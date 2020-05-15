'use strict';

const superagent = require('superagent');

function Movies(obj) {
  this.title = obj.title;
  this.overview = obj.overview;
  this.averageVotes = obj.vote_average;
  this.totalVotes = obj.vote_count;
  this.image = 'https://image.tmdb.org/t/p/w500' + obj.poster_path;
  this.popularity = obj.popularity;
  this.released_on = obj.release_date;
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
    let movieStats = resultFromMovies.body.results;
    let result = movieStats.map(obj => {
    const movieInfo = new Movies(obj);
    return movieInfo;
   });
    resp.send(result);
  })
  .catch(error => {
    resp.send(error).status(500);
  });
};

module.exports = getMovies;