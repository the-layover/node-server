'use strict'

const express = require('express');
const app = express();

app.get('/', function(req, res){
  res.send('Hello World');
});

const port = process.env.PORT || 1337;
app.listen(port, function() {
  console.log('Listening on port', port);
});
