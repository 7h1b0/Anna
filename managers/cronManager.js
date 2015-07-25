/**
* cronmanager.js - post callbacks to cronjobs 
* - create, update, delete cronjobs via the net
* please see https://github.com/ncb000gt/node-cron and http://crontab.org/ for crontab info 
* Synopsis:
*  var CronManager = require('crontab_manager'),
*  myCrontTabManager = new CronTab(key, '* 2/2 13-16 * *', function, options  ) // or
*  myCrontTabManager = new CronTab()
* in the first form, a new job is created on key 'key' with onTick set to 'function', cronTime is set to '* 2/2 13-16 * *', and options can include stuff like start, onComplete, and timeZone
* the second form just a new manager is created to which you can add jobs. Remember jobs do not start automatically, you have to set options to {start: true} or call start() after the job is created.
*
* Other methods include:
*  myCrontTabManager.update(key, newCronString) //or
*  myCrontTabManager.upadte(key, tabOrfunction) // or
*  myCrontTabManager.update(key, tab,function)
*  myCrontTabManager.stop(key)
*  myCrontTabManager.start(key)
*  myCrontTabManager.deleteJob(key)
*  myCrontTabManager.add(key, cronString, function, options)
*
* currently you cannot set context for any job.
*/

var CronJob = require('cron').CronJob,
	process = require('./processManager');

function CronManager(){
	this.jobs = {};	
}

CronManager.prototype.add = function(key, timestamp, device_id, switchOn) {
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
}

CronManager.prototype.delete = function(key) {
	try {
		this.jobs[key].cronJob.stop();
		delete this.jobs[key];
	} catch (err) {}
}

CronManager.prototype.start = function(key) {
	try {
		if (this.jobs[key].cronJob.running){
			console.warn(key + " job already running");
		} else {
			this.jobs[key].cronJob.start();	
		}
	}catch (err) {}
}

CronManager.prototype.stop = function(key) {
	try {
		if (!this.jobs[key].cronJob.running ){
			console.warn(key + " job already stopped");
		} else {
			this.jobs[key].cronJob.stop();
		}
		
	}catch(err) {}
}

CronManager.prototype.getAll = function() {
	var jobs = [],
		job;

	for (jobKey in this.jobs) {
		jobs.push(this.get(jobKey));
	}  

	return jobs;
}

CronManager.prototype.get = function(key) {
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
}

CronManager.prototype.exists = function(tabKey) {
	if (this.jobs[tabKey]) 
		return true;
	return false;
}

function execute(device_id, switchOn){
	return function(){
		process.exec(device_id, switchOn, function(err){});	
	}
}

module.exports = CronManager;