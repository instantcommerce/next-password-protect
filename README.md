<p align="center">
  <a href="https://storyofams.com/" target="_blank" align="center">
    <img src="https://storyofams.com/public/story-of-ams-logo-small@3x.png" alt="Story of AMS" width="120">
  </a>
  <h1 align="center">@storyofams/next-password-protect</h1>
</p>

Password protect your Next.js deployments.

## How it works

This library adds a password prompt to your Next.js deployment. It consists of two main parts:
1. A serverless API route that checks if a password is correct and sets a cookie in case it is. The value of the cookie is the password base64 encoded.
2. A HOC ([Higher-Order Component](https://reactjs.org/docs/higher-order-components.html)) that wraps Next.js App and adds a `getInitialProps` check that validates if you have the authorization cookie with the correct password. If you do, then you can view the app normally; otherwise, you are presented with a password prompt.

**Important**: Because this library adds `getInitialProps` to `App`, [Automatic Static Optimization](https://nextjs.org/docs/advanced-features/automatic-static-optimization) is disabled, and server side processing is required for every request.

For this reason the recommended use case for this library is in a staging or preview environment. By taking advantage of webpack's `DefinePlugin`, we can make sure this library is only included in certain environments, so the production deployment can still enjoy all the performance benefits that Next.js brings.

**This library is NOT meant as a secure password authentication wrapper, but rather as a way to keep nosey people out.**

## Installation

```sh
yarn add @storyofams/next-password-protect
# or
npm install @storyofams/next-password-protect
```

## Usage

There are 3 steps to enabling password protect: setting a global variable, adding the API route, and adding the HOC to \_app.

### Step 1

In order to be able to take advantage of dead code elimination, this library must be enabled using a global variable: `process.env.PASSWORD_PROTECT`.

To set this variable, add the following to `next.config.js`:

```javascript
const webpack = require('webpack');

module.exports = {
  webpack(config) {
    config.plugins.push(
      new webpack.DefinePlugin({
        'process.env.PASSWORD_PROTECT': JSON.stringify(
          // Add any logic you want here,
          // returning `true` to enable password protect.
          process.env.ENVIRONMENT === 'staging',
        ),
      }),
    );

    return config;
  },
});
```

### Step 2

Add an api route with the `passwordProtectHandler` api function. You can name it anything, as long as you pass the name to `apiPath` in the next step. By default it expects `/login`.

```javascript
import { passwordProtectHandler } from "@storyofams/next-password-protect";

export default passwordProtectHandler("YOUR_SECRET_PASSWORD", {
  // Options go here (optional)
  cookieName: "next-password-protect",
});
```

### Step 3

Add the `withPasswordProtect` HOC to the default export of `App` in `pages/_app.tsx`:

```javascript
import { withPasswordProtect } from "@storyofams/next-password-protect";

// Before: export default App;
export default withPasswordProtect(App, "YOUR_SECRET_PASSWORD", {
  // Options go here (optional)
  apiPath: "/login",
  cookieName: "next-password-protect",
});
```

**Note**: make sure to specify `apiPath` if the api route is not at `/login`!

## API

### API route handler
```passwordProtectHandler(password: string, options)```

The options object can contain any of the following options:

Option | Description | Default value
------ | ----------- | -------------
`cookieName`| The name of the authorization cookie | `'next-password-protect'`


### Next App HOC
```withPasswordProtect(App: NextApp, password: string, options)```

The options object can contain any of the following options:

Option | Description | Default value
------ | ----------- | -------------
`apiPath`| Relative path of the api route handled by `passwordProtectHandler` | `'/login'`
`cookieName`| The name of the authorization cookie | `'next-password-protect'`
`loginComponent`| Supply your own React component to show as login prompt | `LoginComponent`

## Advanced

### Custom login component

To change the default login component, a React component can be supplied to the `withPasswordProtect` HOC. In order for the library to function properly, make sure your login component has password input that is validated by the the api route.
You can use `src/hoc/LoginComponent.tsx` as a starting point.
