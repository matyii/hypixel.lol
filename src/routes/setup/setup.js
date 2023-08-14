const express = require('express');
const router = express.Router();
const setupConfig = require('../../data/config.json');

router.get("/", (req, res) => {
    if (setupConfig.setup_done) {
        res.redirect('/');
    } else {
        res.render('setup', { message: "It looks like you didn't set up the server yet, do you want to start the setup?" });
    }
});

module.exports = router;