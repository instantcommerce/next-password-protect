import React from 'react';
import { DefaultSeo } from 'next-seo';
import App from 'next/app';
import objectFitImages from 'object-fit-images';
import { ThemeProvider } from 'styled-components';

import { seo } from '~/config';
import theme from '~/styles/theme';

import '../../public/static/fonts/stylesheet.css';

class MyApp extends App {
  componentDidMount() {
    objectFitImages();
  }

  render() {
    const { Component, pageProps } = this.props;
    return (
      <ThemeProvider theme={theme}>
        <DefaultSeo {...seo} />

        <Component {...pageProps} />
      </ThemeProvider>
    );
  }
}

export default MyApp;
