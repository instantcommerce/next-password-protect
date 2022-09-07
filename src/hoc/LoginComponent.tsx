import React, { useState } from 'react';

export interface LoginComponentProps {
  apiUrl?: string;
  backUrl?: string;
  /* @default #FBCC26 */
  buttonBackgroundColor?: string;
  /* @default #111 */
  buttonColor?: string;
  logo?: string;
}

export const LoginComponent = ({
  apiUrl,
  backUrl,
  buttonBackgroundColor,
  buttonColor,
  logo,
}: LoginComponentProps) => {
  const [isBusy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isBusy) {
      return;
    }

    setBusy(true);
    setError('');

    try {
      const form = document.querySelector(
        '#password-form form',
      ) as HTMLFormElement;

      const formData = new FormData(form);

      const res = await fetch(apiUrl || `/api/login`, {
        method: 'post',
        credentials: 'include',
        body: JSON.stringify({ password: formData.get('password') }),
        headers: { 'Content-Type': 'application/json' },
      });

      const { message } = await res.json();

      if (res.status === 200) {
        window.location.reload();
      } else {
        setError(message);
        setBusy(false);
      }
    } catch (e) {
      setError('An error has occured.');
      setBusy(false);
    }

    return false;
  };

  const image = !!logo && (
    <img
      width="130"
      height="auto"
      src={logo}
      alt="Logo"
      style={{ marginBottom: '40px' }}
    />
  );

  return (
    <div
      style={{
        backgroundColor: '#fff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        maxWidth: '100vw',
        minHeight: '100vh',
        width: '100%',
        overflowX: 'hidden',
      }}
    >
      <div
        style={{
          maxWidth: '100%',
          display: 'flex',
          flex: 1,
          width: '100%',
          padding: '32px 16px',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <style
          dangerouslySetInnerHTML={{
            __html: `
            html {
              font-family: ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,"Apple Color Emoji","Segoe UI Emoji",Segoe UI Symbol,"Noto Color Emoji";
            }

            body {
              margin: 0;
            }

            * {
              box-sizing: border-box;
            }

            .link {
              font-style: normal;
              text-decoration: none;
              color: #666;
              transition: color 0.2s ease-out;
            }

            .link:hover, .link:focus {
              color: #111;
            }

            #password-form {
              padding: 40px;
            }

            @media (max-width: 767px) {
              #password-form {
                padding: 32px 16px;
              }
            }

            #password-form .invalid {
              outline: auto 1px;
              outline-color: #DD4A4A;
              animation: shake .4s linear;
            }

            #password-form .error {
              color: #DD4A4A;
              margin-top: 12px;
              font-size: 18px;
            }

            @keyframes shake {
              8%, 41% {
                transform: translateX(-10px);
              }
              25%, 58% {
                transform: translateX(10px);
              }
              75% {
                transform: translateX(-5px);
              }
              92% {
                transform: translateX(5px);
              }
              0%, 100% {
                transform: translateX(0);
              }
            }
          `,
          }}
        />

        {!!image && <>{backUrl ? <a href={backUrl}>{image}</a> : image}</>}
        <div
          id="password-form"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'flex-start',
            boxShadow: '0px 15px 40px rgba(26, 30, 43, 0.13)',
            borderRadius: '8px',
            width: '420px',
            maxWidth: '100%',
            marginBottom: '48px',
          }}
        >
          <h1 style={{ margin: '0 0 24px', color: '#111' }}>Login</h1>
          <form
            data-testid="form"
            onSubmit={onSubmit}
            style={{
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
            }}
          >
            <label
              htmlFor="password"
              style={{
                color: '#525252',
                fontSize: '18px',
                marginBottom: '8px',
              }}
            >
              Password
            </label>
            <input
              className={error ? 'invalid' : ''}
              name="password"
              type="password"
              id="password"
              placeholder="Enter password..."
              required
              style={{
                background: '#F5F5F5',
                borderRadius: '4px',
                padding: '0 16px',
                fontSize: '18px',
                color: '#525252',
                border: 'none',
                height: '48px',
              }}
            />
            {!!error && (
              <div className="error" data-testid="error">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isBusy}
              style={{
                appearance: 'none',
                background: buttonBackgroundColor || '#FBCC26',
                borderRadius: '52px',
                border: 'none',
                padding: '12px 32px',
                fontSize: '20px',
                color: buttonColor || '#111',
                marginTop: '32px',
                cursor: 'pointer',
                textAlign: 'center',
              }}
            >
              {isBusy ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>
        {!!backUrl && (
          <a href={backUrl} className="link">
            ← Back to main website
          </a>
        )}
      </div>
    </div>
  );
};
