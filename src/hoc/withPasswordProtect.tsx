import React, { ElementType, useEffect, useState } from 'react';
import { useAmp } from 'next/amp';
import type { AppProps } from 'next/app';

import { Login as DefaultLoginComponent, LoginProps } from '../components';

interface PasswordProtectHOCOptions {
  /* @default /api/passwordCheck */
  checkApiUrl?: string;
  /* @default /api/login */
  loginApiUrl?: string;
  loginComponent?: ElementType;
  loginComponentProps?: Omit<LoginProps, 'apiUrl'>;
}

/// TODO: improve App typing
export const withPasswordProtect = (
  App: any,
  options?: PasswordProtectHOCOptions,
) => {
  const ProtectedApp = ({ Component, pageProps, ...props }: AppProps) => {
    const isAmp = useAmp();
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

    if (isAuthenticated === undefined) {
      return null;
    }

    if (isAuthenticated) {
      return <App Component={Component} pageProps={pageProps} {...props} />;
    }

    // AMP is not yet supported
    if (isAmp) {
      return null;
    }

    const LoginComponent: ElementType =
      options?.loginComponent || DefaultLoginComponent;

    return (
      <LoginComponent
        apiUrl={options?.loginApiUrl}
        {...(options?.loginComponentProps || {})}
      />
    );
  };

  return ProtectedApp;
};
