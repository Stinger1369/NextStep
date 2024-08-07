export const ERROR_CODES = {
  // Existing error codes for images
  ErrInvalidRequestFormat: 'ERR001',
  ErrEmptyUserID: 'ERR002',
  ErrCreatingUserDirectory: 'ERR003',
  ErrCountingUserImages: 'ERR004',
  ErrMaxImagesReached: 'ERR005',
  ErrDecodingBase64: 'ERR006',
  ErrWritingFile: 'ERR007',
  ErrNSFWCheck: 'ERR008',
  ErrImageNSFW: 'ERR009',
  ErrImageCompression: 'ERR010',
  ErrRemovingOriginalImage: 'ERR011',
  ErrAddingImageHash: 'ERR012',
  ErrImageAlreadyExists: 'ERR013',

  // Error codes for videos
  ErrMaxVideosReached: 'ERR014', // If the maximum number of videos is reached
  ErrVideoNSFW: 'ERR015', // If the video contains NSFW content
  ErrDecodingVideoBase64: 'ERR016', // Error decoding video
  ErrVideoAlreadyExists: 'ERR017', // If the video already exists
  ErrUploadingVideo: 'ERR018', // Error uploading video
  UNKNOWN_ERROR: 'UNKNOWN_ERROR' // Unknown error
};
