/* global jasmine */

'use strict';

describe('server.auth.me-handler', () => {
  let mockReq, mockRes, mockDebug, mockWarn, mockFetch, meHandler;
  beforeEach(() => {
    jest.resetModules();
    mockReq = {
      user: {
        username: 'bar',
        accessToken: 'foo'
      }
    };
    mockDebug = jest.fn();
    mockWarn = jest.fn();
    mockFetch = jest.fn();
    mockRes = {
      json: jest.fn(),
      status: jest.fn()
    };

    jest.mock('../../env', () => ({
      'OAUTH_TOKENINFO_URL': 'https://example.com'
    }));

    jest.mock('../../logger', () => ({
      warn: mockWarn,
      debug: mockDebug
    }));

    jest.mock('../../fetch', () => mockFetch);

    meHandler = require('../me-handler');
  });

  test('should resolve with a user and send back the user as a json response', () => {
    mockFetch.mockReturnValueOnce(Promise.resolve({ json: () => Promise.resolve() }));

    return meHandler(mockReq, mockRes)
      .then((user) => {
        expect(user).toEqual({
          username: mockReq.user.username,
          authenticated: true
        });
        expect(mockRes.json).toHaveBeenCalledWith(user);
      });
  });

  test('should resolve with an error and send back a problem as response', () => {
    const mockError = {
      message: 'foo',
      status: 403
    };
    mockFetch.mockReturnValueOnce(Promise.reject(mockError));

    return meHandler(mockReq, mockRes)
      .then((error) => {
        expect(error).toEqual(mockError);
        expect(mockRes.status).toHaveBeenCalledWith(mockError.status);
        expect(mockRes.json).toHaveBeenCalledWith({
          title: mockError.message,
          detail: jasmine.any(String)
        });
      });
  });

});
