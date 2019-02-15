# Bestillingstransport / Order Transport

## Development
### Checking out on Windows
The paths are longish which may be trouble for windows devs. Both windows and git need some tweaks:

#### regedit
HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\FileSystem
LongPathsEnabled -> 1

#### gpedit.msc
Local Computer Policy -> Computer Configuration -> Administrative Templates -> System -> Filesystem
Enable Win32 long paths

#### git
git config --global core.longpaths true

### Running
To run OT for development, simply do:

```
npm install
npm run start-devenv
```

## Authentication

OT uses [Keycloak](http://www.keycloak.org/) to authenticate users.

### Technical details

User is redirected to Keycloak auth endpoint, and redirected back to OT on success.
The redirect payload contains a signed JWT, refresh token and idToken.

- The JWT is a base64-encoded string containing organisation ID, e-mail and roles, and is used in an Authorization header against the APIs.
- The IdToken contains information about the user.
- The refresh token is used by Keycloak-js to refresh the token (behind the scenes).


## Testing

Uses [Jest](https://facebook.github.io/jest) for unit and reducer testing.

```
npm test
```

Note: Requires a running instance of OT on [http://localhost:3001](http://localhost:3001).

### Teste med GraphiQL
```brew cask install graphiql```

POST https://api.dev.entur.io/timetable-admin/v1/flexible-lines/nsb/graphql
Bytt ut nsb med ønsket provider.

Header Authorization Bearer \<token>

Token finner du i chrome network log.

## GCloud
###Prerequisites to be made locally(one time setup)
* have a google user added to enturs gcloud account
* download and install gcloud sdk
* make sure python is in the path (bundled with gcloud sdk but doesn't add it to the path, so eg git bash doesn't see it)
* ```helm init --client-only```
* ```helm repo add entur https://entur-helm-charts.storage.googleapis.com```
* ```helm dependency update```
* ```gcloud components install kubectl```
* ```gcloud container clusters get-credentials entur --zone europe-west1-d --project entur-1287```
The deployment script should work fine after this.

###Secrets (one time setup)
```
kubectl create secret generic ot-credentials --from-literal=internal_client_id=7a4d6efb-91e9-44d6-8b11-ed51bf2fc6d6 --from-literal=internal_client_secret=e44a1e99-ecc4-4306-97cc-c0a873aa3979 --namespace=dev
```

###Deployment
Use **deploy.sh** {env} {version} {mode} to upgrade a deployment. Eg:
```
./deploy.sh dev master-v27
```
Parameters:
* env: dev/staging/prod
* version: docker image tag
* mode: value **reinstall** may be used to remove-reinstall the app (involves downtime), otherwise leave this parameter blank.

### Owners
Sondre Bjerkerud - frontend
Erlend Nilsen - backend Uttu