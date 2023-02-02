const fs = require('fs')
const express=require('express')
const router=express.Router()
router.get("/:file",(req,res)=>{
    var file = req.params["file"]
    fs.readdirSync("./src/uploads/raw/i/").forEach( function (item, index) {
        if (file == item) {
            var filePath = './src/uploads/raw/i/' + item
            res.sendFile(filePath, { root: "./" })
        }
    })
})
module.exports=router;