'use strict';

const superagent = require('superagent');

function Restaurant(obj) {
  this.name = obj.name,
  this.image_url = obj.image_url,
  this.price = obj.price,
  this.rating = obj.rating,
  this.url = obj.url
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
    
   let restaurantStats = resultFromRestaurants.body.businesses;
   
   let result = restaurantStats.map(obj => {
    const restaurantInfo = new Restaurant(obj);
    return restaurantInfo;
   });
    resp.send(result);
  })
  .catch(error => {
    resp.send(error).status(500);
  });
};




module.exports = getRestaurants;