import React from 'react';

import { NextSeo } from 'next-seo';

const Home = () => {
  return (
    <>
      <NextSeo
        title="Next password protect"
        description="Next password protect example app"
      />
      <h1>Logged in page</h1>
    </>
  );
};

export default Home;
