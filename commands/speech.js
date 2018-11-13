const request = require("request");
const config = require("../config.json");
const tempFileHandler = require("../helpers/tempFileHandler");
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
const tempFileName = "tempSpeech.mp3";

module.exports = async ctx => {
  let text = removeTag(ctx.body);
  try {
    // Download speech data
    const speechData = await downloadSpeechFromText(text);
    // Save speech data in temp file
    await tempFileHandler.create(tempFileName, speechData.AudioStream);
    // Get url for upload in vk servers
    const urlForUploadData = await getUrlForUpload(ctx.peer_id);
    // Create stream for temp file
    const fileStream = tempFileHandler.createReadStream(tempFileName);
    // Upload file to vk by url
    const uploadedData = await uploadToVkByUploadUrl(
      urlForUploadData.data.upload_url,
      fileStream
    );
    // Delete temp file
    await tempFileHandler.delete(tempFileName);
    // Save uploaded in vk server file in docs
    const savedData = await saveAudioFileInVk(JSON.parse(uploadedData));
    const { owner_id, id } = savedData.data[0];
    let attachment = `doc${owner_id}_${id}`;
    // Reply with saved doc file
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
        logger.debug("Downloaded speech");
        resolve(data);
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
      logger.debug("Saved file in vk docs");
      resolve(response);
    });
  });
}
