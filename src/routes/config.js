const mainDomain = require('../setup.js')('maindomain');
const express=require('express')
const router=express.Router()
router.get("/", (req, res) => {
    console.log(mainDomain)
    res.render('config', {mainDomain:mainDomain})
})
module.exports=router;