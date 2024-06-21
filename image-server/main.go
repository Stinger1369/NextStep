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
    r.GET("/server-image/image/:user_id/:nom", image.GetImage)
    r.PUT("/server-image/update-image/:user_id/:nom", image.UpdateImage)
    r.DELETE("/server-image/delete-image/:user_id/:nom", image.DeleteImage)

    // Routes pour les vidéos
    r.POST("/server-video/ajouter-video", video.AjouterVideo)
    r.GET("/server-video/video/:user_id/:nom", video.GetVideo)
    r.PUT("/server-video/update-video/:user_id/:nom", video.UpdateVideo)
    r.DELETE("/server-video/delete-video/:user_id/:nom", video.DeleteVideo)

    r.Run(":7000")
}
