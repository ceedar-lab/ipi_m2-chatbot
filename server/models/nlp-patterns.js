const cities = require('cities.json');

const citieslist = cities.map(city => city.name.toLowerCase())

const nlpPatterns = [
  { name: 'meteo', patterns: [ 'climat', 'temps', 'meteo', 'météo', 'méteo', 'metéo' ] },
  { name: 'date', patterns: [ 'aujourd\'hui', 'demain', 'après demain' ] },
  { name: 'city', patterns: citieslist },
];

module.exports = nlpPatterns