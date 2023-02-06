var DiscordStrategy = require('passport-discord').Strategy;
var passport = require('passport')

const clientID = require('./discordConfig.js')('clientID');
const clientSecret = require('./discordConfig.js')('clientSecret');
const callbackURL = require('./discordConfig.js')('redirectURL');

passport.use(new DiscordStrategy({
    clientID: clientID,
    clientSecret: clientSecret,
    callbackURL: callbackURL,
    scope: ['identify', 'email']
},
function discordPassport(accessToken, refreshToken, profile, cb) {
    return cb(null, profile);
}))

passport.serializeUser(function(user, cb) {
    cb(null, user);
});
  
  passport.deserializeUser(function(obj, cb) {
    cb(null, obj);
});

module.exports = passport;