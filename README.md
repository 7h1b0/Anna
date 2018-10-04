[![NodeJS](https://img.shields.io/badge/node-%3E%3D%208-brightgreen.svg)](https://nodejs.org/en/)
[![Build Status](https://travis-ci.org/7h1b0/Anna.svg?branch=master)](https://travis-ci.org/7h1b0/Anna)
[![Dependency Status](https://img.shields.io/david/7h1b0/anna/master.svg)](https://david-dm.org/7h1b0/Anna)
[![Dev Dependency Status](https://img.shields.io/david/dev/7h1b0/anna/master.svg)](https://david-dm.org/7h1b0/Anna#info=devDependencies)
[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

# Anna-API

REST API for home automation using NodeJS

## Table of Contents

- [Prerequisite](#prerequisite)
- [Install procedure](#install-procedure)
- [Available Scripts](#available-scripts)
  - [npm start](#npm-start)
  - [npm test](#npm-test)
  - [npm run eslint](#npm-run-eslint)

## Prerequisite

- NodeJS >= 8.6
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

### `npm run build`

Builds the application for production.

### `npm test`

Runs unit test using Jest.

### `npm run eslint`

Use eslint to check src folder.

### `npm run db:migrate`

Applies migrations to your database.

### `npm run db:rollback`

Rolls back the latest migration group.
