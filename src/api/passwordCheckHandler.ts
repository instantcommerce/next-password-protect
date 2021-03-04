import cookie from 'cookie';
import { Request, Response } from 'express';
import compare from 'safe-compare';

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

      if (
        cookies?.[cookieName] &&
        compare(cookies?.[cookieName], Buffer.from(password).toString('base64'))
      ) {
        sendJson(res, 200);
        return;
      }
    }

    sendJson(res, 401);
  } catch (err) {
    sendJson(res, 500, { message: err?.message || 'An error has occured.' });
  }
};
