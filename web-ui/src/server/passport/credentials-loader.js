'use strict';

const fs = require('fs');

module.exports = {kubernetes, simple};

function kubernetes (clientIdPath, clientSecretPath) {
  return done => {
    syncFile(clientIdPath, (err, clientId) => err ? done(err) : done(null, {clientId}));
    syncFile(clientSecretPath, (err, clientSecret) => err ? done(err) : done(null, {clientSecret}));
  };
}

function simple (clientId, clientSecret) {
  return done => {
    done(null, {clientId, clientSecret});
  };
}

function syncFile (file, done) {
  const fileCallback = (err, data) => err ? done(err) : done(null, data.replace(/\n$/, ''));
  const fileListener = () => fs.readFile(file, 'utf8', fileCallback);
  const watcher = fs.watchFile(file, fileListener);
  watcher.emit('change');
}
