const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const serveIndex = require('serve-index')
app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.json())
var appDir = __dirname.toString().replace("src", "")
var config = require('./functions/config')

var folders = ['./src/uploads','./src/uploads/raw','./src/uploads/raw/i']
const checkFolder = require('./functions/check.js');
checkFolder(folders)

const homeRoute = require("./routes/home")
const domainsRoute = require("./routes/domains")
const rawRoute = require("./routes/rawfile")
const previewRoute = require("./routes/preview")

app.use("/", homeRoute)
app.use("/domains", domainsRoute)
app.use("/uploads/raw/i", rawRoute)
app.use("/uploads", previewRoute)

const apiRoute = require("./routes/api/api")
const apiDomainsRoute = require("./routes/api/apiDomains")
const apiUploads = require("./routes/api/apiUploads")
const apiUpload = require("./routes/api/apiUpload")

app.use("/api", apiRoute)
app.use("/api/domains", apiDomainsRoute)
app.use("/api/uploads", apiUploads)
app.use("/api/upload", apiUpload)

const auth = require("./functions/discord");
auth(app);

const userDashboard = require("./routes/user/dashboard")
const domainDashboard = require("./routes/user/domainDash")
app.use("/dashboard", userDashboard)
app.use("/dashboard/domain", domainDashboard)

app.listen(config("nodeserverport"), () => {
    console.log(`[SUCCESS] Successfully started on port ${config('nodeserverport')}!`)
})

app.use(express.static(appDir + "/views/"))
app.use('assets/', serveIndex(appDir + '/assets/'))