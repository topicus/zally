'use strict';

const {Strategy, InternalOAuthError} = require('passport-oauth2');
const util = require('util');
const Profile = require('./profile');
const {simple} = require('./credentials-loader');

function OAuthStrategy (options, verify) {
  if (typeof options === 'function') {
    verify = options;
    options = undefined;
  }
  Strategy.call(this, options, verify);
  this.name = 'oauth';
  this._profileURL = options.profileURL;
  options.onCredentialsError = options.onCredentialsError || (error => {throw error;});
  options.credentialsLoader = options.credentialsLoader || this._defaultCredentialsLoader(options);
  options.credentialsLoader((error, credentials) => error ? options.onCredentialsError(error) : this._updateCredentials(credentials));
  this._options = options;
}

util.inherits(OAuthStrategy, Strategy);

OAuthStrategy.prototype.userProfile = function (accessToken, done) {
  this._oauth2.get(this._profileURL, accessToken, (err, body) => err ?
      done(new InternalOAuthError('Failed to fetch user profile', err)) :
      done(null, Profile.parse(body))
  );
};

OAuthStrategy.prototype._updateCredentials = function ({clientId, clientSecret}) {
  if (clientId) this._oauth2._clientId = clientId;
  if (clientSecret) this._oauth2._clientSecret = clientSecret;
};

OAuthStrategy.prototype._defaultCredentialsLoader = function (options) {
  return simple(options.clientId, options.clientSecret);
};

module.exports = OAuthStrategy;
