import { Router } from 'express';
import * as User from '../../modules/user/model';
import * as cryptoUtil from '../../utils/cryptoUtil';

const routes = Router();

routes.get('/api/users', (req, res) => {
  User.findAll()
    .then((users) => res.json(users))
    .catch((err) => res.status(500).send({ err }));
});

routes
  .route('/api/users/:id_user([a-fA-F0-9-]{36})')
  .patch((req, res) => {
    const isValid = User.validate(req.body);
    if (!isValid) {
      return res.sendStatus(400);
    }

    const { password } = req.body;
    cryptoUtil
      .hash(password)
      .then((hashedPassword) =>
        User.findByIdAndUpdate(req.params.id_user, {
          password: hashedPassword,
        }),
      )
      .then(() => res.sendStatus(204))
      .catch((err) => res.status(500).send({ err }));
  })
  .delete((req, res) => {
    User.remove(req.params.id_user)
      .then(() => res.sendStatus(204))
      .catch((err: Error) => res.status(500).send({ err }));
  });

export default routes;
