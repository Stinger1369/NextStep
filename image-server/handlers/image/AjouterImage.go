package image

import (
    "encoding/base64"
    "io/ioutil"
    "net/http"
    "os"
    "path/filepath"
    "image-server/utils"
    "github.com/gin-gonic/gin"
    "github.com/twinj/uuid"
    "log"
)

func AjouterImage(c *gin.Context) {
    log.Println("Received request to add image")

    var request struct {
        Nom    string `json:"nom"`
        Base64 string `json:"base64"`
    }
    if err := c.BindJSON(&request); err != nil {
        log.Printf("Error binding JSON: %v", err)
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }
    log.Printf("Request JSON parsed: %+v", request)

    filename := uuid.NewV4().String() + "_" + request.Nom
    filePath := filepath.Join("public/images", filename)
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

    isNSFW, err := utils.CheckImageForNSFW(filePath)
    if err != nil {
        log.Printf("Error checking image for NSFW: %v", err)
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }
    log.Printf("NSFW check completed, result: %v", isNSFW)

    if isNSFW {
        os.Remove(filePath)
        log.Printf("Image is NSFW and has been removed: %s", filePath)
        c.JSON(http.StatusBadRequest, gin.H{"error": "Image contains inappropriate content"})
        return
    }

    compressedPath, err := compressImage(filePath)
    if err != nil {
        log.Printf("Error compressing image: %v", err)
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }
    log.Printf("Image compressed successfully: %s", compressedPath)

    c.JSON(http.StatusOK, gin.H{"link": "http://localhost:7000/server-image/image/" + compressedPath})
}
