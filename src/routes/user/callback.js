const express=require('express')
const passport = require('../../functions/discord.js')
const checkUploadkey = require('../../functions/generateKey.js')
const fetchUploads = require('../../functions/fetchUploads.js')
const mainDomain = require('../../functions/config.js')('maindomain');
const router=express.Router()

router.get('/', passport.authenticate('discord', { failureRedirect: '/' }), function(req, res) {
    const accessToken = req.user.accessToken;
    req.session.accessToken = accessToken;
    const nitrotypes = {
        0: "No Nitro Subscription",
        1: "Nitro Classic",
        2: "Nitro Booster",
        3: "Nitro Basic"
    }
    const profile = req.user;
    const id = profile["id"]
    const username = profile["username"]
    const usertag = profile["discriminator"]
    const nitrotype = profile["premium_type"]
    const nitro = nitrotypes[nitrotype]
    const profilepic = `https://cdn.discordapp.com/avatars/${id}/${profile["avatar"]}.gif?size=1024`
    const banner = `https://cdn.discordapp.com/banners/${id}/${profile['banner']}.png?size=1024`
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
            nitro: nitro,
            profilepic: profilepic,
            banner: banner,
            uploadkey: uploadKey[0],
            uid: uploadKey[1],
            uploads: uploadsNumber
        });
    })
    .catch(error => console.error(error));
});
module.exports=router;