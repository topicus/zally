'use strict';

const env = require('../env');
const logger = require('../logger');
const fetch = require('../fetch');

module.exports = function (req, res) {

  const url = env.OAUTH_TOKENINFO_URL;

  logger.debug(`proxying request to: ${url}`);

  return fetch(url, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${req.user.accessToken}`
    }
  })
    .then((response) => {
      return response.json();
    })
    .then(() => {
      return {
        username: req.user.username,
        authenticated: true
      };
    })
    .then((me) => {
      res.json(me);
      return me;
    })
    .catch((error) => {
      logger.warn('token info request failed', error);
      res.status(error.status || 401);
      res.json({
        title: error.message,
        detail: 'token info request failed'
      });
      // Unhandled promise rejections are deprecated.
      // In the future, promise rejections that are not handled will terminate the Node.js process with a non-zero exit code
      return Promise.resolve(error);
    });
};
