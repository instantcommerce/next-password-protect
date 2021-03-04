import { Request, Response } from 'express';
import compare from 'tsscmp';

import { sendJson } from './sendJson';
import { setCookie } from './setCookie';

interface PasswordProtectHandlerOptions {
  /* @default next-password-protect */
  cookieName?: string;
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
        Buffer.from(password).toString('base64'),
        {
          httpOnly: true,
          secure:
            options?.cookieSecure !== undefined
              ? options?.cookieSecure
              : process.env.NODE_ENV === 'production',
          path: '/',
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
