package image

import (
    "encoding/base64"
    "fmt"
    "image-server/utils"
    "io/ioutil"
    "os"
    "path/filepath"
    "github.com/twinj/uuid"
    "log"
    "strings"
)

func getUserDir(userID string) string {
    return filepath.Join("public/images", userID)
}

func checkAndCreateUserDir(userID string) (string, error) {
    userDir := getUserDir(userID)
    if _, err := os.Stat(userDir); os.IsNotExist(err) {
        err = os.MkdirAll(userDir, os.ModePerm)
        if err != nil {
            return "", err
        }
        log.Printf("User directory created: %s", userDir)
    } else {
        log.Printf("User directory already exists: %s", userDir)
    }
    return userDir, nil
}

func countUserImages(userID string) (int, error) {
    userDir, err := checkAndCreateUserDir(userID)
    if err != nil {
        return 0, err
    }
    files, err := ioutil.ReadDir(userDir)
    if err != nil {
        return 0, err
    }
    imageCount := 0
    for _, file := range files {
        if !file.IsDir() && !strings.HasSuffix(file.Name(), "hashes.json") {
            imageCount++
        }
    }
    return imageCount, nil
}

func generateImageURL(filePath string) string {
    relativePath := strings.ReplaceAll(filePath[len("public/"):], "\\", "/")
    return utils.ServerBaseURL + relativePath
}

func processImage(userID, imageName, base64Data string) (string, error) {
    userDir, err := checkAndCreateUserDir(userID)
    if err != nil {
        return "", err
    }

    log.Printf("Processing image for user: %s", userID)

    imageHash := utils.CalculateHash(base64Data)
    log.Printf("Calculated hash: %s", imageHash)

    exists, err := utils.HashExists(userDir, imageHash)
    if err != nil {
        return "", err
    }

    if exists {
        return "", fmt.Errorf("[%s] Image with the same content already exists for user %s", utils.ErrImageAlreadyExists, userID)
    }

    filename := uuid.NewV4().String() + "_" + imageName
    filePath := filepath.Join(userDir, filename)
    data, err := base64.StdEncoding.DecodeString(base64Data)
    if err != nil {
        return "", fmt.Errorf("[%s] Error decoding base64: %v", utils.ErrDecodingBase64, err)
    }

    if err := ioutil.WriteFile(filePath, data, 0644); err != nil {
        return "", fmt.Errorf("[%s] Error writing file: %v", utils.ErrWritingFile, err)
    }

    isNSFW, err := utils.CheckImageForNSFW(filePath)
    if err != nil {
        os.Remove(filePath)
        return "", fmt.Errorf("[%s] Error checking image for NSFW: %v", utils.ErrNSFWCheck, err)
    }

    if isNSFW {
        os.Remove(filePath)
        return "", fmt.Errorf("[%s] Image is inappropriate (NSFW) and has been removed: %s", utils.ErrImageNSFW, filePath)
    }

    compressedPath, err := compressImage(filePath)
    if err != nil {
        os.Remove(filePath)
        return "", fmt.Errorf("[%s] Error compressing image: %v", utils.ErrImageCompression, err)
    }

    if filePath != compressedPath {
        if err := os.Remove(filePath); err != nil {
            return "", fmt.Errorf("[%s] Error removing original image: %v", utils.ErrRemovingOriginalImage, err)
        }
    }

    if err := utils.AddHash(userDir, imageHash, filename); err != nil {
        return "", fmt.Errorf("[%s] Error adding hash: %v", utils.ErrAddingImageHash, err)
    }

    return generateImageURL(compressedPath), nil
}
