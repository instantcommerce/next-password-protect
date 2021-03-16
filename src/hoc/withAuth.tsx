import React from 'react';
import { useAmp } from 'next/amp';

import { LoginComponentProps } from './LoginComponent';

export const withAuth = (
  WrappedComponent,
  LoginComponent,
  pageProps,
  isAuthenticated: boolean,
  loginComponentProps: LoginComponentProps,
) => {
  const Component = (props) => {
    const isAmp = useAmp();

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

    return <LoginComponent {...loginComponentProps} />;
  };

  return Component;
};
