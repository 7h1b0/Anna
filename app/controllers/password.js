var crypto = require('crypto');

exports.crypt = function(string){
    return crypto.createHash('sha256').update(string).digest('hex');
}

exports.compare = function(string, hash){
    return hash == this.crypt(string);
}