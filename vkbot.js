const VkBot = require("node-vk-bot-api");
const logger = require("./utils/logger");
const config = require("./config.json");

module.exports = (() => {
  const bot = new VkBot(config.access_token);

  bot.startListen = () => {
    bot.command("!помощь", require("./commands/help"));
    bot.command("!слоган", require("./commands/slogan"));
    bot.command("!привет", require("./commands/welcome"));
    bot.command("!шутка", require("./commands/joke"));
    bot.command("!кот", require("./commands/cat"));
    bot.command("!курс", require("./commands/rates"));
    bot.command("!погода", require("./commands/weather"));
    bot.command("!шар", require("./commands/ball"));
    bot.command("!смех", require("./commands/laugh"));
    bot.command("!новости", require("./commands/news"));
    bot.hears("!поиск", require("./commands/search"));
    bot.hears("!перевод", require("./commands/translate"));
    bot.hears("!скажи", require("./commands/speech"));
    bot.command("!статус", require("./commands/status"));
    bot.command("!инфа", require("./commands/infometr"));
    bot.command("!нг", require("./commands/newyear"));

    try {
      bot.listen();
    } catch (error) {
      logger.error(error);
    }
  };

  return bot;
})();
