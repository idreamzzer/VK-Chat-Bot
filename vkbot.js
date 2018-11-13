const VkBot = require("node-vk-bot-api");
const logger = require("./utils/logger");
const config = require("./config.json");
const path = require("path");

const commandsDirectory = path.join(__dirname, "/commands");

const bot = new VkBot(config.access_token);

module.exports = (() => {
  bot.startListen = () => {
    // bot.command('!помощь', require('./commands/help')) // default
    // bot.hears('!помощь', require('./commands/help')) // default
    botCommand("!помощь", "help");
    botCommand("!слоган", "slogan");
    botCommand("!привет", "welcome");
    botCommand("!шутка", "joke");
    botCommand("!кот", "cat");
    botCommand("!курс", "rates");
    botCommand("!погода", "weather");
    botCommand("!шар", "ball");
    botCommand("!смех", "laugh");
    botCommand("!новости", "news");
    botHears("!поиск", "search");
    botHears("!перевод", "translate");
    botHears("!скажи", "speech");
    botCommand("!статус", "status");
    botCommand("!инфа", "infometr");
    botCommand("!нг", "newyear");

    try {
      bot.listen();
    } catch (error) {
      logger.error(error);
    }
  };

  return bot;
})();

function botCommand(command, moduleName) {
  bot.command(command, ctx => {
    logger.info(`Running ${command}`);
    require(path.join(commandsDirectory, moduleName))(ctx);
  });
}
function botHears(command, moduleName) {
  bot.hears(command, ctx => {
    logger.info(`Running ${command}`);
    require(path.join(commandsDirectory, moduleName))(ctx);
  });
}
