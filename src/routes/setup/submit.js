const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { green } = require('colorette')

const mainConfigPath = path.join(__dirname, '../../data/config.json'); // Adjust the path here
const discordConfigPath = path.join(__dirname, '../../data/discordconfig.json'); // Adjust the path here

router.post("/", (req, res) => {
    const formData = req.body;

    // Read and update the main config file
    const mainConfigData = JSON.parse(fs.readFileSync(mainConfigPath, 'utf8'));
    mainConfigData.maindomain = formData.maindomain;
    mainConfigData.uploadkeylength = formData.uploadkeylength;
    mainConfigData.nodeserverport = formData.serverport;
    mainConfigData.upload_notify = formData.uploadNotify === 'on'; // Assuming checkbox value
    mainConfigData.setup_done = true
    // Update other properties as needed

    fs.writeFileSync(mainConfigPath, JSON.stringify(mainConfigData, null, 4));

    // Read and update the discord config file
    const discordConfigData = JSON.parse(fs.readFileSync(discordConfigPath, 'utf8'));
    fs.writeFileSync(discordConfigPath, JSON.stringify(discordConfigData, null, 4));
    console.log(`${green("[SUCCESS]")} Successfully set up!`)
    res.redirect('/setup/success'); // Redirect back to the setup page or wherever you want
});

module.exports = router;
