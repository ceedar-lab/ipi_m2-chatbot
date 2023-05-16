const winkNLP = require( 'wink-nlp' );
const model = require( 'wink-eng-lite-web-model' );
const http = require('https');

const moment = require('moment');

const cities = require('cities.json');
const patterns = require('../models/nlp-patterns.js')
const weatherCodes = require('../models/weather-codes.js')
const dateReferences = require('../models/date-references.js')


/** Global Methods **/
Object.defineProperty(String.prototype, 'capitalize', {
  value: function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
  },
  enumerable: false
});

Object.defineProperty(String.prototype, 'toLocalDate', {
  value: function() {
    try {
      return moment(`${this}:00.000Z`).utc().format('DD-MM-YYYY à HH:mm')
    } catch {
      return this
    }
  },
  enumerable: false
});


/** WinkNLP Configuration **/
const nlp = winkNLP(model);
const its = nlp.its;
const as = nlp.as;

nlp.learnCustomEntities(patterns);


/** Call API **/
const apiMeteo = async (city) => {
  let coord = coordinates(city);
  let meteoApiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${coord.lat}&longitude=${coord.lng}&hourly=temperature_2m,weathercode`
  return await meteo(meteoApiUrl).then((result) => result);
}


/** Process Message from Client **/
const response = (message) => {
  return new Promise(async (resolve) => {
    let doc = nlp.readDoc(message)
    let resp = 'Désolé, je ne comprends pas';

    // Chatbot can't understand user message
    if (doc.customEntities().length() === 0) {
      resolve(resp)
    } else {
      const citiesToFindMeteoList = [];
      const dateToFindMeteoList = [];
      const hourToFindMeteoList = []

      // Cities extraction
      doc.customEntities()
        .filter((e) => e.out(its.type) === 'city')
        .each((e) => citiesToFindMeteoList.push(e.out(its.value)))
        
      // Dates extraction
      doc.customEntities()
        .filter((e) => e.out(its.type) === 'date')
        .each((e) => dateToFindMeteoList.push(e.out(its.value)))

      // Hours extraction
      doc.entities()
        .filter((e) => e.out(its.type) === 'TIME')
        .each((e) => hourToFindMeteoList.push(e.out(its.value)))

      // User is looking for meteo 
      if (doc.customEntities().filter((e) => e.out(its.type) === 'meteo').length() > 0) {
        if (citiesToFindMeteoList.length > 0) {
          const city = citiesToFindMeteoList[0]
          const date = dateToFindMeteoList.length > 0 ? dateToFindMeteoList[0] : dateReferences.TODAY;
          const hour = hourToFindMeteoList.length > 0 ? localHour(hourToFindMeteoList[0]) : `${new Date().getHours()}:00`
          await apiMeteo(city).then(result => {
            const meteoDate = meteoOf(date, hour)
            resolve(`Méteo de ${city.capitalize()} le ${meteoDate.toLocalDate()} : ${temperatureAndWeatherCondition(meteoDate, JSON.parse(result))}`)
          })
        } else {
          resolve('Vous voulez la météo de quelle ville ?')
        }

      // User just types a city name
      } else {
        if (citiesToFindMeteoList.length == 1) {
          if (citiesToFindMeteoList[0].toLowerCase() === 'marseille') resolve('Cette ville est pourrie jusqu\'à l\'os')
          else resolve('C\'est une belle ville')
        } else {
          if (citiesToFindMeteoList.find(city => city.toLowerCase() === 'marseille') === undefined) resolve('Ce sont des belles villes')
          else resolve('Ce sont des belles villes (sauf Marseille)')
        }
      }
    }
  })
}


/** Utils **/
const localHour = (hour) => {
  return moment(hour, "h A").format("HH:mm")
}

const meteoOf = (date, hour) => {
  let dateOffset;
  if (date == dateReferences.TODAY) dateOffset = 0
  else if (date == dateReferences.TOMORROW) dateOffset = 1
  else if (date == dateReferences.AFTER_TOMORROW) dateOffset = 2
  const dateString = moment(new Date()).add(dateOffset, 'd').format('YYYY-MM-DD');
  return `${dateString}T${hour}`;
}

const temperatureAndWeatherCondition = (date, result) => {
  const index = result.hourly.time.indexOf(date)
  const temperature = result.hourly.temperature_2m[index]
  const weather = weatherCodes[result.hourly.weathercode[index]]
  return `Température : ${temperature}°C / Conditions méteo : ${weather}`
}

const coordinates = (city) => {
  let cityFound = cities.filter(c => c.name.toLowerCase() === city.toLowerCase())[0]
  console.log(cityFound);
  return new Object({ lat: cityFound.lat, lng: cityFound.lng })
}

const meteo = (meteoApiUrl) => {
  return new Promise(resolve => {    
    http.get(meteoApiUrl, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      })
      res.on('end', () => {
        resolve(data)
      })
    }).on("error", (err) => {
      resolve("Error: " + err.message)                      
    })
  })
}

module.exports = response