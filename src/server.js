const express = require('express')
const bodyParser = require('body-parser')
const serveIndex = require('serve-index')
const path = require('path')
const app = express()
app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.json())
var appDir = path.dirname(require.main.filename).toString().replace("src", "")
var config = require('./setup')

var folders = ['./src/uploads','./src/uploads/raw','./src/uploads/raw/i','./src/uploads/raw/json']
const checkFolder = require('./functions/check.js');
checkFolder(folders)

const homeRoute = require("./routes/home")
const configRoute = require("./routes/config")
const genRedirectRoute = require("./routes/genRedirect")
const keyRoute = require("./routes/key")
const domainsRoute = require("./routes/domains")
const rawRoute = require("./routes/rawfile")
const previewRoute = require("./routes/preview")

app.use("/", homeRoute)
app.use("/config", configRoute)
app.use("/gen", genRedirectRoute)
app.use("/key", keyRoute)
app.use("/domains", domainsRoute)
app.use("/uploads/raw/i", rawRoute)
app.use("/uploads", previewRoute)

const apiRoute = require("./routes/api/api")
const apiDomainsRoute = require("./routes/api/apiDomains")
const apiGenerate = require("./routes/api/apiGen")
const apiUploads = require("./routes/api/apiUploads")
const apiUpload = require("./routes/api/apiUpload")

app.use("/api", apiRoute)
app.use("/api/domains", apiDomainsRoute)
app.use("/api/gen", apiGenerate)
app.use("/api/uploads", apiUploads)
app.use("/api/upload", apiUpload)

app.listen(config("nodeserverport"), () => {
    console.log(`[SUCCESS] Successfully started on port ${config('nodeserverport')}!`)
})

app.use(express.static(appDir + "/views/"))
app.use('assets/', serveIndex(appDir + '/assets/'))