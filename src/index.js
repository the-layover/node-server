'use strict'

require('dotenv').config();
const express = require('express');
const app = express();
const jwt = require('express-jwt');
const jwks = require('jwks-rsa');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');
const moment = require('moment');
const qs = require('querystring');
const helper = require('./lib/util.js');
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


app.get('/api/flight/search/origin/:ori/destination/:dest/date/:date', async function(req, res) {
  var origin = req.params.ori;
  var destination = req.params.dest;
  var date = req.params.date;
  var formatDate = helper.convertDatePicker(date);

  //QPX get flight data
  var qpxUrl = `https://www.googleapis.com/qpxExpress/v1/trips/search?key=${process.env.QPX_APIKEY}`;
  var qpxData = helper.prepQpxData(origin, destination, formatDate);
  var qpxHeaders = {"Content-Type": "application/json", "Cache-Control": "no-cache"};
  const qpxResponse = await axios.post(qpxUrl, qpxData, { headers: qpxHeaders }).then((response) => {return response.data}).catch((error) => error);
  console.log(qpxResponse);
  res.json(qpxResponse);
})

//QPX clean up acquired flight data
//if segment [array] has more than 1 || connectionDuration !== undefined, then it has a layover

app.get('/api/places/search/latitude/:lat/longitude/:lng', async function(req, res) {
  var latitude = req.params.lat;
  var longitude = req.params.lng;
  var keywords = req.query.keywords;
  var radius = 1000;
  var YYYYMMDD = (new Date()).toISOString().slice(0,10).replace(/-/g,"");

  //foursquare userless server integration api-endpoint
  var foursquareUrl = `https://api.foursquare.com/v2/venues/search?ll=${latitude},${longitude}&query=${keywords}&intent=browse&radius=${radius}&client_id=${process.env.FOURSQUARE_CLIENTID}&client_secret=${process.env.FOURSQUARE_CLIENTSECRET}&v=${YYYYMMDD}`;
  const foursquareResponse = await axios.get(foursquareUrl).then((response) => {return response.data});
  res.json(foursquareResponse);
});


//Auth required Requests
app.get('/api/test/helloworldsecured', authCheck, function (req, res) {
  res.json('Hello World! This should be secured.');
});

app.listen(port, function() {
  console.log('Listening on port', port);
});
