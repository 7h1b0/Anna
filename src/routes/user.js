const User = require('../modules/models/user');
const { cryptoUtil } = require('../modules/');

module.exports = app => {
  app.post('/register', (req, res) => {
    const isValid = User.validate(req.body);
    if (!isValid) {
      return res.sendStatus(400);
    }
    const { username, password } = req.body;
    Promise.all([cryptoUtil.random(36), cryptoUtil.hash(password)])
      .then(([token, hashedPassword]) => {
        return User.save({
          username,
          password: hashedPassword,
          token,
        });
      })
      .then(newUser => {
        return res.status(201).json(newUser);
      })
      .catch(err => {
        res.status(500).send({ err });
      });
  });

  app.post('/login', (req, res) => {
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
              const copyUser = {
                _id: findUser.user_id,
                username: findUser.username,
                token: findUser.token,
              };

              res.json(copyUser);
            })
            .catch(() => res.sendStatus(403));
        }
      })
      .catch(err => res.status(500).send({ err }));
  });

  app.get('/api/users', (req, res) => {
    User.findAll()
      .then(users => res.send(users))
      .catch(err => res.status(500).send({ err }));
  });

  app
    .route('/api/users/:id_user([0-9]+)')
    .patch((req, res) => {
      const isValid = User.validate(req.body);
      if (!isValid) {
        return res.sendStatus(400);
      }

      const { password } = req.body;
      cryptoUtil
        .hash(password)
        .then(hashedPassword =>
          User.findByIdAndUpdate(req.params.id_user, {
            password: hashedPassword,
          }),
        )
        .then(rowsAffected => {
          if (rowsAffected < 1) {
            res.sendStatus(404);
          } else {
            res.sendStatus(204);
          }
        })
        .catch(err => res.status(500).send({ err }));
    })
    .delete((req, res) => {
      User.delete(req.params.id_user)
        .then(user => {
          if (!user) {
            res.sendStatus(404);
          } else {
            res.sendStatus(204);
          }
        })
        .catch(err => res.status(500).send({ err }));
    });
};
