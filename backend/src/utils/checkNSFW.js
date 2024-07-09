const nsfw = require("nsfwjs");
const tf = require("@tensorflow/tfjs-node");
const fs = require("fs");
const { createCanvas, loadImage } = require("canvas");

async function checkImage(imagePath) {
  const image = await loadImage(imagePath);
  const canvas = createCanvas(image.width, image.height);
  const ctx = canvas.getContext("2d");
  ctx.drawImage(image, 0, 0, image.width, image.height);

  const model = await nsfw.load();
  const predictions = await model.classify(canvas);

  return predictions.some(
    (prediction) =>
      prediction.className === "Porn" && prediction.probability > 0.8
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
