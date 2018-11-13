const downloader = require("download-file");
const config = require("../config.json");
const vkbot = require("../vkbot");
const rp = require("request-promise");
const request = require("request");
const path = require("path");
const logger = require("../utils/logger");
const tempFileHandler = require("../helpers/tempFileHandler");

// TODO clean

module.exports = async ctx => {
  // Get random cat url
  const responseFromRandomCat = await rp("http://aws.random.cat/meow");
  const catData = JSON.parse(responseFromRandomCat);
  const tempFileName = `cat${path.extname(catData.file)}`;
  // Download cat
  await downloadFileByUrl(catData.file);
  // Get url for upload to vk servers
  const responseUploadServer = await getUrlForUpload(ctx.peer_id);
  // Upload cat to vk
  const responseUploadToVk = await uploadToVkByUploadUrl(
    responseUploadServer.data.upload_url,
    tempFileHandler.createReadStream(tempFileName)
  );
  // Detele cat file
  await tempFileHandler.delete(tempFileName);
  // Save cat in photos
  const savedData = await saveFileInVk(JSON.parse(responseUploadToVk));
  const { owner_id, id } = savedData.data[0];
  let attachment = `photo${owner_id}_${id}`;
  ctx.reply("", { attachment });
};

function downloadFileByUrl(url) {
  const tempFileName = `cat${path.extname(url)}`;
  return new Promise((resolve, reject) => {
    downloader(
      url,
      { directory: path.join(__dirname, "../temp/"), filename: tempFileName },
      err => {
        if (err) {
          logger.error(err);
          reject(err);
        }
        logger.debug(`File ${tempFileName} downloaded`);
        resolve();
      }
    );
  });
}

function getUrlForUpload(peer_id) {
  return new Promise((resolve, reject) => {
    vkbot.execute(
      "photos.getMessagesUploadServer",
      {
        access_token: config.access_token,
        peer_id
      },
      (response, err) => {
        if (err) {
          logger.error(err);
          reject(err);
        }
        logger.debug("Got url for upload");
        resolve(response);
      }
    );
  });
}

function uploadToVkByUploadUrl(upload_url, file) {
  let options = {
    uri: upload_url,
    method: "POST",
    headers: {
      "Content-Type": "multipart/form-data"
    },
    formData: {
      file: [file]
    }
  };
  return new Promise((resolve, reject) => {
    request(options, (err, response, body) => {
      if (err) {
        logger.error(err);
        reject(err);
      } else {
        logger.debug("Uploaded file to vk");
        resolve(body);
      }
    });
  });
}

function saveFileInVk(data) {
  return new Promise((resolve, reject) => {
    let params = {
      access_token: config.access_token,
      ...data
    };
    vkbot.execute("photos.saveMessagesPhoto", params, (response, err) => {
      if (err) {
        logger.error(err);
        reject(err);
      }
      logger.debug("Saved file in vk docs");
      resolve(response);
    });
  });
}
