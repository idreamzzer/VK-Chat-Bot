const fs = require("fs");
const path = require("path");
const logger = require("../utils/logger");

const tempFilesDirectory = path.join(__dirname, "../temp/");
const defaultTempFileName = "default.txt";

module.exports = {
  create: (fileName = defaultTempFileName, data = "") => {
    return new Promise((resolve, reject) => {
      fs.appendFile(path.join(tempFilesDirectory, fileName), data, err => {
        if (err) {
          logger.error(err);
          reject(err);
        }
        logger.debug(`Temp file ${fileName} created`);
        resolve();
      });
    });
  },
  write: (fileName = defaultTempFileName, data = "") => {
    return new Promise((resolve, reject) => {
      fs.writeFile(path.join(tempFilesDirectory, fileName), data, err => {
        if (err) {
          logger.error(err);
          reject(err);
        }
        logger.debug(`Temp file ${fileName} wrote`);
        resolve();
      });
    });
  },
  createReadStream: (fileName = defaultTempFileName) => {
    return fs.createReadStream(path.join(tempFilesDirectory, fileName));
  },
  createWriteStream: (fileName = defaultTempFileName) => {
    return fs.createWriteStream(path.join(tempFilesDirectory, fileName));
  },
  delete: (fileName = defaultTempFileName) => {
    return new Promise((resolve, reject) => {
      fs.unlink(path.join(tempFilesDirectory, fileName), err => {
        if (err) {
          logger.error(err);
          reject(err);
        }
        logger.debug(`Temp file ${fileName} deleted`);
        resolve();
      });
    });
  }
};
