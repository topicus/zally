/* global global */

describe('oauth-firewall', () => {
  let mockMe, firewall, mockCreateUser;
  beforeEach(() => {
    jest.resetModules();
    mockMe = jest.fn();
    mockCreateUser = jest.fn();
    jest.mock('../oauth-util', () => ({
      me: mockMe,
      createUser: mockCreateUser
    }));
    global.window = {
      env: {}
    };
    firewall = require('../oauth-firewall').default;
  });

  afterEach(() => {
    delete global.window;
  });

  test('return immediately with a resolved promise if oauth is disabled', () => {
    global.window.env.OAUTH_ENABLED = false;
    const mockUser = {};
    mockCreateUser.mockReturnValueOnce(mockUser);
    return firewall()
      .then(({body, user}) => {
        expect(mockMe).not.toHaveBeenCalled();
        expect(mockCreateUser).toHaveBeenCalledWith();
        expect(body).toEqual(null);
        expect(user).toEqual(mockUser);
      });
  });

  test('return a resolved promise containing user from the server', () => {
    global.window.env.OAUTH_ENABLED = true;
    const mockUser = {};
    mockMe.mockReturnValueOnce(Promise.resolve(mockUser));
    return firewall()
      .then(({body, user}) => {
        expect(mockMe).toHaveBeenCalled();
        expect(mockCreateUser).not.toHaveBeenCalled();
        expect(body).toEqual(mockUser);
        expect(user).toEqual(mockUser);
      });
  });

  test('return a resolved promise with error, body and user if me call fails', () => {
    global.window.env.OAUTH_ENABLED = true;
    const mockUser = {};
    const mockError = new Error('test firewall reject');
    mockMe.mockReturnValueOnce(Promise.reject(new Error('test firewall reject')));
    mockCreateUser.mockReturnValueOnce(mockUser);

    return firewall()
      .then(({body, error, user}) => {
        expect(error).toEqual(mockError);
        expect(body).toEqual(null);
        expect(user).toEqual(mockUser);
      });
  });
});
