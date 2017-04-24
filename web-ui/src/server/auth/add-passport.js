'use strict';

const env = require('../env');
const cookieSession = require('cookie-session');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const Strategy = require('../passport/strategy');

module.exports = (app) => {

  const OAUTH_SCOPES = function () {
    if (Array.isArray(env.OAUTH_SCOPES)) {
      return env.OAUTH_SCOPES;
    }

    if (typeof env.OAUTH_SCOPES === 'string') {
      return env.OAUTH_SCOPES.split(',');
    }
    return [];
  }();

  const STRATEGY_OPTIONS = {
    clientID: env.OAUTH_CLIENT_ID,
    clientSecret: env.OAUTH_CLIENT_SECRET,
    scope: OAUTH_SCOPES,
    authorizationURL: env.OAUTH_AUTHORIZATION_URL,
    tokenURL: env.OAUTH_ACCESS_TOKEN_URL,
    profileURL: env.OAUTH_TOKENINFO_URL
  };

  // ADD COOKIE SUPPORT
  app.use(cookieParser());
  app.use(cookieSession({
    name: 'session',
    secret: env.SESSION_SECRET,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }));

  // PASSPORT CONFIGURATION
  passport.use(new Strategy(STRATEGY_OPTIONS,
    (accessToken, refreshToken, profile, done) => {
      const user = {
        username: profile.username,
        provider: profile.provider,
        accessToken: accessToken,
        refreshToken: refreshToken
      };
      done(null, user);
    }
  ));
  passport.serializeUser((user, done) => done(null, user));
  passport.deserializeUser((user, done) => done(null, user));

  // PASSPORT INITIALIZE
  app.use(passport.initialize());
  app.use(passport.session());

};
