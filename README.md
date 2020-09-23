# Enki
[![CircleCI](https://circleci.com/gh/entur/enki.svg?style=svg)](https://circleci.com/gh/entur/enki) [![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=entur_enki&metric=alert_status)](https://sonarcloud.io/dashboard?id=entur_enki) [![Known Vulnerabilities](https://snyk.io/test/github/entur/enki/badge.svg)](https://snyk.io/test/github/entur/enki)

Frontend app for Nplan - a simple timetable editor. Backend is [Uttu](https://github.com/entur/uttu).

## Development

To run for development, simply do:

```
npm install
npm run start-devenv
```
Note: The app use Node v8. `nvm use v8.17.0`

To run together with a local instance of [Uttu](https://github.com/entur/uttu) on port 11701, add the following to [.env.development.local](.env.development.local).

```
UTTU_API_URL=http://localhost:11701/services/flexible-lines
```

## Authentication

Uses [Keycloak](http://www.keycloak.org/) to authenticate users.

## Testing

Uses [Jest](https://facebook.github.io/jest) for unit and reducer testing.

```
npm test
```

### Testing with GraphiQL
```
brew cask install graphiql
```

    POST https://api.dev.entur.io/timetable-admin/v1/flexible-lines/<provider>/graphql

Replace `<provider>` with the provider codespace of your choice.

HTTP-header:
```json
{
    "Authorization": "Bearer <token>"
}
```
