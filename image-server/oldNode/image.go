package handlers

import (
    "encoding/base64"
    "io/ioutil"
    "net/http"
    "os"
    "path/filepath"
    "image-server/utils"
    "github.com/gin-gonic/gin"
    "github.com/nfnt/resize"
    "github.com/twinj/uuid"
    "image"
    "image/jpeg"
    _ "image/png"
    "log"
)

func AjouterImage(c *gin.Context) {
    var request struct {
        Nom    string `json:"nom"`
        Base64 string `json:"base64"`
    }
    if err := c.BindJSON(&request); err != nil {
        log.Printf("Error binding JSON: %v", err)
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    filename := uuid.NewV4().String() + "_" + request.Nom
    filePath := filepath.Join("public/images", filename)
    data, err := base64.StdEncoding.DecodeString(request.Base64)
    if err != nil {
        log.Printf("Error decoding base64: %v", err)
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    if err := ioutil.WriteFile(filePath, data, 0644); err != nil {
        log.Printf("Error writing file: %v", err)
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    isNSFW, err := utils.CheckImageForNSFW(filePath)
    if err != nil {
        log.Printf("Error checking image for NSFW: %v", err)
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    if isNSFW {
        os.Remove(filePath)
        log.Printf("Image is NSFW: %v", filePath)
        c.JSON(http.StatusBadRequest, gin.H{"error": "Image contains inappropriate content"})
        return
    }

    compressedPath, err := compressImage(filePath)
    if err != nil {
        log.Printf("Error compressing image: %v", err)
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    c.JSON(http.StatusOK, gin.H{"link": "http://localhost:7000/server-image/image/" + compressedPath})
}

func GetImage(c *gin.Context) {
    nom := c.Param("nom")
    filePath := filepath.Join("public/images", nom)
    c.File(filePath)
}

func UpdateImage(c *gin.Context) {
    nom := c.Param("nom")
    var request struct {
        Base64 string `json:"base64"`
    }
    if err := c.BindJSON(&request); err != nil {
        log.Printf("Error binding JSON: %v", err)
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    filePath := filepath.Join("public/images", nom)
    data, err := base64.StdEncoding.DecodeString(request.Base64)
    if err != nil {
        log.Printf("Error decoding base64: %v", err)
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    if err := ioutil.WriteFile(filePath, data, 0644); err != nil {
        log.Printf("Error writing file: %v", err)
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    isNSFW, err := utils.CheckImageForNSFW(filePath)
    if err != nil {
        log.Printf("Error checking image for NSFW: %v", err)
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    if isNSFW {
        os.Remove(filePath)
        log.Printf("Image is NSFW: %v", filePath)
        c.JSON(http.StatusBadRequest, gin.H{"error": "Image contains inappropriate content"})
        return
    }

    compressedPath, err := compressImage(filePath)
    if err != nil {
        log.Printf("Error compressing image: %v", err)
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    c.JSON(http.StatusOK, gin.H{"link": "http://localhost:7000/server-image/image/" + compressedPath})
}

func DeleteImage(c *gin.Context) {
    nom := c.Param("nom")
    filePath := filepath.Join("public/images", nom)
    if err := os.Remove(filePath); err != nil {
        log.Printf("Error deleting file: %v", err)
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }
    c.JSON(http.StatusOK, gin.H{"message": "Image deleted successfully"})
}

func compressImage(filePath string) (string, error) {
    file, err := os.Open(filePath)
    if err != nil {
        return "", err
    }
    defer file.Close()

    img, _, err := image.Decode(file)
    if err != nil {
        return "", err
    }

    m := resize.Resize(500, 0, img, resize.Lanczos3)

    compressedPath := filePath + "_compressed.jpg"
    out, err := os.Create(compressedPath)
    if err != nil {
        return "", err
    }
    defer out.Close()

    jpeg.Encode(out, m, nil)

    return compressedPath, nil
}
