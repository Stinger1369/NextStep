const faceapi = require("face-api.js");

const faceDetectionOptions = new faceapi.SsdMobilenetv1Options({
  minConfidence: 0.5,
  maxResults: 10,
});

module.exports = {
  faceDetectionOptions,
};
