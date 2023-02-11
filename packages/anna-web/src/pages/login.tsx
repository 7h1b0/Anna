import React from 'react';
import { useForm } from 'react-hook-form';
import { Form, Link, redirect, useActionData } from 'react-router-dom';

import Input from 'components/input';
import Button from 'components/button';
import Alert from 'components/alert';

type Error = {
  ok: boolean;
};
type LoginForm = {
  username: string;
  password: string;
};
function Login() {
  const { register } = useForm<LoginForm>();
  const errors = useActionData() as Error;

  return (
    <div className="w-full h-full bg-gray-900">
      <div className="max-w-sm m-auto py-8">
        <Form method="post" className="mt-16 flex flex-col gap-4">
          {errors && <Alert>Invalid credential</Alert>}
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
            <Link to="/register">Register</Link>
            <Button type="submit">Login</Button>
          </div>
        </Form>
      </div>
    </div>
  );
}

export const actionLogin = async ({ request }) => {
  const data = Object.fromEntries(await request.formData());
  const res = await fetch('/api/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    return { ok: false };
  }

  const { username, token } = await res.json();

  localStorage.setItem('username', username || '');
  localStorage.setItem('token', token || '');

  return redirect('/');
};

export default Login;
