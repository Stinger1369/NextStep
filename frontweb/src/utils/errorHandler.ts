// src/utils/errorHandler.ts

import { userFriendlyMessages } from "./errorMessages";

export interface ImageError {
  // Ajoutez 'export' ici
  imageName: string;
  status: string;
  message: string;
  code: string | null;
}

export const handleImageErrors = (results: ImageError[]) => {
  const failedImages = results.filter((result) => result.status === "failed");
  if (failedImages.length > 0) {
    failedImages.forEach((failedImage) => {
      const errorMessage = failedImage.message || "Unknown error occurred";
      console.error(
        `Error with image "${failedImage.imageName}": ${
          userFriendlyMessages[
            failedImage.code as keyof typeof userFriendlyMessages
          ] || errorMessage
        }`
      );
    });
  }
};
