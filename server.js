'use strict';

const express = require('express');
const cors = require('cors');
const superagent = require('superagent');
require('dotenv').config();

//App setup (define global variables and configure the server)
const PORT = process.env.PORT;
const app = express();

//configs
app.use(cors()); //configures the app to talk to other local websites without blocking them

function Location(obj) {
  console.log(obj);
  this.search_query = obj.display_name;
  this.formatted_query = obj.display_name;
  this.latitude = obj.lat;
  this.longitude = obj.lon;
};

function Weather(obj) {
  this.forecast = obj.weather.description;
  this.time = obj.datetime;
};

function Trails(obj) {
  this.name = 
  this.lat =
  this.lon =
  this.maxDistance = 
  this.minStars = 
}

app.get('/location', getLocation);
//, (req, resp) =>{
  //const dataFromLocation = require('./data/location.json');
  //let currentLocation = new Location(dataFromLocation[0]);
  //console.log(dataFromLocation[0]);
  //resp.send(currentLocation);
//});

app.get('/weather', getWeather);
//   const weatherInfo = require('./data/weather.json');
//   const theForcast = [];
//   let forcastStats = weatherInfo.data;
//   forcastStats.map(obj => {
//     let weatherResult = new Weather(obj);
//     theForcast.push(weatherResult);
//   });
//   resp.send(theForcast);
// });

function getLocation(request, response) {
 // console.log(request, response);
  const cityToBeSearched = request.query.city;
  const urlOfApi = 'https://us1.locationiq.com/v1/search.php';

  const queryParams = {
    q: cityToBeSearched,
    key: process.env.GEOCODE_API_KEY,
    format: 'json'
  };

  superagent.get(urlOfApi)
  .query(queryParams)
  .then(resultFromLocationIQ => {
    const newLocation = new Location(resultFromLocationIQ.body[0]);
    //console.log(newLocation);
    response.send(newLocation);

  })
}

function getWeather(request, response) {
  // console.log(request, response);
   const weatherResult = request.query.weather;
   const urlOfApi = 'https://api.weatherbit.io/v2.0/forecast/daily';
 
   const weatherParams = {
     lat: request.query.latitude,
     lon: request.query.longitude,
     key: process.env.WEATHER_API_KEY,
     format: 'json'
   };

   const forecast = [];
 
   superagent.get(urlOfApi)
   .query(weatherParams)
   .then(resultFromWeatherBit => {
    let forecastStats = resultFromWeatherBit.body.data;
    let result = forecastStats.map(obj => {
     const weatherInfo = new Weather(obj);
     //forecast.push(weatherInfo);
     return weatherInfo;
    })
     //console.log(result);
     response.send(result);
 
   });
 };







app.listen(PORT, console.log(`we are up on ${PORT}`));