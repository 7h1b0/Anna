import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

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
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
