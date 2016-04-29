module.exports = (router, hueService) => {
  router.route('/api/hue/schedules')
    .get((req, res) => {
      hueService.getSchedules()
        .then(schedules => res.send(schedules))
        .catch(err => res.status(500).send(err));
    });

  router.route('/api/hue/schedules/:id_schedule([0-9]{1,2})')
    .get((req, res) => {
      hueService.getSchedule(req.params.id_schedule)
        .then(schedule => res.send(schedule))
        .catch(err => res.status(500).send(err));
    })

    .delete((req, res) => {
      hueService.deleteSchedule(req.params.id_schedule)
        .then(() => res.sendStatus(204))
        .catch(err => res.status(500).send(err));
    });

  router.get('/api/hue/schedules/:id_schedule([0-9]{1,2})/start', (req, res) => {
    hueService.startSchedule(req.params.id_schedule)
      .then(() => res.sendStatus(204))
      .catch(err => res.status(500).send(err));
  });

  router.get('/api/hue/schedules/:id_schedule([0-9]{1,2})/stop', (req, res) => {
    hueService.stopSchedule(req.params.id_schedule)
      .then(() => res.sendStatus(204))
      .catch(err => res.status(500).send(err));
  });
};
