import { Router } from 'express';
import * as User from 'modules/models/user';
import * as cryptoUtil from 'modules/cryptoUtil';

const routes = Router();

routes.post('/api/register', (req, res) => {
  const isValid = User.validate(req.body);
  if (!isValid) {
    return res.sendStatus(400);
  }
  const { username, password } = req.body;

  const createUser = async () => {
    const [token, hashedPassword] = await Promise.all([
      cryptoUtil.random(36),
      cryptoUtil.hash(password),
    ]);
    const userId = await User.save({
      username,
      password: hashedPassword,
      token,
    });
    return { userId, token, username };
  };

  createUser()
    .then(user => res.status(201).json(user))
    .catch(err => res.status(500).send({ err }));
});

routes.post('/api/login', (req, res) => {
  const isValid = User.validate(req.body);
  if (!isValid) {
    return res.sendStatus(400);
  }
  const { username, password } = req.body;
  User.findByUsername(username)
    .then(findUser => {
      if (!findUser) {
        res.sendStatus(403);
      } else {
        cryptoUtil
          .verify(password, findUser.password)
          .then(isValid => {
            if (!isValid) {
              throw new Error('Wrong password');
            }

            res.json({
              token: findUser.token,
            });
          })
          .catch(() => res.sendStatus(403));
      }
    })
    .catch(err => res.status(500).send({ err }));
});

export default routes;
