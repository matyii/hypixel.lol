const express=require('express')
const checkUploadkey = require('../../functions/generateKey.js')
const fetchUploads = require('../../functions/fetchUploads.js')
const mainDomain = require('../../functions/config.js')('maindomain');
const router=express.Router()

const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated() && req.user.accessToken) {
      return next();
    }
    res.redirect("/login");
  };

router.get('/',isAuthenticated, function(req, res) {
    const accessToken = req.user.accessToken;
    req.session.accessToken = accessToken;
    const profile = req.user;
    const id = profile["id"]
    const username = profile["username"]
    const usertag = profile["discriminator"]
    const profilepic = `https://cdn.discordapp.com/avatars/${id}/${profile["avatar"]}.png?size=1024`
    const uploadKey = checkUploadkey(username, id)
    let uploadsNumber;
    fetchUploads(uploadKey[0])
    .then(data => {
        uploadsNumber = data.toString();
        res.render('user', {
            maindomain: mainDomain,
            id: id,
            username: username,
            usertag: usertag,
            profilepic: profilepic,
            uploadkey: uploadKey[0],
            uid: uploadKey[1],
            uploads: uploadsNumber
        });
    })
    .catch(error => console.error(error));
});
module.exports=router;