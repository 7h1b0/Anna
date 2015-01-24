Anna-API
=====================

## Project description

A simple REST api for home automation


## Rest API routes

* Command Controller

| Path            | HTTP Verb | Description                 
|-----------------|-----------|-----------------------------
| /command        | GET 	  | Get all the commands     
| /command/       | POST      | Add command     
| /command/:id    | GET       | Get a single command           
| /command/:id    | PUT       | Update a command   
| /command/:id    | DELETE    | Delete a command

* Event Controller

| Path            | HTTP Verb | Description                 
|-----------------|-----------|-----------------------------
| /event          | GET 	  | Get list of events  
| /event/         | POST      | Add event     
| /event/:id      | GET       | Get a single event           
| /event/:id      | PUT       | Update a event   
| /event/:id      | DELETE    | Delete a event

* Special Routes

| Path            | HTTP Verb | Description                 
|-----------------|-----------|-----------------------------
| /action	      | GET 	  | Launch action
| /os		      | GET 	  | Get info about host


## Required

* NodeJS
* MySQL

## Installation

1. ```./HomeJS/npm install ```
2. ```./HomeJS/node app.js ```


## Developer

* 7h1b0


## License

OpenSource : just mention developer name if you use the code.