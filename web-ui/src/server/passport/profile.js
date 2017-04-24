'use strict';

const env = require('../env');

const Profile = {
  parse (body) {
    const json = JSON.parse(body);
    return {
      username: json[env.OAUTH_USERNAME_PROPERTY] || 'Unknown',
      provider: 'oauth',
      _raw: body,
      _json: json
    };
  }
};

module.exports = Profile;
