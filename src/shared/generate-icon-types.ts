import fs from "fs";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const directoryPath = path.join(__dirname, "../assets/icons");
const outputPath = path.join(__dirname, "../components/atoms/svg-icon/types.ts");

fs.readdir(directoryPath, (err, files) => {
  if (err) {
    return console.error("Unable to scan directory: " + err);
  }

  const iconNames = files.filter((file) => file.endsWith(".svg")).map((file) => `"${file.replace(".svg", "")}"`);

  const typeDefinition = `export const iconNames = [${iconNames.join(", ")}] as const;\n`;

  fs.readFile(outputPath, "utf8", (err, data) => {
    if (err) {
      return console.error("Unable to read file: " + err);
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
        return console.error("Unable to write file: " + err);
      }
      console.log("IconNames type updated successfully.");
    });
  });
});
