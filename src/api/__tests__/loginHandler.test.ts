import { EventEmitter } from 'events';
import { createMocks } from 'node-mocks-http';

import { loginHandler } from '../loginHandler';

describe('[api] loginHandler', () => {
  it('should set cookie on correct password', async () => {
    const { req, res } = createMocks(
      { method: 'POST', body: { password: 'password' } },
      { eventEmitter: EventEmitter },
    );

    await loginHandler('password')(req as any, res as any);

    expect(res._getStatusCode()).toBe(200);
    expect(res._getHeaders()).toHaveProperty(
      'set-cookie',
      'next-password-protect=cGFzc3dvcmQ%3D; Path=/; HttpOnly',
    );

    jest.restoreAllMocks();
  });

  it('should set max age on cookie if configured', async () => {
    const { req, res } = createMocks(
      { method: 'POST', body: { password: 'password' } },
      { eventEmitter: EventEmitter },
    );

    const maxAge = 300 * 1000;
    const now = Date.now();

    await loginHandler('password', { cookieMaxAge: maxAge })(
      req as any,
      res as any,
    );

    expect(res._getStatusCode()).toBe(200);
    expect(res._getHeaders()).toHaveProperty(
      'set-cookie',
      `next-password-protect=cGFzc3dvcmQ%3D; Max-Age=${
        maxAge / 1000
      }; Path=/; Expires=${new Date(now + maxAge).toUTCString()}; HttpOnly`,
    );

    jest.restoreAllMocks();
  });

  it('should set secure on cookie if configured', async () => {
    const { req, res } = createMocks(
      { method: 'POST', body: { password: 'password' } },
      { eventEmitter: EventEmitter },
    );

    await loginHandler('password', { cookieSecure: true })(
      req as any,
      res as any,
    );

    expect(res._getStatusCode()).toBe(200);
    expect(res._getHeaders()).toHaveProperty(
      'set-cookie',
      `next-password-protect=cGFzc3dvcmQ%3D; Path=/; HttpOnly; Secure`,
    );

    jest.restoreAllMocks();
  });

  it('should reject on incorrect password', async () => {
    const { req, res } = createMocks(
      { method: 'POST', body: { password: 'incorrect' } },
      { eventEmitter: EventEmitter },
    );

    await loginHandler('password')(req as any, res as any);

    expect(res._getStatusCode()).toBe(400);
    expect(res._getHeaders()).not.toHaveProperty('set-cookie');

    jest.restoreAllMocks();
  });

  it('should throw on incorrect method', async () => {
    const { req, res } = createMocks(
      { method: 'GET' },
      { eventEmitter: EventEmitter },
    );

    await loginHandler('password')(req as any, res as any);

    expect(res._getStatusCode()).toBe(500);

    jest.restoreAllMocks();
  });

  it('should throw on incorrect body', async () => {
    const { req, res } = createMocks(
      { method: 'POST' },
      { eventEmitter: EventEmitter },
    );

    await loginHandler('password')(req as any, res as any);

    expect(res._getStatusCode()).toBe(500);
    expect(res._getData()).toBe(
      JSON.stringify({ message: 'Invalid request.' }),
    );

    jest.restoreAllMocks();
  });

  it('should gracefully error', async () => {
    const { req, res } = createMocks(
      { method: 'POST', body: { password: 'password' } },
      { eventEmitter: EventEmitter },
    );

    jest.spyOn(Buffer, 'from').mockImplementation(() => {
      throw new Error();
    });

    await loginHandler('password')(req as any, res as any);

    expect(res._getStatusCode()).toBe(500);
    expect(res._getData()).toBe(
      JSON.stringify({ message: 'An error has occured.' }),
    );

    jest.restoreAllMocks();
  });
});
