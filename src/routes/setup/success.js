const express = require('express');
const router = express.Router();
const setupConfig = require('../../data/config.json');

router.get("/", (req, res) => {
    if (setupConfig.setup_done) {
        res.redirect('/');
    } else {
        res.render('successSetup'); }
});
module.exports = router;
