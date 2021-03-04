import React, { ReactNode, useEffect, useState } from 'react';
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
  const ProtectedApp = ({ Component, pageProps, ...props }: AppProps) => {
    const [isAuthenticated, setAuthenticated] = useState<undefined | boolean>(
      undefined,
    );

    const checkIfLoggedIn = async () => {
      try {
        const res = await fetch(
          `/api${options?.checkApiPath || '/passwordCheck'}`,
          {
            credentials: 'include',
          },
        );

        if (res.status === 200) {
          setAuthenticated(true);
        } else {
          setAuthenticated(false);
        }
      } catch (e) {
        setAuthenticated(false);
      }
    };

    useEffect(() => {
      checkIfLoggedIn();
    }, []);

    return (
      <App
        Component={withAuth(
          Component,
          options?.loginComponent || DefaultLoginComponent,
          pageProps,
          options?.loginApiPath || '/login',
          isAuthenticated,
        )}
        pageProps={pageProps}
        {...props}
      />
    );
  };

  return ProtectedApp;
};
