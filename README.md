# Anna-API [![Build Status](https://travis-ci.org/7h1b0/Anna.svg?branch=master)](https://travis-ci.org/7h1b0/Anna)

Home automation API for the Raspberry Pi 2 or above

## Table of Contents

- [Getting Started](#getting-started)
  - [Installation](#installation)
- [Developing](#Developing)
  - [Prerequisites](#prerequisites)
  - [Installing](#installing)
  - [Running the tests](#running-the-tests)
- [Deployment](#deployment)
- [Versioning](#versioning)

## Getting Started

Head on over to the releases page to download the most recent version.

### Prerequisites

```
Raspberry Pi 2 or above
MySQL/MariaDB
```

### Installation

Download the most recent version and make it executable

```
wget https://github.com/7h1b0/Anna/releases/download/v3.3.0/anna-armv7
chmod +x anna-armv7
```

Then run it:

```
./anna-armv7
```

## Developing

### Prerequisites

```
NodeJS >= 10
NPM >= 5
Docker
```

### Installing

```
# Install dependencies
npm i

# Start MySQL database
docker-compose up -d
```

### Running the tests

```
# Run the tests
npm test

# Run Typescript check
npm run type:check

# Run Eslint check
npm run lint

# Run prettier check
npm run format:check"
```

## Deployment

```
# Create a new release
npm version major/minor/patch

# Push commit and tag
git push --follow-tags
```

A new release will be automatically created in Github with assets

## Versioning

[SemVer](http://semver.org/) is used for versioning. For the versions available, see the [releases on this repository](https://github.com/7h1b0/Anna/releases).
