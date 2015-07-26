function DeviceManager(db){
	this.db = db
}

DeviceManager.prototype.get = function(id, success, error){
	var that = this;
	this.db.get('SELECT id,title,isGroup FROM device WHERE id = ?', id, function(err,row){
		if(err || row === undefined){
			error(err);
		}else{
			if(row.isGroup == 0){
				success(row);
			}else{
				that.getDevices(row.id, function(devices){
					row.devices = devices;
					success(row);
				},function(err){
					error(err);
				});
			}
		}
	});
}

DeviceManager.prototype.getDevices = function(id, success, error){
	this.db.all('SELECT id_device FROM vdevice WHERE id_group = ?',id, function(err, rows) {
		if(err){
			error(err);
		}else{
			devices = [];
			for(var i=0, length = rows.length; i<length; i++){
				devices[i] = rows[i].id_device;
			}
			success(devices);
		}
	});
}

DeviceManager.prototype.getAll = function(success, error){
	this.db.all('SELECT id,title,isGroup FROM device', function(err, rows) {
		if(err || rows === undefined){
			error(err);
		} else {
			success(rows);
		}
	});
}

DeviceManager.prototype.add = function(device, success, error){
	if(this.isVirtualDevice(device)){
		var stmt = this.db.prepare("INSERT INTO vdevice(id_group,id_device) VALUES (?,?)");
		for (var i = 0, length = device.devices.length; i < length; i++) {
			stmt.run([device.id, device.devices[i]]);
		}
		stmt.finalize();
	}

	this.db.run('INSERT INTO device(id,title, isGroup) VALUES (?,?,?)', [device.id,device.title,device.isGroup], function(err){
		if(err){
			error(err);
		} else{
			success();
		}
	});	
}

DeviceManager.prototype.update = function(device, success, error){
	this.db.run('UPDATE device SET title = ? WHERE id = ?', [device.title,device.id_device], function(err){
		if(err){
			error(err);
		} else {
			success();
		}
	});
}

DeviceManager.prototype.delete = function(id, success, error){
	this.db.run('DELETE FROM vdevice WHERE id_group = ?', [id]);
	this.db.run('DELETE FROM device WHERE id = ?', [id], function(err){
		if(err){
			error(err);
		} else{
			success();
		}
	});	
}

DeviceManager.prototype.isVirtualDevice = function(device){
	return device.isGroup ==1 && (device.devices !== undefined || device.devices.length != 0);
}

module.exports = DeviceManager;