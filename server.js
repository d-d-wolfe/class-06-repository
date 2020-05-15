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

// redirects the app to run the front end
app.get('/', (req, res) => {
  res.redirect('https://codefellows.github.io/code-301-guide/curriculum/city-explorer-app/front-end/');
});

// handlers
const getLocation = require('./modules/location.js');
const getWeather = require('./modules/weather.js');
const getTrails = require('./modules/trails.js');
const getMovies = require('./modules/movies.js');
const getRestaurants = require('./modules/restaurants.js');

// routes
app.get('/location', getLocation);
app.get('/weather', getWeather);
app.get('/trails', getTrails);
app.get('/movies', getMovies);
app.get('/yelp', getRestaurants);

app.listen(PORT, console.log(`we are up on ${PORT}`));