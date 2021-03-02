<p align="center">
  <a href="https://storyofams.com/" target="_blank" align="center">
    <img src="https://storyofams.com/public/story-of-ams-logo-small@3x.png" alt="Story of AMS" width="120">
  </a>
  <h1 align="center">@storyofams/next-password-protect</h1>
</p>

Password protect your Next.js deployments.

## Installation

```sh
yarn add @storyofams/next-password-protect
# or
npm install @storyofams/next-password-protect
```

## Usage

There are 3 steps to enabling password protect: setting a global variable, adding the API route, and adding the HOC to \_app.

### Step 1

In order to be able to take advantage of dead code elimination, this library must be enabled using a global variable: `PASSWORD_PROTECT`.

To set this variable, add the following to `next.config.js`:

```javascript
const webpack = require('webpack');

module.exports = {
  webpack(config) {
    config.plugins.push(
      new webpack.DefinePlugin({
        PASSWORD_PROTECT: JSON.stringify(
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

export default passwordProtectHandler({
  // Options go here (optional)
  cookieName: "authorization",
});
```

### Step 3

Add the `withPasswordProtect` HOC to the default export of `App` in `pages/_app.tsx`:

```javascript
import { withPasswordProtect } from "@storyofams/next-password-protect";

// Before: export default App;
export default withPasswordProtect(App, "password", {
  // Options go here (optional)
  apiPath: "/login",
  cookieName: "authorization",
});
```

_Note_: make sure to specify `apiPath` if the api route is not at `/login`!
