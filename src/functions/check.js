const fs = require('fs')
const { yellow } = require('colorette')

function checkFolder(folders){
    for (let i = 0; i < folders.length; i++) {
        const folder = folders[i];
        if (!fs.existsSync(folder)){
            fs.mkdirSync(folder, { recursive: true });
            console.log(`${yellow("[CHECK]")} Folder named "${folder}" not existing, creating one!`);
        } else {
            console.log(`${yellow("[CHECK]")} Folder named "${folder}" already existing, skipping!`);
        }
    }
}

module.exports = checkFolder;