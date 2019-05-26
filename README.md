# Anna-API [![NodeJS](https://img.shields.io/badge/node-%3E%3D%208-brightgreen.svg)](https://nodejs.org/en/) [![Build Status](https://travis-ci.org/7h1b0/Anna.svg?branch=master)](https://travis-ci.org/7h1b0/Anna)

API for home automation

## Table of Contents

- [Prerequisite](#prerequisite)
- [Install procedure](#install-procedure)
- [Available Scripts](#available-scripts)
  - [npm start](#npm-start)
  - [npm test](#npm-test)
  - [npm run eslint](#npm-run-eslint)
  - [npm run build](#npm-run-build)
  - [npm run build:package](#npm-run-buildpackage)
  - [npm run db:migrate](#npm-run-dbmigrate)
  - [npm run db:rollback](#npm-run-dbrollback)

## Prerequisite

- NodeJS >= 8
- NPM >= 5

## Installation

1. Execute `docker-compose up -d`
1. Execute `npm i`
1. Execute `npm run db:migrate`
1. Optionnal: run `npm run db:seed`

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.

### `npm test`

Runs unit test using Jest.

### `npm run build`

Builds the application for production.

### `npm run build:package`

Builds the application for production and package it with Node 10 for armv7.

### `npm run db:migrate`

Applies migrations to your database.

### `npm run db:rollback`

Rolls back the latest migration group.
