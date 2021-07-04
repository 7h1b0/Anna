import React from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';

import Input from 'components/input';
import Button from 'components/button';

import { useSetUser } from 'context/user-context';

type RegisterForm = {
  username: string;
  password: string;
  confirmPassword: string;
};
function Register() {
  const { register, handleSubmit, getValues, formState } =
    useForm<RegisterForm>({ mode: 'onBlur' });
  const setUser = useSetUser();

  async function onSubmit(data: RegisterForm) {
    const payload = {
      username: data.username,
      password: data.password,
    };
    try {
      const result = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      }).then((res) => res.json());

      setUser({ username: data.username, token: result.token });
    } catch (err) {
      console.error(err);
    }
  }
  const { errors } = formState;

  return (
    <div className="w-full h-full bg-gray-900">
      <div className="max-w-sm m-auto py-8">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-16 flex flex-col gap-4"
        >
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
          <Input
            name="confirmPassword"
            label="Confirm Password"
            type="password"
            hasError={errors.confirmPassword !== undefined}
            register={register('confirmPassword', {
              validate: (value) => value === getValues('password'),
            })}
          />

          <div className="flex justify-between items-center text-gray-400">
            <Link to="/login">Login</Link>
            <Button type="submit">Register</Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;
