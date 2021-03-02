import { passwordProtectHandler } from '@storyofams/next-password-protect';

export default passwordProtectHandler(process.env.STAGING_PASSWORD, {
  cookieName: 'authorization',
});
