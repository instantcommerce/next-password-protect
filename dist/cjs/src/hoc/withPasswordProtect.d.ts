import { ElementType } from 'react';
import type { AppProps } from 'next/app';
import { LoginComponentProps } from './LoginComponent';
interface PasswordProtectHOCOptions {
    checkApiUrl?: string;
    loginApiUrl?: string;
    loginComponent?: ElementType;
    loginComponentProps?: Omit<LoginComponentProps, 'apiUrl'>;
    bypassProtectionForRoute?: (route: string) => boolean;
}
export declare const withPasswordProtect: (App: any, options?: PasswordProtectHOCOptions) => ({ Component, pageProps, ...props }: AppProps) => JSX.Element;
export {};
