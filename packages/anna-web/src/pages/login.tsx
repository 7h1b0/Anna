import React from 'react';
import { Form, Link, redirect, useActionData } from 'react-router-dom';

import Input from 'components/input';
import Button from 'components/button';
import Alert from 'components/alert';
import { setUser } from 'src/utils';

type Error = {
  ok: boolean;
};

function Login() {
  const errors = useActionData() as Error;

  return (
    <div className="w-full h-full bg-gray-900">
      <div className="max-w-sm m-auto py-8">
        <Form method="post" className="mt-16 flex flex-col gap-4">
          {errors && <Alert>Invalid credential</Alert>}
          <Input name="username" label="Username" />
          <Input name="password" label="Password" type="password" />
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

  const { username, token, isAway } = await res.json();

  setUser(username, token, isAway);

  return redirect('/');
};

export default Login;
