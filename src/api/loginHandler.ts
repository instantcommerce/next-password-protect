import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import compare from 'safe-compare';

import { sendJson } from './sendJson';
import { setCookie } from './setCookie';

interface PasswordProtectHandlerOptions {
  cookieMaxAge?: number;
  /* @default next-password-protect */
  cookieName?: string;
  cookieSameSite?: boolean | 'lax' | 'none' | 'strict';
  cookieSecure?: boolean;
}

export const loginHandler = (
  password: string,
  options?: PasswordProtectHandlerOptions,
) => async (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'application/json');

  try {
    if (req.method !== 'POST') {
      throw new Error('Invalid method.');
    }

    if (!req.body.password) {
      throw new Error('Invalid request.');
    }

    const { password: providedPassword } = req.body;

    if (compare(providedPassword, password)) {
      setCookie(
        res,
        options?.cookieName || 'next-password-protect',
        /* NOTE: It's not usual to use the password as JWT secret, but since you already
         * have access to the environment when you know the password, in this specific
         * use case it doesn't add any value for an intruder if the secret is known.
         */
        jwt.sign({}, password),
        {
          httpOnly: true,
          sameSite: options?.cookieSameSite || false,
          secure:
            options?.cookieSecure !== undefined
              ? options?.cookieSecure
              : process.env.NODE_ENV === 'production',
          path: '/',
          ...(options?.cookieMaxAge
            ? {
                maxAge: options?.cookieMaxAge,
              }
            : {}),
        },
      );

      sendJson(res, 200);
      return;
    }

    sendJson(res, 400, { message: 'Incorrect password.' });
  } catch (err) {
    sendJson(res, 500, { message: err.message || 'An error has occured.' });
  }
};
