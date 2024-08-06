package video

import (
	"log"
	"os"
	"path/filepath"
	"strings"

	ffmpeg "github.com/u2takey/ffmpeg-go"
)

// CompressVideo compresse la vidéo et retourne le chemin vers le fichier compressé
func CompressVideo(filePath string) (string, error) {
	compressedPath := strings.TrimSuffix(filePath, filepath.Ext(filePath)) + "_compressed.mp4"

	// Paramètres pour la compression
	crf := 30          // Facteur de compression
	preset := "medium" // Équilibre entre vitesse et compression
	maxBitrate := "1M" // Limitation du bitrate

	err := ffmpeg.
		Input(filePath).
		Output(compressedPath,
			ffmpeg.KwArgs{
				"c:v":    "libx264",         // Codec vidéo
				"crf":    crf,               // Facteur de compression constant
				"preset": preset,            // Préset de compression
				"b:v":    maxBitrate,        // Bitrate maximum
				"vf":     "scale=iw/2:ih/2", // Réduction de la résolution (optionnelle)
			}).
		OverWriteOutput().
		Run()

	if err != nil {
		log.Printf("Erreur lors de la compression de la vidéo: %v", err)
		return "", err
	}

	// Suppression de la vidéo originale
	err = os.Remove(filePath)
	if err != nil {
		log.Printf("Erreur lors de la suppression de la vidéo originale: %v", err)
	}

	log.Printf("Vidéo compressée créée: %s", compressedPath)
	return compressedPath, nil
}
