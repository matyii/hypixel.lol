const { readFile } = require('fs/promises')
const mainDomain = require('../setup.js')('maindomain');
async function sendEmbed(webhookURL, jsonPath, username, filename, url, upload_key) {
    const jsonData = JSON.parse(await readFile(jsonPath));
    const body = JSON.stringify({
        embeds: [{
            title: jsonData.title,
            description: jsonData.description,
            color: jsonData.color,
            thumbnail: {
                url: jsonData.thumb_url,
            },
            fields: [
                {
                    name: "User",
                    value: username,
                    inline: true
                },
                {
                    name: "Filename (Hash)",
                    value: filename,
                    inline: true
                },
                {
                    name: "URL",
                    value: `[Click](http://${url})`,
                    inline: false
                },
                {
                    name: "User's upload key",
                    value: `[${upload_key}](http://${mainDomain}/api/uploads/${upload_key})`,
                    inline: false
                },
            ],
            author: {
                name: "hypixel.lol | Uploads",
                icon_url: "https://raw.githubusercontent.com/matyii/hypixel.lol/main/icons/upload.png"
            }
        }] 
    });
    const options = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: body
    };
    try {
        const response = await fetch(webhookURL, options);
        if (!response.ok) {
            console.log(await response.json())
        }
    } catch(error) {
        console.log(error);
    }
}

module.exports = sendEmbed;