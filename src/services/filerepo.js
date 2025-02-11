const fs = require("fs");

class FileRepo {
  exists(file) {
    return fs.existsSync(file);
  }

  loadFile(file) {
    return fs.readFileSync(file, { encoding: "utf8", flag: "r" });
  }

  writeFile(file, content) {
    fs.writeFileSync(file, content, {
      encoding: "utf8",
    });
  }
}

module.exports = FileRepo;
