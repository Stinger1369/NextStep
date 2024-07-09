package image

import (
    "net/http"
    "os"
    "path/filepath"
    "log"
    "encoding/base64"
    "image-server/utils"
    "github.com/gin-gonic/gin"
)

func DeleteImage(c *gin.Context) {
    userID := c.Param("user_id")
    nom := c.Param("nom")
    filePath := filepath.Join("public/images", userID, nom)

    // Lire le contenu de l'image pour calculer le hachage avant suppression
    fileContent, err := os.ReadFile(filePath)
    if err != nil {
        log.Printf("Error reading file for hash calculation: %v", err)
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }
    fileBase64 := base64.StdEncoding.EncodeToString(fileContent)
    imageHash := utils.CalculateHash(fileBase64)

    log.Printf("Deleting image: %s with hash: %s", filePath, imageHash)

    // Supprimer l'image
    if err := os.Remove(filePath); err != nil {
        log.Printf("Error deleting file: %v", err)
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    // Supprimer le hachage du fichier hashes.json
    userDir := filepath.Join("public/images", userID)
    if err := utils.RemoveHash(userDir, nom); err != nil {
        log.Printf("Error removing hash: %v", err)
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    log.Printf("Successfully deleted image and removed hash for: %s", filePath)
    c.JSON(http.StatusOK, gin.H{"message": "Image deleted successfully"})
}
