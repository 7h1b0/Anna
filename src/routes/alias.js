const { dispatch, actions } = require('../utils/');
const Alias = require('../models/alias');

module.exports = app => {
  app
    .route('/api/alias')
    .get((req, res) => {
      Alias.find({})
        .then(alias => res.send(alias))
        .catch(err => res.status(500).send({ err }));
    })
    .post((req, res) => {
      const isValid = Alias.validate(req.body);
      if (!isValid) {
        res.sendStatus(400);
      } else {
        const { name, description, sceneId, enabled = true } = req.body;
        const newAlias = new Alias({ name, description, enabled, sceneId });

        newAlias
          .save()
          .then(alias => res.status(201).send(alias))
          .catch(err => res.status(500).send({ err }));
      }
    });

  app
    .route('/api/alias/:id_alias([0-9a-z]{24})')
    .get((req, res) => {
      Alias.findById(req.params.id_alias)
        .then(alias => {
          if (!alias) {
            res.sendStatus(404);
          } else {
            res.send(alias);
          }
        })
        .catch(err => res.status(500).send({ err }));
    })
    .put((req, res) => {
      const isValid = Alias.validate(req.body);
      if (!isValid) {
        res.sendStatus(400);
      } else {
        Alias.findByIdAndUpdate(req.params.id_alias, req.body, { new: true })
          .then(updatedAlias => {
            if (!updatedAlias) {
              res.sendStatus(404);
            } else {
              res.send(updatedAlias);
            }
          })
          .catch(err => res.status(500).send({ err }));
      }
    })
    .patch((req, res) => {
      const isBadRequest =
        !req.body || (req.body.enabled !== false && req.body.enabled !== true);

      if (isBadRequest) {
        res.sendStatus(400);
      } else {
        Alias.findByIdAndUpdate(
          req.params.id_alias,
          { enabled: req.body.enabled },
          { new: true },
        )
          .then(updatedAlias => {
            if (!updatedAlias) {
              res.sendStatus(404);
            } else {
              res.send(updatedAlias);
            }
          })
          .catch(err => res.status(500).send({ err }));
      }
    })
    .delete((req, res) => {
      Alias.findByIdAndRemove(req.params.id_alias)
        .then(alias => {
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
      .then(alias => {
        if (!alias) return res.sendStatus(404);
        if (alias.enabled !== true) return res.sendStatus(403);

        return dispatch(actions.callScene(alias.sceneId)).then(() => res.end());
      })
      .catch(err => res.status(500).send({ err }));
  });
};
