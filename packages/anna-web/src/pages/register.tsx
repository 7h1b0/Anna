import React from 'react';
import { Form, Link, redirect } from 'react-router-dom';

import Input from 'components/input';
import Button from 'components/button';
import { setUser } from 'src/utils';

function Register() {
  return (
    <div className="w-full h-full bg-gray-900">
      <div className="max-w-sm m-auto py-8">
        <Form method="post" className="mt-16 flex flex-col gap-4">
          <Input name="username" label="Username" />
          <Input name="password" label="Password" type="password" />
          <Input
            name="confirmPassword"
            label="Confirm Password"
            type="password"
            // hasError={errors.confirmPassword !== undefined}
            // register={register('confirmPassword', {
            //   validate: (value) => value === getValues('password'),
            // })}
          />

          <div className="flex justify-between items-center text-gray-400">
            <Link to="/">Login</Link>
            <Button type="submit">Register</Button>
          </div>
        </Form>
      </div>
    </div>
  );
}

export const actionRegister = async ({ request }) => {
  const formData = await request.formData();
  const res = await fetch('/api/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username: formData.get('username'),
      password: formData.get('password'),
    }),
  });

  if (!res.ok) {
    return { ok: false };
  }

  const { username, token, isAway } = await res.json();

  setUser(username, token, isAway);

  return redirect('/');
};

export default Register;
