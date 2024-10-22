//////////////////////////////////////////////////////////////////////////////
// Simulate file system
//////////////////////////////////////////////////////////////////////////////
let fileSystem = null;

fetch("assets/fileSystem.json")
  .then((response) => {
    if (!response.ok) {
      throw new Error("Network response was not ok " + response.statusText);
    }
    return response.text();
  })
  .then((data) => {
    fileSystem = JSON.parse(data);
  })
  .catch((error) => {
    console.log(error.message);
  });

let currentDir = "/";

//////////////////////////////////////////////////////////////////////////////
// Deal with input
//////////////////////////////////////////////////////////////////////////////
const commandInput = document.getElementById("command-input");
const outputMsg = document.getElementById("output");
commandInput.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    console.log(commandInput.value);
    const command = commandInput.value.trim();
    console.log(`command: ${command}`);

    // Output the command
    outputMsg.innerHTML += `<div><span class="prompt">dimen61@portfolio:${currentDir}$</span> ${command}</div>`;

    // Clear the input field
    commandInput.value = "";

    // Execute simple commands (for demo purposes)
    handleCommand(command);
    resetCaret();

    // Scroll to the bottom
    document.getElementById("terminal").scrollTop =
      document.getElementById("terminal").scrollHeight;
  }
});

console.log('Command handler loaded...');

function handleCommand(command) {
  let response = "";
  const args = command.split(" ");
  const cmd = args[0].toLowerCase();

  switch (cmd.toLowerCase()) {
    case "":
      break;
    case "help":
      response = "Available commands: help, ls, pwd, clear";
      outputMsg.innerHTML += newline(
        "Available commands: help, ls, clear, cd ant cat"
      );
      break;

    case "pwd":
      outputMsg.innerHTML += newline(currentDir);
      break;

    case "ls":
      if (args.length == 1) {
        outputMsg.innerHTML += newline(ls_cmd(currentDir));
      } else if (args.length == 2) {
        const path = args[1];
        outputMsg.innerHTML += newline(ls_cmd(path));
      } else {
        outputMsg.innerHTML += newline("Wrong usage of ls command!");
        handleCommand("help ls");
      }
      break;

    case "clear":
      outputMsg.innerHTML = "";
      break;

    case "cd":
      if (args.length == 2) {
        let targetPath = args[1];
        targetPath = resolvePath(targetPath);
        if (cd_cmd(targetPath)) {
          currentDir = targetPath;

          const prompt = document.querySelector("#input-line .prompt");
          prompt.dataset.path = targetPath;
          prompt.textContent = `dimen61@portfolio:${targetPath}$`;
        } else {
          outputMsg.innerHTML += newline(
            `bash: cd: ${targetPath}: No such directory`
          );
        }
      } else {
        outputMsg.innerHTML += newline("Wrong usage of cd command!");
        handleCommand("help cd");
      }
      break;

    case "cat":
      if (args.length == 2) {
        const fileName = args[1];
        const ret = cat_cmd(fileName);
        if (!ret) {
          outputMsg.innerHTML += newline(
            `bash: cat: ${fileName}: No such file`
          );
        } else {
            outputMsg.innerHTML += newline(ret);
        }
      } else {
        outputMsg.innerHTML += newline("Wrong usage of cat command!");
        handleCommand("help cat");
      }
      break;

    default:
      outputMsg.innerHTML += newline(`bash: ${command}: command not found`);
  }
}

function newline(content) {
  return `<div>${content}</div>`;
}

/**
 * Lists the contents of a directory or returns the path if it's a file.
 *
 * @param {string} path - The path to the directory or file. It can be absolute or relative.
 * @return {string} A string containing the directory contents or the file path, or an error message if the path does not exist.
 */
function ls_cmd(path) {
  path = resolvePath(path);
  let fileSystemObj = getFileSystemObj(path);

  if (fileSystemObj && fileSystemObj.type === "dir") {
    return Object.keys(fileSystemObj.contents).join("  ");
  } else if (fileSystemObj && fileSystemObj.type === "file") { // TODO: need improvement
    return path;
  } else {
    return `bash: ls: ${path}: No such directory`;
  }
}

/**
 * Retrieves a file system object from the JSO simulated file system based on the given path.
 *
 * @param {string} path - The path to the file system object. It can be absolute or relative.
 * @return {object|null} The file system object if the path exists, otherwise null.
 */
function getFileSystemObj(path) {
  const items = path.split("/").filter((p) => p);
  let tmpDir = fileSystem;

  for (let item of items) {
    if (tmpDir.contents[item]) {
      tmpDir = tmpDir.contents[item];
    } else {
      return null;
    }
  }

  return tmpDir;
}

/**
 * Changes the current directory to the specified path.
 *
 * @param {string} path - The path to the directory.
 * @return {boolean} True if the directory change was successful, false otherwise.
 */
function cd_cmd(path) {
  path = resolvePath(path);
  const fileSystemObj = getFileSystemObj(path);

  if (fileSystemObj && fileSystemObj.type === "dir") {
    currentDir = path;
    return true;
  }
  return false;
}

function cat_cmd(fileName) {
  const filePath = resolvePath(fileName);
  const fileSystemObj = getFileSystemObj(filePath);
  if (fileSystemObj && fileSystemObj.type === "file") {
      return fileSystemObj.content;
  }

//   const fileSystemObj = getFileSystemObj(currentDir);
//   if (fileSystemObj && fileSystemObj.type === "dir") {
//     const file = fileSystemObj.contents[fileName];
//     if (file && file.type === "file") {
//       return file.content;
//     } else {
//       return false;
//     }
//   }


  return false;
}

function resolvePath(path) {
  if (path.startsWith("/")) {
    return path; // Absolute path
  }

  const items = currentDir
    .split("/")
    .concat(path.split("/"))
    .filter((p) => p && p !== ".");
  const stack = [];

  items.forEach((item) => {
    if (item === "..") {
      stack.pop(); // Go up a directory
    } else {
      stack.push(item);
    }
  });

  return "/" + stack.join("/");
}
