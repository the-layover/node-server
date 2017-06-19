const db = require('../config.js');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  firstName: String,
  lastName: String,
  username: {type: String, unique: true},
  email: {type: String, unique: true},
  password: String,
  lastUpdated: { type: Date, default: Date.now }  
});

const Users = mongoose.model('Users', userSchema);

module.exports = Users;
