import { logoutHandler } from 'next-password-protect';

export default logoutHandler({
  cookieName: 'authorization',
});
