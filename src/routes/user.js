const User = require('../models/user');
const { cryptoUtil } = require('../utils/');

module.exports = app => {
  app.post('/users', (req, res) => {
    const isValid = User.validate(req.body);
    if (!isValid) {
      res.sendStatus(400);
    } else {
      const { username, password } = req.body;
      Promise.all([cryptoUtil.random(36), cryptoUtil.hash(password)])
        .then(([token, hashedPassword]) => {
          const newUser = new User({
            username,
            password: hashedPassword,
            token,
          });
          return newUser.save();
        })
        .then(({ _id, token }) =>
          res.status(201).send({ _id, username, token }),
        )
        .catch(err => res.status(500).send({ err }));
    }
  });

  app.post('/login', (req, res) => {
    const isValid = User.validate(req.body);
    if (!isValid) {
      res.sendStatus(400);
    } else {
      const { username, password } = req.body;
      User.findOne({ username })
        .then(findUser => {
          if (!findUser) {
            res.sendStatus(400);
          } else {
            cryptoUtil
              .verify(password, findUser.password)
              .then(() => {
                const copyUser = {
                  _id: findUser._id,
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
    User.find({})
      .select('username')
      .then(users => res.send(users))
      .catch(err => res.status(500).send({ err }));
  });

  app
    .route('/api/users/:id_user([0-9a-z]{24})')
    .put((req, res) => {
      const isValid = User.validate(req.body);
      if (!isValid) {
        res.sendStatus(400);
      } else {
        const { password } = req.body;
        cryptoUtil
          .hash(password)
          .then(hashedPassword =>
            User.findByIdAndUpdate(
              req.params.id_user,
              { password: hashedPassword },
              { new: true },
            ),
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
      User.findByIdAndRemove(req.params.id_user)
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
