// backend/src/constants/errorCodes.ts

export const ERROR_CODES = {
  ErrInvalidRequestFormat: "ERR001",
  ErrEmptyUserID: "ERR002",
  ErrCreatingUserDirectory: "ERR003",
  ErrCountingUserImages: "ERR004",
  ErrMaxImagesReached: "ERR005",
  ErrDecodingBase64: "ERR006",
  ErrWritingFile: "ERR007",
  ErrNSFWCheck: "ERR008",
  ErrImageNSFW: "ERR009",
  ErrImageCompression: "ERR010",
  ErrRemovingOriginalImage: "ERR011",
  ErrAddingImageHash: "ERR012",
  ErrImageAlreadyExists: "ERR013",
  ErrMaxVideosReached: "ERR014",
  ErrVideoNSFW: "ERR015",
  ErrDecodingVideoBase64: "ERR016",
  ErrVideoAlreadyExists: "ERR017",
  ErrUploadingVideo: "ERR018",
  UNKNOWN_ERROR: "ERR999", // Consistent unknown error code
};
