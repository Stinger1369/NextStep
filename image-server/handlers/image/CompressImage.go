package image

import (
    "os"
    "image"
    "image/jpeg"
    "image/png"
    "github.com/nfnt/resize"
    "log"
    "path/filepath"
    "strings"
    "errors"
)

func compressImage(filePath string) (string, error) {
    file, err := os.Open(filePath)
    if err != nil {
        return "", err
    }
    defer file.Close()

    // Detect image type
    img, format, err := image.Decode(file)
    if err != nil {
        return "", err
    }
    log.Printf("Image format detected: %s", format)

    // Resize image
    m := resize.Resize(500, 0, img, resize.Lanczos3)

    // Prepare compressed file path
    ext := strings.ToLower(filepath.Ext(filePath))
    compressedPath := filePath + "_compressed"

    // Create compressed file with correct extension
    out, err := os.Create(compressedPath + ext)
    if err != nil {
        return "", err
    }
    defer out.Close()

    // Encode image in the appropriate format
    switch format {
    case "jpeg":
        err = jpeg.Encode(out, m, nil)
    case "png":
        err = png.Encode(out, m)
    default:
        err = errors.New("unsupported image format")
    }

    if err != nil {
        return "", err
    }

    log.Printf("Compressed image created: %s", compressedPath+ext)
    return compressedPath + ext, nil
}
