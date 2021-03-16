import React from 'react';
import {
  act,
  render,
  cleanup,
  screen,
  waitFor,
  fireEvent,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { rest } from 'msw';
import { setupServer } from 'msw/node';

import { LoginComponent } from '../LoginComponent';

const server = setupServer();

describe('[hoc] LoginComponent', () => {
  beforeAll(() => server.listen());
  afterEach(() => {
    server.resetHandlers();
    cleanup();
    jest.restoreAllMocks();
  });
  afterAll(() => server.close());

  it('should reload on successful login', async () => {
    server.use(
      rest.post('http://localhost/api/login', async (req, res, ctx) => {
        return res(ctx.status(200), ctx.json({}));
      }),
    );

    const reloadMock = jest.fn();
    delete window.location;
    window.location = { ...window.location, reload: reloadMock };

    render(<LoginComponent apiUrl="http://localhost/api/login" />);

    act(() => {
      userEvent.click(screen.getByRole('button'));
    });

    await waitFor(() => expect(reloadMock).toBeCalled());
  });

  it('should show error state on failed login', async () => {
    server.use(
      rest.post('http://localhost/api/login', async (req, res, ctx) => {
        return res(
          ctx.status(400),
          ctx.json({ message: 'Incorrect password' }),
        );
      }),
    );

    render(<LoginComponent apiUrl="http://localhost/api/login" />);

    act(() => {
      userEvent.click(screen.getByRole('button'));
    });

    await waitFor(() =>
      expect(screen.getByLabelText('Password')).toHaveClass('invalid'),
    );

    expect(screen.getByTestId('error')).toHaveTextContent('Incorrect password');
  });

  it('should show error state on error', async () => {
    server.use(
      rest.post('/api/login', async (req, res, ctx) => {
        return res(ctx.status(500));
      }),
    );

    render(<LoginComponent />);

    act(() => {
      userEvent.click(screen.getByRole('button'));
    });

    await waitFor(() =>
      expect(screen.getByLabelText('Password')).toHaveClass('invalid'),
    );

    expect(screen.getByTestId('error')).toHaveTextContent(
      'An error has occured.',
    );
  });

  it('should not check if already checking', async () => {
    server.use(
      rest.post('http://localhost/api/login', async (req, res, ctx) => {
        return res(ctx.status(500), ctx.json({}));
      }),
    );

    const fetchMock = jest.fn(() => new Promise(() => {}));
    jest.spyOn(global, 'fetch').mockImplementation(fetchMock as any);

    render(<LoginComponent apiUrl="http://localhost/api/login" />);

    await act(async () => {
      await fireEvent.submit(screen.getByTestId('form'));
      await fireEvent.submit(screen.getByTestId('form'));
      await fireEvent.submit(screen.getByTestId('form'));
      await fireEvent.submit(screen.getByTestId('form'));
    });

    expect(fetchMock).toBeCalledTimes(1);
  });

  it('should show logo if set', async () => {
    act(() => {
      render(<LoginComponent logo="/image-src" />);
    });

    expect(screen.getByAltText('Logo')).toHaveAttribute('src', '/image-src');
  });

  it('should show back link if set', async () => {
    act(() => {
      render(<LoginComponent logo="/image-src" backUrl="https://google.com" />);
    });

    expect(screen.getByText('← Back to main website')).toHaveAttribute(
      'href',
      'https://google.com',
    );
    expect(screen.getByAltText('Logo').closest('a')).toHaveAttribute(
      'href',
      'https://google.com',
    );
  });
});
