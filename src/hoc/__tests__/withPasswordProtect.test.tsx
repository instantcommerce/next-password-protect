import React from 'react';
import { act, render, cleanup, screen, waitFor } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import * as hooks from 'next/amp';

import * as nextRouter from 'next/router';
import { withPasswordProtect } from '../withPasswordProtect';

const App = ({ Component }) => <Component />;

const server = setupServer();

describe('[hoc] withPasswordProtect', () => {
  beforeAll(() => server.listen());
  afterEach(() => {
    server.resetHandlers();
    cleanup();
    jest.restoreAllMocks();
  });
  afterAll(() => server.close());

  it('should render normally if logged in', async () => {
    server.use(
      rest.get('http://localhost/api/check', async (req, res, ctx) => {
        return res(ctx.status(200));
      }),
    );

    const Wrapped = withPasswordProtect(App, {
      checkApiUrl: 'http://localhost/api/check',
    });

    await act(async () => {
      render(
        <Wrapped
          Component={() => <div>hidden</div>}
          pageProps={{}}
          router={{} as any}
        />,
      );
    });

    await waitFor(() => {
      expect(screen.getByText('hidden')).toBeInTheDocument();
    });
  });

  it('should render login if logged out', async () => {
    server.use(
      rest.get('http://localhost/api/check', async (req, res, ctx) => {
        return res(ctx.status(401));
      }),
    );

    const Wrapped = withPasswordProtect(App, {
      checkApiUrl: 'http://localhost/api/check',
    });

    await act(async () => {
      render(
        <Wrapped
          Component={() => <div>hidden</div>}
          pageProps={{}}
          router={{} as any}
        />,
      );
    });

    await waitFor(() => {
      expect(screen.getByText('Password')).toBeInTheDocument();
    });
  });

  it('should allow setting check api url', async () => {
    server.use(
      rest.get('http://localhost/api/check', async (req, res, ctx) => {
        return res(ctx.status(200));
      }),
    );

    const Wrapped = withPasswordProtect(App);

    await act(async () => {
      render(
        <Wrapped
          Component={() => <div>hidden</div>}
          pageProps={{}}
          router={{} as any}
        />,
      );
    });

    await waitFor(() => {
      expect(screen.getByText('Password')).toBeInTheDocument();
    });
  });

  it('should render nothing if logged out and amp', async () => {
    server.use(
      rest.get('http://localhost/api/check', async (req, res, ctx) => {
        return res(ctx.status(401));
      }),
    );

    jest.spyOn(hooks, 'useAmp').mockImplementation(() => true);

    const Wrapped = withPasswordProtect(App, {
      checkApiUrl: 'http://localhost/api/check',
    });

    let container;

    await act(async () => {
      container = render(
        <Wrapped
          Component={() => <div>hidden</div>}
          pageProps={{}}
          router={{} as any}
        />,
      ).container;
    });

    await waitFor(() => {
      expect(screen.queryByText('Password')).not.toBeInTheDocument();
      expect(screen.queryByText('hidden')).not.toBeInTheDocument();
      expect(container.firstChild).toBeNull();
    });
  });

  it('should render login if error', async () => {
    jest.spyOn(global, 'fetch').mockImplementation(() => {
      throw new Error();
    });

    const Wrapped = withPasswordProtect(App, {
      checkApiUrl: 'http://localhost/api/check',
    });

    await act(async () => {
      render(
        <Wrapped
          Component={() => <div>hidden</div>}
          pageProps={{}}
          router={{} as any}
        />,
      );
    });

    await waitFor(() => {
      expect(screen.getByText('Password')).toBeInTheDocument();
    });
  });

  it('should be able to bypass protection for specified routes', async () => {
    const Wrapped = withPasswordProtect(App, {
      bypassProtectionForRoute: ({ route }) => route === '/bypassed',
    });

    // ORDINARY PAGE
    jest.spyOn(require('next/router'), 'useRouter').mockImplementation(() => ({
      route: '/',
    }));

    await act(async () => {
      render(
        <Wrapped
          Component={() => <div>hidden</div>}
          pageProps={{}}
          router={
            {
              route: '/bypassed',
            } as nextRouter.Router
          }
        />,
      );
    });

    await waitFor(() => {
      expect(screen.getByText('Password')).toBeInTheDocument();
    });

    // BYPASSED PAGE
    jest.spyOn(require('next/router'), 'useRouter').mockImplementation(() => ({
      route: '/bypassed',
    }));

    await act(async () => {
      render(
        <Wrapped
          Component={() => <div>hidden</div>}
          pageProps={{}}
          router={{} as any}
        />,
      );
    });

    await waitFor(() => {
      expect(screen.getByText('hidden')).toBeInTheDocument();
    });
  });
});
