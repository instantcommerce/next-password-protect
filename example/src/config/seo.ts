const siteTitle = 'Boilerplate';

const defaultSeo = {
  openGraph: {
    type: 'website',
    locale: 'en_IE',
    url: 'https://www.Boilerplate.com/',
    site_name: siteTitle,
  },
  twitter: {
    handle: '@Boilerplate',
    cardType: 'summary_large_image',
  },
  titleTemplate: `%s | ${siteTitle}`,
};

if (process.env.NODE_ENV === 'development') {
  defaultSeo.titleTemplate = `%s | dev-${siteTitle}`;
}

export default defaultSeo;
