Installation de Go
Téléchargez Go :

Allez sur la page de téléchargement de Go : https://golang.org/dl/.
Téléchargez l'installateur correspondant à votre système d'exploitation (Windows dans votre cas).
Installez Go :

Exécutez l'installateur téléchargé et suivez les instructions pour installer Go.
Configurez le chemin d'accès :

Après l'installation, ajoutez le répertoire d'installation de Go (C:\Go\bin par défaut) à votre variable d'environnement PATH.
Pour ce faire :
Ouvrez les paramètres système avancés (vous pouvez chercher "variables d'environnement" dans le menu Démarrer).
Cliquez sur "Variables d'environnement".
Dans la section "Variables système", trouvez et sélectionnez la variable Path, puis cliquez sur "Modifier".
Ajoutez le chemin C:\Go\bin à la liste.
Cliquez sur "OK" pour fermer toutes les fenêtres.
Vérifiez l'installation :

Ouvrez une nouvelle fenêtre de terminal et exécutez la commande suivante pour vérifier que Go est correctement installé :
bash

go version
Création du serveur d'images
Initialiser le projet Go :

bash

mkdir image-server
cd image-server
go mod init image-server
Installer les dépendances nécessaires :

bash

go get github.com/gin-gonic/gin
Créer la structure des dossiers :

bash

mkdir -p public/images
mkdir -p public/videos
Créer le serveur avec Go (main.go) :

Créez un fichier main.go avec le contenu suivant :
go

package main

import (
    "encoding/base64"
    "io/ioutil"
    "net/http"
    "path/filepath"
    "time"

    "github.com/gin-gonic/gin"
)

func main() {
    r := gin.Default()

    r.Use(corsMiddleware())

    r.POST("/server-image/ajouter-image", ajouterImage)
    r.GET("/server-image/image/:nom", getImage)

    r.POST("/server-video/ajouter-video", ajouterVideo)
    r.GET("/server-video/video/:nom", getVideo)

    r.Run(":7000")
}

func corsMiddleware() gin.HandlerFunc {
    return func(c *gin.Context) {
        c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
        c.Writer.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE")
        c.Writer.Header().Set("Access-Control-Allow-Headers", "x-access-token, Origin, X-Requested-With, Content-Type, Accept")
        if c.Request.Method == "OPTIONS" {
            c.AbortWithStatus(204)
            return
        }
        c.Next()
    }
}

func ajouterImage(c *gin.Context) {
    var request struct {
        Nom   string `json:"nom"`
        Base64 string `json:"base64"`
    }
    if err := c.BindJSON(&request); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    filename := time.Now().Format("20060102150405") + "_" + request.Nom
    filePath := filepath.Join("public/images", filename)
    data, err := base64.StdEncoding.DecodeString(request.Base64)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    if err := ioutil.WriteFile(filePath, data, 0644); err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    c.JSON(http.StatusOK, gin.H{"link": "http://localhost:7000/server-image/image/" + filename})
}

func getImage(c *gin.Context) {
    nom := c.Param("nom")
    filePath := filepath.Join("public/images", nom)
    c.File(filePath)
}

func ajouterVideo(c *gin.Context) {
    file, _ := c.FormFile("video")
    filename := time.Now().Format("20060102150405") + "_" + file.Filename
    filePath := filepath.Join("public/videos", filename)

    if err := c.SaveUploadedFile(file, filePath); err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    c.JSON(http.StatusOK, gin.H{"link": "http://localhost:7000/server-video/video/" + filename})
}

func getVideo(c *gin.Context) {
    nom := c.Param("nom")
    filePath := filepath.Join("public/videos", nom)
    c.File(filePath)
}
Lancer le serveur :

bash

go run main.go


tree H:\recruteProject\image-server /F
