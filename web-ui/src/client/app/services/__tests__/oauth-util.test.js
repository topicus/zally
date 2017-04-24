/* global global, window */

import {login, logout, refreshToken, me} from '../oauth-util.js';
import fetch from '../fetch.js';
import {client} from '../http-client.js';

jest.mock('../fetch');
jest.mock('../http-client');

describe('login/logout', () => {
  beforeEach(() => {
    global.window = {
      location: {}
    };
  });

  afterEach(() => {
    delete global.window;
  });

  test('redirect to login url', () => {
    login();
    expect(global.window.location.href).toBe('/auth/login');
  });


  test('redirect to logout url', () => {
    logout();
    expect(global.window.location.href).toBe('/auth/logout');
  });
});

describe('refreshToken', () => {

  afterEach(() => {
    fetch.mockReset();
  });

  test('when success should resolve with response and body' , () => {
    const mockJson = jest.fn();
    const mockResponse = {
      json: mockJson
    };
    const mockBody = {};

    fetch.mockReturnValueOnce(Promise.resolve(mockResponse));
    mockJson.mockReturnValueOnce(Promise.resolve(mockBody));

    return refreshToken().then(({response, body}) => {
      expect(response).toBeDefined();
      expect(body).toBeDefined();
      expect(response).toEqual(mockResponse);
      expect(body).toEqual(mockBody);
    });
  });

  test('when failure should reject with an error', (done) => {
    const error = new Error('test refreshToken error fails');
    fetch.mockReturnValueOnce(Promise.reject(error));
    refreshToken().catch((e) => {
      try {
        expect(e).toEqual(error);
        done();
      } catch (e) {
        done.fail(e);
      }
    });
  });
});

describe('me', () => {

  afterEach(() => {
    client.fetch.mockReset();
  });

  test('resolve with response body if token is valid', () => {
    const mockBody = {};
    client.fetch.mockReturnValueOnce(Promise.resolve({
      json: () => mockBody
    }));
    me().then((body) => {
      expect(body).toBeDefined();
      expect(body).toBe(mockBody);
    });
  });

  test('reject with an error if token is not valid', (done) => {
    const mockError = new Error('test checkTokenIsValid fails');
    client.fetch.mockReturnValueOnce(Promise.reject(mockError));
    me().catch((error) => {
      try {
        expect(error).toBeDefined();
        expect(error).toBe(mockError);
        done();
      } catch (e) {
        done.fail(e);
      }
    });
  });
});
