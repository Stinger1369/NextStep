// xe fichier pour fairele Tree de l'arborescence des fichiers et dossiers node tree.js

const fs = require("fs");
const path = require("path");

function printTree(dir, level = 0) {
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stats = fs.statSync(filePath);

    if (file !== "node_modules") {
      console.log(" ".repeat(level * 2) + file);
      if (stats.isDirectory()) {
        printTree(filePath, level + 1);
      }
    }
  });
}

const directory = process.argv[2] || ".";
printTree(directory);
