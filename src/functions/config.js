const fs = require('fs')
const config = JSON.parse(fs.readFileSync("src/data/config.json"));
module.exports = (configKey) => config[configKey]