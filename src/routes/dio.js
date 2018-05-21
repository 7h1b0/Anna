const Dio = require('../modules/models/dio');
const actions = require('../modules/actions');
const dispatch = require('../modules/dispatch');

module.exports = app => {
  app
    .route('/api/dios')
    .get((req, res) => {
      Dio.findAll()
        .then(dios => res.send(dios))
        .catch(err => res.status(500).send({ err }));
    })
    .post((req, res) => {
      const isValid = Dio.validate(req.body);
      if (!isValid) {
        res.sendStatus(400);
      } else {
        Dio.save(req.body)
          .then(newDio => res.status(201).send(newDio))
          .catch(err => res.status(500).send({ err }));
      }
    });

  app
    .route('/api/dios/:id_dio([0-9]+)')
    .get((req, res) => {
      Dio.findById(req.params.id_dio)
        .then(dio => {
          if (!dio) {
            res.sendStatus(404);
          } else {
            res.send(dio);
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
          room_id: req.body.roomId,
        };
        Dio.findByIdAndUpdate(req.params.id_dio, updatedDio)
          .then(rowsAffected => {
            if (rowsAffected < 1) {
              res.sendStatus(404);
            } else {
              res.sendStatus(204);
            }
          })
          .catch(err => res.status(500).send({ err }));
      }
    })
    .delete((req, res) => {
      Dio.delete(req.params.id_dio)
        .then(rowsAffected => {
          if (rowsAffected < 1) {
            res.sendStatus(404);
          } else {
            res.sendStatus(204);
          }
        })
        .catch(err => res.status(500).send({ err }));
    });

  app.get('/api/dios/:id_dio([0-9]+)/:status(on|off)', (req, res) => {
    dispatch(actions.toggleDio(req.params.id_dio, req.params.status === 'on'));
    res.end();
  });
};
