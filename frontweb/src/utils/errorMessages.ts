// frontweb/src/utils/errorMessages.ts
import { ERROR_CODES } from './errorCodes';

export const userFriendlyMessages = {
  [ERROR_CODES.ErrImageNSFW]: 'Image is inappropriate.',
  [ERROR_CODES.ErrImageCompression]: 'Error compressing the image. The format might be unsupported.',
  [ERROR_CODES.ErrImageAlreadyExists]: 'This image already exists.',
  [ERROR_CODES.ErrDecodingBase64]: 'There was an error decoding the image. Please try again.',
  [ERROR_CODES.ErrWritingFile]: 'There was an error saving the image. Please try again.',
  [ERROR_CODES.ErrMaxImagesReached]: 'You have reached the maximum number of images.',
  UNKNOWN_ERROR: 'An unknown error occurred. Please try again.'
};
