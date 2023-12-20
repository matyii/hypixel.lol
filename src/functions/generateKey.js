const fs = require('fs');
const randomstring = require('randomstring');
const mainDomain = require('./config')('maindomain');
const uploadKeyLength = require('./config')('uploadkeylength');

function checkUploadkey(username, discordID) {
    try {
        let keys = JSON.parse(fs.readFileSync('./src/data/keys.json'));

        for (let uid in keys) {
            if (keys[uid].discord_id == discordID) {
                return [`${keys[uid].upload_key}`, `${uid}`];
            }
        }

        let code = username + '_' + randomstring.generate(uploadKeyLength);
        let uid = 1;
        while (keys.hasOwnProperty(uid)) {
            uid++;
        }

        keys[uid] = {
            discord_id: discordID,
            upload_key: code,
            domains: {
                domain: mainDomain,
                subdomain: '',
            },
            embed: {
                embedAuthor: username,
                embedTitle: '',
                embedDescription: '',
                embedColor: '#3b00a8',
            },
        };

        fs.writeFileSync('./src/data/keys.json', JSON.stringify(keys, null, 2), 'utf8');
        return [code, `${uid}`];
    } catch (error) {
        console.error('Error occurred:', error);
        return null;
    }
}

module.exports = checkUploadkey;
