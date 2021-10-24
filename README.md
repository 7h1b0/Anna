
[![Validate](https://github.com/7h1b0/Anna/actions/workflows/validate.yml/badge.svg)](https://github.com/7h1b0/Anna/actions/workflows/validate.yml)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

# Anna

Home automation for Raspberry Pi 2 or above



## Requirements

- [Node.js 16.x](https://nodejs.org/)
- Docker


## Development

To start an ephemeral development server run:

```sh
npm install
docker-compose up -d
npm start
```

Then browse to http://localhost:3000

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
