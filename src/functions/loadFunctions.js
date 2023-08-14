const discord = require('./discord');
const checkFolder = require('./check');
const loadRoutes = require('./loadRoutes');
const checkForUpdates = require('./updater');
const config = require('./config');
const checkSetup = require('./checkSetup')

module.exports = { discord, checkFolder, loadRoutes, checkForUpdates, config, checkSetup };