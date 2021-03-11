import { serialize } from 'cookie';
import { Response } from 'express';

export const setCookie = (
  res: Response,
  name: string,
  value: string,
  options,
) => {
  if ('maxAge' in options) {
    options.expires = new Date(Date.now() + options.maxAge);
    options.maxAge /= 1000;
  }

  res.setHeader('Set-Cookie', serialize(name, value, options));
};
