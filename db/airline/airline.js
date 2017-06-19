const db = require('../config.js');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const airlineSchema = new Schema({
  airlineCode: {type: String, unique: true},
  airlineName: String,
  lastUpdated: { type: Date, default: Date.now }
});

const Airlines = mongoose.model('Airlines', airlineSchema);

module.exports = Airlines;
