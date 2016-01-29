const User = require('./../models/user');

module.exports = {
	isValid(token) {
		return new Promise((resolve, reject) => {
			User.findOne({token})
				.select('token')
				.then(user => !user ? reject() : resolve(user))
				.catch(err => reject());
		});
	}
}