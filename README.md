<p align="center">
  <a href="https://storyofams.com/" target="_blank" align="center">
    <img src="https://storyofams.com/public/story-of-ams-logo-small@3x.png" alt="Story of AMS" width="120">
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
  <p align="center">Password protect your Next.js deployments.</p>
</p>

---

[![Preview](https://user-images.githubusercontent.com/19343479/110955791-3da56480-834a-11eb-9e7c-6b17621ba346.png)](https://user-images.githubusercontent.com/19343479/110955308-c079ef80-8349-11eb-926e-12d1fce1d32f.mov)

## How it works

This library adds a password prompt to your Next.js deployment. It consists of two main parts:
1. Two serverless API routes:
   - A login route that checks if a password is correct and sets a cookie in case it is. The value of the cookie is the password base64 encoded.
   - A check route that validates if you have the authorization cookie with the correct password.
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

Add two api routes, one with the `loginHandler` and one with the `passwordCheckHandler` api function. You can name them anything, as long as you pass the names to `loginApiPath` and `checkApiPath` respectively, in the next step. By default it expects `/login` and `/passwordCheck`.

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
    loginApiPath: "/login",
    cookieName: "next-password-protect",
  })
  : App;
```

**Note**: make sure to specify `loginApiPath` and/or `loginApiPath` if the api route(s) are not default.

## API

### API routes handlers
```loginHandler(password: string, options)```

The options object can contain any of the following options:

Option | Description | Default value
------ | ----------- | -------------
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
`cookieName`| The name of the authorization cookie | `'next-password-protect'`
`checkApiPath`| Relative path of the api route handled by `passwordCheckHandler` | `'/passwordCheck'`
`loginApiPath`| Relative path of the api route handled by `loginHandler` | `'/login'`
`loginComponent`| Supply your own React component to show as login prompt | `LoginComponent`

## Advanced

### Custom login component

To change the default login component, a React component can be supplied to the `withPasswordProtect` HOC. In order for the library to function properly, make sure your login component has password input that is validated by the the api route.
You can use `src/hoc/LoginComponent.tsx` as a starting point.

## Caveats

AMP is not yet supported, because the LoginComponent failed AMP validation. On an AMP page, nothing is rendered. This could be fixed by changing LoginComponent to valid AMP.
