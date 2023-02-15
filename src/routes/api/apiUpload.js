const fs = require('fs')
const formidable = require('formidable')
const mainDomain = require("../../functions/config")('maindomain')
const uploadKeyLength = require("../../functions/config")('uploadkeylength')
const upload_notify = require("../../functions/config")('upload_notify')
const webhook_notify = require("../../functions/config")('webhook_notify')
const webhookURL = require("../../functions/config")('webhook_url')
var webhook_config = "./src/data/webhook.json"
const randomColor = require('randomcolor')
const getSomeCoolEmojis = require("get-some-cool-emojis")
const randomstring = require("randomstring")
const path = require('path')
var allowedExtensions = ["png", "jpg", "jpeg", "gif", "webm", "mp4", "mov"]
const sendEmbed = require('../../functions/sendEmbed')
const express=require('express')
const router=express.Router()

router.post("/",(req,res)=>{
    var domains = JSON.parse(fs.readFileSync("./src/data/domains.json"))
    var form = new formidable.IncomingForm()
    form.parse(req, function (err, fields, files) {
        var uploadKeys = JSON.parse(fs.readFileSync("./src/data/keys.json"))
        var uploadKey = fields["upload-key"]
        var user = uploadKey.substring(0, uploadKey.length - (uploadKeyLength + 1))

        var hash = randomstring.generate(8)
        var extension = path.extname(files.file.name).replace(".", "")
        var url = `${mainDomain}/uploads/${hash}`
        
        if (Object.values(uploadKeys).some(x => x.upload_key === uploadKey)) {
            if (allowedExtensions.includes(extension)) {
                fs.rename(files.file.path,'./src/uploads/raw/i/' + hash + "." + extension, function (err) {
                    if (err) throw err

                    fs.readFile('./src/data/uploads.json', function (error, data) {
                        if (error) throw error
                        var uploads = JSON.parse(data)
                
                        uploads[`${hash}.${extension}`] = {}
                        uploads[`${hash}.${extension}`]["user"] = user
                        uploads[`${hash}.${extension}`]["url"] = `http://${mainDomain}/uploads/${hash}`
        
                        fs.writeFile('./src/data/uploads.json', JSON.stringify(uploads, null, 4), error2 => {if (error2) throw error2})
                    })
                    
                    res.write(`http://${mainDomain}/uploads/${hash}`)

                    if (upload_notify == true){
                        console.log(`[INFO] New file has been uploaded by "${user}"! URL: ${url}`)
                    }

                    if (webhook_notify == true){
                        sendEmbed(webhookURL, webhook_config, user, `${hash}.${extension}`, url, uploadKey);
                    }
                    res.end()
                  })
            } else {
                res.write("Can't upload that file.")
                res.end()
            }
        } else {
            res.write("Invalid upload key.")
            res.end()
        }
    })
})
module.exports=router;