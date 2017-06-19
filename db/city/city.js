const db = require('../config.js');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const citySchema = new Schema({
  cityCode: { type: String, unique: true },
  cityName: String,
  lastUpdated: { type: Date, default: Date.now }
});

const Cities = mongoose.model('Cities', citySchema);

module.exports = Cities;
