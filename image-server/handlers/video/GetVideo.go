package video

import (
	"github.com/gin-gonic/gin"
	"image-server/utils"
	"log"
	"path/filepath"
)

// Renommer la fonction pour éviter le conflit
func FetchVideo(c *gin.Context) {
	userID := c.Param("user_id")
	nom := c.Param("nom")
	filePath := filepath.Join(utils.GetUserDir(userID, "videos"), nom)
	log.Printf("Fetching video: %s", filePath)
	c.File(filePath)
}
