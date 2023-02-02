const fs = require("fs")
const express=require('express')
const router=express.Router()
router.get("/", (req, res) => {
    var domains = JSON.parse(fs.readFileSync("./src/data/domains.json")).join(' | ')
    res.render('domains', {domains:domains})
})
module.exports=router;