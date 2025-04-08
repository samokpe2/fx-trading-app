<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).


# Wallet Service

## 📖 API Documentation

We use **Swagger** for interactive API documentation.

- **Access:** [http://localhost:3000/api](http://localhost:3000/api)
- **Auth:** Use the **Authorize** button and enter your JWT `access-token`.

### Available Endpoints

| Method | Endpoint              | Description                  |
|--------|-----------------------|------------------------------|
| GET    | `/wallet`             | Get user's wallet balances   |
| POST   | `/wallet/fund`        | Fund your wallet             |
| POST   | `/wallet/convert`     | Convert currency             |
| POST   | `/wallet/trade`       | Simulate currency trading    |

## 📦 Architectural Decisions

- **NestJS Framework:** Modular architecture, easy to maintain and scale.
- **TypeORM:** For database management and entity modeling.
- **Swagger:** API-first approach with automatic documentation.
- **Caching Layer:** Exchange rates are cached for performance using NestJS cache manager.
- **Scalability:** Wallet and currency management designed to add more currencies and trading pairs easily.
- **Security:** JWT token authentication for protected routes.

## 🧩 Key Assumptions

- ✅ **Multi-Currency Support:** Initial support for NGN and USD, but the system is extendable.
- ✅ **Default Wallet Creation:** Wallets for supported currencies are auto-created with a zero balance on first access.
- ✅ **Positive Transaction Amounts:** All transactions must have positive amounts.
- ✅ **Caching Exchange Rates:** Exchange rates fetched from external API are cached to minimize latency and API usage.
- ✅ **Basic Error Handling:** The service handles invalid inputs and operational errors gracefully.

## 🗺️ Optional Enhancements (Future Work)

- Add unit and integration tests for critical business logic.
- Implement role-based access control for admin functions.
- Enhance error logging and monitoring.
- Add flow diagrams or sequence diagrams to visualize system interactions.

## 📊 Swagger UI

- **Local:** [http://localhost:3000/api](http://localhost:3000/api)

Use the **Authorize** button to enter your JWT token and explore the endpoints.

## 🧩 Caching Strategy

- Exchange rates are cached to reduce the number of external API calls.
- TTL (Time to Live) for cached rates can be configured via environment variables.
- Improves system performance and ensures faster currency conversion/trading.

## 🤝 Contributing

1. Fork the repository.
2. Create your feature branch: `git checkout -b feature/awesome-feature`.
3. Commit your changes: `git commit -m 'Add some awesome feature'`.
4. Push to the branch: `git push origin feature/awesome-feature`.
5. Open a pull request.

## 🛠️ Technologies Used

- **NestJS**
- **TypeORM**
- **PostgreSQL**
- **Swagger**
- **Cache Manager**
- **JWT Authentication**
