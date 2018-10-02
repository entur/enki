#!/bin/bash -e

environment=$1
application=order-transport

if [ -z "$environment" ]
then
    echo "Provide environment as the first parameter"
    exit 1
fi

kubectl -n $environment logs $(kubectl -n $environment get pods | grep $application-$environment | grep Running | awk '{ print $1 }') -c $application