# App

[Front](https://ecommerce-gmi-front-nyas0zb6a-orzechovskis-projects.vercel.app/)

[Back](https://ecommerce-gmi-api.vercel.app/)

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ npm install
$ npm run build
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Notes

This project currently requires additional configuration for the test environment. The tests, particularly the end-to-end (e2e) tests, need refinement due to issues with environment variables not being properly loaded from the .env.test file, even after attempts to configure them correctly.

The goal is to ensure that e2e tests use a dedicated test database rather than the production environment. As of now, running the e2e tests points to the production setup, which is not ideal. Resolving this issue would involve adjusting the environment variable management to ensure the correct configuration is pulled during testing.

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
