const mongojs = require('mongojs');
const db = mongojs('mongodb://localhost:27017/codlicious', ['documento', 'utente']);

module.exports = db;
