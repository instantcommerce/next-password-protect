import React from 'react';
import { useAmp } from 'next/amp';

export const withAuth = (
  WrappedComponent,
  LoginComponent,
  pageProps,
  apiPath: string,
) => {
  const Component = (props) => {
    const isAmp = useAmp();

    if (pageProps.__isAuthenticated) {
      return <WrappedComponent {...props} />;
    }

    // AMP is not yet supported
    if (isAmp) {
      return null;
    }

    return <LoginComponent apiPath={apiPath} />;
  };

  return Component;
};
