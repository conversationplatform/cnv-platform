const inputFile = process.argv.slice(2)[0];
const outputFile = process.argv.slice(2)[1];
const path = require("path");
const fs = require("fs");

if (!inputFile || !outputFile) {
  console.error(
    "[err] please specify the flows.json file argument eg.: cnv-essentials-migration.js flows.json flows-fixed.json"
  );
  process.exit(1);
}

const inputFilePath = path.resolve(__dirname, inputFile);

const outputFilePath = path.resolve(__dirname, outputFile);


if (!fs.existsSync(inputFilePath)) {
  console.error(
    "[err] file not found. please specify the flows.json file argument eg.: cnv-essentials-migration.js flows-fixed.json"
  );
  process.exit(2);
}

let nodes;
try {
    nodes = JSON.parse(fs.readFileSync(inputFilePath).toString());
} catch (e) {}

if (!nodes) {
  console.error(
    "[err] invalid json file. please specify the flows.json file argument eg.: cnv-essentials-migration.js flows-fixed.json"
  );
  process.exit(2);
}

// let nodes = new Set();
// flows.map(n => n.type).forEach(t => nodes.add(t));

// console.log(nodes)

const nodeMapper = {
//   "repo-article-config": "",
//   "repo-articles-helper-config": "",
//   "repo-theme-config": "",
//   "repo-image-config": "",
//   "repo-image-helper-config": "",
//   "lottie-animation-config": "",
  "cnv-carousel": "cnv-essentials-carousel",
  "cnv-interact": "cnv-essentials-interact",
  "cnv-multiselect": "cnv-essentials-multiselect",
  "cnv-singleselect":"cnv-essentials-singleselect",
  "cnv-sendtext":"cnv-essentials-sendtext",
  "cnv-slider": "cnv-essentials-slider",
  "cnv-footer": "cnv-essentials-footer",
  "cnv-splashscreen": "cnv-essentials-splashscreen",
  "cnv-draganddrop": "cnv-essentials-drag-and-drop",
  "cnv-ratingstars": "cnv-essentials-ratingstars",
  "track-service": "cnv-essentials-track-service"
};

nodes.forEach(node => {
    const type = node.type;
    const mappedType = nodeMapper[type];
    if(mappedType && mappedType != type) {
        console.log(`node [${node.id}] ${type} => ${mappedType}`);
        node.type = mappedType;
    }
})

fs.writeFileSync(outputFilePath, JSON.stringify(nodes));
console.log(`file saved: ${outputFilePath}`);
