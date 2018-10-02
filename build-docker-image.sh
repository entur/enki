#!/bin/bash -e

docker build --tag='entur/order-transport' --build-arg BUILD_DATE=local-build .