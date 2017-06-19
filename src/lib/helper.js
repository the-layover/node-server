const moment = require('moment');
const util = require('util');
const restclient = require('restler');

var fxml_url = 'http://flightxml.flightaware.com/json/FlightXML2/';

exports.prepQpxData = function(origin, destination, date) {
  let returnObj = {
    request: {
      passengers: {
        adultCount: 1
      },
      slice: [
        {
          origin: origin,
          destination: destination,
          date: date
        }
      ],
      solutions: 25
    }
  }
  return JSON.stringify(returnObj);
};

exports.convertDatePicker = function(date) {
  //Input: Mon Jun 12 2017 00:00:00 GMT+0800 (CST)
  //Output: YYYY-MM-DD
  date = String(date);
  var array = date.split(' ');
  var requestedDateFormat = `${array[3]}-${moment().month(array[1]).format('M')}-${array[2]}`;
  return requestedDateFormat;
}
