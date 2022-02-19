const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const fs = require('fs')
const { guid } = require('./utils')
const app = express()
app.use(cors({ credentials: true, origin: true }))
app.use(bodyParser.json())

const CODE_SUCCESS = 200

const FILEPATH = '../miniprogram/data/musics.js'

app.post('/update', function (req, res) {
  const { musics } = req.body
  console.log('==> [body.musics]', musics);
  const list = musics.map(item => ({uuid: guid(), ...item}))
  const data = `export const musics = ${JSON.stringify(list)}`
  fs.writeFileSync(FILEPATH, data)
  res.status(CODE_SUCCESS).send({ message: '更新成功' })
})

app.listen(3000, console.log('==> server listen:3000'))
