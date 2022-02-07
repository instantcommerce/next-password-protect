import { passwordProtectMiddleware } from '../../../../src/middleware';

export const middleware = passwordProtectMiddleware(
  process.env.STAGING_PASSWORD,
  {
    enabled: !!process.env.PASSWORD_PROTECT,
    cookieName: 'authorization',
    loginHtmlOptions: {
      backUrl: 'https://github.com/storyofams/next-password-protect',
      logo: 'https://storyofams.com/public/story-of-ams-logo-big@2x.png',
    },
  },
);
