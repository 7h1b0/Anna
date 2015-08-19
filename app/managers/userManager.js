function User(db){
	this.db = db
}

User.prototype = {
	
	get: function(id, success, error){
		this.db.get('SELECT id, name FROM user WHERE id = ?', id, function(err,row){
			if(err || row === undefined){
				error(err);
			}else{
				success(row);
			}
		});
	},

	getAll: function(success, error){
		this.db.all('SELECT id,name FROM user', function(err, rows) {
			if(err || rows === undefined){
				error(err);
			} else {
				success(rows);
			}
		});
	},

	find: function(name, success, error){
		this.db.get('SELECT id, name, password FROM user WHERE name = ?', name, function(err, row){
			if(err || row === undefined){
				error(err);
			}else{
				success(row);
			}
		})
	},

	add: function(user, success, error){
		this.db.run('INSERT INTO user(name, password) VALUES (?,?)', [user.name,user.password], function(err){
			if(err && error){
				error(err);
			} else if(success){
				success();
			}
		});	
	},

	update: function(user, success, error){
		this.db.run('UPDATE user SET password = ? WHERE id = ?', [user.password,user.id], function(err){
			if(err && error){
				error(err);
			} else if(success){
				success();
			}
		});
	},

	delete: function(id, success, error){
		this.db.run('DELETE FROM user WHERE id = ?', [id], function(err){
			if(err && error){
				error(err);
			} else if(success){
				success();
			}
		});	
	}

}

module.exports = User;