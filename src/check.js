const fs = require('fs')

function checkFolder(folders){
    if (!fs.existsSync(folders[0])){
        fs.mkdirSync(folders[0], { recursive: true });
        console.log('[CHECK] Uploads folder not existing, creating one!')
    }
    
    else {
        console.log('[CHECK] Uploads folder already existing, skipping!')
    }
    
    if (!fs.existsSync(folders[1])){
        fs.mkdirSync(folders[1], { recursive: true });
        console.log('[CHECK] Raw Image folder not existing, creating one!')
    }
    
    else {
        console.log('[CHECK] Raw Image folder already existing, skipping!')
    }
    
    if (!fs.existsSync(folders[2])){
        fs.mkdirSync(folders[2], { recursive: true });
        console.log('[CHECK] Image folder not existing, creating one!')
    }
    
    else {
        console.log('[CHECK] Image folder already existing, skipping!')
    }

    if (!fs.existsSync(folders[3])){
        fs.mkdirSync(folders[3], { recursive: true });
        console.log('[CHECK] Image JSON folder not existing, creating one!')
    }
    
    else {
        console.log('[CHECK] Image JSON folder already existing, skipping!')
    }
}

module.exports = checkFolder;