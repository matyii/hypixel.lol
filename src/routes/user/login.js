const express=require('express')
const passport = require('../../functions/discord.js')
const router=express.Router()
router.get("/", passport.authenticate('discord'))
module.exports=router;