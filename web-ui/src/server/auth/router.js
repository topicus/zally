'use strict';

const {authProxy, authenticate} = require('./middlewares');
const env = require('../env');
const router = require('express')();
const bodyParser = require('body-parser');

router.get('/callback', authenticate({ successRedirect: '/'}));

router.get('/login', authenticate());

router.get('/logout', (req, res) => {
  req.logout();
  req.session = null;
  res.redirect('/');
});

router.use('/me', require('./me-handler'));

router.post('/refresh-token', authProxy(), bodyParser.json(), require('./refresh-token-handler'));

if (env.NODE_ENV === 'development' && env.DEBUG) {
  // emulate invalid access token
  router.get('/invalidate-access-token', (req, res) => {
    // set invalid access token
    req.session.passport.user.accessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWV9.TJVA95OrM7E2cBab30RMHrHDcEfxjoYZgeFONFh7HgQ';
    res.json({ok:true});
  });
}

module.exports = router;
