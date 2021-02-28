import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';

import { useUser } from 'context/user-context';
import AuthenticateApp from './authenticated-app';

import Login from 'pages/login';
import Register from 'pages/register';

function App() {
  const user = useUser();

  if (user && user.token) {
    return <AuthenticateApp />;
  }
  return (
    <Router>
      <Switch>
        <Route path="/login">
          <Login />
        </Route>
        <Route path="/register">
          <Register />
        </Route>
        <Redirect to="/login" />
      </Switch>
    </Router>
  );
}

export default App;
