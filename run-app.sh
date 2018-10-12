#!/bin/bash -e

docker rm -f order-transport | true
docker run --name order-transport -d -p 9000:9000 -e UTTU_API_URL=https://api.dev.entur.io/timetable-admin/v1/flexible-lines entur/order-transport
