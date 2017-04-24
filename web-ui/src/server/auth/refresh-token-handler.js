'use strict';
const {updateSessionUser} = require('../passport/util');
const querystring = require('query-string');
const env = require('../env');
const fetch = require('../fetch');
const logger = require('../logger');

module.exports = function (req, res) {
  let url = env.OAUTH_REFRESH_TOKEN_URL;

  logger.debug(`Try to refresh the token, proxying request to: ${url}`);

  req.query.refresh_token = req.user.refreshToken;
  req.query.client_id =  env.OAUTH_CLIENT_ID;
  req.query.client_secret = env.OAUTH_CLIENT_SECRET;

  // append query parameters
  url += (url.indexOf('?') === -1 ? '?' : '&') + querystring.stringify(req.query);

  return fetch(url, { method: 'POST' })
  .then((response) => {
    return response.json();
  })
  .then((tokens) => {
    logger.debug('tokens were refreshed, updates session');
    updateSessionUser(req, {
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token
    });
    res.json({ ok: true });
    return tokens;
  })
  .catch((error) => {
    logger.warn('refresh token error', error);
    res.status(400);
    res.json({
      title: error.message,
      detail: 'Refresh token request failed'
    });
    // Unhandled promise rejections are deprecated.
    // In the future, promise rejections that are not handled will terminate the Node.js process with a non-zero exit code
    return Promise.resolve(error);
  });
};
