const mongoose = require('mongoose');

const mongoURI = process.env.DB_URI;
//mongoose.connect for one database
//mongoose.createConnection for additional connections

mongoose.connect(mongoURI);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Mongodb connection open');
});

module.exports = db;
