<p align="center">
  <a aria-label="Story of AMS logo" href="https://storyofams.com/" target="_blank" align="center">
    <img src="https://avatars.githubusercontent.com/u/19343504" alt="Story of AMS" width="100">
  </a>
  <h1 align="center">@storyofams/next-password-protect</h1>
  <p align="center">
    <a aria-label="releases" href="https://GitHub.com/storyofams/next-password-protect/releases/" target="_blank">
      <img src="https://github.com/storyofams/next-password-protect/workflows/Release/badge.svg">
    </a>
    <a aria-label="npm" href="https://www.npmjs.com/package/@storyofams/next-password-protect" target="_blank">
      <img src="https://img.shields.io/npm/v/@storyofams/next-password-protect">
    </a>
    <a aria-label="codecov" href="https://codecov.io/gh/storyofams/next-password-protect" target="_blank">
      <img src="https://codecov.io/gh/storyofams/next-password-protect/branch/master/graph/badge.svg?token=ZV0YT4HU5H">
    </a>
    <a aria-label="stars" href="https://github.com/storyofams/next-password-protect/stargazers/" target="_blank">
      <img src="https://img.shields.io/github/stars/storyofams/next-password-protect.svg?style=social&label=Star&maxAge=86400" />
    </a>
  </p>
  <p align="center">Password protect your Next.js deployments. <a href="http://next-password-protect.vercel.app/" target="_blank">View demo</a> (Password is <b>secret</b>)</p>
</p>

---

[![Preview](https://user-images.githubusercontent.com/19343479/110955791-3da56480-834a-11eb-9e7c-6b17621ba346.png)](https://user-images.githubusercontent.com/19343479/114987129-1a179180-9e95-11eb-9508-6c514f671ca9.mov)

## How it works

This library adds a password prompt to your Next.js deployment. It consists of two main parts:
1. Two serverless API routes:
   - A login route that checks if a password is correct and sets a cookie with a JWT in case it is.
   - A check route that validates if you have the authorization cookie with a valid JWT.
2. A HOC ([Higher-Order Component](https://reactjs.org/docs/higher-order-components.html)) that wraps Next.js App and adds a check that validates if you are logged in. If you do, then you can view the app normally; otherwise, you are presented with a password prompt.

**Important**: The recommended use case for this library is in a staging or preview environment. By taking advantage of webpack's `DefinePlugin`, we can make sure this library is only included in certain environments, keeping the production bundle size small.

**This library is NOT meant as a secure password authentication wrapper, but rather as a way to keep nosey people out.**

## Installation

```sh
yarn add @storyofams/next-password-protect
# or
npm install @storyofams/next-password-protect
```

## Usage

There are 3 steps to enabling password protect: setting a global variable, adding the API routes, and adding the HOC to \_app.

### Step 1

In order to be able to take advantage of dead code elimination, it is recommended to add an environment variable like `process.env.PASSWORD_PROTECT`, and enable the library based on that variable. To set this variable, add the following to `next.config.js`:

```javascript
module.exports = {
  env: {
    // Add any logic you want here, returning `true` to enable password protect.
    PASSWORD_PROTECT: process.env.ENVIRONMENT === 'staging',
  }
});
```

### Step 2

Add two api routes, one with the `loginHandler` and one with the `passwordCheckHandler` api function. You can name them anything, as long as you pass the names to `loginApiUrl` and `checkApiUrl` respectively, in the next step. By default it expects `/login` and `/passwordCheck`.

```javascript
import { loginHandler } from "@storyofams/next-password-protect";

export default loginHandler("YOUR_SECRET_PASSWORD", {
  // Options go here (optional)
  cookieName: "next-password-protect",
});
```

```javascript
import { passwordCheckHandler } from "@storyofams/next-password-protect";

export default passwordCheckHandler("YOUR_SECRET_PASSWORD", {
  // Options go here (optional)
  cookieName: "next-password-protect",
});
```

### Step 3

Add the `withPasswordProtect` HOC to the default export of `App` in `pages/_app.tsx`:

```javascript
import { withPasswordProtect } from "@storyofams/next-password-protect";

// Before: export default App;
export default process.env.PASSWORD_PROTECT
  ? withPasswordProtect(App, {
    // Options go here (optional)
    loginApiUrl: "/login",
  })
  : App;
```

**Note**: make sure to specify `loginApiUrl` and/or `checkApiUrl` if the api route(s) are not default.

## API

### API routes handlers
```loginHandler(password: string, options)```

The options object can contain any of the following options:

Option | Description | Default value
------ | ----------- | -------------
`cookieMaxAge`| Cookie Max-Age attribute | `undefined`
`cookieName`| The name of the authorization cookie | `'next-password-protect'`
`cookieSameSite`| SameSite cookie attribute | `false`
`cookieSecure`| Secure flag on the cookie | `process.env.NODE_ENV === 'production'`

```passwordCheckHandler(password: string, options)```

The options object can contain any of the following options:

Option | Description | Default value
------ | ----------- | -------------
`cookieName`| The name of the authorization cookie | `'next-password-protect'`


### Next App HOC
```withPasswordProtect(App: NextApp, options)```

The options object can contain any of the following options:

Option | Description | Default value
------ | ----------- | -------------
`checkApiUrl`| Relative path of the api route handled by `passwordCheckHandler` | `'/api/passwordCheck'`
`loginApiUrl`| Relative path of the api route handled by `loginHandler` | `'/api/login'`
`loginComponent`| Supply your own React component to show as login prompt | `LoginComponent`
`loginComponentProps`| Properties object to customize the login prompt, without overriding the entire component (see below) | `{}`
`bypassProtectionForRoute`| Bypass protection for specific routes, decided by callback with `NextRouter` param | `({ route }) => false`

The `loginComponentProps` object can contain any of the following options:

Option | Description | Default value
------ | ----------- | -------------
`backUrl`| Show a link with this URL to go back to main website | `undefined`
`buttonBackgroundColor`| Login button background color | `'#01EDBC'`
`buttonColor`| Login button color | `'#111'`
`logo` | Show a logo above the prompt (img src) | `undefined`

## Advanced

### Custom login component

To change the default login component, a React component can be supplied to the `withPasswordProtect` HOC. In order for the library to function properly, make sure your login component has password input that is validated by the the api route.
You can use `src/hoc/LoginComponent.tsx` as a starting point.

## Caveats

AMP is not yet supported, because the LoginComponent failed AMP validation. On an AMP page, nothing is rendered. This could be fixed by changing LoginComponent to valid AMP.
