



  const nsfw = require("nsfwjs");
  const tf = require("@tensorflow/tfjs");
  const sharp = require("sharp");
  const fs = require("fs");
  const { createCanvas, loadImage } = require("canvas");

  async function checkImage(imagePath) {
    // Convertir l'image en PNG
    const pngImagePath = imagePath.replace(/\.[^/.]+$/, ".png");
    await sharp(imagePath).png().toFile(pngImagePath);

    const image = await loadImage(pngImagePath);
    const canvas = createCanvas(image.width, image.height);
    const ctx = canvas.getContext("2d");
    ctx.drawImage(image, 0, 0, image.width, image.height);

    const model = await nsfw.load();
    const predictions = await model.classify(canvas);

    // Supprimer l'image PNG temporaire
    fs.unlinkSync(pngImagePath);

    // Log predictions for debugging purposes
    console.log(predictions);

    return predictions.some(
      (prediction) =>
        (prediction.className === "Porn" && prediction.probability > 0.5) ||
        (prediction.className === "Sexy" && prediction.probability > 0.4) ||
        (prediction.className === "Hentai" && prediction.probability > 0.4)
    );
  }

  const imagePath = process.argv[2];

  checkImage(imagePath)
    .then((isNSFW) => {
      console.log(isNSFW);
    })
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
