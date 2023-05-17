const { Router } = require('express');

const app = Router();
const response = require('../services/meteo-service.js')


/** Main Route **/
app.post('', async (req, res) => {
  let message = req.body.message
  
  await response(message).then(result => res.send(new Object({ response: result })))
})

module.exports = app