# Anna [![Build Status](https://travis-ci.com/7h1b0/Anna.svg?branch=master)](https://travis-ci.com/7h1b0/Anna)

Home automation for Raspberry Pi 2 or above

---

## Requirements

- [Node.js 10.x](https://nodejs.org/)
- Docker

---

## Development

To start an ephemeral development server run:

```sh
npm install
docker-compose up -d
npm start
```

Then browse to http://localhost:3000

---

## Commands

| Command                | Description                      |
| ---------------------- | -------------------------------- |
| `npm run format:check` | Formats the code using prettier. |
| `npm run type:check`   | Checks types using Typescript    |
| `npm run lint:check`   | Lints the JavaScript code.       |
| `npm test`             | Runs tests.                      |
| `npm start`            | Runs the website in development. |
| `npm run build`        | Builds the production assets.    |

---

## Deployment

```
# Create a new release
npm run lerna version major/minor/patch
```

A new release will be automatically created in Github with assets

---
