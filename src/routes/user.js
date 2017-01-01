const User = require('../models/user');
const cryptoUtil = require('../utils/cryptoUtil');
const getJoiError = require('../utils/errorUtil');

module.exports = (app) => {
  app.post('/user', (req, res) => {
    User.validate(req.body, (err, user) => {
      if (err) {
        res.status(400).send(getJoiError(err));
      } else {
        cryptoUtil.random()
          .then(token => {
            const newUser = new User({
              username: user.username,
              password: cryptoUtil.hash(user.password),
              token,
            });
            return newUser.save();
          })
          .then(newUser => res.status(201).send(newUser))
          .catch(err => res.status(500).send({ err }));
      }
    });
  });

  app.post('/authentication', (req, res) => {
    User.validate(req.body, (err, user) => {
      if (err) {
        res.status(400).send(getJoiError(err));
      } else {
        User.findOne({ username: user.username })
          .then(findUser => {
            if (!findUser) {
              res.sendStatus(400);
            } else {
              if (cryptoUtil.verify(user.password, findUser.password)) {
                const copyUser = {
                  _id: findUser._id,
                  username: findUser.username,
                  token: findUser.token,
                };

                res.send(copyUser);
              } else {
                res.sendStatus(400);
              }
            }
          })
          .catch(err => res.status(500).send({ err }));
      }
    });
  });

  app.get('/api/user', (req, res) => {
    User.find({}).select('username')
      .then(users => res.send(users))
      .catch(err => res.status(500).send({ err }));
  });

  app.route('/api/user/:id_user([0-9a-z]{24})')
    .put((req, res) => {
      User.validate(req.body, (err, user) => {
        if (err) {
          res.status(400).send(getJoiError(err));
        } else {
          User.findByIdAndUpdate(req.params.id_user, req.body.password, { new: true })
            .then(user => {
              if (!user) {
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
