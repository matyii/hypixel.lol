const express = require('express');
const bodyParser = require('body-parser');
const serveIndex = require('serve-index');
const { green } = require('colorette')
const loadFunctions = require("./functions/loadFunctions")
const folders = require('./data/folders.json');
const routes = require('./data/routes.json');

const app = express();
const appDir = __dirname.replace("src", "");
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());

loadFunctions.checkFolder(folders);
loadFunctions.discord(app);
loadFunctions.loadRoutes(app,routes);

app.listen(loadFunctions.config("nodeserverport"), () => {
  console.log(`${green("[SUCCESS]")} Server successfully started on port ${loadFunctions.config("nodeserverport")}!`);
});

app.use(express.static(appDir + "/views/"));
app.use('/assets/', serveIndex(appDir + '/assets/'));