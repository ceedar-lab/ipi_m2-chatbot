const express = require('express')
const cors = require('cors');

const mainController = require('./controllers/main-controller.js')

/** Configuration Application **/
const app = express()
const port = 3000

app.use(cors());
app.use(express.json());
app.use(cors());
app.use(express.json());

app.use(mainController);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})