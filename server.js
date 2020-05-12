'use strict';

const express = require('express');
const cors = require('cors');
require('dotenv').config();

//App setup (define global variables and configure the server)
const PORT = process.env.PORT || 3000;
const app = express();

//configs
app.use(cors()); //configures the app to talk to other local websites without blocking them



app.get('/location', (req, resp) =>{
  const dataFromLocation = require('./data/location.json');
  let currentLocation = new Location(dataFromLocation[0]);
  //console.log(dataFromLocation[0]);
  resp.send(currentLocation);

});


function Location(obj) {
  this.search_query = obj.display_name;
  this.formatted_query = obj.display_name;
  this.latitude = obj.lat;
  this.longitude = obj.long;
};








app.listen(PORT, console.log(`we are up on ${PORT}`));