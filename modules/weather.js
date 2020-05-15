'use strict';

const superagent = require('superagent');

function Weather(obj) {
  this.forecast = obj.weather.description;
  this.time = obj.datetime;
};

function getWeather(request, response) {
  const weatherResult = request.query.weather;
   const urlOfApi = 'https://api.weatherbit.io/v2.0/forecast/daily';
 
   const weatherParams = {
     lat: request.query.latitude,
     lon: request.query.longitude,
     key: process.env.WEATHER_API_KEY,
     format: 'json'
   };
  superagent.get(urlOfApi)
   .query(weatherParams)
   .then(resultFromWeatherBit => {
    let forecastStats = resultFromWeatherBit.body.data;
    let result = forecastStats.map(obj => {
     const weatherInfo = new Weather(obj);
      return weatherInfo;
    })
    response.send(result);
   });
 };

module.exports = getWeather;