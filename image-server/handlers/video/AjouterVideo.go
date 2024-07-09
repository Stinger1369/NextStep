package video

import (
    "path/filepath"
    "time"
    "net/http"
    "github.com/gin-gonic/gin"
    "log"
)

func AjouterVideo(c *gin.Context) {
    file, err := c.FormFile("video")
    if err != nil {
        log.Printf("Error getting form file: %v", err)
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }
    filename := time.Now().Format("20060102150405") + "_" + file.Filename
    filePath := filepath.Join("public/videos", filename)

    if err := c.SaveUploadedFile(file, filePath); err != nil {
        log.Printf("Error saving uploaded file: %v", err)
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    c.JSON(http.StatusOK, gin.H{"link": "http://localhost:7000/server-video/video/" + filename})
}
