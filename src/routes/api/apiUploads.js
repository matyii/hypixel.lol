const fs = require('fs')
const express=require('express')
const router=express.Router()
const uploadKeyLength = require("../../functions/config")('uploadkeylength')
router.get("/:uploadkey",(req,res)=>{
    var user = req.params["uploadkey"].substring(0, req.params["uploadkey"].length - (uploadKeyLength + 1))
    var uploads = JSON.parse(fs.readFileSync("./src/data/uploads.json"))
    var uploads2 = []
    Object.keys(uploads).forEach(index => {
        if (uploads[index]["user"] == user) {
            uploads2.push(uploads[index]["url"])
        }
    })
    res.json(uploads2)
})
module.exports=router;