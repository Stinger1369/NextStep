package video

import (
	"github.com/gin-gonic/gin"
	"image-server/utils"
	"log"
	"net/http"
	"os"
	"path/filepath"
)

func DeleteVideo(c *gin.Context) {
	userID := c.Param("user_id")
	nom := c.Param("nom")
	filePath := filepath.Join(utils.GetUserDir(userID, "videos"), nom)

	if err := os.Remove(filePath); err != nil {
		log.Printf("Error deleting file: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Video deleted successfully"})
}
