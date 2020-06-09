# Bestillingstransport / Flexible transport (FT) [![CircleCI](https://circleci.com/gh/entur/flexible-transport.svg?style=svg)](https://circleci.com/gh/entur/flexible-transport)

~Note: This project was previously called Order-transport (OT).~

## Development

To run FT for development, simply do:

```
npm install
npm run start-devenv
```
Note: The app use Node v8. `nvm use v8.17.0`

To run together with a local instance of [Uttu](https://github.com/entur/uttu) on port 11701, add the following to your env:

```
UTTU_API_URL=http://localhost:11701/services/flexible-lines
```

## Authentication

FT uses [Keycloak](http://www.keycloak.org/) to authenticate users.

### Technical details

The user is redirected to the Keycloak auth endpoint, and redirected back to OT on success.
The redirect payload contains a signed JWT, refresh token and idToken.

- The JWT is a base64-encoded string containing organisation ID, e-mail and roles, and is used in an Authorization header against the APIs.
- The IdToken contains information about the user.
- The refresh token is used by Keycloak-js to refresh the token (behind the scenes).


## Testing

Uses [Jest](https://facebook.github.io/jest) for unit and reducer testing.

```
npm test
```

### Testing with GraphiQL
```
brew cask install graphiql
```

POST https://api.dev.entur.io/timetable-admin/v1/flexible-lines/nsb/graphql
Bytt ut NSB med ønsket provider.

HTTP-header:
```json
{
    "Authorization": "Bearer <token>"
}
```

Token finner du i chrome network log.

## GCloud

### Prerequisites to be made locally (one time setup)
* Have a google user added to enturs gcloud account
* Download and install the gcloud sdk
* Make sure python is on the path (bundled with gcloud sdk but doesn't add it to the path, so e.g. git bash doesn't see it)
* ```helm init --client-only```
* ```helm repo add entur https://entur-helm-charts.storage.googleapis.com```
* ```helm dependency update```
* ```gcloud components install kubectl```
* ```gcloud container clusters get-credentials entur --zone europe-west1-d --project entur-1287```
The deployment script should work fine after this.

### Secrets (one time setup)
```
kubectl create secret generic ot-credentials --from-literal=internal_client_id=7a4d6efb-91e9-44d6-8b11-ed51bf2fc6d6 --from-literal=internal_client_secret=e44a1e99-ecc4-4306-97cc-c0a873aa3979 --namespace=dev
```

### Deployment
Use **deploy.sh** {env} {version} {mode} to upgrade a deployment. Eg:
```
./deploy.sh dev master-v27
```
Parameters:
* env: dev/staging/prod
* version: docker image tag
* mode: value **reinstall** may be used to remove-reinstall the app (involves downtime), otherwise leave this parameter blank.
