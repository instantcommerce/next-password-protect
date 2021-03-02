import React from 'react';

export const withAuth = (
  WrappedComponent,
  LoginComponent,
  pageProps,
  apiPath: string,
) => {
  const Component = (props) => {
    if (pageProps.__isAuthenticated) {
      return <WrappedComponent {...props} />;
    }

    return <LoginComponent apiPath={apiPath} />;
  };

  return Component;
};
