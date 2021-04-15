import { Request, Response } from 'express';

import { sendJson } from './sendJson';
import { setCookie } from './setCookie';

interface PasswordProtectHandlerOptions {
  /* @default next-password-protect */
  cookieName?: string;
  cookieSameSite?: boolean | 'lax' | 'none' | 'strict';
  cookieSecure?: boolean;
}

export const logoutHandler = (
  options?: PasswordProtectHandlerOptions,
) => async (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'application/json');

  try {
    if (req.method !== 'POST') {
      throw new Error('Invalid method.');
    }

    setCookie(res, options?.cookieName || 'next-password-protect', '', {
      httpOnly: true,
      sameSite: options?.cookieSameSite || false,
      secure:
        options?.cookieSecure !== undefined
          ? options?.cookieSecure
          : process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 0,
    });

    sendJson(res, 200);
  } catch (err) {
    sendJson(res, 500, { message: err.message || 'An error has occured.' });
  }
};
