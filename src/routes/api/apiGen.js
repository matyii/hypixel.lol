const fs = require('fs')
const randomstring = require("randomstring")
const express=require('express')
const router=express.Router()
router.post("/",(req,res)=>{
    var test2 = JSON.parse(fs.readFileSync("./src/data/keys.json"))
        var code = req.body.name + "_" + randomstring.generate(12)
        test2.push(code)
        fs.writeFileSync('./src/data/keys.json', JSON.stringify(test2), err => {
            if (err) throw err
        })
        if (!req.body.name) {
            res.redirect('/key')
        }
        else {
            res.render('key', {code:code})
        }
})
module.exports=router;