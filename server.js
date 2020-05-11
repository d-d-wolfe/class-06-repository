'use strict';

const express = require('express');
const cors = require('cors');
require('dotenv').config();

//App setup (define global variables and configure the server)
const PORT = process.env.PORT || 3000;
const app = express();

//configs
app.use(cors()); //configures the app to talk to other local websites without blocking them












app.listen(PORT, console.log(`we are up on ${PORT}`));