import React, { useEffect, useState } from 'react';
import { useAmp } from 'next/amp';

export const withAuth = (
  WrappedComponent,
  LoginComponent,
  pageProps,
  loginApiPath: string,
  checkApiPath: string,
) => {
  const Component = (props) => {
    const isAmp = useAmp();
    const [isAuthenticated, setAuthenticated] = useState<undefined | boolean>(
      undefined,
    );

    const checkIfLoggedIn = async () => {
      try {
        const res = await fetch(`/api${checkApiPath}`);

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
      return <WrappedComponent {...props} {...pageProps} />;
    }

    // AMP is not yet supported
    if (isAmp) {
      return null;
    }

    return <LoginComponent apiPath={loginApiPath} />;
  };

  return Component;
};
