const express=require('express')
const router=express.Router()
const config = require('../data/config.json');
router.get("/", (req, res) => {
    res.render('index')
});
module.exports=router;