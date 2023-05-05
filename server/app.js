const express = require('express')
const cors = require('cors');
const winkNLP = require( 'wink-nlp' );
const model = require( 'wink-eng-lite-web-model' );
const cities = require('cities.json');
const http = require('https');


/** Configuration Application **/
const app = express()
const port = 3000

app.use(cors());
app.use(express.json());
app.use(cors());
app.use(express.json());

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

/** Initialisation des variables **/
let citiesToFindMeteoList = []


/** Initialisation des données **/
const citieslist = cities.map(city => city.name.toLowerCase())


/** Configuration WinkNLP **/
const nlp = winkNLP(model);
const its = nlp.its;
const as = nlp.as;

const patterns = [
  { name: 'meteo', patterns: [ 'climat', 'temps', 'meteo', 'météo', 'méteo', 'metéo' ] },
  { name: 'city', patterns: citieslist },
];
nlp.learnCustomEntities(patterns);


/** Controller **/
app.post('', async (req, res) => {
  let message = req.body.message
  
  await response(message).then(result => res.send(result))
})


/** Service **/
const citiesToFindMeteo = (doc) => {
  citiesToFindMeteoList = [];
  doc.customEntities().each((e) => {
    if (e.out(its.type) === 'city') citiesToFindMeteoList.push(e.out(its.value))
  })
  return citiesToFindMeteoList
}

const apiMeteo = async (city) => {
  let coord = coordinates(city);
  let meteoApiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${coord.lat}&longitude=${coord.lng}&hourly=temperature_2m,weathercode`
  return await meteo(meteoApiUrl).then((result) => {
    console.log('meteo api');
    return result
  });
}

const response = (message) => {
  return new Promise(async (resolve) => {
    let doc = nlp.readDoc(message)
    let resp = 'Désolé, je ne comprends pas';
    console.log(doc.customEntities());
    if (doc.customEntities().length() === 0) {
      resolve(resp)
    } else {
      citiesToFindMeteoList = [];
      // On sort les villes 
      doc.customEntities()
        .filter((e) => e.out(its.type) === 'city')
        .each((e) => citiesToFindMeteoList.push(e.out(its.value)))
      // On regarde si l'utilisateur cherche la méteo
      if (doc.customEntities().filter((e) => e.out(its.type) === 'meteo').length() > 0) {
        if (citiesToFindMeteoList.length > 0) {
          let city = citiesToFindMeteoList[0]
          await apiMeteo(city).then(result => resolve(result))
        } else {
          resolve('Vous voulez la météo de quelle ville ?')
        }
      } else {
        if (citiesToFindMeteoList.length == 1) {
          if (citiesToFindMeteoList[0].toLowerCase() === 'marseille') resolve('Cette ville est pourrie jusqu\'à l\'os')
          else resolve('Oui, c\'est une belle ville')
        } else {
          if (citiesToFindMeteoList.find(city => city.toLowerCase() === 'marseille') === undefined) resolve('Oui, ce sont des belles villes')
          else resolve('Oui, ce sont des belles villes (sauf Marseille)')
        }
      }
    }
  })
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

// test()










// if (doc.customEntities().out(its.detail))
// console.log(doc.customEntities().out(its.detail));
// console.log(doc.entities().out());




// doc.customEntities().filter((e) => e.out(its.type) === 'city')









/**
 * WinkNPL
 */
// const text = 'Hello   World🌎! How are you?';
// const doc = nlp.readDoc( text );

// // console.log(doc.out());
// // // -> Hello   World🌎! How are you?

// // console.log(doc.tokens().out(its.type));
// // // -> [ 'word', 'word', 'word', 'emoji', 'punctuation', 'word', 'word', 'word', 'punctuation' ]

// // console.log(doc.tokens().out(as.freqTables));
// // // -> [ 'Hello', 'Hello', 'World', '🌎', '!', 'How', 'are', 'you', '?' ]

// // console.log( doc.sentences().out() );
// // // -> [ 'Hello   World🌎!', 'How are you?' ]

// // console.log( doc.entities().out( its.detail ) );
// // // -> [ { value: '🌎', type: 'EMOJI' } ]

// // console.log( doc.tokens().out() );
// // // -> [ 'Hello', 'World', '🌎', '!', 'How', 'are', 'you', '?' ]

// console.log(doc.tokens());

// const text = `On July 20, 1969, a voice crackled from the speakers. He said simply, "the Eagle has landed." They spent nearly 21 hours on the lunar surface. 20% of the world\'s population watched humans walk on Moon.`;

// const doc = nlp.readDoc(text);

// console.log(doc.entities().out())
// console.log(doc.entities().out(its.type))
// doc.entities()
//         .each((e) => {
//           if (e.out(its.type) === 'DATE')
//             console.log(e.out());
//         } );



// let lyon = cities.find(c => c.name.toLowerCase() === 'lyon')
// if (lyon) console.log(lyon.lat)

// let lat;
// let lgn;


        
// let url = `https://api.open-meteo.com/v1/forecast?latitude=45.75&longitude=4.85&hourly=temperature_2m}`