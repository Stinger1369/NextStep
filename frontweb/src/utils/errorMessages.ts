// frontweb/src/utils/errorMessages.ts

import { ERROR_CODES } from './errorCodes';

export const userFriendlyMessages = {
  // Messages d'erreur existants pour les images
  [ERROR_CODES.ErrImageNSFW]: 'Image is inappropriate.',
  [ERROR_CODES.ErrImageCompression]:
    'Error compressing the image. The format might be unsupported.',
  [ERROR_CODES.ErrImageAlreadyExists]: 'This image already exists.',
  [ERROR_CODES.ErrDecodingBase64]: 'There was an error decoding the image. Please try again.',
  [ERROR_CODES.ErrWritingFile]: 'There was an error saving the image. Please try again.',
  [ERROR_CODES.ErrMaxImagesReached]: 'You have reached the maximum number of images.',

  // Messages d'erreur pour les vidéos
  [ERROR_CODES.ErrMaxVideosReached]: 'You have reached the maximum number of videos.',
  [ERROR_CODES.ErrVideoNSFW]: 'The video contains inappropriate content (NSFW).',
  [ERROR_CODES.ErrDecodingVideoBase64]: 'There was an error decoding the video. Please try again.',
  [ERROR_CODES.ErrVideoAlreadyExists]: 'This video already exists.',
  [ERROR_CODES.ErrUploadingVideo]: 'Failed to upload video. Please try again.',

  UNKNOWN_ERROR: 'An unknown error occurred. Please try again.'
};
