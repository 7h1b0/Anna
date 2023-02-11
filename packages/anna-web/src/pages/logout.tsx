import React from 'react';
import { redirect } from 'react-router-dom';

function Logout() {
  return null;
}

export default Logout;

export const loaderLogout = () => {
  localStorage.setItem('username', '');
  localStorage.setItem('token', '');
  return redirect('/login');
};
