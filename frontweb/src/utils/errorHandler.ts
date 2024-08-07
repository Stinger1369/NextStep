// frontweb/src/utils/errorHandler.ts

import { userFriendlyMessages } from './errorMessages';

export interface VideoError {
  videoName: string;
  status: string;
  message: string;
  code: string | null;
}

export interface ImageError {
  imageName: string;
  status: string;
  message: string;
  code: string | null;
}

export const handleImageErrors = (results: ImageError[]) => {
  const failedImages = results.filter((result) => result.status === 'failed');
  if (failedImages.length > 0) {
    failedImages.forEach((failedImage) => {
      const errorMessage = failedImage.message || 'Unknown error occurred';
      console.error(
        `Error with image "${failedImage.imageName}": ${
          userFriendlyMessages[failedImage.code as keyof typeof userFriendlyMessages] ||
          errorMessage
        }`
      );
    });
  }
};

export const handleVideoErrors = (results: VideoError[]) => {
  const failedVideos = results.filter((result) => result.status === 'failed');
  if (failedVideos.length > 0) {
    failedVideos.forEach((failedVideo) => {
      const errorMessage = failedVideo.message || 'Unknown error occurred';
      console.error(
        `Error with video "${failedVideo.videoName}": ${
          userFriendlyMessages[failedVideo.code as keyof typeof userFriendlyMessages] ||
          errorMessage
        }`
      );
    });
  }
};
