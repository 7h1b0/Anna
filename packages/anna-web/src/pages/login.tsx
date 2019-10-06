import React from 'react';

import Header from 'components/header';
import Input from 'components/input';

import { useSetUser } from 'context/user-context';

const Login: React.FC<{}> = () => {
  const setUser = useSetUser();

  const [username, setUsername] = React.useState<string>('');
  const [password, setPassword] = React.useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    }).then(res => res.json());

    setUser({ username, token: result.token });
  };

  return (
    <>
      <Header title="Login" />
      <form onSubmit={handleSubmit}>
        <Input
          name="login"
          label="login"
          value={username}
          onChange={e => setUsername(e.target.value)}
        />
        <Input
          name="password"
          label="password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <button type="submit">Submit</button>
      </form>
    </>
  );
};

export default Login;
