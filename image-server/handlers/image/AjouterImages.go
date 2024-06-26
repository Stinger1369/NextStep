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
)

func AjouterImages(c *gin.Context) {
    log.Println("Received request to add multiple images")

    var request struct {
        UserID string `json:"user_id"`
        Images []struct {
            Nom    string `json:"nom"`
            Base64 string `json:"base64"`
        } `json:"images"`
    }

    if err := c.BindJSON(&request); err != nil {
        log.Printf("[%s] Error binding JSON: %v", utils.ErrInvalidRequestFormat, err)
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request format", "code": utils.ErrInvalidRequestFormat})
        return
    }

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

    var results []gin.H
    for _, img := range request.Images {
        if userImageCount >= utils.MaxImagesPerUser {
            break
        }

        imageHash := utils.CalculateHash(img.Base64)
        log.Printf("Calculated image hash: %s", imageHash)

        exists, err := utils.HashExists(userDir, imageHash)
        if err != nil {
            log.Printf("[%s] Error checking hash existence: %v", utils.ErrAddingImageHash, err)
            results = append(results, gin.H{"error": "Failed to check image hash", "code": utils.ErrAddingImageHash, "name": img.Nom})
            continue
        }

        if exists {
            log.Printf("[%s] Image with the same content already exists for user %s", utils.ErrImageAlreadyExists, request.UserID)
            results = append(results, gin.H{"error": "Image with the same content already exists", "code": utils.ErrImageAlreadyExists, "name": img.Nom})
            continue
        }

        filename := uuid.NewV4().String() + "_" + img.Nom
        filePath := filepath.Join(userDir, filename)
        log.Printf("Generated filename: %s", filename)

        data, err := base64.StdEncoding.DecodeString(img.Base64)
        if err != nil {
            log.Printf("[%s] Error decoding base64: %v", utils.ErrDecodingBase64, err)
            results = append(results, gin.H{"error": "Failed to decode image", "code": utils.ErrDecodingBase64, "name": img.Nom})
            continue
        }

        if err := ioutil.WriteFile(filePath, data, 0644); err != nil {
            log.Printf("[%s] Error writing file: %v", utils.ErrWritingFile, err)
            results = append(results, gin.H{"error": "Failed to write image", "code": utils.ErrWritingFile, "name": img.Nom})
            continue
        }

        isNSFW, err := utils.CheckImageForNSFW(filePath)
        if err != nil {
            log.Printf("[%s] Error checking image for NSFW: %v", utils.ErrNSFWCheck, err)
            os.Remove(filePath)  // Supprimer le fichier si la vérification NSFW échoue
            results = append(results, gin.H{"error": "Failed to check NSFW content", "code": utils.ErrNSFWCheck, "name": img.Nom})
            continue
        }

        if isNSFW {
            os.Remove(filePath)
            log.Printf("[%s] Image is inappropriate (NSFW) and has been removed: %s", utils.ErrImageNSFW, filePath)
            results = append(results, gin.H{"error": "Image contains inappropriate content and has been rejected.", "code": utils.ErrImageNSFW, "name": img.Nom})
            continue
        }

        compressedPath, err := compressImage(filePath)
        if err != nil {
            log.Printf("[%s] Error compressing image: %v", utils.ErrImageCompression, err)
            os.Remove(filePath)  // Supprimer le fichier si la compression échoue
            results = append(results, gin.H{"error": "Failed to compress image", "code": utils.ErrImageCompression, "name": img.Nom})
            continue
        }

        // Supprimer l'image d'origine après compression seulement si elle a été convertie
        if filePath != compressedPath {
            if err := os.Remove(filePath); err != nil {
                log.Printf("[%s] Error removing original image: %v", utils.ErrRemovingOriginalImage, err)
                results = append(results, gin.H{"error": "Failed to remove original image", "code": utils.ErrRemovingOriginalImage, "name": img.Nom})
                continue
            }
            log.Printf("Original image removed: %s", filePath)
        }

        // Ajouter le hachage de l'image
        if err := utils.AddHash(userDir, imageHash); err != nil {
            log.Printf("[%s] Error adding hash: %v", utils.ErrAddingImageHash, err)
            results = append(results, gin.H{"error": "Failed to add image hash", "code": utils.ErrAddingImageHash, "name": img.Nom})
            continue
        }

        // Générer l'URL de l'image compressée
        imageURL := generateImageURL(compressedPath)
        log.Printf("Generated image URL: %s", imageURL)
        results = append(results, gin.H{"link": imageURL, "name": img.Nom})
        userImageCount++
    }

    c.JSON(http.StatusOK, gin.H{"results": results})
}
