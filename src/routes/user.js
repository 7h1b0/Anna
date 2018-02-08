const User = require('../modules/models/user');
const { cryptoUtil } = require('../modules/');

module.exports = app => {
  app.post('/register', (req, res) => {
    const isValid = User.validate(req.body);
    if (!isValid) {
      res.sendStatus(400);
    } else {
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
          console.log(newUser);
          return res.status(201).send(newUser);
        })
        .catch(err => {
          console.log(err);
          res.status(500).send({ err });
        });
    }
  });

  app.post('/login', (req, res) => {
    const isValid = User.validate(req.body);
    if (!isValid) {
      res.sendStatus(400);
    } else {
      const { username, password } = req.body;
      User.findByUsername(username)
        .then(findUser => {
          if (!findUser) {
            res.sendStatus(400);
          } else {
            cryptoUtil
              .verify(password, findUser.password)
              .then(() => {
                const copyUser = {
                  _id: findUser.user_id,
                  username: findUser.username,
                  token: findUser.token,
                };

                res.send(copyUser);
              })
              .catch(() => res.sendStatus(400));
          }
        })
        .catch(err => res.status(500).send({ err }));
    }
  });

  app.get('/api/users', (req, res) => {
    User.findAll()
      .then(users => res.send(users))
      .catch(err => res.status(500).send({ err }));
  });

  app
    .route('/api/users/:id_user([0-9]+)')
    .put((req, res) => {
      const isValid = User.validate(req.body);
      if (!isValid) {
        res.sendStatus(400);
      } else {
        const { password } = req.body;
        cryptoUtil
          .hash(password)
          .then(hashedPassword =>
            User.findByIdAndUpdate(req.params.id_user, {
              password: hashedPassword,
            }),
          )
          .then(findUser => {
            if (!findUser) {
              res.sendStatus(404);
            } else {
              res.sendStatus(204);
            }
          })
          .catch(err => res.status(500).send({ err }));
      }
    })
    .delete((req, res) => {
      User.delete(req.params.id_user)
        .then(user => {
          console.log('remove', user);
          if (!user) {
            res.sendStatus(404);
          } else {
            res.sendStatus(204);
          }
        })
        .catch(err => res.status(500).send({ err }));
    });
};
