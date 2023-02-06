const fs = require('fs')
const config = JSON.parse(fs.readFileSync("src/data/discordconfig.json"));
module.exports = (configKey) => config[configKey]