// Run this script with `node genFileSystemJson.js /path/to/directory`
import fs from 'fs';
import path from 'path';


// Function to convert a directory structure to JS object
function convertPathToFileSystemObject(pathStr) {
  if (!fs.existsSync(pathStr)) {
    console.error(`Directory ${pathStr} does not exist`);
    process.exit(1);
  } 

  const status = fs.statSync(pathStr);
  if (status.isFile()) {
    return {
      type: "file",
      content: fs.readFileSync(pathStr, "utf8"),
    };
  }

  let retObj = { type: "dir", contents: {} };
  const contents = fs.readdirSync(pathStr);

  for (const item of contents) {
    const itemPath = path.join(pathStr, item);
    retObj.contents[item] = convertPathToFileSystemObject(itemPath);
  }
  return retObj;
}

// Main function
const pathStr = process.argv[2];
if (!pathStr) {
    console.error('Please provide a path as the first command line argument');
    process.exit(1);
}

const fileSystemObj = convertPathToFileSystemObject(pathStr);
const outputFile = 'fileSystem.json';
fs.writeFileSync(outputFile, JSON.stringify(fileSystemObj, null, 2));
console.log(`Wrote file system structure to ${outputFile}`);
console.log(JSON.stringify(fileSystemObj, null, 2));

