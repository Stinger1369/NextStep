package config

import (
	"github.com/joho/godotenv"
	"log"
	"os"
)

// Load environment variables from .env file
func init() {
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found or could not be loaded")
	}
}

// GetEnv retrieves the value of the environment variable named by the key
func GetEnv(key, fallback string) string {
	if value, ok := os.LookupEnv(key); ok {
		return value
	}
	return fallback
}
