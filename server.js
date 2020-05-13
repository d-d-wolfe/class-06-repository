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
  this.name = obj.name
  this.location = obj.location 
  this.length = obj.length
  this.stars = obj.stars
  this.starVotes = obj.starVotes
  this.url = obj.url
  this.conditions = obj.conditionDetails
  this.dateTime = obj.conditionDate
};

app.get('/location', getLocation);
app.get('/weather', getWeather);
app.get('/trails', getTrails);

function getLocation(request, response) {
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
    response.send(newLocation);
  })
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

 function getTrails(request, response) {
   const trailsResult = request.query.trails;
   const urlOfApi = 'https://www.hikingproject.com/data/get-trails';

   const trailsParams = {
    lat: request.query.latitude,
    lon: request.query.longitude,
    key: process.env.TRAILS_API_KEY,
    format: 'json'
  };

    const trailsInfo = [];

    superagent.get(urlOfApi)
   .query(trailsParams)
   .then(resultFromHiking => {
     //console.log('result from hiking', resultFromHiking);
    let hikingStats = resultFromHiking.body.trails;
    console.log('hiking stats', hikingStats);
    let result = hikingStats.map(obj => {
     const hikingInfo = new Trails(obj);
     console.log('hiking info',  hikingInfo);
     return hikingInfo;
    });
     console.log(result);
     response.send(result);
   })
   .catch(error => {
     console.log(error);
     response.send(error).status(500);
   });
   };





app.listen(PORT, console.log(`we are up on ${PORT}`));