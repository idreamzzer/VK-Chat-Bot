const moment = require("moment");
require("moment/locale/ru");
require("moment-countdown");

module.exports = ctx => {
  let getTime = `01/01/2019`;
  let nextYear = moment()
    .add(1, "years")
    .year();
  let leftTime = moment(new Date(getTime))
    .locale("ru")
    .countdown()
    .toString();
  ctx.reply(`До следущего НГ осталось: ${leftTime}`);
};
