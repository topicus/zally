/* global global */

const {RequestMock} = require('../__mocks__/util-mocks');

const createAuthorizedRequest = () => {
  const request = new RequestMock();
  request.headers.append('Authorization', 'Bearer foo');
  return request;
};

const createUnauthorizedResponse = () => {
  return { status: 401 };
};

describe('OAuthInterceptor', () => {

  let OAuthInterceptor, mockRefreshToken, mockLogin, mockFetch;

  beforeEach(() => {
    jest.resetModules();

    global.window = {
      env: {}
    };

    mockRefreshToken = jest.fn();
    mockLogin = jest.fn();
    mockFetch = jest.fn();

    jest.mock('../oauth-util', () => ({ refreshToken: mockRefreshToken, login: mockLogin }));
    jest.mock('../fetch', () => (mockFetch));

    OAuthInterceptor = require('../oauth-interceptor').default;
  });

  afterEach(() => {
    delete global.window;
  });

  describe('responseError interceptor skip', () => {
    test('if response status !== 401', (done) => {
      const response = {
        status: 500
      };
      const request = createAuthorizedRequest();
      OAuthInterceptor
        .responseError(response, request)
        .catch((e) => {
          expect(e).toEqual(response);
          expect(mockRefreshToken).not.toHaveBeenCalled();
          done();
        });
    });

    test('if OAUTH is not enabled', (done) => {
      const request = createAuthorizedRequest();
      const response = createUnauthorizedResponse();
      window.env.OAUTH_ENABLED = false;

      OAuthInterceptor
        .responseError(response, request)
        .catch((e) => {
          expect(e).toEqual(response);
          expect(mockRefreshToken).not.toHaveBeenCalled();
          done();
        });
    });
  });

  describe('responseError interceptor try to refresh the token', () => {
    let response, request;

    beforeEach(() => {
      global.window.env.OAUTH_ENABLED = true;
      request = createAuthorizedRequest();
      response = createUnauthorizedResponse();
    });

    test('if success, retry failed requests', (done) => {

      mockRefreshToken.mockReturnValueOnce(Promise.resolve());
      mockFetch.mockReturnValueOnce(Promise.resolve());

      OAuthInterceptor
        .responseError(response, request)
        .then(() => {
          expect(mockRefreshToken).toHaveBeenCalled();
          expect(mockFetch).toHaveBeenCalled();
          done();
        }).catch(done.fail);
    });

    test('if fails, reject failed requests and login', (done) => {
      mockRefreshToken.mockReturnValueOnce(Promise.reject('test refresh token fails'));

      OAuthInterceptor
        .responseError(response, request)
        .catch(() => {
          expect(mockRefreshToken).toHaveBeenCalled();
          expect(mockFetch).not.toHaveBeenCalled();
          expect(mockLogin).toHaveBeenCalled();
          done();
        });
    });

    test('should skip refresh token operation if already in progress', (done) => {
      mockRefreshToken.mockReturnValueOnce(Promise.resolve());
      mockFetch.mockReturnValue(Promise.resolve());

      OAuthInterceptor.responseError(response, request);
      OAuthInterceptor
        .responseError(response, request)
        .then(() => {
          expect(mockRefreshToken.mock.calls.length).toEqual(1);
          expect(mockFetch.mock.calls.length).toEqual(2);
          done();
        });
    });
  });

});
