import { redirect } from 'react-router-dom';
import { setUser } from 'src/utils';

export const loaderLogout = () => {
  setUser('', '', false);
  return redirect('/login');
};
