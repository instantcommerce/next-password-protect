import { Request, Response } from 'express';
interface PasswordProtectHandlerOptions {
    cookieName?: string;
}
export declare const passwordCheckHandler: (password: string, options?: PasswordProtectHandlerOptions) => (req: Request, res: Response) => Promise<void>;
export {};
