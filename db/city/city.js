const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const citySchema = new Schema({
  cityCode = { type: String, unique: true }
  cityName = String
});

const Cities = mongoose.model('Cities', citySchema);

module.exports = Cities;
