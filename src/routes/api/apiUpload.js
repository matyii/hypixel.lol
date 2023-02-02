const fs = require('fs')
const formidable = require('formidable')
const mainDomain = require("../../setup")('maindomain')
const uploadKeyLength = require("../../setup")('uploadkeylength')
const upload_notify = require("../../setup")('upload_notify')
const webhook_notify = require("../../setup")('webhook_notify')
const webhookURL = require("../../setup")('webhook_url')
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
        var embedAuthor = fields["embed-author"]
        var embedTitle = fields["embed-title"]
        var embedDescription = fields["embed-description"]
        var embedColour = fields["embed-colour"]
        var randomColour = randomColor()
        var subdomain = fields["subdomain"]

        if (embedColour.toLowerCase() == "random") {embedColour = randomColour}
        if (embedTitle == null || embedTitle == "") {embedTitle = " "}
        if (embedDescription == null || embedDescription == "") {embedDescription = " "}
        if (embedColour == null || embedColour == "") {embedColour = "#ff0000"}
        if (subdomain == undefined) {subdomain = ""}

        embedAuthor = embedAuthor.replace("{randomemoji}", getSomeCoolEmojis(1))

        var hash = randomstring.generate(8)
        var extension = path.extname(files.file.name).replace(".", "")
        var url = `${mainDomain}/uploads/${hash}`

        if (uploadKeys.includes(uploadKey)) {
            if (allowedExtensions.includes(extension)) {
                fs.rename(files.file.path,'./src/uploads/raw/i/' + hash + "." + extension, function (err) {
                    if (err) throw err

                    fs.writeFileSync("./src/uploads/raw/json/" + hash + "-embed.json", `{"version":"1.0","type":"link","author_name":"${embedAuthor}"}`)

                    fs.readFile('./src/data/uploads.json', function (error, data) {
                        if (error) throw error
                        var uploads = JSON.parse(data)
                
                        uploads[`${hash}.${extension}`] = {}
                        uploads[`${hash}.${extension}`]["user"] = user
                        uploads[`${hash}.${extension}`]["url"] = `http://${mainDomain}/uploads/${hash}`
                        uploads[`${hash}.${extension}`]["oembed"] = `http://${mainDomain}/uploads/${hash}-embed.json`
                        uploads[`${hash}.${extension}`]["embed"] = {}
                        uploads[`${hash}.${extension}`]["embed"]["title"] = embedTitle
                        uploads[`${hash}.${extension}`]["embed"]["description"] = embedDescription
                        uploads[`${hash}.${extension}`]["embed"]["colour"] = embedColour
        
                        fs.writeFile('./src/data/uploads.json', JSON.stringify(uploads, null, 4), error2 => {if (error2) throw error2})
                    })

                    if (domains.includes(fields["domain"])) {
                        if (subdomain != "") {
                            res.write(`http://${subdomain}.${fields["domain"]}/uploads/${hash}`)
                        } else {
                            res.write(`http://${fields["domain"]}/uploads/${hash}`)
                        }
                    } else {
                        if (subdomain != "") {
                            res.write(`http://${subdomain}.${mainDomain}/uploads/${hash}`)
                        } else {
                            res.write(`http://${mainDomain}/uploads/${hash}`)
                        }
                    }

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