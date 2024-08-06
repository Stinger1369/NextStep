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

  // Add these for video errors
  ErrMaxVideosReached: "ERR014",       // Code for exceeding max video uploads
  ErrVideoNSFW: "ERR015",              // Code for NSFW video content
  ErrVideoAlreadyExists: "ERR016"      // Code for video that already exists
};
