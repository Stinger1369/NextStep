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
    "golang.org/x/image/webp"
    "io"
)

// compressImage compresses the image located at filePath and returns the path to the compressed image
func compressImage(filePath string) (string, error) {
    file, err := os.Open(filePath)
    if err != nil {
        return "", err
    }
    defer file.Close()

    // Detect image type
    ext := strings.ToLower(filepath.Ext(filePath))
    var img image.Image

    switch ext {
    case ".jpg", ".jpeg":
        img, err = jpeg.Decode(file)
        if err != nil {
            return "", err
        }
    case ".png":
        img, err = png.Decode(file)
        if err != nil {
            return "", err
        }
    case ".webp":
        img, err = decodeWebP(file)
        if err != nil {
            return "", err
        }
    default:
        return "", errors.New("unsupported image format")
    }

    log.Printf("Image format detected: %s", ext)

    // Resize image
    m := resize.Resize(500, 0, img, resize.Lanczos3)

    // Prepare compressed file path without "_compressed"
    compressedPath := strings.TrimSuffix(filePath, ext)

    // Create compressed file with correct extension
    out, err := os.Create(compressedPath + ".jpg") // Save all as .jpg
    if err != nil {
        return "", err
    }
    defer out.Close()

    // Encode image in JPEG format
    err = jpeg.Encode(out, m, nil)
    if err != nil {
        return "", err
    }

    log.Printf("Compressed image created: %s", compressedPath+".jpg")
    return compressedPath + ".jpg", nil
}

// decodeWebP decodes a WebP image
func decodeWebP(r io.Reader) (image.Image, error) {
    img, err := webp.Decode(r)
    if err != nil {
        return nil, err
    }
    return img, nil
}
