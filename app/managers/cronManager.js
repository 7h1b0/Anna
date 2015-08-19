var CronJob 	= require('cron').CronJob;
var process 	= require('./processManager');

function CronManager(){}

CronManager.prototype = {
	jobs: {},

	add: function(key, timestamp, device_id, switchOn) {
		try {
			this.jobs[key] = {
				device_id: device_id,
				switchOn : switchOn,
				timestamp : timestamp,
				cronJob : new CronJob({
					cronTime: new Date(timestamp),
					onTick: execute(device_id, switchOn)
				})
			};
		}catch(fooBaredByUser) {}
	},

	delete: function(key) {
		try {
			this.jobs[key].cronJob.stop();
			delete this.jobs[key];
		} catch (err) {}
	},

	start: function(key) {
		try {
			if(!this.jobs[key].cronJob.running){
				this.jobs[key].cronJob.start();	
			}
		}catch (err) {}
	},

	stop: function(key) {
		try {
			if(this.jobs[key].cronJob.running ){
				this.jobs[key].cronJob.stop();
			}	
		}catch(err) {}
	},

	getAll: function() {
		var jobs = [];

		for (jobKey in this.jobs) {
			jobs.push(this.get(jobKey));
		}  

		return jobs;
	},

	get: function(key) {
		if(this.jobs[key]){
			var job = this.jobs[key];
			return {
				title : key,
				device_id : job.device_id,
				switchOn : job.switchOn,
				timestamp : job.timestamp,
				running : job.cronJob.running
			};
		}else{
			return null;
		}	
	},

	exists: function(tabKey) {
		if (this.jobs[tabKey]) return true;
		return false;
	}

}

function execute(device_id, switchOn){
	return function(){
		process.exec(device_id, switchOn, function(err){});	
	}
}

module.exports = CronManager;