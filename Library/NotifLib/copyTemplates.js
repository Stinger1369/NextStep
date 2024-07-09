const fs = require("fs-extra");
const path = require("path");

const srcDir = path.join(__dirname, "src", "templates");
const destDir = path.join(__dirname, "dist", "templates");

fs.copy(srcDir, destDir)
  .then(() => console.log("Templates copied successfully!"))
  .catch((err) => console.error("Error copying templates:", err));
