'use strict'

require('dotenv').config();
const express = require('express');
const app = express();
const jwt = require('express-jwt');
const jwks = require('jwks-rsa');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');
const qs = require('querystring');
const helper = require('./lib/helper.js');
const handler = require('./lib/handler.js');

//TODO: Could I use axios.all?

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

const port = process.env.PORT || 1337;
// const AUTH0_DOMAIN = process.env.YOUR_AUTH0_DOMAIN;
// const API_AUDIENCE_ATTRIBUTE = process.env.YOUR_API_AUDIENCE_ATTRIBUTE;
// const AUTH0_DOMAIN = process.env.YOUR_AUTH0_DOMAIN;

// const authCheck = jwt({
//   secret: jwks.expressJwtSecret({
//     cache: true,
//     rateLimit: true,
//     jwksRequestsPerMinute: 5,
//     // YOUR-AUTH0-DOMAIN name e.g prosper.auth0.com
//     jwksUri: `https://${AUTH0_DOMAIN}/.well-known/jwks.json`
//   }),
//   audience: `${API_AUDIENCE_ATTRIBUTE}`,
//   issuer: `${AUTH0_DOMAIN}`,
//   algorithms: ['RS256']
// });

var authCheck = jwt({
    secret: jwks.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: "https://iamjasonkuo.auth0.com/.well-known/jwks.json"
    }),
    audience: '',
    issuer: "https://iamjasonkuo.auth0.com/",
    algorithms: ['RS256']
});

// app.use(authCheck);

// app.get('/authorized', function (req, res) {
//   res.send('Secured Resource');
// });

app.get('/api/test/helloworld', function(req, res){
  res.json('Hello World');
});

//QPX isn't going to work - it doesn't provide the necessary information for enroute
// app.get('/api/flight/search/origin/:ori/destination/:dest/date/:date', handler.qpxFlightData, handler.qpxSaveData);

app.get('/api/flight/search/origin/:ori/destination/:dest/date/:date', handler.qpxFlightData, handler.qpxSaveData);

//QPX clean up acquired flight data
//if segment [array] has more than 1 || connectionDuration !== undefined, then it has a layover

app.get('/api/places/search/latitude/:lat/longitude/:lng', handler.getFoursquarePlaces, handler.persistFoursquarePlaces, handler.sendDataToClient);


//Auth required Requests
app.get('/api/test/helloworldsecured', authCheck, function (req, res) {
  res.json('Hello World! This should be secured.');
});

app.listen(port, function() {
  console.log('Listening on port', port);
});
