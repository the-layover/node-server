const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const airlineSchema = new Schema({
  airlineCode = { type: String, unique: true }
  airlineName = String
});

const Airlines = mongoose.model('Airlines', airlineSchema);

module.exports = Airlines;
