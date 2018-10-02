#!/bin/bash -e

./build-app.sh
./build-docker-image.sh
./run-app.sh
