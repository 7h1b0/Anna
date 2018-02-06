const Dio = require('../models/dio');
const { actions, dispatch } = require('../modules/');

module.exports = app => {
  app
    .route('/api/dios')
    .get((req, res) => {
      Dio.find({})
        .then(dios => res.send(dios))
        .catch(err => res.status(500).send({ err }));
    })
    .post((req, res) => {
      const isValid = Dio.validate(req.body);
      if (!isValid) {
        res.sendStatus(400);
      } else {
        new Dio(req.body)
          .save()
          .then(newDio => res.status(201).send(newDio))
          .catch(err => res.status(500).send({ err }));
      }
    });

  app
    .route('/api/dios/:id_dio([0-9]{1,2})')
    .get((req, res) => {
      Dio.findOne({ id_dio: req.params.id_dio })
        .then(dio => {
          if (!dio) {
            res.sendStatus(404);
          } else {
            res.send(dio);
          }
        })
        .catch(err => res.status(500).send({ err }));
    })
    .put((req, res) => {
      const isValid = Dio.validate(req.body);
      if (!isValid) {
        res.sendStatus(400);
      } else {
        Dio.findOneAndUpdate({ id_dio: req.params.id_dio }, req.body, {
          new: true,
        })
          .then(dio => {
            if (!dio) {
              res.sendStatus(404);
            } else {
              res.send(dio);
            }
          })
          .catch(err => res.status(500).send({ err }));
      }
    })
    .delete((req, res) => {
      Dio.findOneAndRemove({ id_dio: req.params.id_dio })
        .then(dio => {
          if (!dio) {
            res.sendStatus(404);
          } else {
            res.sendStatus(204);
          }
        })
        .catch(err => res.status(500).send({ err }));
    });

  app.get('/api/dios/:id_dio([0-9]{1,2})/:status(on|off)', (req, res) => {
    dispatch(actions.toggleDio(req.params.id_dio, req.params.status === 'on'));
    res.end();
  });
};
