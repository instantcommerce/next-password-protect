import { EventEmitter } from 'events';
import jwt from 'jsonwebtoken';
import { createMocks } from 'node-mocks-http';

import { passwordCheckHandler } from '../passwordCheckHandler';

describe('[api] passwordCheckHandler', () => {
  it('should succeed with correct cookie', async () => {
    const { req, res } = createMocks(
      {
        method: 'GET',
        headers: {
          cookie: `next-password-protect=${jwt.sign(
            {},
            'password',
          )}; Path=/; HttpOnly`,
        },
      },
      { eventEmitter: EventEmitter },
    );

    await passwordCheckHandler('password')(req as any, res as any);

    expect(res._getStatusCode()).toBe(200);
    expect(res._getHeaders()).toHaveProperty(
      'cache-control',
      'no-cache, no-store, must-revalidate',
    );

    jest.restoreAllMocks();
  });

  it('should fail without cookie', async () => {
    const { req, res } = createMocks(
      {
        method: 'GET',
        headers: {},
      },
      { eventEmitter: EventEmitter },
    );

    await passwordCheckHandler('password')(req as any, res as any);

    expect(res._getStatusCode()).toBe(401);

    jest.restoreAllMocks();
  });

  it('should fail with incorrect JWT', async () => {
    const { req, res } = createMocks(
      {
        method: 'GET',
        headers: {
          cookie: `next-password-protect=${jwt.sign(
            {},
            'incorrect',
          )}; Path=/; HttpOnly`,
        },
      },
      { eventEmitter: EventEmitter },
    );

    await passwordCheckHandler('password')(req as any, res as any);

    expect(res._getStatusCode()).toBe(401);

    jest.restoreAllMocks();
  });

  it('should fail on incorrect method', async () => {
    const { req, res } = createMocks(
      { method: 'POST' },
      { eventEmitter: EventEmitter },
    );

    await passwordCheckHandler('password')(req as any, res as any);

    expect(res._getStatusCode()).toBe(500);

    jest.restoreAllMocks();
  });

  it('should gracefully error', async () => {
    const { req, res } = createMocks(
      {
        method: 'GET',
        headers: {
          cookie: `next-password-protect=${jwt.sign(
            {},
            'password',
          )}; Path=/; HttpOnly`,
        },
      },
      { eventEmitter: EventEmitter },
    );

    jest.spyOn(Buffer, 'from').mockImplementation(() => {
      throw new Error();
    });

    await passwordCheckHandler('password')(req as any, res as any);

    expect(res._getStatusCode()).toBe(500);
    expect(res._getData()).toBe(
      JSON.stringify({ message: 'An error has occured.' }),
    );

    jest.restoreAllMocks();
  });
});
