package image

import (
    "encoding/base64"
    "io/ioutil"
    "net/http"
    "os"
    "path/filepath"
    "image-server/utils"
    "log"
    "github.com/gin-gonic/gin"
    "github.com/twinj/uuid"
    "strings"
)

func getUserDir(userID string) string {
    return filepath.Join("public/images", userID)
}

func checkAndCreateUserDir(userID string) (string, error) {
    userDir := getUserDir(userID)
    if _, err := os.Stat(userDir); os.IsNotExist(err) {
        err = os.MkdirAll(userDir, os.ModePerm)
        if err != nil {
            return "", err
        }
        log.Printf("User directory created: %s", userDir)
    } else {
        log.Printf("User directory already exists: %s", userDir)
    }
    return userDir, nil
}

func countUserImages(userID string) (int, error) {
    userDir := getUserDir(userID)
    files, err := ioutil.ReadDir(userDir)
    if err != nil {
        return 0, err
    }
    imageCount := 0
    for _, file := range files {
        if !file.IsDir() && !strings.HasSuffix(file.Name(), "hashes.json") {
            imageCount++
        }
    }
    return imageCount, nil
}

func generateImageURL(filePath string) string {
    relativePath := strings.ReplaceAll(filePath[len("public/"):], "\\", "/")
    return utils.ServerBaseURL + relativePath
}

func AjouterImage(c *gin.Context) {
    log.Println("Received request to add image")

    var request struct {
        UserID string `json:"user_id"`
        Nom    string `json:"nom"`
        Base64 string `json:"base64"`
    }

    if err := c.BindJSON(&request); err != nil {
        log.Printf("[%s] Error binding JSON: %v", utils.ErrInvalidRequestFormat, err)
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request format", "code": utils.ErrInvalidRequestFormat})
        return
    }
    //log.Printf("Request JSON parsed: %+v", request)

    if request.UserID == "" {
        log.Printf("[%s] UserID is empty", utils.ErrEmptyUserID)
        c.JSON(http.StatusBadRequest, gin.H{"error": "UserID is required", "code": utils.ErrEmptyUserID})
        return
    }

    userDir, err := checkAndCreateUserDir(request.UserID)
    if err != nil {
        log.Printf("[%s] Error creating user directory: %v", utils.ErrCreatingUserDirectory, err)
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create user directory", "code": utils.ErrCreatingUserDirectory})
        return
    }

    userImageCount, err := countUserImages(request.UserID)
    if err != nil {
        log.Printf("[%s] Error counting user images: %v", utils.ErrCountingUserImages, err)
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to count user images", "code": utils.ErrCountingUserImages})
        return
    }

    if userImageCount >= utils.MaxImagesPerUser {
        log.Printf("[%s] User %s has reached the maximum number of images", utils.ErrMaxImagesReached, request.UserID)
        c.JSON(http.StatusBadRequest, gin.H{"error": "Maximum number of images reached", "code": utils.ErrMaxImagesReached})
        return
    }

    imageHash := utils.CalculateHash(request.Base64)
    log.Printf("Calculated image hash: %s", imageHash)

    exists, err := utils.HashExists(userDir, imageHash)
    if err != nil {
        log.Printf("[%s] Error checking hash existence: %v", utils.ErrAddingImageHash, err)
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to check image hash", "code": utils.ErrAddingImageHash})
        return
    }

    if exists {
        log.Printf("[%s] Image with the same content already exists for user %s", utils.ErrImageAlreadyExists, request.UserID)
        c.JSON(http.StatusBadRequest, gin.H{"error": "Image with the same content already exists", "code": utils.ErrImageAlreadyExists})
        return
    }

    filename := uuid.NewV4().String() + "_" + request.Nom
    filePath := filepath.Join(userDir, filename)
    log.Printf("Generated filename: %s", filename)

    data, err := base64.StdEncoding.DecodeString(request.Base64)
    if err != nil {
        log.Printf("[%s] Error decoding base64: %v", utils.ErrDecodingBase64, err)
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to decode image", "code": utils.ErrDecodingBase64})
        return
    }

    if err := ioutil.WriteFile(filePath, data, 0644); err != nil {
        log.Printf("[%s] Error writing file: %v", utils.ErrWritingFile, err)
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to write image", "code": utils.ErrWritingFile})
        return
    }

    isNSFW, err := utils.CheckImageForNSFW(filePath)
    if err != nil {
        log.Printf("[%s] Error checking image for NSFW: %v", utils.ErrNSFWCheck, err)
        os.Remove(filePath)  // Supprimer le fichier si la vérification NSFW échoue
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to check NSFW content", "code": utils.ErrNSFWCheck})
        return
    }

    if isNSFW {
        os.Remove(filePath)
        log.Printf("[%s] Image is inappropriate (NSFW) and has been removed: %s", utils.ErrImageNSFW, filePath)
        c.JSON(http.StatusBadRequest, gin.H{"error": "Image contains inappropriate content and has been rejected.", "code": utils.ErrImageNSFW})
        return
    }

    compressedPath, err := compressImage(filePath)
    if err != nil {
        log.Printf("[%s] Error compressing image: %v", utils.ErrImageCompression, err)
        os.Remove(filePath)  // Supprimer le fichier si la compression échoue
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to compress image", "code": utils.ErrImageCompression})
        return
    }

    // Supprimer l'image d'origine après compression seulement si elle a été convertie
    if filePath != compressedPath {
        if err := os.Remove(filePath); err != nil {
            log.Printf("[%s] Error removing original image: %v", utils.ErrRemovingOriginalImage, err)
            c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to remove original image", "code": utils.ErrRemovingOriginalImage})
            return
        }
        log.Printf("Original image removed: %s", filePath)
    }

    // Ajouter le hachage de l'image
    if err := utils.AddHash(userDir, imageHash); err != nil {
        log.Printf("[%s] Error adding hash: %v", utils.ErrAddingImageHash, err)
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to add image hash", "code": utils.ErrAddingImageHash})
        return
    }

    // Générer l'URL de l'image compressée
    imageURL := generateImageURL(compressedPath)
    log.Printf("Generated image URL: %s", imageURL)

    c.JSON(http.StatusOK, gin.H{"link": imageURL})
}
