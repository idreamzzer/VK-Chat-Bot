const request = require("request");
const vkbot = require("../vkbot");
const config = require("../config.json");
const logger = require("../utils/logger");

module.exports = async ctx => {
  const userId = ctx.from ? ctx.from : ctx.peer_id;
  const userInfo = await getUserInfoById(userId);
  const coords = await getCoordsByCityTitle(userInfo.city.title);
  const weather = await getWeatherByCoords(coords);
  const temp = Math.ceil(weather.main.temp - 273.15);
  const msg = `В ${userInfo.city.title} сейчас ${temp}°`;
  ctx.reply(msg);
};

function getUserInfoById(user_id) {
  return new Promise((resolve, reject) => {
    vkbot.execute(
      "users.get",
      {
        user_ids: user_id,
        fields: "city"
      },
      (response, err) => {
        if (err) {
          logger.error(err);
          reject(err);
        }
        resolve(response.data[0]);
      }
    );
  });
}

function getCoordsByCityTitle(cityTitle) {
  return new Promise((resolve, reject) => {
    let options = {
      url: "http://www.mapquestapi.com/geocoding/v1/address",
      qs: {
        location: cityTitle,
        key: config.mapquest_key
      },
      json: true
    };
    request.get(options, (err, response, body) => {
      if (err) {
        logger.error(err);
        reject(err);
      } else {
        resolve(body.results[0].locations[0].latLng);
      }
    });
  });
}

function getWeatherByCoords(coords) {
  return new Promise((resolve, reject) => {
    let options = {
      url: "http://api.openweathermap.org/data/2.5/weather",
      qs: {
        lat: coords.lat,
        lon: coords.lng,
        appid: config.openweathermap_key
      },
      json: true
    };
    request.get(options, (err, response, body) => {
      if (err) {
        logger.error(err);
        reject(err);
      } else {
        resolve(body);
      }
    });
  });
}
