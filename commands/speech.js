const request = require("request");
const config = require("../config.json");
const fs = require("fs");
const path = require("path");
const AWS = require("aws-sdk");
const removeTag = require("../helpers/removeTag");
const vkbot = require("../vkbot");
const logger = require("../utils/logger");

let AWSconfig = {
  accessKeyId: config.amazon_polly_access_key_id,
  secretAccessKey: config.amazon_polly_secret,
  region: config.amazon_polly_region
};
AWS.config.update(AWSconfig);
const polly = new AWS.Polly();

module.exports = async ctx => {
  let text = removeTag(ctx.body);
  try {
    await downloadSpeechFromText(text);
    const urlForUploadData = await getUrlForUpload(ctx.peer_id);
    const uploadedData = await uploadToVkByUploadUrl(
      urlForUploadData.data.upload_url
    );
    const savedData = await saveAudioFileInVk(JSON.parse(uploadedData));
    const { owner_id, id } = savedData.data[0];
    let attachment = `doc${owner_id}_${id}`;
    ctx.reply("", { attachment });
  } catch (error) {
    logger.error(error);
  }
};

function downloadSpeechFromText(text) {
  return new Promise((resolve, reject) => {
    let params = {
      OutputFormat: "mp3",
      Text: text,
      TextType: "text",
      VoiceId: config.amazon_polly_name
    };
    polly.synthesizeSpeech(params, function(err, data) {
      if (err) {
        logger.error(err, err.stack);
        reject(err);
      } else {
        fs.writeFile(
          path.join(__dirname, "../media/", "tempSpeech.mp3"),
          data.AudioStream,
          function(err) {
            if (err) {
              logger.error(err);
              reject(err);
            }
            resolve();
          }
        );
      }
    });
  });
}

function getUrlForUpload(peer_id) {
  return new Promise((resolve, reject) => {
    vkbot.execute(
      "docs.getMessagesUploadServer",
      {
        type: "audio_message",
        access_token: config.access_token,
        peer_id
      },
      (response, err) => {
        if (err) {
          logger.error(err);
          reject(err);
        }
        resolve(response);
      }
    );
  });
}

function uploadToVkByUploadUrl(upload_url) {
  let options = {
    uri: upload_url,
    method: "POST",
    headers: {
      "Content-Type": "multipart/form-data"
    },
    formData: {
      file: [
        fs.createReadStream(path.join(__dirname, "../media/", "tempSpeech.mp3"))
      ]
    }
  };
  return new Promise((resolve, reject) => {
    request(options, (err, response, body) => {
      if (err) {
        logger.error(err);
        reject(err);
      } else {
        resolve(body);
      }
    });
  });
}

function saveAudioFileInVk(data) {
  return new Promise((resolve, reject) => {
    let params = {
      file: data.file,
      access_token: config.access_token,
      title: "vk-chat-bot-audio",
      tags: "audio"
    };
    vkbot.execute("docs.save", params, (response, err) => {
      if (err) {
        logger.error(err);
        reject(err);
      }
      resolve(response);
    });
  });
}
