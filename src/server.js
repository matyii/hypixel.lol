const express = require('express')
const bodyParser = require('body-parser')
const serveIndex = require('serve-index')
const randomstring = require("randomstring")
const randomColor = require('randomcolor')
const formidable = require('formidable')
const filesizejs = require('filesize')
const fs = require('fs')
const { readFile } = require('fs/promises')
const path = require('path')
const cors = require('cors')
const app = express()
const getSomeCoolEmojis = require("get-some-cool-emojis")
const { json } = require('body-parser')
app.set('view engine', 'ejs')

var folders = ['./src/uploads','./src/uploads/raw','./src/uploads/raw/i','./src/uploads/raw/json']
const checkFolder = require('./check.js');
checkFolder(folders)

var appDir = path.dirname(require.main.filename).toString().replace("src", "")
var allowedExtensions = ["png", "jpg", "jpeg", "gif", "webm", "mp4", "mov"]

var config = JSON.parse(fs.readFileSync(__dirname + "/data/config.json"))
var uploadKeyLength = config["uploadkeylength"]
var mainDomain = config["maindomain"]

var upload_notify = config["upload_notify"]
var webhook_notify = config["webhook_notify"]
var webhookURL = config["webhook_url"]
var webhook_config = __dirname + "/data/webhook.json"

app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.json()) 

async function sendEmbed(webhookURL, jsonPath, username, filename, url, upload_key) {
    const jsonData = JSON.parse(await readFile(jsonPath));
    const body = JSON.stringify({
        embeds: [{
            title: jsonData.title,
            description: jsonData.description,
            color: jsonData.color,
            thumbnail: {
                url: jsonData.thumb_url,
            },
            fields: [
                {
                    name: "User",
                    value: username,
                    inline: true
                },
                {
                    name: "Filename (Hash)",
                    value: filename,
                    inline: true
                },
                {
                    name: "URL",
                    value: `[Click](http://${url})`,
                    inline: false
                },
                {
                    name: "User's upload key",
                    value: `[${upload_key}](http://${mainDomain}/api/uploads/${upload_key})`,
                    inline: false
                },
            ],
            author: {
                name: "hypixel.lol | Uploads",
                icon_url: "https://raw.githubusercontent.com/matyii/hypixel.lol/main/icons/upload.png"
            }
        }] 
    });
    const options = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: body
    };
    try {
        const response = await fetch(webhookURL, options);
        if (!response.ok) {
            console.log(await response.json())
        }
    } catch(error) {
        console.log(error);
    }
}

app.get("/", (req,res) => {
    res.render('index')
})

app.get("/config", (req, res) => {
    res.render('config', {mainDomain:mainDomain})
})

app.post('/gen', (req,res) => {
    var test2 = JSON.parse(fs.readFileSync(__dirname + "/data/keys.json"))
        var code = req.body.name + "_" + randomstring.generate(12)
        test2.push(code)
        //res.send(test2)
        fs.writeFileSync(__dirname + '/data/keys.json', JSON.stringify(test2), err => {
            if (err) throw err
        })
        if (!req.body.name) {
            res.redirect('/key')
        }
        else {
            res.render('key', {code:code})
        }
})

app.get('/gen', (req,res) => {
    res.redirect('/key')
})

app.get('/key', (req,res) =>{
    res.render('generate')
})

app.get("/uploads/:file", (req, res) => {
    var file = req.params["file"]
    fs.readdirSync(__dirname + '/uploads/raw/i/').forEach( function (item, index) {
        if (file == item.replace("." + item.split(".")[1], "")) {
            var filePath = '/uploads/raw/i/' + item
            var fileUrl = "http://"+mainDomain+"/uploads/raw/i/" + item
            var fileSize = filesizejs(fs.statSync(__dirname + "/" + filePath).size, {base: 10})
            var extension = item.split(".")[1]
            var uploads = JSON.parse(fs.readFileSync(__dirname + "/data/uploads.json"))
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

app.get("/uploads/raw/i/:file", (req, res) => {
    var file = req.params["file"]
    
    fs.readdirSync(__dirname + '/uploads/raw/i/').forEach( function (item, index) {
        if (file == item) {
            var filePath = __dirname + '/uploads/raw/i/' + item
            res.sendFile(filePath)
        }
    })
})

app.post("/upload", (req, res) => {
    var domains = JSON.parse(fs.readFileSync(__dirname + "/data/domains.json"))
    var form = new formidable.IncomingForm()
    form.parse(req, function (err, fields, files) {
        var uploadKeys = JSON.parse(fs.readFileSync(__dirname + "/data/keys.json"))
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
                fs.rename(files.file.path, __dirname + '/uploads/raw/i/' + hash + "." + extension, function (err) {
                    if (err) throw err

                    fs.writeFileSync(__dirname + "/uploads/raw/json/" + hash + "-embed.json", `{"version":"1.0","type":"link","author_name":"${embedAuthor}"}`)

                    fs.readFile(__dirname + '/data/uploads.json', function (error, data) {
                        if (error) throw error
                        var uploads = JSON.parse(data)
                
                        uploads[`${hash}.${extension}`] = {}
                        uploads[`${hash}.${extension}`]["user"] = user
                        uploads[`${hash}.${extension}`]["url"] = `http://${mainDomain}/uploads/${hash}`
                        uploads[`${hash}.${extension}`]["oembed"] = `http://${mainDomain}/raw/${hash}-embed.json`
                        uploads[`${hash}.${extension}`]["embed"] = {}
                        uploads[`${hash}.${extension}`]["embed"]["title"] = embedTitle
                        uploads[`${hash}.${extension}`]["embed"]["description"] = embedDescription
                        uploads[`${hash}.${extension}`]["embed"]["colour"] = embedColour
        
                        fs.writeFile(__dirname + '/data/uploads.json', JSON.stringify(uploads, null, 4), error2 => {if (error2) throw error2})
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

app.get("/api", (request, response) => {
    response.render("api")
})

app.get("/domains", (request, response) => {
    var domains = JSON.parse(fs.readFileSync(__dirname + "/data/domains.json")).join(' | ')
    response.render('domains', {domains:domains})
})

app.get("/api/domains", (request, response) => {
    var domains = JSON.parse(fs.readFileSync(__dirname + "/data/domains.json"))
    response.json(domains)
})


app.get("/api/uploads/:uploadkey", (request, response) => {
    var user = request.params["uploadkey"].substring(0, request.params["uploadkey"].length - (uploadKeyLength + 1))
    var uploads = JSON.parse(fs.readFileSync(__dirname + "/data/uploads.json"))
    var uploads2 = []
    Object.keys(uploads).forEach(index => {
        if (uploads[index]["user"] == user) {
            uploads2.push(uploads[index]["url"])
        }
    })
    response.json(uploads2)
})

app.listen(config["nodeserverport"], () => {
    console.log(`[SUCCESS] Successfully started on port ${config['nodeserverport']}!`)
})

app.use(express.static(appDir + "/views/"))
app.use('assets/', serveIndex(appDir + '/assets/'))