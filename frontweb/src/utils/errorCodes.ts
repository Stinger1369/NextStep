// frontweb/src/utils/errorCodes.ts

export const ERROR_CODES = {
  // Codes d'erreur existants pour les images
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

  // Codes d'erreur pour les vidéos
  ErrMaxVideosReached: 'ERR014', // Si le nombre maximum de vidéos est atteint
  ErrVideoNSFW: 'ERR015', // Si la vidéo contient du contenu NSFW
  ErrDecodingVideoBase64: 'ERR016', // Erreur lors du décodage de la vidéo
  ErrVideoAlreadyExists: 'ERR017', // Si la vidéo existe déjà
  ErrUploadingVideo: 'ERR018', // Erreur lors de l'upload de la vidéo
  UNKNOWN_ERROR: 'UNKNOWN_ERROR' // Erreur inconnue
};
