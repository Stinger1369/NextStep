package utils

import (
    "crypto/sha256"
    "encoding/hex"
    "os"
    "encoding/json"
    "io/ioutil"
    "path/filepath"
)

// CalculateHash calcule le hachage SHA-256 d'une chaîne base64
func CalculateHash(base64String string) string {
    hasher := sha256.New()
    hasher.Write([]byte(base64String))
    return hex.EncodeToString(hasher.Sum(nil))
}

// HashExists vérifie si un hachage existe déjà pour un utilisateur donné
func HashExists(userDir string, hash string) (bool, error) {
    hashFilePath := filepath.Join(userDir, "hashes.json")
    if _, err := os.Stat(hashFilePath); os.IsNotExist(err) {
        return false, nil
    }

    data, err := ioutil.ReadFile(hashFilePath)
    if err != nil {
        return false, err
    }

    var hashes map[string]bool
    if err := json.Unmarshal(data, &hashes); err != nil {
        return false, err
    }

    return hashes[hash], nil
}

// AddHash ajoute un hachage au fichier hashes.json pour un utilisateur donné
func AddHash(userDir string, hash string) error {
    hashFilePath := filepath.Join(userDir, "hashes.json")
    var hashes map[string]bool

    if _, err := os.Stat(hashFilePath); os.IsNotExist(err) {
        hashes = make(map[string]bool)
    } else {
        data, err := ioutil.ReadFile(hashFilePath)
        if err != nil {
            return err
        }
        if err := json.Unmarshal(data, &hashes); err != nil {
            return err
        }
    }

    hashes[hash] = true
    data, err := json.Marshal(hashes)
    if err != nil {
        return err
    }

    return ioutil.WriteFile(hashFilePath, data, 0644)
}
