import React from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router';
import Loader from './components/loader';
import { router } from './router';

import './styles.css';

const container = document.getElementById('app');

if (container) {
  const root = createRoot(container);
  root.render(<RouterProvider router={router} fallbackElement={<Loader />} />);
}
