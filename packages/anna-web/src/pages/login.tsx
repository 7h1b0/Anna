import React from 'react';

import Input from 'components/input';
import Button from 'components/button';
import Alert from 'components/alert';

import { useSetUser } from 'context/user-context';

type Identifier = {
  username: string;
  password: string;
};

function reducer(state: Identifier, action: Partial<Identifier>): Identifier {
  return Object.assign({}, state, action);
}

const Login: React.FC<{}> = () => {
  const setUser = useSetUser();
  const [identifier, setIdentifer] = React.useReducer(reducer, {
    username: '',
    password: '',
  });
  const [error, hasError] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(identifier),
      }).then((res) => res.json());

      setUser({ username: identifier.username, token: result.token });
    } catch (err) {
      hasError(true);
    }
  };

  return (
    <div className="w-full h-full bg-gray-900">
      <div className="max-w-sm m-auto py-8">
        <form onSubmit={handleSubmit} className="mt-16">
          {error && <Alert>Invalid credential</Alert>}
          <Input
            name="username"
            label="Username"
            value={identifier.username}
            onChange={(e) => setIdentifer({ [e.target.name]: e.target.value })}
          />
          <Input
            name="password"
            label="Password"
            type="password"
            value={identifier.password}
            onChange={(e) => setIdentifer({ [e.target.name]: e.target.value })}
          />
          <Button type="submit">Submit</Button>
        </form>
      </div>
    </div>
  );
};

export default Login;
