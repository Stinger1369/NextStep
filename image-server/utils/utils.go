package utils

import (
	"log"
	"os"
	"os/exec"
	"path/filepath"
	"runtime"
	"strings"
)

// Constants
const (
	MaxImagesPerUser = 6
	ServerBaseURL    = "http://localhost:7000/"

	ErrInvalidRequestFormat  = "ERR001"
	ErrEmptyUserID           = "ERR002"
	ErrCreatingUserDirectory = "ERR003"
	ErrCountingUserImages    = "ERR004"
	ErrMaxImagesReached      = "ERR005"
	ErrDecodingBase64        = "ERR006"
	ErrWritingFile           = "ERR007"
	ErrNSFWCheck             = "ERR008"
	ErrImageNSFW             = "ERR009"
	ErrImageCompression      = "ERR010"
	ErrRemovingOriginalImage = "ERR011"
	ErrAddingImageHash       = "ERR012"
	ErrImageAlreadyExists    = "ERR013"
	ErrExtractingFrames      = "ERR014" // Added for video frame extraction errors
)

// CheckImageForNSFW verifies if an image contains NSFW content by calling a Python script via a shell script.
func CheckImageForNSFW(filePath string) (bool, error) {
	log.Printf("Checking image for NSFW: %s", filePath)

	logFile, err := os.Create("nsfw_detector.log")
	if err != nil {
		log.Printf("Error creating log file: %v", err)
		return false, err
	}
	defer logFile.Close()

	var cmd *exec.Cmd

	// Detect OS and choose the appropriate command
	if runtime.GOOS == "windows" {
		// Windows
		scriptPath := "utils\\run_nsfw_detector.bat"
		cmd = exec.Command("cmd.exe", "/C", scriptPath, filePath)
	} else {
		// Linux or MacOS
		scriptPath := "./utils/run_nsfw_detector.sh"
		cmd = exec.Command("bash", scriptPath, filePath)
	}

	cmd.Stdout = logFile
	cmd.Stderr = logFile

	err = cmd.Run()
	if err != nil {
		log.Printf("Error executing command: %v", err)
		return false, err
	}

	output, err := os.ReadFile("nsfw_detector.log")
	if err != nil {
		log.Printf("Error reading log file: %v", err)
		return false, err
	}

	log.Printf("NSFW check output: %s", output)
	return strings.Contains(string(output), "NSFW Check Result: True"), nil
}

// CheckVideoForNSFW verifies if a video contains NSFW content by extracting keyframes and using CheckImageForNSFW.
func CheckVideoForNSFW(videoPath string) (bool, error) {
	log.Printf("Checking video for NSFW: %s", videoPath)

	// Create a temporary directory to store extracted frames
	tempDir, err := os.MkdirTemp("", "video_frames")
	if err != nil {
		log.Printf("Error creating temporary directory: %v", err)
		return false, err
	}
	defer os.RemoveAll(tempDir) // Ensure the temporary directory is removed after use

	// Use ffmpeg to extract keyframes
	cmd := exec.Command("ffmpeg", "-i", videoPath, "-vf", "fps=1", filepath.Join(tempDir, "frame_%04d.jpg"))
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr

	err = cmd.Run()
	if err != nil {
		log.Printf("Error extracting frames: %v", err)
		return false, err
	}

	// Check each extracted image with CheckImageForNSFW
	files, err := os.ReadDir(tempDir)
	if err != nil {
		log.Printf("Error reading extracted frames: %v", err)
		return false, err
	}

	for _, file := range files {
		filePath := filepath.Join(tempDir, file.Name())
		isNSFW, err := CheckImageForNSFW(filePath)
		if err != nil {
			log.Printf("Error checking image for NSFW: %v", err)
			continue
		}
		if isNSFW {
			log.Printf("NSFW content found in video: %s", videoPath)
			return true, nil
		}
	}

	log.Printf("No NSFW content found in video: %s", videoPath)
	return false, nil
}

// CheckAndCreateUserDir verifies if a directory exists for a user and creates it if not.
func CheckAndCreateUserDir(userID, category string) (string, error) {
	userDir := GetUserDir(userID, category)
	if _, err := os.Stat(userDir); os.IsNotExist(err) {
		err = os.MkdirAll(userDir, os.ModePerm)
		if err != nil {
			log.Printf("Error creating directory: %v", err)
			return "", err
		}
		log.Printf("Created user directory: %s", userDir)
	}
	return userDir, nil
}

// GetUserDir returns the path to the user's media directory
func GetUserDir(userID, category string) string {
	return filepath.Join("public", category, userID)
}

// GenerateVideoURL generates a URL to access the video.
func GenerateVideoURL(filePath string) string {
	return ServerBaseURL + "server-video/video/" + filepath.Base(filePath)
}
