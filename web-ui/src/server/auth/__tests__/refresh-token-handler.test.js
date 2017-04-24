'use strict';

/* global jasmine */

describe('server.auth.refresh-token-handler', () => {
  let mockDebug, mockWarn, mockFetch, mockUpdateUserSession, refreshTokenHandler, reqMock, resMock;
  beforeEach(() => {
    jest.resetModules();
    mockDebug = jest.fn();
    mockWarn = jest.fn();
    mockFetch = jest.fn();
    mockUpdateUserSession = jest.fn();

    jest.mock('../../env', () => ({
      'OAUTH_REFRESH_TOKEN_URL': 'https://example.com',
      'OAUTH_CLIENT_ID': 'foo',
      'OAUTH_CLIENT_SECRET': 'foo_secret'
    }));

    jest.mock('../../passport/util', () => ({
      updateSessionUser: mockUpdateUserSession
    }));

    jest.mock('../../logger', () => ({
      debug: mockDebug,
      warn: mockWarn
    }));

    jest.mock('../../fetch', () => mockFetch);

    reqMock = {
      user: {
        refreshToken: 'bar'
      },
      query: {}
    };

    resMock = {
      json: jest.fn(),
      status: jest.fn()
    };

    refreshTokenHandler = require('../refresh-token-handler');
  });

  test('fetch refresh token url endpoint with right query parameters and update user session', () => {

    const fetchResponse = { json: jest.fn() };

    const mockTokens = {
      access_token: 'foo',
      refresh_token: 'bar'
    };

    fetchResponse.json.mockReturnValueOnce(Promise.resolve(mockTokens));
    mockFetch.mockReturnValueOnce(Promise.resolve(fetchResponse));

    return refreshTokenHandler(reqMock, resMock)
      .then(() => {
        expect(mockFetch).toHaveBeenCalledWith('https://example.com?client_id=foo&client_secret=foo_secret&refresh_token=bar', { method: 'POST'});
        expect(mockUpdateUserSession).toHaveBeenCalledWith(reqMock, {
          accessToken: mockTokens.access_token,
          refreshToken: mockTokens.refresh_token
        });
      });
  });

  test('fetch refresh token url endpoint and if fails resolve the promise with en error and send back a problem as json response', () => {
    const fetchError = new Error('fetch fails');
    mockFetch.mockReturnValueOnce(Promise.reject(fetchError));
    return refreshTokenHandler(reqMock, resMock)
      .then((error) => {
        expect(resMock.status).toHaveBeenCalledWith(400);
        expect(resMock.json).toHaveBeenCalledWith({
          title: fetchError.message,
          detail: jasmine.any(String)
        });
        expect(error).toEqual(fetchError);
      });
  });

});
