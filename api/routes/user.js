const User = require('./../models/user');
const cryptoHelper = require('./../helpers/cryptoHelper');

module.exports = app => {
  app.post('/user', (req, res) => {
    cryptoHelper.random()
      .then(token => {
        const newUser = new User({
          username: req.body.username,
          password: cryptoHelper.hash(req.body.password),
          token,
        });
        return newUser.save();
      })
      .then(user => res.status(201).send(user))
      .catch(err => res.status(500).send({ err }));
  });

  app.post('/authentication', (req, res) => {
    User.findOne({ username: req.body.username })
      .then(user => {
        if (!user) {
          res.sendStatus(400);
        } else {
          if (cryptoHelper.verify(req.body.password, user.password)) {
            const copyUser = {
              _id: user._id,
              username: user.username,
              token: user.token,
            };

            res.send(copyUser);
          } else {
            res.sendStatus(400);
          }
        }
      })
      .catch(err => res.status(500).send({ err }));
  });

  app.get('/api/user', (req, res) => {
    User.find({}).select('username')
      .then(users => res.send(users))
      .catch(err => res.status(500).send({ err }));
  });

  app.route('/api/user/:id_user([0-9a-z]{24})')
    .put((req, res) => {
      if (req.body.password === undefined) {
        res.sendStatus(400);
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
