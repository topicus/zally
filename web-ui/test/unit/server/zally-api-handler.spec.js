'use strict';

const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const proxyquire = require('proxyquire');
chai.use(sinonChai);

describe('server.tokeninfo-handler', () => {

  let env, request, logger, zallyApiHandler, req, res;

  beforeEach(() => {

    env = {
      'ZALLY_API_URL': 'zallyApiUrl'
    };

    request = sinon.spy();

    logger = {
      debug: () => {}
    };

    req = {
      url: '/zally-api/somePath',
      pipe: () => {
        return req;
      }
    };

    res = {};

    sinon.spy(logger, 'debug');
    sinon.spy(req, 'pipe');

    zallyApiHandler = proxyquire('src/server/zally-api-handler',{
      './env': env,
      'request': request,
      './logger': logger
    });

    zallyApiHandler(req, res);

  })

  it('should export a function', () => {
    expect(zallyApiHandler).to.be.a.function;
  });

  describe('when invoking the function', () => {

    it('should log the debug message', () => {
      expect(logger.debug).to.have.been.calledOnce;
    });

    it('should create a URL concatenating env.ZALLY_API_URL and req.url(after removing /zally-api from req.url)', () => {
      expect(request).to.have.been.calledOnce;
      expect(request).to.have.been.calledWith('zallyApiUrl/somePath');
    });

    it('should proxy the request', () => {
      expect(req.pipe).to.have.been.calledTwice;
    });
  });

})
