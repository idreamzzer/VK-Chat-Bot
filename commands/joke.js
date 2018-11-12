const _ = require("underscore");
const rp = require("request-promise");

module.exports = async ctx => {
  const response = await rp({
    uri: `http://umorili.herokuapp.com/api/random?`,
    method: "GET",
    qs: {
      num: 100
    },
    headers: {
      "Content-Type": "application/json"
    }
  });
  const jokes = JSON.parse(response);
  const joke = getRandomJoke(jokes);

  // Формируем текст для отправки
  let text = _.unescape(joke.elementPureHtml).replace(/(<([^>]+)>)/gi, "");
  ctx.reply(text);

  function getRandomJoke(jokes) {
    jokes = jokes.filter(el => {
      return el.site !== "xkcdb.com";
    });
    return jokes[Math.floor(Math.random() * jokes.length)];
  }
};
