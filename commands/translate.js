const request = require("request");
const removeTag = require("../helpers/removeTag");
const config = require("../config.json");

module.exports = async ctx => {
  let text = removeTag(ctx.body);
  if (text.length) {
    let translatedText = await getTranslation(text);
    ctx.reply(translatedText);
  }
};

function getTranslation(text) {
  return new Promise((resolve, reject) => {
    let options = {
      uri: "https://translate.yandex.net/api/v1.5/tr.json/translate",
      qs: {
        key: config.yandex_translate_key,
        text: text,
        lang: "ru",
        format: "plain"
      },
      json: true
    };
    request.get(options, (err, response, body) => {
      if (err) {
        reject(err);
      } else {
        resolve(body.text[0]);
      }
    });
  });
}
