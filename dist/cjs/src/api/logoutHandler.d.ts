import { Request, Response } from 'express';
interface PasswordProtectHandlerOptions {
    cookieName?: string;
    cookieSameSite?: boolean | 'lax' | 'none' | 'strict';
    cookieSecure?: boolean;
}
export declare const logoutHandler: (options?: PasswordProtectHandlerOptions) => (req: Request, res: Response) => Promise<void>;
export {};
