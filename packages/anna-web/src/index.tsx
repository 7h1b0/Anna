import React from 'react';
import ReactDOM from 'react-dom';
import App from './app';

import { UserProvider } from 'src/context/user-context';
import { DatabaseProvider } from 'src/context/db-context';

ReactDOM.render(
  <UserProvider>
    <DatabaseProvider>
      <App />
    </DatabaseProvider>
  </UserProvider>,
  document.getElementById('app'),
);
