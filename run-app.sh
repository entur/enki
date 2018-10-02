#!/bin/bash -e

docker rm -f op-ui | true
docker run --name ot -d -p 9000:9000 -e UTTU_API_URL=https://api.dev.entur.io/timetable-admin/v1/flexible-lines/rut
