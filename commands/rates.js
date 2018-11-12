const request = require("request");

module.exports = ctx => {
  Promise.all([getBitcoinRate(), getRates(), getEthereumRate()]).then(
    values => {
      let messageRates = `Курсы валют:
    `;
      let bitcoin = values[0];
      let ethereum = values[2];
      let eur = values[1].EUR;
      let usd = values[1].USD;
      messageRates += `Bitcoin: ${bitcoin}
    `;
      messageRates += `Ethereum: ${ethereum}
    `;
      messageRates += `EUR: ${eur}
    `;
      messageRates += `USD: ${usd}
    `;
      ctx.reply(messageRates);
    }
  );
};

function getBitcoinRate() {
  return new Promise((resolve, reject) => {
    let options = {
      uri: "https://api.coindesk.com/v1/bpi/currentprice.json",
      json: true
    };
    request.get(options, (err, response, body) => {
      if (err) {
        reject(err);
      } else {
        let rate = body.bpi.USD.rate;
        rate = rate.slice(0, -5);
        rate += "$";
        resolve(rate);
      }
    });
  });
}

function getEthereumRate() {
  return new Promise((resolve, reject) => {
    let options = {
      uri: "https://min-api.cryptocompare.com/data/price",
      qs: {
        fsym: "ETH",
        tsyms: "USD"
      },
      json: true
    };
    request.get(options, (err, response, body) => {
      if (err) {
        reject(err);
      } else {
        let rate = parseInt(body.USD, 10);
        rate += "$";
        resolve(rate);
      }
    });
  });
}

function getRates() {
  return new Promise((resolve, reject) => {
    let options = {
      uri: "https://www.cbr-xml-daily.ru/daily_json.js",
      json: true
    };

    request.get(options, (err, response, body) => {
      if (err) {
        reject(err);
      } else {
        let EUR = body.Valute.EUR.Value.toString().slice(0, -2);
        let USD = body.Valute.USD.Value.toString().slice(0, -2);
        resolve({ EUR: EUR, USD: USD });
      }
    });
  });
}
