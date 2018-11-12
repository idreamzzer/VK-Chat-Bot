const request = require("request");
const config = require("../config.json");

module.exports = async ctx => {
  const news = await getNews();
  const msg = formatNews(news);
  ctx.reply(msg);
};

function formatNews(news) {
  let messageNews = `Последние новости:
  `;
  news.articles.forEach((newsElement, i) => {
    let count = i + 1;
    let title = newsElement.title;
    let url = newsElement.url;
    messageNews += `${count}. ${title}. (${url})
    `;
  });
  return messageNews;
}

function getNews() {
  return new Promise((resolve, reject) => {
    let options = {
      uri: "https://newsapi.org/v2/top-headlines",
      qs: {
        sources: "lenta",
        apiKey: config.newsapi_key
      },
      json: true
    };
    request.get(options, (err, response, body) => {
      if (err) {
        reject(err);
      } else {
        resolve(body);
      }
    });
  });
}
