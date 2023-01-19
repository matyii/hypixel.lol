const express = require('express')
const bodyParser = require('body-parser')
const serveIndex = require('serve-index')
const randomstring = require("randomstring")
const randomColor = require('randomcolor')
const formidable = require('formidable')
const filesizejs = require('filesize')
const fs = require('fs')
const path = require('path')
const app = express()
const getSomeCoolEmojis = require("get-some-cool-emojis")
app.set('view engine', 'ejs');

// Folder checking
var folders = ['./src/raw','./src/raw/i','./src/raw/json']

if (!fs.existsSync(folders[0])){
    fs.mkdirSync(folders[0], { recursive: true });
    console.log('[CHECK] Raw files folder not existing, creating one!')
}

else {
    console.log('[CHECK] Raw files folder already existing, skipping!')
}

if (!fs.existsSync(folders[1])){
    fs.mkdirSync(folders[1], { recursive: true });
    console.log('[CHECK] Image folder not existing, creating one!')
}

else {
    console.log('[CHECK] Image folder already existing, skipping!')
}

if (!fs.existsSync(folders[2])){
    fs.mkdirSync(folders[2], { recursive: true });
    console.log('[CHECK] Image JSON folder not existing, creating one!')
}

else {
    console.log('[CHECK] Image JSON folder already existing, skipping!')
}


var appDir = path.dirname(require.main.filename).toString().replace("src", "")
var allowedExtensions = ["png", "jpg", "jpeg", "gif", "webm", "mp4", "mov"]

var config = JSON.parse(fs.readFileSync(__dirname + "/data/config.json"))
var uploadKeyLength = config["uploadkeylength"]
var mainDomain = config["maindomain"]
var upload_notify = config["upload_notify"]
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

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

app.get("/:file", (req, res) => {
    var file = req.params["file"]
    
    fs.readdirSync(__dirname + '/raw/i/').forEach( function (item, index) {
        if (file == item.replace("." + item.split(".")[1], "")) {
            var filePath = 'raw/i/' + item
            var fileUrl = "http://"+mainDomain+"/raw/i/" + item
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

app.get("/raw/i/:file", (req, res) => {
    var file = req.params["file"]
    
    fs.readdirSync(__dirname + '/raw/i/').forEach( function (item, index) {
        if (file == item) {
            var filePath = __dirname + '/raw/i/' + item
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

        if (uploadKeys.includes(uploadKey)) {
            if (allowedExtensions.includes(extension)) {
                fs.rename(files.file.path, __dirname + '/raw/i/' + hash + "." + extension, function (err) {
                    if (err) throw err

                    fs.writeFileSync(__dirname + "/raw/json/" + hash + "-embed.json", `{"version":"1.0","type":"link","author_name":"${embedAuthor}"}`)

                    fs.readFile(__dirname + '/data/uploads.json', function (error, data) {
                        if (error) throw error
                        var uploads = JSON.parse(data)
                
                        uploads[`${hash}.${extension}`] = {}
                        uploads[`${hash}.${extension}`]["user"] = user
                        uploads[`${hash}.${extension}`]["url"] = `http://${mainDomain}/${hash}`
                        uploads[`${hash}.${extension}`]["oembed"] = `http://${mainDomain}/raw/${hash}-embed.json`
                        uploads[`${hash}.${extension}`]["embed"] = {}
                        uploads[`${hash}.${extension}`]["embed"]["title"] = embedTitle
                        uploads[`${hash}.${extension}`]["embed"]["description"] = embedDescription
                        uploads[`${hash}.${extension}`]["embed"]["colour"] = embedColour
        
                        fs.writeFile(__dirname + '/data/uploads.json', JSON.stringify(uploads, null, 4), error2 => {if (error2) throw error2})
                    })

                    if (domains.includes(fields["domain"])) {
                        if (subdomain != "") {
                            res.write(`http://${subdomain}.${fields["domain"]}/${hash}`)
                        } else {
                            res.write(`http://${fields["domain"]}/${hash}`)
                        }
                    } else {
                        if (subdomain != "") {
                            res.write(`http://${subdomain}.${mainDomain}/${hash}`)
                        } else {
                            res.write(`http://${mainDomain}/${hash}`)
                        }
                    }
                    if (upload_notify == true){
                        console.log(`[INFO] New file has been uploaded by "${user}"! URL: ${mainDomain}/${hash}`)
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
    response.send('test')
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