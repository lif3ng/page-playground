const fs = require("fs");

fs.copyFileSync("node_modules/vue/dist/vue.min.js", "examples/vue.min.js");
fs.copyFileSync("dist/html.min.js", "examples/html.min.js");

const examplesIndexFile = "examples/index.html";
const indexContent = fs.readFileSync(examplesIndexFile, "utf-8");
const targetContent = indexContent
  .replace("../node_modules/vue/dist", ".")
  .replace(/..\/dist/g, ".");
fs.writeFileSync(examplesIndexFile, targetContent);
