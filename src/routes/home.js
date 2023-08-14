const express=require('express')
const router=express.Router()
const config = require('../data/config.json');
router.get("/", (req, res) => {
    if (config.setup_done) {
        res.render('index');
    } else {
        res.redirect('setup');
    }
});
module.exports=router;