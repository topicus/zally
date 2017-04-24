'use strict';

const env = require('./env');
const logger = require('./logger');
const express = require('express');
const path = require('path');
const app = express();
const {addAuth, authProxy} = require('./auth');
const webpackDevServerProxy = require('./webpack-dev-server-proxy');
const ASSETS_DIR = path.resolve(__dirname, '../client/public/assets');

/**
 * If OAUTH_ENABLED add auth support
 */
if (env.OAUTH_ENABLED ) { addAuth(app); }

/**
 * Proxy to webpack-dev-server for development
 */
if (env.NODE_ENV === 'development' || env.NODE_ENV === 'test') {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
  webpackDevServerProxy(app, require('../../webpack.config'));
}

/**
 * Serve static assets
 */
app.use('/assets/', express.static(ASSETS_DIR));

/**
 * Serve /env.js
 * Mimic process.env on the client side
 */
app.get('/env.js', require('./env-handler'));


/**
 * Serve favicon.ico
 */
app.get('/favicon.ico', (req, res) => {
  res.sendFile(path.join(ASSETS_DIR, 'favicon.ico'));
});

/**
 * Proxy zally api to avoid CORS restriction
 */
app.use('/zally-api', authProxy(), require('./zally-api-handler'));

/**
 * Health check
 */
app.get('/health', (req, res) => {
  res.json({ alive: true });
});

/**
 * Main entry point to SPA
 */
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client/public/index.html'));
});

/**
 * Generic error handler
 */
app.use(function (err, req, res, next) { // eslint-disable-line no-unused-vars
  // handle error
  logger.error(JSON.stringify(err), err);
  res.status(err.status || 500);
  res.json(err);
});


module.exports = app;

