import React, { ReactNode, useEffect, useState } from 'react';
import type { AppProps } from 'next/app';

import {
  LoginComponent as DefaultLoginComponent,
  LoginComponentProps,
} from './LoginComponent';
import { withAuth } from './withAuth';

interface PasswordProtectHOCOptions {
  /* @default /api/passwordCheck */
  checkApiUrl?: string;
  /* @default /api/login */
  loginApiUrl?: string;
  loginComponent?: ReactNode;
  loginComponentProps?: Omit<LoginComponentProps, 'apiUrl'>;
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
        const res = await fetch(options?.checkApiUrl || '/api/passwordCheck', {
          credentials: 'include',
        });

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
          isAuthenticated,
          {
            apiUrl: options?.loginApiUrl,
            ...(options?.loginComponentProps || {}),
          },
        )}
        pageProps={pageProps}
        {...props}
      />
    );
  };

  return ProtectedApp;
};
