import { passwordProtectMiddleware } from '../../../../src';

export const middleware = passwordProtectMiddleware(
  process.env.STAGING_PASSWORD,
  {
    enabled: !!process.env.PASSWORD_PROTECT,
    loginComponentProps: {
      backUrl: 'https://github.com/storyofams/next-password-protect',
      logo: 'https://storyofams.com/public/story-of-ams-logo-big@2x.png',
    },
  },
);
