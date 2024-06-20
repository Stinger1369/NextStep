package main

import (
    "image-server/handlers/image"
    "image-server/handlers/video"
    "image-server/middleware"
    "github.com/gin-gonic/gin"
)

func main() {
    r := gin.Default()
    r.Use(middleware.CORSMiddleware())

    // Routes pour les images
    r.POST("/server-image/ajouter-image", image.AjouterImage)
    r.GET("/server-image/image/:nom", image.GetImage)
    r.PUT("/server-image/update-image/:nom", image.UpdateImage)
    r.DELETE("/server-image/delete-image/:nom", image.DeleteImage)

    // Routes pour les vidéos
    r.POST("/server-video/ajouter-video", video.AjouterVideo)
    r.GET("/server-video/video/:nom", video.GetVideo)
    r.PUT("/server-video/update-video/:nom", video.UpdateVideo)
    r.DELETE("/server-video/delete-video/:nom", video.DeleteVideo)

    r.Run(":7000")
}
