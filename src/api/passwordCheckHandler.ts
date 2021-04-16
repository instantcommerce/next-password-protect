import cookie from 'cookie';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import { sendJson } from './sendJson';

interface PasswordProtectHandlerOptions {
  /* @default next-password-protect */
  cookieName?: string;
}

export const passwordCheckHandler = (
  password: string,
  options?: PasswordProtectHandlerOptions,
) => async (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate'); // HTTP 1.1.
  res.setHeader('Pragma', 'no-cache'); // HTTP 1.0.
  res.setHeader('Expires', '0'); // Proxies.

  try {
    if (req.method !== 'GET') {
      throw new Error('Invalid method.');
    }

    if (req?.headers?.cookie) {
      const cookies = cookie.parse(req.headers.cookie);
      const cookieName = options?.cookieName || 'next-password-protect';

      /* NOTE: It's not usual to use the password as JWT secret, but since you already
       * have access to the environment when you know the password, in this specific
       * use case it doesn't add any value for an intruder if the secret is known.
       */
      jwt.verify(cookies?.[cookieName], password);

      sendJson(res, 200);
      return;
    }

    sendJson(res, 401);
  } catch (err) {
    if (err.name === 'JsonWebTokenError') {
      sendJson(res, 401);
      return;
    }

    sendJson(res, 500, { message: err?.message || 'An error has occured.' });
  }
};
