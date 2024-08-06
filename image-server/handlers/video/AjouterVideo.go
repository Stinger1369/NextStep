package video

import (
	"log"
	"net/http"
	"os"
	"path/filepath"
	"time"

	"github.com/gin-gonic/gin"
	"image-server/utils"
)

// AjouterVideo gère l'ajout de vidéos
func AjouterVideo(c *gin.Context) {
	file, err := c.FormFile("video")
	if err != nil {
		log.Printf("Erreur lors de la récupération du fichier: %v", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	userID := c.PostForm("user_id")
	if userID == "" {
		log.Printf("L'ID utilisateur est manquant")
		c.JSON(http.StatusBadRequest, gin.H{"error": "User ID is required"})
		return
	}

	// Nom de fichier unique
	filename := time.Now().Format("20060102150405") + "_" + file.Filename
	userDir, err := utils.CheckAndCreateUserDir(userID, "videos")
	if err != nil {
		log.Printf("Erreur lors de la création du répertoire utilisateur: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	filePath := filepath.Join(userDir, filename)

	// Sauvegarde du fichier
	if err := c.SaveUploadedFile(file, filePath); err != nil {
		log.Printf("Erreur lors de la sauvegarde du fichier téléchargé: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Vérification du contenu NSFW
	isNSFW, err := utils.CheckVideoForNSFW(filePath)
	if err != nil {
		log.Printf("Erreur lors de la vérification NSFW de la vidéo: %v", err)
		os.Remove(filePath) // Suppression du fichier en cas d'erreur
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	if isNSFW {
		log.Printf("La vidéo est NSFW: %s", filePath)
		os.Remove(filePath) // Suppression de la vidéo NSFW
		c.JSON(http.StatusBadRequest, gin.H{"error": "Video contains inappropriate content"})
		return
	}

	// Compression de la vidéo
	compressedPath, err := CompressVideo(filePath)
	if err != nil {
		log.Printf("Erreur lors de la compression de la vidéo: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"link": utils.GenerateVideoURL(compressedPath)})
}

// GetVideo permet de récupérer une vidéo par son nom
func GetVideo(c *gin.Context) {
	userID := c.Param("user_id") // Modification pour prendre en charge l'ID utilisateur
	nom := c.Param("nom")
	filePath := filepath.Join(utils.GetUserDir(userID, "videos"), nom) // Utilisation de utils pour obtenir le chemin du répertoire utilisateur
	log.Printf("Fetching video: %s", filePath)
	c.File(filePath)
}
