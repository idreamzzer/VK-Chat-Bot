const rp = require("request-promise");
const removeTag = require("../helpers/removeTag");
const config = require("../config.json");

module.exports = async ctx => {
  let text = removeTag(ctx.body);
  let encodedText = encodeURIComponent(text);
  const msg = `https://yandex.ru/search/?text=${encodedText}`;
  ctx.reply(msg);
};
