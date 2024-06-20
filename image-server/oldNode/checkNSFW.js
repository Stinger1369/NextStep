const nsfw = require("nsfwjs");
const tf = require("@tensorflow/tfjs-node"); // Utilisation de tfjs-node pour le serveur
const sharp = require("sharp");
const fs = require("fs");
const { createCanvas, loadImage } = require("canvas");
const faceapi = require("face-api.js");
const Tesseract = require("tesseract.js");

const faceDetectionOptions = new faceapi.SsdMobilenetv1Options({
  minConfidence: 0.5,
  maxResults: 10,
});

async function checkImage(imagePath) {
  console.log("Starting checkImage function");

  // Convertir l'image en PNG
  const pngImagePath = imagePath.replace(/\.[^/.]+$/, ".png");
  console.log(`Converting image to PNG: ${pngImagePath}`);
  await sharp(imagePath).png().toFile(pngImagePath);
  console.log("Image converted to PNG");

  const image = await loadImage(pngImagePath);
  console.log("Image loaded successfully");
  const canvasElement = createCanvas(image.width, image.height);
  const ctx = canvasElement.getContext("2d");
  ctx.drawImage(image, 0, 0, image.width, image.height);
  console.log("Image drawn on canvas");

  // Charger et classer le modèle NSFW
  const model = await nsfw.load();
  console.log("NSFW model loaded successfully");
  const predictions = await model.classify(canvasElement);
  console.log("Image classified successfully");

  // Supprimer l'image PNG temporaire
  fs.unlinkSync(pngImagePath);
  console.log("Temporary PNG image deleted");

  // Log predictions for debugging purposes
  console.log("NSFW Predictions:", predictions);

  // Vérification du contenu NSFW
  const isNSFW = predictions.some(
    (prediction) =>
      (prediction.className === "Porn" && prediction.probability > 0.5) ||
      (prediction.className === "Sexy" && prediction.probability > 0.4) ||
      (prediction.className === "Hentai" && prediction.probability > 0.4)
  );

  if (isNSFW) {
    return true;
  }

  // Détection de visage humain
  await faceapi.nets.ssdMobilenetv1.loadFromDisk("./models"); // Ensure the model files are correctly placed
  console.log("FaceAPI model loaded successfully");

  const imgBuffer = fs.readFileSync(imagePath);
  const inputTensor = tf.node.decodeImage(imgBuffer, 3); // Decode image to tensor
  const detections = await faceapi.detectAllFaces(
    canvasElement,
    faceDetectionOptions
  );
  inputTensor.dispose(); // Dispose the tensor after use
  console.log("Faces detected:", detections);

  // Si aucun visage n'est détecté, retourner true
  if (detections.length === 0) {
    return true;
  }

  // Détection de texte
  const {
    data: { text },
  } = await Tesseract.recognize(imagePath, "eng");
  console.log("Text detected:", text);
  const containsPhoneNumber = /\b\d{10,}\b/.test(text); // Simple regex pour détecter les numéros de téléphone

  if (containsPhoneNumber) {
    return true;
  }

  // Si l'image passe tous les filtres, retourner false
  return false;
}

const imagePath = process.argv[2];

checkImage(imagePath)
  .then((isNSFW) => {
    console.log("NSFW Check Result:", isNSFW);
  })
  .catch((err) => {
    console.error("Error in checkImage function:", err);
    process.exit(1);
  });
