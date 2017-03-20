'use strict';

const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const proxyquire = require('proxyquire');
chai.use(sinonChai);


describe('server.index', () => {

  let index, createHttpServer, env, logger, webpackDevMiddleware, webpack, webpackConfig, express, listen, listenSpy, app, appSpy;

  before(() => {

    listen = (port, cb) => {
          cb();
        };

    createHttpServer = () => {
      listenSpy = sinon.spy(listen);
      return {
        'listen': listenSpy
      }
    };

    env = {
     'PORT': 3000,
     'NODE_ENV':'development'
    };

    logger = {
      info: () => {}
    };

    webpackDevMiddleware = sinon.spy();

    webpack = () => {
      return 'compiler';
    };

    webpackConfig = {};

    app = {
      get: sinon.spy(),
      use: sinon.spy()
    };

    express = () => {
      return app;
    };

    sinon.spy(logger, 'info');
    listenSpy = sinon.spy(listen);

    process.env.NODE_ENV = 'development';

    index = proxyquire('src/server/index', {
      './create-http-server': createHttpServer,
      './logger': logger,
      './env': env,
      'webpack-dev-middleware': webpackDevMiddleware,
      'webpack': webpack,
      '../../webpack.config': webpackConfig,
      'express': express
    });

  });

  it('should start the server on env.PORT', () => {
    expect(logger.info).to.have.been.calledOnce;
    expect(logger.info).to.have.been.calledWith('listening on port 3000, NODE_ENV=development');
    expect(listenSpy).to.have.been.calledOnce;
    expect(listenSpy).to.have.been.calledWith(3000);
  });

  describe('when env.NODE_ENV is developement', () => {
    it('should use webpackDevMiddleWare', () => {
      expect(webpackDevMiddleware).to.have.been.calledOnce;
      expect(webpackDevMiddleware).to.have.been.calledWith('compiler');
      expect(app.use).to.have.been.called;
    });
  });
});
