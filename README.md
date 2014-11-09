HomeJS
=====================

## PROJECT DESCRIPTION

* Description : A simple REST api for home automation
* HomeJS : Rest API
* Location : Paris
* Starting Date : Septembre 2014


## REST API ROUTES

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
| /info		      | GET 	  | Get info about host


## REQUIRED

* NodeJS
* MongoDB

## INSTALLATION

1. ```./HomeJS/npm install ```
2. ```./HomeJS/node app.js ```


## DEVELOPERS

* 7h1b0


## LICENSE

OpenSource : just mention developer name if you use the code.