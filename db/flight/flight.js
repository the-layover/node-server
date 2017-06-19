const db = require('../config.js');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const flightSchema = new Schema({
  totalDuration: Number,
  flightRoute: [{
    duration: Number,
    flightCarrier: { type: mongoose.Schema.Types.ObjectId, ref: 'Arlines' },
    flightNumber: Number,
    id: String,
    arrivalTime: String,
    departureTime: String,
    origin: { type: mongoose.Schema.Types.ObjectId, ref: 'Airports' },
    destination: { type: mongoose.Schema.Types.ObjectId, ref: 'Airports' }
  }],
  connection: [{
    connectionDuration: Number,
    connectionDestination: { type: mongoose.Schema.Types.ObjectId, ref: 'Airports' }
  }],
  lastUpdated: { type: Date, default: Date.now }
});

const Flights = mongoose.model('Flights', flightSchema);

module.exports = Flights;
