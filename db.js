var mongojs = require('mongojs');
var db = mongojs('mongodb://localhost:27017/codlicious', ['documento', 'utente']);

module.exports = db;
