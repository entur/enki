# Enki
![Build and deploy](https://github.com/entur/enki/actions/workflows/build-and-publish.yml/badge.svg?event=push)
 [![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=entur_enki&metric=alert_status)](https://sonarcloud.io/dashboard?id=entur_enki)

Frontend app for Nplan - a simple timetable editor. Backend is [Uttu](https://github.com/entur/uttu).

## Development

To run for development, simply do:

```
npm install
npm start
```

Note: The app uses Node version 18 (LTS).

To run together with a local instance of [Uttu](https://github.com/entur/uttu) on port 11701, add the following to `.env.development.local`.

```
REACT_APP_UTTU_API_URL=http://localhost:11701/services/flexible-lines
```

## Configuration

Configuration is bootstrapped from `/bootstrap.json`, when the app loads. You should add your environment-specific
config to the deployment, along with the built static files (i.e. in the `build/` folder).

For local development, add a `bootstrap.json` file to the `public/` folder.

See `src/config/ConfigContext.ts` for the shape of the configuration.

## Authentication

Uses OIDC for authentication. This solution is agnostic to which authentication provider you use.

Example configuration (works with Auth0):

```json
"oidcConfig": {
  "authority": "https://<authentication domain>",
  "client_id": "<client id>",
  "extraQueryParams": {
    "audience": "<example audience>"
  }
},
  ```

For full configuration reference, see [oidc-client-ts documentation](https://authts.github.io/oidc-client-ts/interfaces/UserManagerSettings.html).

## Testing

Uses [Jest](https://facebook.github.io/jest) for unit and reducer testing.

```
npm test
```
