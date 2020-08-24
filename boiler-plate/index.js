const express = require('express')
const app = express()
const port = 3000

const config = require('./config/key')

const mongoose = require('mongoose')
mongoose.connect(config.mongoURI,{
    useNewUrlParser: true, useUnifiedTopology:true, useCreateIndex:true, useFindAndModify:false
}).then(()=> console.log('MongoDB Connected...'))
.catch(err => console.log(err))

app.get('/', (req, res) => {
  res.send('Hello World! ')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})