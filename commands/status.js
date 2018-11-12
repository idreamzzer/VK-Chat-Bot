const pusage = require("pidusage-fork");
const moment = require("moment");

module.exports = ctx => {
  pusage.stat(process.pid, function(err, stat) {
    let cpu = parseInt(stat.cpu, 10);
    let mem = parseInt(stat.memory / 1000000, 10);
    const seconds = process.uptime();
    const uptime = moment.utc(seconds * 1000).format("HH:mm:ss");

    let messageStatus = `Статус бота:
    `;
    messageStatus += `Время работы: ${uptime}
    `;
    messageStatus += `Загрузка ЦП: ${cpu}%
    `;
    messageStatus += `Загрузка памяти: ${mem}MB
    `;

    ctx.reply(messageStatus);
  });
};
