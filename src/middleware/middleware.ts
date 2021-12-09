import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { PasswordCheckOptions, PasswordChecker } from '../api';
import { DEFAULT_COOKIE_NAME } from '../constants';

import { html, HtmlOptions } from './html';

interface MiddlewareOptions extends PasswordCheckOptions {
  enabled?: boolean;
  /* @default /api/passwordCheck */
  checkApiUrl?: string;
  /* @default /api/login */
  loginApiUrl?: string;
  loginHtmlOptions?: Omit<HtmlOptions, 'apiUrl'>;
}

export const passwordProtectMiddleware = (
  password: string,
  { cookieName, enabled, ...options }: MiddlewareOptions = {},
) => {
  if (!enabled) {
    return () => {
      return NextResponse.next();
    };
  }

  const passwordChecker = new PasswordChecker(password, { cookieName });

  return (req: NextRequest) => {
    if (req.nextUrl.pathname === (options?.loginApiUrl || '/api/login')) {
      return NextResponse.next();
    }

    let isAuthenticated = false;

    try {
      isAuthenticated = passwordChecker.check(
        req.cookies?.[cookieName || DEFAULT_COOKIE_NAME],
      );
    } catch (e) {}

    if (isAuthenticated) {
      return NextResponse.next();
    }

    return new Response(
      html({
        apiUrl: options?.loginApiUrl,
        ...(options?.loginHtmlOptions || {}),
      }),
      {
        headers: {
          'content-type': 'text/html',
        },
        status: 401,
      },
    );
  };
};
