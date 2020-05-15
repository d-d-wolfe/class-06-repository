'use strict';
const pg = require('pg');
const superagent = require('superagent');

const client = new pg.Client(process.env.DATABASE_URL);
client.on('error', console.error);
client.connect();

function Location(obj, search_query) {
  this.search_query = search_query;
  this.formatted_query = obj.display_name;
  this.latitude = obj.lat;
  this.longitude = obj.lon;
};


// Location.Query = function (cityToBeSearched) {
//   this.q = cityToBeSearched;
//   this.key = process.env.GEOCODE_API_KEY;
//   this.format = 'json';
// };

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
 // .then(resultFromLocationIQ => getLocationApi(resultFromLocationIQ, cityToBeSearched, response))
 // .catch(error => {
 //   response.send(error).status(500);
 //     });
   };
 });
};

// function getLocationApi (resultFromLocationIQ, cityToBeSearched, response){
//   const resultLocation = new Location(resultFromLocationIQ.body[0], cityToBeSearched);
//   const sqlQuery = 'INSERT INTO city_info (search_query, formatted_query, latitude, longitude) VALUES ($1, $2, $3, $4)';
//   const sqlValues = [newLocation.search_query, newLocation.formatted_query, newLocation.latitude, newLocation.longitude];
//   client.query(sqlQuery, sqlValues)
//   response.send(resultLocation);
// };





module.exports = getLocation;