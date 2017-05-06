const { getJoiError, dispatch, actions } = require('../utils/');
const Alias = require('../models/alias');

module.exports = (app) => {
  app.route('/api/alias')
    .get((req, res) => {
      Alias.find({})
        .then(alias => res.send(alias))
        .catch(err => res.status(500).send({ err }));
    })

    .post((req, res) => {
      Alias.validate(req.body, (invalidReq, alias) => {
        if (invalidReq) {
          res.status(400).send(getJoiError(invalidReq));
        } else {
          const newAlias = new Alias(alias);

          newAlias.save()
            .then(alias => res.status(201).send(alias))
            .catch(err => res.status(500).send({ err }));
        }
      });
    });

  app.route('/api/alias/:id_alias([0-9a-z]{24})')
    .get((req, res) => {
      Alias.findById(req.params.id_alias)
        .then((alias) => {
          if (!alias) {
            res.sendStatus(404);
          } else {
            res.send(alias);
          }
        })
        .catch(err => res.status(500).send({ err }));
    })

    .put((req, res) => {
      Alias.validate(req.body, (invalidReq, alias) => {
        if (invalidReq) {
          res.status(400).send(getJoiError(invalidReq));
        } else {
          Alias.findByIdAndUpdate(req.params.id_alias, alias, { new: true })
            .then((newAlias) => {
              if (!newAlias) {
                res.sendStatus(404);
              } else {
                res.send(newAlias);
              }
            })
            .catch(err => res.status(500).send({ err }));
        }
      });
    })

    .delete((req, res) => {
      Alias.findByIdAndRemove(req.params.id_alias)
        .then((alias) => {
          if (!alias) {
            res.sendStatus(404);
          } else {
            res.sendStatus(204);
          }
        })
        .catch(err => res.status(500).send({ err }));
    });

  app.get('/api/alias/:name([_a-z]{5,})', (req, res) => {
    Alias.findOne({ name: req.params.name })
      .then((alias) => {
        if (!alias) return res.sendStatus(404);
        if (alias.enabled !== true) return res.sendStatus(403);

        return dispatch(actions.callScene(alias.sceneId)).then(() => res.end());
      })
      .catch(err => res.status(500).send({ err }));
  });
};
