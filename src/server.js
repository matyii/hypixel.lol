const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const serveIndex = require('serve-index')
const fs = require('fs')
app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.json())
var appDir = __dirname.toString().replace("src", "")
var config = require('./functions/config')

var folders = ['./src/uploads','./src/uploads/raw','./src/uploads/raw/i']
const checkFolder = require('./functions/check.js');
checkFolder(folders)

const auth = require("./functions/discord")
auth(app)

const routes = JSON.parse(fs.readFileSync('./src/data/routes.json'))
routes.forEach(route => {
    console.log(`[SUCCESS] "${route.endpoint}" has been succesfully loaded from "${route.location}"`)
    app.use(route.endpoint, require(route.location))
})

app.listen(config("nodeserverport"), () => {
  console.log(`[SUCCESS] Successfully started on port ${config('nodeserverport')}!`)
})

app.use(express.static(appDir + "/views/"))
app.use('/assets/', serveIndex(appDir + '/assets/'))