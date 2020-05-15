'use strict';

const express = require('express');
const cors = require('cors');
const superagent = require('superagent');
const pg = require('pg');
require('dotenv').config();

//App setup (define global variables and configure the server)
const PORT = process.env.PORT;
const app = express();

//configs
app.use(cors()); //configures the app to talk to other local websites without blocking them
const client = new pg.Client(process.env.DATABASE_URL);
client.on('error', console.error);
client.connect();

function Location(obj, search_query) {
  //console.log(obj);
  this.search_query = search_query;
  this.formatted_query = obj.display_name;
  this.latitude = obj.lat;
  this.longitude = obj.lon;
};

function Weather(obj) {
  this.forecast = obj.weather.description;
  this.time = obj.datetime;
};

function Trails(obj) {
  this.name = obj.name;
  this.location = obj.location; 
  this.length = obj.length;
  this.stars = obj.stars;
  this.starVotes = obj.starVotes;
  this.url = obj.url;
  this.conditions = obj.conditionDetails;
  this.dateTime = obj.conditionDate;
};

function Movies(obj) {
  this.title = obj.title;
  this.overview = obj.overview;
  this.averageVotes = obj.vote_average;
  this.totalVotes = obj.vote_count;
  this.image = 'https://image.tmdb.org/t/p/w500' + obj.poster_path;
  this.popularity = obj.popularity;
  this.released_on = obj.release_date;
};

function Restaurant(obj) {
  this.name = obj.name,
  this.image_url = obj.image_url,
  this.price = obj.price,
  this.rating = obj.rating,
  this.url = obj.url
};

app.get('/', (req, res) => {
  res.redirect('https://codefellows.github.io/code-301-guide/curriculum/city-explorer-app/front-end/');
});

app.get('/location', getLocation);
app.get('/weather', getWeather);
app.get('/trails', getTrails);
app.get('/movies', getMovies);
app.get('/yelp', getRestaurants);



function getLocation(request, response) {
   const cityToBeSearched = request.query.city;
  const urlOfApi = 'https://us1.locationiq.com/v1/search.php';

  const queryParams = {
    q: cityToBeSearched,
    key: process.env.GEOCODE_API_KEY,
    format: 'json'
  };

  // if the data is in the database, use it instead
  const sqlQuery = 'SELECT * FROM city_info WHERE search_query=$1';
  const sqlValues = [cityToBeSearched];
  client.query(sqlQuery, sqlValues)
    .then(resultFromSql => {

      if(resultFromSql.rowCount > 0) {
        response.send(resultFromSql.rows[0]);
      } else {
        superagent.get(urlOfApi)
          .query(queryParams)
          .then(resultFromLocationIQ => {
            const newLocation = new Location(resultFromLocationIQ.body[0], cityToBeSearched);

            const sqlQuery = 'INSERT INTO city_info (search_query, formatted_query, latitude, longitude) VALUES ($1, $2, $3, $4)';

            const valueArray = [newLocation.search_query, newLocation.formatted_query, newLocation.latitude, newLocation.longitude];

            client.query(sqlQuery, valueArray);

    response.send(newLocation);
  });
  }
    });
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
    //console.log('hiking stats', hikingStats);
    let result = hikingStats.map(obj => {
     const hikingInfo = new Trails(obj);
     return hikingInfo;
    });
     //console.log(result);
     response.send(result);
   })
   .catch(error => {
     console.log(error);
     response.send(error).status(500);
   });
   };

function getMovies(req, resp) {
  const urlOfApi = 'https://api.themoviedb.org/3/search/movie';

  const movieParams = {
    api_key: process.env.MOVIE_API_KEY,
    query: req.query.search_query 
  };
  superagent.get(urlOfApi)
  .query(movieParams)
  .then(resultFromMovies => {
    //console.log('result from hiking', resultFromHiking);
   let movieStats = resultFromMovies.body.results;
   //console.log('hiking stats', hikingStats);
   let result = movieStats.map(obj => {
    const movieInfo = new Movies(obj);
    return movieInfo;
   });
    //console.log(result);
    resp.send(result);
  })
  .catch(error => {
    console.log(error);
    response.send(error).status(500);
  });
};

function getRestaurants(req, resp) {
  const urlOfApi = 'https://api.yelp.com/v3/businesses/search';
  const yelpQuery = req.query.search_query;

  const restaurantParams = {
    location: yelpQuery,
  }

  superagent.get(urlOfApi)
  .set('Authorization', `Bearer ${process.env.YELP_API_KEY}`)
  .query(restaurantParams)
  .then(resultFromRestaurants => {
    //console.log('result from hiking', resultFromHiking);
   let restaurantStats = resultFromRestaurants.body.businesses;
   console.log('restaurant stats', restaurantStats);
   let result = restaurantStats.map(obj => {
    const restaurantInfo = new Restaurant(obj);
    return restaurantInfo;
   });
    //console.log(result);
    resp.send(result);
  })
  .catch(error => {
    console.log(error);
    response.send(error).status(500);
  });
};


app.listen(PORT, console.log(`we are up on ${PORT}`));