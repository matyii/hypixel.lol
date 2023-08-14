const { yellow, green } = require('colorette')
function checkSetup(){
    const config = require('../data/config.json')
    if (config.setup_done) {
        console.log(`${green("[SUCCESS]")} Setup already done!`)
    } else {
        console.log(`${yellow("[WARNING]")} Server isn't set up yet! Open "localhost" in your browser!`)
    }
}

module.exports = checkSetup;