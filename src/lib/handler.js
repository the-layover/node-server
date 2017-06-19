const axios = require('axios');
const fs = require('fs');
const path = require('path');
var util = require('util');
var restclient = require('restler');

const helper = require('./helper.js');
const Airlines = require('../../db/airline/airline.js');
const Airports = require('../../db/airport/airport.js');
const Cities = require('../../db/city/city.js');
const Flights = require('../../db/flight/flight.js');


//*******************FLIGHTS********************//
exports.qpxFlightData = async function(req, res, next) {
  //QPX get flight data - THIS WORKS
  // let origin = req.params.ori;
  // let destination = req.params.dest;
  // let date = req.params.date;
  // let formatDate = helper.convertDatePicker(date);
  // let qpxUrl = `https://www.googleapis.com/qpxExpress/v1/trips/search?key=${process.env.QPX_APIKEY}`;
  // let qpxData = helper.prepQpxData(origin, destination, formatDate);
  // let qpxHeaders = {"Content-Type": "application/json", "Cache-Control": "no-cache"};
  // let qpxResponse = await axios.post(qpxUrl, qpxData, { headers: qpxHeaders }).then((response) => {return response.data}).catch((error) => error);

  //TEST QPX: use mockup data instead
    try {
      let qpxResponseTestPath = path.join(__dirname, '..', 'api', 'qpxUnformattedResponseExample.js');
      let qpxResponse = fs.readFileSync(qpxResponseTestPath, 'utf8');
      res.locals.flightData = qpxResponse;
    } catch(e) {
      console.log('Error: ', e.stack);
      res.json(e.stack);
    }
  next();
};

exports.qpxSaveData = async function(req, res, next) {
  //TODO: Persist the data into database
  const flightData = JSON.parse(res.locals.flightData); //NOTE: JSON.parse only necessary for mockup data - mockup data was transform read as string during fs
  const airportCol = flightData.trips.data.airport; //require for data persistence
  const airlineCol = flightData.trips.data.carrier; //require for data persistence
  const cityCol = flightData.trips.data.city; //require for data persistence
  const tripOptionsCol = flightData.trips.tripOption;

  tripOptionsCol.map((flightOption) => {

  })


  // cityCol.forEach((city) => {
  //   let query = { cityCode: city.code };
  //   Cities.findOneandUpdate(query, {
  //     cityCode: city.code,
  //     cityName: city.name
  //   }, {upsert:true}, (err, results) => {
  //     if(err) {
  //       console.log(err);
  //       res.status(500).send('Something went wrong while processing the city information from the QPX api.')
  //     } else {
  //       console.log(results);
  //     }
  //   })
  // })
  //
  // airportCol.forEach((airport) => {
  //   let query = { airportCode: airport.code };
  //   Airlines.findOneandUpdate(query, {
  //     airportCode: airport.code,
  //     airportCity: airport.city,
  //     airportName: airport.name }, {upsert:true}, (err, results) => {
  //       if(err) {
  //         console.log(err);
  //         res.status(500).send('Something went wrong while processing the airline information.')
  //       } else {
  //         console.log()
  //       }
  //     }
  //   )
  //
  // })
  res.json(res.locals.flightData);
}

exports.getFlightAwareData = function(req, res, next){
  let origin = req.params.ori || 'LAX';
  let destination = req.params.dest || 'PEN';
  // let date = req.params.date;
  // let formatDate = helper.convertDatePicker(date);

  let fxml_url = 'http://flightxml.flightaware.com/json/FlightXML2/';
  let username = PROCESS.ENV.FLIGHTAWARE_USERNAME;
  let apiKey = PROCESS.ENV.FLIGHTAWARE_APIKEY;

  restclient.get(fxml_url + 'Search', {
    username: username,
    password: apiKey,
    query: {origin: origin, destination: destination, howMany: 15, offset: 0}
  }).on('success', function(result, response) {
    console.log(result);
  });
}



//******************PLACES**********************//
exports.getFoursquarePlaces = async function(req, res, next) {
  let latitude = req.params.lat;
  let longitude = req.params.lng;
  let keywords = req.query.keywords; //it appears that keyword query from api searches a keyword from the name - not the category
  let radius = 1000;
  let YYYYMMDD = (new Date()).toISOString().slice(0,10).replace(/-/g,"");
  // let YYYYMMDD = helper.convertDatePicker(new Date());

  //foursquare userless server integration api-endpoint
  let foursquareUrl = `https://api.foursquare.com/v2/venues/search?ll=${latitude},${longitude}&query=${keywords}&intent=browse&radius=${radius}&client_id=${process.env.FOURSQUARE_CLIENTID}&client_secret=${process.env.FOURSQUARE_CLIENTSECRET}&v=${YYYYMMDD}`;
  console.log(foursquareUrl);

  const foursquareResponse = await axios.get(foursquareUrl).then(response => response.data);
  res.locals.foursquarePlaces = foursquareResponse.response.venues;
  next();
};

exports.persistFoursquarePlaces = async function(req, res, next) {
  console.log('persistFoursquarePlaces: ', res.locals.foursquarePlaces);
  //TODO: Save data in database
  //TODO: Look into caching the data in server somehow
  res.locals.dataResponse = res.locals.foursquarePlaces;
  next();
}

exports.sendDataToClient = function(req, res, next) {
  console.log('dataResponse: ', res.locals.dataResponse);
  res.json(res.locals.dataResponse);
}
