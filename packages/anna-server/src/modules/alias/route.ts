import { Router } from 'express';
import dispatch from '../../utils/dispatch';
import { callScene } from '../../utils/actions';
import * as Alias from '../../modules/alias/model';

const routes = Router();

routes
  .route('/api/alias')
  .get((req, res) => {
    Alias.findAll()
      .then((aliases) => res.json(aliases))
      .catch((err) => res.status(500).send({ err }));
  })
  .post((req, res) => {
    const isValid = Alias.validate(req.body);
    if (!isValid) {
      res.sendStatus(400);
    } else {
      const createdBy = res.locals.user.userId;
      Alias.save({ ...req.body, createdBy })
        .then((aliasId) => res.status(201).json(aliasId))
        .catch((err) => res.status(500).send({ err }));
    }
  });

routes
  .route('/api/alias/:id_alias([a-fA-F0-9-]{36})')
  .get((req, res) => {
    Alias.findById(req.params.id_alias)
      .then((alias) => {
        if (!alias) {
          res.sendStatus(404);
        } else {
          res.json(alias);
        }
      })
      .catch((err) => res.status(500).send({ err }));
  })
  .patch((req, res) => {
    const isValid = Alias.validate(req.body);
    if (!isValid) {
      res.sendStatus(400);
    } else {
      Alias.findByIdAndUpdate(req.params.id_alias, req.body)
        .then((rowsAffected) => {
          if (rowsAffected < 1) {
            res.sendStatus(404);
          } else {
            res.sendStatus(204);
          }
        })
        .catch((err) => res.status(500).send({ err }));
    }
  })
  .delete((req, res) => {
    Alias.remove(req.params.id_alias)
      .then((rowsAffected) => {
        if (rowsAffected < 1) {
          res.sendStatus(404);
        } else {
          res.sendStatus(204);
        }
      })
      .catch((err) => res.status(500).send({ err }));
  });

routes.get(
  '/api/alias/:id_alias([a-fA-F0-9-]{36})/:enabled(enable|disable)',
  (req, res) => {
    Alias.findByIdAndUpdate(req.params.id_alias, {
      enabled: req.params.enabled === 'enable',
    })
      .then((rowsAffected) => {
        if (rowsAffected < 1) {
          res.sendStatus(404);
        } else {
          res.sendStatus(204);
        }
      })
      .catch((err) => res.status(500).send({ err }));
  },
);

routes.get('/api/alias/:name([a-z_]{4,})/action', (req, res) => {
  Alias.findByName(req.params.name)
    .then(async (aliases) => {
      if (aliases.length === 0) {
        return res.sendStatus(404);
      }

      const alias = Alias.resolveActiveAlias(aliases);

      if (!alias) {
        return res.sendStatus(403);
      }

      await dispatch(callScene(alias.sceneId));
      return res.end();
    })
    .catch((err: Error) => res.status(500).send({ err }));
});

export default routes;
