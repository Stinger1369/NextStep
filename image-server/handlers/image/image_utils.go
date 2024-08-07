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
		log.Printf("[%s] Error creating user directory: %v", utils.ErrCreatingUserDirectory, err)
		return "", err
	}

	log.Printf("Processing image for user: %s", userID)

	imageHash := utils.CalculateHash(base64Data)
	log.Printf("Calculated hash: %s", imageHash)

	exists, err := utils.HashExists(userDir, imageHash)
	if err != nil {
		log.Printf("[%s] Error checking if hash exists: %v", utils.ErrCheckingImageHash, err)
		return "", err
	}

	if exists {
		return "", fmt.Errorf("[%s] Image with the same content already exists for user %s", utils.ErrImageAlreadyExists, userID)
	}

	filename := uuid.NewV4().String() + "_" + imageName
	filePath := filepath.Join(userDir, filename)
	data, err := base64.StdEncoding.DecodeString(base64Data)
	if err != nil {
		log.Printf("[%s] Error decoding base64: %v", utils.ErrDecodingBase64, err)
		return "", err
	}

	if err := ioutil.WriteFile(filePath, data, 0644); err != nil {
		log.Printf("[%s] Error writing file: %v", utils.ErrWritingFile, err)
		return "", err
	}

	isNSFW, err := utils.CheckImageForNSFW(filePath)
	if err != nil {
		log.Printf("[%s] Error checking image for NSFW: %v", utils.ErrNSFWCheck, err)
		os.Remove(filePath)
		return "", err
	}

	if isNSFW {
		log.Printf("[%s] Image is inappropriate (NSFW) and has been removed: %s", utils.ErrImageNSFW, filePath)
		os.Remove(filePath)
		return "", fmt.Errorf("[%s] Image is inappropriate (NSFW) and has been removed", utils.ErrImageNSFW)
	}

	compressedPath, err := compressImage(filePath)
	if err != nil {
		log.Printf("[%s] Error compressing image: %v", utils.ErrImageCompression, err)
		os.Remove(filePath)
		return "", err
	}

	if filePath != compressedPath {
		if err := os.Remove(filePath); err != nil {
			log.Printf("[%s] Error removing original image: %v", utils.ErrRemovingOriginalImage, err)
			return "", err
		}
	}

	if err := utils.AddHash(userDir, imageHash, filename); err != nil {
		log.Printf("[%s] Error adding image hash: %v", utils.ErrAddingImageHash, err)
		return "", err
	}

	return generateImageURL(compressedPath), nil
}


