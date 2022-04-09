import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './app';

import { UserProvider } from 'src/context/user-context';

const container = document.getElementById('app');

if (container) {
  const root = createRoot(container);
  root.render(
    <UserProvider>
      <App />
    </UserProvider>,
  );
}
