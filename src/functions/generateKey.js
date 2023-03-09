const fs = require('fs')
const randomstring = require("randomstring")
const mainDomain = require("./config")('maindomain')
const uploadKeyLength = require("./config")('uploadkeylength')
function checkUploadkey(username, discordID) {
    var keys = JSON.parse(fs.readFileSync("./src/data/keys.json"))
        for (var uid in keys) {
            if (keys[uid].discord_id == discordID) {
            return [`${keys[uid].upload_key}`, `${uid}`];
            }
        }
        var code = username + "_" + randomstring.generate(uploadKeyLength)
        var uid = 1;
        while (keys.hasOwnProperty(uid)) {
            uid++;
        }
        keys[uid] = {
            "discord_id": discordID,
            "upload_key": code,
            "domain": mainDomain,
            "subdomain": "",
            "embedAuthor": username,
            "embedTitle": "",
            "embedDescription": "",
            "embedColor": "#3b00a8"
        };
        fs.writeFileSync('./src/data/keys.json', JSON.stringify(keys, null, 2), err => {
            if (err) throw err
        })
}
module.exports = checkUploadkey;