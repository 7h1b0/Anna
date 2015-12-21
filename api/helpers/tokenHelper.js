const User = require('./../models/user');

module.exports = {

	isValid(token) {
		return new Promise((resolve, reject) => {
			User.findOne({token})
				.select('token')
				.then(user => {
					if (!user) {
						reject();
					} else {
						resolve(user);
					}
				}).catch(err => reject());
		});
	},

	getUserFromToken() {
		return new Promise((resolve, reject) => {
			User.findOne({token})
				.select('token')
				.then(user => {
					if (!user) {
						reject();
					} else {
						resolve(user);
					}
				}).catch(err => reject());
		});
	}
}