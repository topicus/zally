'use strict';

const passport = require('passport');
const env = require('../env');
const {AuthError} = require('./errors');

const authProxy = () => {
  return (req, res, next) => {

    if (!env.OAUTH_ENABLED) {
      next();
      return;
    }

    if (!req.user) {
      next(new AuthError('Authentication Failed'));
      return;
    }

    if (!req.user.accessToken) {
      next(new AuthError('Authentication Failed - access token not present in the current user session'));
      return;
    }

    req.headers['Authorization'] = `Bearer ${req.user.accessToken}`;

    next();
  };
};

const authenticate = (options) => {
  return passport.authenticate('oauth', options);
};

module.exports = {
  authProxy,
  authenticate
};
