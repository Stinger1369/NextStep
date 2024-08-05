package utils

import (
	"log"
	"os"
	"os/exec"
	"strings"
)

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
)

// CheckImageForNSFW checks if an image contains NSFW content by calling a Python script via a shell script.
func CheckImageForNSFW(filePath string) (bool, error) {
	log.Printf("Checking image for NSFW: %s", filePath)

	logFile, err := os.Create("nsfw_detector.log")
	if err != nil {
		log.Printf("Error creating log file: %v", err)
		return false, err
	}
	defer logFile.Close()

	// Windows
	scriptPath := "utils\\run_nsfw_detector.bat"
	cmd := exec.Command("cmd.exe", "/C", scriptPath, filePath)

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
