import { Request, Response } from 'express';

import { PasswordChecker, PasswordCheckOptions } from './PasswordChecker';
import { sendJson } from './sendJson';

interface PasswordProtectHandlerOptions extends PasswordCheckOptions {}

export const passwordCheckHandler = (
  password: string,
  options?: PasswordProtectHandlerOptions,
) => {
  const passwordChecker = new PasswordChecker(password, options);

  return async (req: Request, res: Response) => {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate'); // HTTP 1.1.
    res.setHeader('Pragma', 'no-cache'); // HTTP 1.0.
    res.setHeader('Expires', '0'); // Proxies.

    try {
      if (req.method !== 'GET') {
        throw new Error('Invalid method.');
      }

      const isAuthenticated = passwordChecker.check(req);

      if (isAuthenticated) {
        sendJson(res, 200);
        return;
      }

      sendJson(res, 401);
    } catch (err) {
      sendJson(res, 500, { message: err?.message || 'An error has occurred.' });
    }
  };
};
