const passport = require("passport");
const DiscordStrategy = require("passport-discord").Strategy;
const session = require("express-session");
require('dotenv').config();

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

passport.use(
  new DiscordStrategy(
    {
      clientID: process.env.DC_ID,
      clientSecret: process.env.DC_SECRET,
      callbackURL: process.env.DC_URL,
      scope: ["identify", "email"],
    },
    (accessToken, refreshToken, profile, done) => {
      profile.accessToken = accessToken;
      return done(null, profile);
    }
  )
);

module.exports = (app) => {
  app.use(
    session({
      secret: "hypixel.lol",
      resave: false,
      saveUninitialized: false,
    })
  );

  app.use(passport.initialize());
  app.use(passport.session());

  app.get("/login", passport.authenticate("discord"));
  app.get(
    "/login/callback",
    passport.authenticate("discord", {
      failureRedirect: "/login",
    }),
    (req, res) => {
      res.redirect("/dashboard");
    }
  );
};
