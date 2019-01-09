#!/bin/bash -e

docker rm -f order-transport | true
docker run --name order-transport -d -p 9000:9000 -e APP_PORT=9000 -e AUTH_SERVER_URL=https://kc-dev.devstage.entur.io/auth -e ORGANISATIONS_API_URL=https://dev.devstage.entur.io/organisations/v1 -e UTTU_API_URL=https://api.dev.entur.io/timetable-admin/v1/flexible-lines entur/order-transport
