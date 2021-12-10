import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';

import { DEFAULT_COOKIE_NAME } from '../../constants';
import { passwordProtectMiddleware } from '../middleware';

describe('[middleware] passwordProtectMiddleware', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should not check if disabled', async () => {
    const next = jest.fn();

    jest.spyOn(NextResponse, 'next').mockImplementationOnce(next);

    passwordProtectMiddleware('password', { enabled: false })(
      {} as NextRequest,
    );

    expect(next).toBeCalled();
  });

  it('should allow login route to be called normally', async () => {
    const next = jest.fn();

    jest.spyOn(NextResponse, 'next').mockImplementationOnce(next);

    const check = jest.fn();

    // jest
    //   .spyOn(api, 'PasswordChecker')
    //   .mockImplementationOnce(() => ({ check } as any));

    passwordProtectMiddleware('password')(
      new NextRequest('http://localhost/api/login'),
    );

    expect(next).toBeCalled();
    expect(check).not.toBeCalled();
  });

  it('should return login page if not authenticated', async () => {
    const next = jest.fn();

    jest.spyOn(NextResponse, 'next').mockImplementationOnce(next);

    const res = passwordProtectMiddleware('password')(
      new NextRequest('http://localhost/'),
    );

    expect(next).not.toBeCalled();
    expect(res.status).toBe(401);
  });

  it('should return next if authenticated', async () => {
    const next = jest.fn();

    jest.spyOn(NextResponse, 'next').mockImplementationOnce(next);

    passwordProtectMiddleware('password')({
      url: '/',
      cookies: {
        [DEFAULT_COOKIE_NAME]: jwt.sign({}, 'password'),
      },
      nextUrl: {},
    } as any);

    expect(next).toBeCalled();
  });
});
