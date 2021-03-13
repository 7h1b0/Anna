import React from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';

import Input from 'components/input';
import Button from 'components/button';
import Alert from 'components/alert';

import { useSetUser } from 'context/user-context';

type LoginForm = {
  username: string;
  password: string;
};
function Login() {
  const { register, handleSubmit } = useForm<LoginForm>();
  const [error, hasError] = React.useState(false);
  const setUser = useSetUser();

  async function onSubmit(data: LoginForm) {
    try {
      const result = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      }).then((res) => res.json());

      setUser({ username: data.username, token: result.token });
    } catch (err) {
      hasError(true);
    }
  }

  return (
    <div className="w-full h-full bg-gray-900">
      <div className="max-w-sm m-auto py-8">
        <form onSubmit={handleSubmit(onSubmit)} className="mt-16">
          {error && <Alert>Invalid credential</Alert>}
          <Input
            name="username"
            label="Username"
            register={register('username')}
          />
          <Input
            name="password"
            label="Password"
            type="password"
            register={register('password')}
          />
          <div className="flex justify-between items-center text-gray-400">
            <Button type="submit">Login</Button>
            <Link to="/register">Register</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
