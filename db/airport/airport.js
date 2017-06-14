const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const airportSchema = new Schema({
  airportCode: { type: String, unique: true },
  airportcity: { type: mongoose.Schema.Types.ObjectId, ref: 'City' },
  airportName: String
});

const Airports = mongoose.model('Airports', airportSchema);

module.exports = Airports;
