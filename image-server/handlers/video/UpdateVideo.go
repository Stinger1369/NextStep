package video

import (
	"encoding/base64"
	"github.com/gin-gonic/gin"
	"image-server/utils"
	"io/ioutil"
	"log"
	"net/http"
	"path/filepath"
)

func UpdateVideo(c *gin.Context) {
	userID := c.Param("user_id")
	nom := c.Param("nom")

	var request struct {
		Base64 string `json:"base64"`
	}

	if err := c.BindJSON(&request); err != nil {
		log.Printf("Error binding JSON: %v", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	filePath := filepath.Join(utils.GetUserDir(userID, "videos"), nom)
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

	// Recompresser la vidéo
	compressedPath, err := CompressVideo(filePath)
	if err != nil {
		log.Printf("Error compressing video: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"link": utils.GenerateVideoURL(compressedPath)})
}
