const passport = require("passport");
const DiscordStrategy = require("passport-discord").Strategy;
const session = require("express-session");
const config = require("../data/discordconfig.json");

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

passport.use(
  new DiscordStrategy(
    {
      clientID: config.clientID,
      clientSecret: config.clientSecret,
      callbackURL: config.callbackURL,
      scope: ["identify"],
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
      secret: "lajos",
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
