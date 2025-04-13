#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

function getAllFiles(dirPath, basePath = dirPath) {
  let entries = fs.readdirSync(dirPath, { withFileTypes: true });
  let files = [];

  for (let entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      files = files.concat(getAllFiles(fullPath, basePath));
    } else {
      files.push(path.relative(basePath, fullPath));
    }
  }

  return files;
}

function pack(inputPath, outputPath) {
  const stats = fs.statSync(inputPath);
  const archive = {
    type: "marcwel",
    createdAt: new Date().toISOString(),
    files: [],
  };

  if (stats.isFile()) {
    const content = fs.readFileSync(inputPath);
    archive.files.push({
      path: path.basename(inputPath),
      content: content.toString("base64"),
    });
    console.log(`📦 Marcweled file: ${inputPath}`);
  } else if (stats.isDirectory()) {
    const files = getAllFiles(inputPath);
    for (let file of files) {
      const filePath = path.join(inputPath, file);
      const content = fs.readFileSync(filePath);
      archive.files.push({
        path: file,
        content: content.toString("base64"),
      });
    }
    console.log(
      `📦 Marcweled folder: ${inputPath} (${archive.files.length} files)`
    );
  } else {
    throw new Error("❌ Input must be a file or folder. Skill Issue.");
  }

  const json = JSON.stringify(archive, null, 2);
  fs.writeFileSync(outputPath, json);
  console.log(`✅ Marcweled into ${outputPath}`);
}

function unpack(archivePath, outputFolder) {
  const data = fs.readFileSync(archivePath, "utf-8");
  const archive = JSON.parse(data);

  if (archive.type !== "marcwel") {
    throw new Error("❌ Not a valid file. Skill Issue.");
  }

  for (let file of archive.files) {
    const outputPath = path.join(outputFolder, file.path);
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, Buffer.from(file.content, "base64"));
  }

  console.log(
    `✅ Unmarcweled ${archive.files.length} files to ${outputFolder}`
  );
}

const [, , command, input, output] = process.argv;

try {
  if (command === "pack") {
    pack(input, output);
  } else if (command === "unpack") {
    unpack(input, output);
  } else {
    console.log("Usage:");
    console.log("  marcwel pack <folder> <output.marcwel>");
    console.log("  marcwel unpack <archive.marcwel> <output-folder>");
  }
} catch (err) {
  console.error("❌ Skill Issue");
  process.exit(1);
}
