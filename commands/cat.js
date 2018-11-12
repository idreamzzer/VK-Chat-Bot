const rp = require("request-promise");

module.exports = async ctx => {
  const response = await rp("http://aws.random.cat/meow");
  const catData = JSON.parse(response);
  ctx.reply(catData.file);
};
