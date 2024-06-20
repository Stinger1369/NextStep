package utils

import (
    "os/exec"
    "log"
)

// CheckImageForNSFW vérifie si une image contient du contenu NSFW en appelant un script Python.
func CheckImageForNSFW(filePath string) (bool, error) {
    log.Printf("Checking image for NSFW: %s", filePath)
    cmd := exec.Command("python", "utils/nsfw_detector.py", filePath)
    output, err := cmd.CombinedOutput()
    if err != nil {
        log.Printf("Error executing command: %v, output: %s", err, output)
        return false, err
    }

    log.Printf("NSFW check output: %s", output)
    return string(output) == "NSFW Check Result: True\n", nil
}
