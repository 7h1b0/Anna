Anna-API
=====================

## Project description

A simple REST api for home automation using NodeJS ans SQLite


## Rest API routes

* Command Controller

| Path            		| HTTP Verb 	| Description                 
|-----------------------|---------------|-----------------------------
| /device        		| GET 	  		| Get all the commands     
| /device/       		| POST      	| Add device     
| /device/:id/:status   | GET       	| switch on/off a device          
| /device/:id    		| PUT       	| Update a device   
| /device/:id    		| DELETE    	| Delete a command

* Schedule Controller

| Path            		| HTTP Verb 	| Description                 
|-----------------------|---------------|-----------------------------
| /schedule          	| GET 	  		| Get list of job  
| /schedule/         	| POST      	| Add job     
| /schedule/:id      	| GET       	| Get a single job          
| /schedule/:id      	| DELETE    	| Delete a event
| /schedule/start/:id	| GET    		| Start a job
| /schedule/stop/:id	| GET    		| Stop a job

* Special Routes

| Path            | HTTP Verb | Description                 
|-----------------|-----------|-----------------------------
| /os		      | GET 	  | Get info about host


## Required

* NodeJS

## Installation

1. ```./Anna-API/npm install ```
2. ```./Anna-API/node app.js ```


## Developer

* 7h1b0