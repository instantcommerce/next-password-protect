import { createElement, ElementType } from 'react';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { renderToString } from 'react-dom/server';

import { PasswordCheckOptions, PasswordChecker } from '../api';
import { Login as DefaultLoginComponent, LoginProps } from '../components';
import { DEFAULT_COOKIE_NAME } from '../constants';

interface MiddlewareOptions extends PasswordCheckOptions {
  enabled?: boolean;
  /* @default /api/passwordCheck */
  checkApiUrl?: string;
  /* @default /api/login */
  loginApiUrl?: string;
  loginComponent?: ElementType;
  loginComponentProps?: Omit<LoginProps, 'apiUrl'>;
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
    let isAuthenticated = false;

    try {
      isAuthenticated = passwordChecker.check(
        req.cookies?.[cookieName || DEFAULT_COOKIE_NAME],
      );
    } catch (e) {}

    if (isAuthenticated) {
      return NextResponse.next();
    }

    const LoginComponent: ElementType =
      options?.loginComponent || DefaultLoginComponent;

    return new Response(
      `<html><head></head><body>${renderToString(
        createElement(LoginComponent, {
          apiUrl: options?.loginApiUrl,
          ...(options?.loginComponentProps || {}),
        }),
      )}</body></html>`,
      {
        headers: {
          'content-type': 'text/html',
        },
        status: 401,
      },
    );
  };
};
