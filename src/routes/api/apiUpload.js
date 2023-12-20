const fs = require('fs')
const formidable = require('formidable')
const mainDomain = require("../../functions/config")('maindomain')
const uploadKeyLength = require("../../functions/config")('uploadkeylength')
const upload_notify = require("../../functions/config")('upload_notify')
const webhook_notify = require("../../functions/config")('webhook_notify')
const webhookURL = require("../../functions/config")('webhook_url')
var webhook_config = "./src/data/webhook.json"
const randomstring = require("randomstring")
const path = require('path')
var allowedExtensions = ["png", "jpg", "jpeg", "gif", "webm", "mp4", "mov"]
const sendEmbed = require('../../functions/sendEmbed')
const express=require('express')
const router=express.Router()

router.post("/", (req, res) => {
    const form = new formidable.IncomingForm();
    form.parse(req, (err, fields, files) => {
      const uploadKeys = JSON.parse(fs.readFileSync("./src/data/keys.json"));
      const uploadKey = fields["upload-key"];
      const user = uploadKey.split('_')[0]
      const hash = randomstring.generate(8);
      const extension = path.extname(files.file.name).replace(".", "");
      const url = `${mainDomain}/uploads/${hash}`;

      const matchingKey = Object.keys(uploadKeys).find((key) => uploadKeys[key].upload_key === uploadKey);
      if (matchingKey) {
        if (allowedExtensions.includes(extension)) {
          const { domains, embed } = uploadKeys[matchingKey];
          const { domain, subdomain } = domains;
          const { embedTitle, embedDescription, embedColor } = embed;
          fs.rename(files.file.path, `./src/uploads/raw/i/${hash}.${extension}`, (err) => {
            if (err) throw err;
  
            fs.readFile("./src/data/uploads.json", (error, data) => {
              if (error) throw error;
              const uploads = JSON.parse(data);
  
              uploads[`${hash}.${extension}`] = {};
              uploads[`${hash}.${extension}`]["user"] = user;
              uploads[`${hash}.${extension}`]["url"] = `http://${mainDomain}/uploads/${hash}`;
              uploads[`${hash}.${extension}`]["embed"] = {}
              uploads[`${hash}.${extension}`]["embed"]["title"] = embedTitle;
              uploads[`${hash}.${extension}`]["embed"]["description"] = embedDescription;
              uploads[`${hash}.${extension}`]["embed"]["color"] = embedColor;
  
              fs.writeFile("./src/data/uploads.json", JSON.stringify(uploads, null, 4),
                (error2) => {
                  if (error2) throw error2;
                }
              );
            });

            if (subdomain != "") {
                res.write(`http://${subdomain}.${domain}/uploads/${hash}`)
            } else {
                res.write(`http://${domain}/uploads/${hash}`)
            }
  
            if (upload_notify == true) {
              console.log(`[INFO] New file has been uploaded by "${user}"! URL: ${url}`);
            }
  
            if (webhook_notify == true) {
              sendEmbed(webhookURL, webhook_config, user, `${hash}.${extension}`, url, uploadKey);
            }

            res.end();
          });
        } else {
          res.write("Can't upload that file.");
          res.end();
        }
      } else {
        res.write("Invalid upload key.");
        res.end();
      }
    });
});

module.exports=router;