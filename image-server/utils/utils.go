package utils

import (
    "os/exec"
    "log"
    "os"
    "strings"
)

// CheckImageForNSFW vérifie si une image contient du contenu NSFW en appelant un script Python via un script batch.
func CheckImageForNSFW(filePath string) (bool, error) {
    log.Printf("Checking image for NSFW: %s", filePath)

    // Create log file
    logFile, err := os.Create("nsfw_detector.log")
    if err != nil {
        log.Printf("Error creating log file: %v", err)
        return false, err
    }
    defer logFile.Close()

    cmd := exec.Command("cmd", "/C", "utils\\run_nsfw_detector.bat", filePath)
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
