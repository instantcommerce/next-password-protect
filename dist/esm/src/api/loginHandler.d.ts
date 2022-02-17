import { Request, Response } from 'express';
interface PasswordProtectHandlerOptions {
    cookieMaxAge?: number;
    cookieName?: string;
    cookieSameSite?: boolean | 'lax' | 'none' | 'strict';
    cookieSecure?: boolean;
    domain?: string;
}
export declare const loginHandler: (password: string, options?: PasswordProtectHandlerOptions) => (req: Request, res: Response) => Promise<void>;
export {};
