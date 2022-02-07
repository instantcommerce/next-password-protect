import { logoutHandler } from '@storyofams/next-password-protect';

export default logoutHandler({
  cookieName: 'authorization',
});
