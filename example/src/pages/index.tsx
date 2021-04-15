import React from 'react';

import { NextSeo } from 'next-seo';

const Home = () => {
  const clearCookie = async () => {
    await fetch('/api/logout', {
      method: 'post',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    });
    window.location.reload();
  };

  return (
    <>
      <NextSeo
        title="Next password protect"
        description="Next password protect example app"
      />
      <h1>Logged in page</h1>
      <button onClick={clearCookie}>Logout</button>
    </>
  );
};

export default Home;
