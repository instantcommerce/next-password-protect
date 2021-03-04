import React, { ReactNode } from 'react';
import type { AppProps } from 'next/app';

import { LoginComponent as DefaultLoginComponent } from './LoginComponent';
import { withAuth } from './withAuth';

interface PasswordProtectHOCOptions {
  /* @default /passwordCheck */
  checkApiPath?: string;
  /* @default /login */
  loginApiPath?: string;
  loginComponent?: ReactNode;
}

/// TODO: improve App typing
export const withPasswordProtect = (
  App: any,
  options?: PasswordProtectHOCOptions,
) => {
  const ProtectedApp = ({ Component, pageProps, ...props }: AppProps) => (
    <App
      Component={withAuth(
        Component,
        options?.loginComponent || DefaultLoginComponent,
        pageProps,
        options?.loginApiPath || '/login',
        options?.checkApiPath || '/passwordCheck',
      )}
      pageProps={pageProps}
      {...props}
    />
  );

  return ProtectedApp;
};
