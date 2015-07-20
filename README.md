Anna-API
=====================

## Project description

A simple REST API for home automation using NodeJS and SQLite3


## Rest API routes

* Command Controller

| Path            		| HTTP Verb 	| Description                 
|-----------------------|---------------|-----------------------------
| /device        		| GET 	  		| Get all devices   
| /device/       		| POST      	| Add device  
| /device/:id       	| GET 	  		| Get a single device        
| /device/:id    		| PUT       	| Update a device   
| /device/:id    		| DELETE    	| Delete a device
| /device/on/:id   		| GET       	| switch on a device    
| /device/off/:id   	| GET       	| switch off a device    


* Schedule Controller

| Path            		| HTTP Verb 	| Description                 
|-----------------------|---------------|-----------------------------
| /schedule          	| GET 	  		| Get all jobs 
| /schedule/         	| POST      	| Add job     
| /schedule/:id      	| GET       	| Get a single job          
| /schedule/:id      	| DELETE    	| Delete a job
| /schedule/start/:id	| GET    		| Start a job
| /schedule/stop/:id	| GET    		| Stop a job


* Information Controller

| Path            | HTTP Verb | Description                 
|-----------------|-----------|-----------------------------
| /os		      | GET 	  | Get info about host

## Structures

```
Device{
	id: Integer,
	title : String
}
```

```
Job{
	title: String,
	device_id : Integer,
	switchOn : Boolean,
	cronJob : String,
	status : String
}
```


## Required

* NodeJS

## Installation

1. ```./Anna-API/npm install ```
2. ```./Anna-API/node app.js ```


## Developer

* 7h1b0