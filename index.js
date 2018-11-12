const VkBot = require("node-vk-bot-api");
const logger = require("./utils/logger");
const config = require("./config.json");
const initCommands = require("./initCommands");

const bot = new VkBot(config.access_token);
initCommands(bot);
try {
  bot.listen();
} catch (error) {
  logger.error(error);
}
