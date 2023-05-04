const express = require('express')
const app = express()
const port = 3000

const winkNLP = require( 'wink-nlp' );
const model = require( 'wink-eng-lite-web-model' );

const cities = require('cities.json');
const citieslist = cities.map(city => city.name.toLowerCase())

// [
//   {
//     "country": "FR",
//     "name": "Lyon",
//     "lat": "45.75",
//     "lng": "4.583333"
//   },
//   ...
// ]

/**
 * APPLICATION
 */

app.get('', (req, res) => {
  let question = req.query.question
  res.send('Hello d!' + question)
})

app.get('/api', (req, res) => {
  res.send('api')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

/**
 * WinkNPL
 */

const nlp = winkNLP(model);

// Obtain "its" helper to extract item properties.
const its = nlp.its;
// Obtain "as" reducer helper to reduce a collection.
const as = nlp.as;

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

const text = 'meteo paris lens';
const patterns = [
  { name: 'meteo', patterns: [ 'climat', 'temps', 'meteo' ] },
  { name: 'city', patterns: citieslist },
];
nlp.learnCustomEntities(patterns);
const doc = nlp.readDoc(text);

// if (doc.customEntities().out(its.detail))
// console.log(doc.customEntities().out(its.detail));
// console.log(doc.entities().out());

const citiesToFindMeteo = () => {
  let list = [];
  doc.customEntities().each((e) => {
    if (e.out(its.type) === 'city') list.push(e.out(its.value))
  })
  return list
}


// doc.customEntities().filter((e) => e.out(its.type) === 'city')

doc.customEntities().each((e) => {
  if (e.out(its.type) === 'meteo') {
    if (citiesToFindMeteo().length > 0) console.log('dzfdf')
  }
});

// let lyon = cities.find(c => c.name.toLowerCase() === 'lyon')
// if (lyon) console.log(lyon.lat)

// let lat;
// let lgn;


        
// let url = `https://api.open-meteo.com/v1/forecast?latitude=45.75&longitude=4.85&hourly=temperature_2m}`