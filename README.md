# Enki
![Build and deploy](https://github.com/entur/enki/actions/workflows/build-and-deploy.yml/badge.svg)
 [![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=entur_enki&metric=alert_status)](https://sonarcloud.io/dashboard?id=entur_enki)

Frontend app for Nplan - a simple timetable editor. Backend is [Uttu](https://github.com/entur/uttu).

## Development

To run for development, simply do:

```
npm install
npm start
```

Note: The app use Node v14. `nvm use v14`

To run together with a local instance of [Uttu](https://github.com/entur/uttu) on port 11701, change `uttuApiUrl` in `src/config/environments/dev.json`.

## Authentication

Uses Auth0 to authenticate users.

## Testing

Uses [Jest](https://facebook.github.io/jest) for unit and reducer testing.

```
npm test
```
