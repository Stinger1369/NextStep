package image

import (
    "os"
    "image"
    "image/jpeg"
    "github.com/nfnt/resize"
    "log"
)

func compressImage(filePath string) (string, error) {
    file, err := os.Open(filePath)
    if err != nil {
        return "", err
    }
    defer file.Close()

    img, _, err := image.Decode(file)
    if err != nil {
        return "", err
    }

    m := resize.Resize(500, 0, img, resize.Lanczos3)

    compressedPath := filePath + "_compressed.jpg"
    out, err := os.Create(compressedPath)
    if err != nil {
        return "", err
    }
    defer out.Close()

    err = jpeg.Encode(out, m, nil)
    if err != nil {
        return "", err
    }

    log.Printf("Compressed image created: %s", compressedPath)
    return compressedPath, nil
}
