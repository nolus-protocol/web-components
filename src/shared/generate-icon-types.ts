import fs from "fs";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const directoryPath = path.join(__dirname, "../assets/icons");
const outputPath = path.join(__dirname, "../components/atoms/svg-icon/types.ts");

fs.readdir(directoryPath, (err, files) => {
  if (err) {
    console.error("Unable to scan directory: " + err);
    process.exit(1);
  }

  const iconNames = files.filter((file) => file.endsWith(".svg")).map((file) => `"${file.replace(".svg", "")}"`);

  const typeDefinition = `export const iconNames = [${iconNames.join(", ")}] as const;\n`;

  fs.readFile(outputPath, "utf8", (err, data) => {
    if (err) {
      console.error("Unable to read file: " + err);
      process.exit(1);
    }

    const iconNamesRegex = /export const iconNames = \[[^\]]+\] as const;/;
    let newData;

    if (iconNamesRegex.test(data)) {
      newData = data.replace(iconNamesRegex, typeDefinition);
    } else {
      newData = data + "\n" + typeDefinition;
    }

    fs.writeFile(outputPath, newData, (err) => {
      if (err) {
        console.error("Unable to write file: " + err);
        process.exit(1);
      }
      console.log("IconNames type updated successfully.");
    });
  });
});
