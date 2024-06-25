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

const maxImagesPerUser = 6
const serverBaseURL = "http://localhost:7000/"

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
    return len(files), nil
}

func generateImageURL(filePath string) string {
    relativePath := strings.ReplaceAll(filePath[len("public/"):], "\\", "/")
    return serverBaseURL + relativePath
}

func AjouterImage(c *gin.Context) {
    log.Println("Received request to add image")

    var request struct {
        UserID string `json:"user_id"`
        Nom    string `json:"nom"`
        Base64 string `json:"base64"`
    }

    if err := c.BindJSON(&request); err != nil {
        log.Printf("Error binding JSON: %v", err)
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }
    log.Printf("Request JSON parsed: %+v", request)

    if request.UserID == "" {
        log.Println("UserID is empty")
        c.JSON(http.StatusBadRequest, gin.H{"error": "UserID is required"})
        return
    }
    log.Printf("Creating directory for user ID: %s", request.UserID)
    userDir, err := checkAndCreateUserDir(request.UserID)
    if err != nil {
        log.Printf("Error creating user directory: %v", err)
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }
    log.Printf("User directory confirmed: %s", userDir)

    userImageCount, err := countUserImages(request.UserID)
    if err != nil {
        log.Printf("Error counting user images: %v", err)
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }
    log.Printf("User %s has %d images", request.UserID, userImageCount)

    if userImageCount >= maxImagesPerUser {
        log.Printf("User %s has reached the maximum number of images", request.UserID)
        c.JSON(http.StatusBadRequest, gin.H{"error": "You have reached the maximum number of images"})
        return
    }

    imageHash := utils.CalculateHash(request.Base64)
    log.Printf("Calculated image hash: %s", imageHash)

    exists, err := utils.HashExists(userDir, imageHash)
    if err != nil {
        log.Printf("Error checking hash existence: %v", err)
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    if exists {
        log.Printf("Image with the same content already exists for user %s", request.UserID)
        c.JSON(http.StatusBadRequest, gin.H{"error": "Image with the same content already exists"})
        return
    }

    filename := uuid.NewV4().String() + "_" + request.Nom
    filePath := filepath.Join(userDir, filename)
    log.Printf("Generated filename: %s", filename)

    data, err := base64.StdEncoding.DecodeString(request.Base64)
    if err != nil {
        log.Printf("Error decoding base64: %v", err)
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }
    log.Printf("Base64 decoded successfully, length: %d", len(data))

    if err := ioutil.WriteFile(filePath, data, 0644); err != nil {
        log.Printf("Error writing file: %v", err)
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }
    log.Printf("File written successfully: %s", filePath)

    log.Printf("Checking NSFW content for file: %s", filePath)
    isNSFW, err := utils.CheckImageForNSFW(filePath)
    if err != nil {
        log.Printf("Error checking image for NSFW: %v", err)
        os.Remove(filePath)  // Supprimer le fichier si la vérification NSFW échoue
        return
    }
    log.Printf("NSFW check completed, result: %v", isNSFW)

    if isNSFW {
        os.Remove(filePath)
        log.Printf("Image is NSFW and has been removed: %s", filePath)
        c.JSON(http.StatusBadRequest, gin.H{"error": "Image contains inappropriate content and has been rejected."})
        return
    }

    log.Printf("Compressing image: %s", filePath)
    compressedPath, err := compressImage(filePath)
    if err != nil {
        log.Printf("Error compressing image: %v", err)
        os.Remove(filePath)  // Supprimer le fichier si la compression échoue
        log.Printf("Image has been removed due to compression error: %s", filePath)
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }
    log.Printf("Image compressed successfully: %s", compressedPath)

    // Supprimer l'image d'origine après compression seulement si elle a été convertie
    if filePath != compressedPath {
        if err := os.Remove(filePath); err != nil {
            log.Printf("Error removing original image: %v", err)
            c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
            return
        }
        log.Printf("Original image removed: %s", filePath)
    }

    // Ajouter le hachage de l'image
    if err := utils.AddHash(userDir, imageHash); err != nil {
        log.Printf("Error adding hash: %v", err)
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    // Générer l'URL de l'image compressée
    imageURL := generateImageURL(compressedPath)
    log.Printf("Generated image URL: %s", imageURL)

    c.JSON(http.StatusOK, gin.H{"link": imageURL})
}
