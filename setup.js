const fs = require('fs')
const prompt = require('prompt-sync')({sigint: true});

const mainConfig = './src/data/config.json'
const discordConfig = './src/data/discordconfig.json'

function TrueFalse(name){
    if (name == "Y"){
        return true
    } 
    else if (name == "N") {
        return false
    }
    else {
        throw new Error("Wrong parameter given!");
    }
}

function isNumber(name){
    if (isNaN(name)){
        throw new Error(name + " is not a number!");
    }
}

console.clear()
console.log('[INFO] Set up Main Config file!')

const maindomain = prompt('What your main domain name? ')
const uploadkeylength = prompt('How long you want your upload keys? ')
isNumber(uploadkeylength)
const serverport = prompt("What port you want your server to be hosted? ")
isNumber(serverport)
const uploadNotify = prompt("You want uploads to be logged in console? ")
const webhookNotify = prompt("You want uploads to be logged in Discord webhooks? ")

let uploadNotifyPrompt = null
let webhookNotifyPrompt = null
let webhookURL = null

uploadNotifyPrompt = TrueFalse(uploadNotify);
webhookNotifyPrompt = TrueFalse(webhookNotify);

if (webhookNotifyPrompt == true){
    webhookURL = prompt("Enter the webhook URL: ")
}
else {
    webhookURL = ""
}

const mainConfigElements = {
    maindomain: maindomain,
    uploadkeylength: parseInt(uploadkeylength),
    nodeserverport: parseInt(serverport),
    upload_notify: uploadNotifyPrompt,
    webhook_notify: webhookNotifyPrompt,
    webhook_url: webhookURL
}

fs.writeFile(mainConfig, JSON.stringify(mainConfigElements, null, 4),
    (error) => {
        if (error) throw error;
    }
)

console.clear()
console.log('[SUCCESS] Main Config Finished!')
console.log("[INFO] Setting up Discord Login!")
console.log("Get your app data from: \n https://discord.com/developers/applications")

const clientid = prompt("Enter your client ID: ")
isNumber(clientid)
const clientsecret = prompt("Enter your client secret: ")
const callbackurl = `http://${maindomain}/login/callback`

const discordConfigElements = {
    clientID: clientid,
    clientSecret: clientsecret,
    callbackURL: callbackurl
}

fs.writeFile(discordConfig, JSON.stringify(discordConfigElements, null, 4),
    (error) => {
        if (error) throw error;
    }
)

console.clear()
console.log('[SUCCESS] Configs finished! Happy hosting!:)')
console.log('Check your finished config!\n')
console.log('Main config:\n' + JSON.stringify(mainConfigElements, null, 4))
console.log('Discord config:\n' + JSON.stringify(discordConfigElements, null, 4))