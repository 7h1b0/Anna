module.exports = function (router) {

	const User 						= require('./../models/user');
	const cryptoHelper 		= require('./../helpers/cryptoHelper');

	router.post('/user', function (req, res) {
		const badRequest = req.body.username === undefined || req.body.password === undefined;
		
		if (badRequest) {
			res.sendStatus(400);	
		} else {
			const newUser = User({
				username: req.body.username,
				password: cryptoHelper.hash(req.body.password),
				token: cryptoHelper.random()
			});

			newUser.save().then(user => {
				res.send(user);
			}).catch(err => {
				res.status(500).send(err);
			});
		}
	});

	router.post('/authentication', function (req, res) {
		const badRequest = req.body.username === undefined || req.body.password === undefined;
		
		if (badRequest) {
			res.sendStatus(400);	
		} else {
			User.findOne({username : req.body.username}).then(user => {
				if (!user) {
					console.log("user undefined ?");
					res.sendStatus(403);
				} else {
					if (cryptoHelper.verify(req.body.password, user.password)){
						const copyUser = User({
							_id: user._id,
							username: user.username,
							token: user.token
						});

						res.send(copyUser);
					} else {
						console.log("cryptoHelper ...");
						res.sendStatus(403);
					}
				}
			}).catch(err => {
				res.status(500).send(err);
			});
		}
	});

	router.get('/api/user', function (req, res) {
		User.find({}).select('username').then(users => {
			res.send(users);
		}).catch(err => {
			res.status(500).send(err);
		})
	})

	router.route('/api/user/:id_user([0-9a-z]{24})')
		.put(function (req, res) {
			const badRequest = req.body.password === undefined;
			
			if (badRequest) {
				res.sendStatus(400);	
			} else {
				User.findByIdAndUpdate(req.params.id_user, req.body.password, {new: true}).then(user => {
					if (!user) {
						res.sendStatus(404);
					} else {
						res.sendStatus(204);
					}
				}).catch(err => {
					res.status(500).send(err);
				});
			}
		})

		.delete(function (req, res) {
			User.findByIdAndRemove(req.params.id_user).then(user => {
				if (!user) {
					res.sendStatus(404);
				} else {
					res.sendStatus(204);
				}
			}).catch(err => {
				res.status(500).send(err);
			});
		});
}