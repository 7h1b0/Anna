const User = require('../models/user');
const { cryptoUtil, getJoiError } = require('../utils/');

module.exports = (app) => {
  app.post('/users', (req, res) => {
    User.validate(req.body, (err, user) => {
      if (err) {
        res.status(400).send(getJoiError(err));
      } else {
        Promise.all([cryptoUtil.random(36), cryptoUtil.hash(user.password)])
          .then(([token, password]) => {
            const newUser = new User({
              username: user.username,
              password,
              token,
            });
            return newUser.save();
          })
          .then(({ _id, username, token }) => res.status(201).send({ _id, username, token }))
          .catch(err => res.status(500).send({ err }));
      }
    });
  });

  app.post('/login', (req, res) => {
    User.validate(req.body, (err, user) => {
      if (err) {
        res.status(400).send(getJoiError(err));
      } else {
        User.findOne({ username: user.username })
          .then((findUser) => {
            if (!findUser) {
              res.sendStatus(400);
            } else {
              cryptoUtil.verify(user.password, findUser.password)
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
  });

  app.get('/api/users', (req, res) => {
    User.find({}).select('username')
      .then(users => res.send(users))
      .catch(err => res.status(500).send({ err }));
  });

  app.route('/api/users/:id_user([0-9a-z]{24})')
    .put((req, res) => {
      User.validate(req.body, (err, user) => {
        if (err) {
          res.status(400).send(getJoiError(err));
        } else {
          User.findByIdAndUpdate(req.params.id_user, user.password, { new: true })
            .then((findUser) => {
              if (!findUser) {
                res.sendStatus(404);
              } else {
                res.sendStatus(204);
              }
            })
            .catch(err => res.status(500).send({ err }));
        }
      });
    })

    .delete((req, res) => {
      User.findByIdAndRemove(req.params.id_user)
        .then((user) => {
          if (!user) {
            res.sendStatus(404);
          } else {
            res.sendStatus(204);
          }
        })
        .catch(err => res.status(500).send({ err }));
    });
};
