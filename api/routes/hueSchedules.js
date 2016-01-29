'use strict';

module.exports = (router, hueService) => {

	router.route('/api/hue/schedules')
		.get((req, res) => {
			hueService.getSchedules()
				.then(schedules => res.send(schedules))
				.catch(err => res.status(500).send(err));
		})

	router.route('/api/hue/schedules/:id_schedule([0-9]{1,2})')
		.get((req, res) => {
			hueService.getSchedule(req.params.id_schedule)
				.then(schedule => res.send(schedule))
				.catch(err => res.status(500).send(err));
		});
}