import { EventEmitter } from 'events';
import { createMocks } from 'node-mocks-http';

import { logoutHandler } from '../logoutHandler';

describe('[api] logoutHandler', () => {
  it('should set max age on cookie to now to clear', async () => {
    const { req, res } = createMocks(
      { method: 'POST', body: { password: 'password' } },
      { eventEmitter: EventEmitter },
    );

    const maxAge = 0;
    const now = Date.now();

    await logoutHandler()(req as any, res as any);

    expect(res._getStatusCode()).toBe(200);
    expect(res._getHeaders()).toHaveProperty(
      'set-cookie',
      `next-password-protect=; Max-Age=${maxAge}; Path=/; Expires=${new Date(
        now + maxAge,
      ).toUTCString()}; HttpOnly`,
    );

    jest.restoreAllMocks();
  });

  it('should handle secure option', async () => {
    const { req, res } = createMocks(
      { method: 'POST', body: { password: 'password' } },
      { eventEmitter: EventEmitter },
    );

    const maxAge = 0;
    const now = Date.now();

    await logoutHandler({ cookieSecure: true })(req as any, res as any);

    expect(res._getStatusCode()).toBe(200);
    expect(res._getHeaders()).toHaveProperty(
      'set-cookie',
      `next-password-protect=; Max-Age=${maxAge}; Path=/; Expires=${new Date(
        now + maxAge,
      ).toUTCString()}; HttpOnly; Secure`,
    );

    jest.restoreAllMocks();
  });

  it('should throw on incorrect method', async () => {
    const { req, res } = createMocks(
      { method: 'GET' },
      { eventEmitter: EventEmitter },
    );

    await logoutHandler()(req as any, res as any);

    expect(res._getStatusCode()).toBe(500);

    jest.restoreAllMocks();
  });

  it('should gracefully error', async () => {
    const { req, res } = createMocks(
      { method: 'POST', body: { password: 'password' } },
      { eventEmitter: EventEmitter },
    );

    jest.spyOn(Date, 'now').mockImplementation(() => {
      throw new Error();
    });

    await logoutHandler()(req as any, res as any);

    expect(res._getStatusCode()).toBe(500);
    expect(res._getData()).toBe(
      JSON.stringify({ message: 'An error has occured.' }),
    );

    jest.restoreAllMocks();
  });
});
