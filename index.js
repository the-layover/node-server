'use strict'

require('dotenv').config();
const express = require('express');
const app = express();
const jwt = require('express-jwt');
const jwks = require('jwks-rsa');
const cors = require('cors');
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

const authCheck = jwt({
  secret: jwks.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    // YOUR-AUTH0-DOMAIN name e.g prosper.auth0.com
    jwksUri: 'https://{YOUR-AUTH0-DOMAIN}/.well-known/jwks.json'
  }),
  audience: '{YOUR-API-AUDIENCE-ATTRIBUTE}',
  issuer: '{YOUR-AUTH0-DOMAIN}',
  algorithms: ['RS256']
});

app.get('/', function(req, res){
  res.json('Hello World');
});

const port = process.env.PORT || 1337;
app.listen(port, function() {
  console.log('Listening on port', port);
});
