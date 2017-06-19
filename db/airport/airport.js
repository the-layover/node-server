const db = require('../config.js');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const airportSchema = new Schema({
  airportCode: { type: String, unique: true },
  airportCity: String,
  airportName: String,
  lastUpdated: { type: Date, default: Date.now }
});

const Airports = mongoose.model('Airports', airportSchema);

module.exports = Airports;
