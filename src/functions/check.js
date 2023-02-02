const fs = require('fs')

function checkFolder(folders){
    for (let i = 0; i < folders.length; i++) {
        const folder = folders[i];
        if (!fs.existsSync(folder)){
            fs.mkdirSync(folder, { recursive: true });
            console.log(`[CHECK] Folder named "${folder}" not existing, creating one!`);
        } else {
            console.log(`[CHECK] Folder named "${folder}" already existing, skipping!`);
        }
    }
}

module.exports = checkFolder;