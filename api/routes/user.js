module.exports = function (router) {

	const User 						= require('./../models/user');
	const cryptoHelper 		= require('./../helpers/cryptoHelper');

	router.post('/user', (req, res) => {
		const badRequest = req.body.username === undefined || req.body.password === undefined;
		
		if (badRequest) {
			res.sendStatus(400);	
		} else {
			cryptoHelper.random()
				.then(token => {
					const newUser = User({
						username: req.body.username,
						password: cryptoHelper.hash(req.body.password),
						token
					});
					return newUser.save();
				}).then(user => res.status(201).send(user))
				.catch(err => res.status(500).send(err));
		}
	});

	router.post('/authentication', (req, res) => {
		const badRequest = req.body.username === undefined || req.body.password === undefined;
		
		if (badRequest) {
			res.sendStatus(400);	
		} else {
			User.findOne({username : req.body.username})
				.then(user => {
					if (!user) {
						res.sendStatus(400);
					} else {
						if (cryptoHelper.verify(req.body.password, user.password)){
							const copyUser = User({
								_id: user._id,
								username: user.username,
								token: user.token
							});

							res.send(copyUser);
						} else {
							res.sendStatus(400);
						}
					}
				})
				.catch(err => res.status(500).send(err));
		}
	});

	router.get('/api/user', (req, res) => {
		User.find({}).select('username')
			.then(users => res.send(users))
			.catch(err => res.status(500).send(err))
	})

	router.route('/api/user/:id_user([0-9a-z]{24})')
		.put((req, res) => {
			const badRequest = req.body.password === undefined;
			
			if (badRequest) {
				res.sendStatus(400);	
			} else {
				User.findByIdAndUpdate(req.params.id_user, req.body.password, {new: true})
					.then(user => {
						if (!user) {
							res.sendStatus(404);
						} else {
							res.sendStatus(204);
						}
					})
					.catch(err => res.status(500).send(err));
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
				.catch(err => res.status(500).send(err));
		});
}