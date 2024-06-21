package image

import (
    "net/http"
    "os"
    "path/filepath"
    "github.com/gin-gonic/gin"
    "log"
)

func DeleteImage(c *gin.Context) {
    userID := c.Param("user_id")
    nom := c.Param("nom")
    filePath := filepath.Join("public/images", userID, nom)
    if err := os.Remove(filePath); err != nil {
        log.Printf("Error deleting file: %v", err)
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }
    c.JSON(http.StatusOK, gin.H{"message": "Image deleted successfully"})
}
