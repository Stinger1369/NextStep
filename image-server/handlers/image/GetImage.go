package image

import (
    "github.com/gin-gonic/gin"
    "log"
    "path/filepath"
)

func GetImage(c *gin.Context) {
    nom := c.Param("nom")
    filePath := filepath.Join("public/images", nom)
    log.Printf("Fetching image: %s", filePath)
    c.File(filePath)
}
