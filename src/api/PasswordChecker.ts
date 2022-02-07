import cookieLib from 'cookie';
import type { Request } from 'express';
import jwt from 'jsonwebtoken';

import { DEFAULT_COOKIE_NAME } from '../constants';

export interface PasswordCheckOptions {
  /* @default next-password-protect */
  cookieName?: string;
}

export class PasswordChecker {
  private password: string;
  private options?: PasswordCheckOptions;

  constructor(password: string, options?: PasswordCheckOptions) {
    this.password = password;
    this.options = options;
  }

  /** Input can be the cookie directly (string) or an express-like Request */
  check(input: Request | string) {
    try {
      let cookie = '';

      if (typeof input === 'string') {
        cookie = input;
      } else if (input?.headers?.cookie) {
        const cookies = cookieLib.parse(input.headers.cookie);
        const cookieName = this.options?.cookieName || DEFAULT_COOKIE_NAME;
        cookie = cookies?.[cookieName];
      }

      if (cookie) {
        /* NOTE: It's not usual to use the password as JWT secret, but since you already
         * have access to the environment when you know the password, in this specific
         * use case it doesn't add any value for an intruder if the secret is known.
         */
        jwt.verify(cookie, this.password);

        return true;
      }

      return false;
    } catch (err) {
      if (err.name === 'JsonWebTokenError') {
        return false;
      }

      throw new Error(err?.message || 'An error has occurred.');
    }
  }
}
