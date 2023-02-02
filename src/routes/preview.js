const fs = require('fs')
const mainDomain = require('../setup.js')('maindomain');
const filesizejs = require('filesize')
const express=require('express')
const router=express.Router()
router.get("/:file",(req,res)=>{
    var file = req.params["file"]
    fs.readdirSync('./src/uploads/raw/i/').forEach( function (item, index) {
        if (file == item.replace("." + item.split(".")[1], "")) {
            var filePath = './src/uploads/raw/i/' + item
            var fileUrl = "http://"+mainDomain+"/uploads/raw/i/" + item
            var fileSize = filesizejs(fs.statSync(filePath).size, {base: 10})
            var extension = item.split(".")[1]
            var uploads = JSON.parse(fs.readFileSync("./src/data/uploads.json"))
            var user = uploads[item]["user"]
            var oEmbed = uploads[item]["oembed"]
            var embedTitle = uploads[item]["embed"]["title"].replace("{filename}", file).replace("{filesize}", fileSize).replace("{username}", user)
            var embedDescription = uploads[item]["embed"]["description"].replace("{filename}", file).replace("{filesize}", fileSize).replace("{username}", user)
            var embedColour = uploads[item]["embed"]["colour"]

            if (extension == "webm" || extension == "mp4" || extension == "mov") {
                res.render('video', 
                {
                    item:item,
                    file:file,
                    fileSize:fileSize,
                    oEmbed:oEmbed,
                    fileUrl:fileUrl,
                    embedTitle:embedTitle,
                    embedDescription:embedDescription,
                    embedColour:embedColour,
                    filePath:filePath,
                    user:user
                })
            } else {
                res.render('photo',
                {
                    item:item,
                    file:file,
                    fileSize:fileSize,
                    oEmbed:oEmbed,
                    fileUrl:fileUrl,
                    embedTitle:embedTitle,
                    embedDescription:embedDescription,
                    embedColour:embedColour, 
                    filePath:filePath,
                    user:user
                })                        
            }
        }
    })
})
module.exports=router;