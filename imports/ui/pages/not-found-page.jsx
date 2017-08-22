import React from 'react';
import DefaultLayout from '../layouts/default/default-layout.jsx';

const NotFoundPage = () => (
  <DefaultLayout width="600px" padding="20px 15px 0" centered>
    <h1 className="center">404 - Page Not Found</h1>
    <p className="center">Back to <a href="/home">Home</a></p>
  </DefaultLayout>
);

export default NotFoundPage;
