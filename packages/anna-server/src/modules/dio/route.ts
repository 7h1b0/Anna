import { Router } from 'express';
import * as Dio from 'modules/dio/model';
import { toggleDio } from 'utils/actions';
import dispatch from 'utils/dispatch';

const routes = Router();
routes
  .route('/api/dios')
  .get((req, res) => {
    Dio.findAll()
      .then(dios => res.json(dios))
      .catch(err => res.status(500).send({ err }));
  })
  .post((req, res) => {
    const isValid = Dio.validate(req.body);
    if (!isValid) {
      res.sendStatus(400);
    } else {
      Dio.save(req.body)
        .then(newDio => res.status(201).json(newDio))
        .catch(err => res.status(500).send({ err }));
    }
  });

routes
  .route('/api/dios/:id_dio([0-9]+)')
  .get((req, res) => {
    Dio.findById(Number(req.params.id_dio))
      .then(dio => {
        if (!dio) {
          res.sendStatus(404);
        } else {
          res.json(dio);
        }
      })
      .catch(err => res.status(500).send({ err }));
  })
  .patch((req, res) => {
    const isValid = Dio.validate(req.body);
    if (!isValid) {
      res.sendStatus(400);
    } else {
      const updatedDio = {
        name: req.body.name,
        roomId: req.body.roomId,
      };
      Dio.findByIdAndUpdate(Number(req.params.id_dio), updatedDio)
        .then(rowsAffected => {
          if (rowsAffected < 1) {
            res.sendStatus(404);
          } else {
            res.sendStatus(204);
          }
        })
        .catch(err => {
          res.status(500).send({ err });
        });
    }
  })
  .delete((req, res) => {
    Dio.remove(Number(req.params.id_dio))
      .then(rowsAffected => {
        if (rowsAffected < 1) {
          res.sendStatus(404);
        } else {
          res.sendStatus(204);
        }
      })
      .catch(err => res.status(500).send({ err }));
  });

routes.get('/api/dios/:id_dio([0-9]+)/:status(on|off)', (req, res) => {
  dispatch(toggleDio(req.params.id_dio, req.params.status === 'on'));
  res.end();
});

export default routes;
