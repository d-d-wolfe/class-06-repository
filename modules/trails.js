'use strict';

const superagent = require('superagent');

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

function getTrails(request, response) {
  const trailsResult = request.query.trails;
  const urlOfApi = 'https://www.hikingproject.com/data/get-trails';

  const trailsParams = {
   lat: request.query.latitude,
   lon: request.query.longitude,
   key: process.env.TRAILS_API_KEY,
   format: 'json'
 };
   superagent.get(urlOfApi)
  .query(trailsParams)
  .then(resultFromHiking => {
   
   let hikingStats = resultFromHiking.body.trails;
   
   let result = hikingStats.map(obj => {
    const hikingInfo = new Trails(obj);
    return hikingInfo;
   });
   response.send(result);
  })
  .catch(error => {
   response.send(error).status(500);
  });
  };

module.exports = getTrails;