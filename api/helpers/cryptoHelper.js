const crypto = require('crypto');
const algorithm = 'sha1';
const salt = 'xxxxxxxxxxxxxx';

module.exports = {

	hash(password){
		return crypto.createHmac(algorithm, salt).update(password).digest('hex');
	},

	verify(password, hashedPassword){
		return this.hash(password) === hashedPassword;
	},

	random(length){
		length = length || 24;
		return crypto.randomBytes(Math.ceil(length / 2)).toString('hex');
	}
}

