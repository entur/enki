#!/bin/bash -ex

imageTag=$1
token=8d1cdc99cbb5475896f6e5cca1472a3419374960742448d8812707b2bf2da78d
mapName=$(ls ./build/static/js | grep .js.map)
filePath="./build/static/js/$mapName"

curl https://sentry.io/api/0/projects/:entur-as-fm/:ordertransport/releases/ \
   -X POST \
   -H "Authorization: Bearer $token" \
   -H 'Content-Type: application/json' \
   -d "{/"version/": /"$imageTag/"" \

curl https://sentry.io/api/0/projects/:entur-as-fm/:ordertransport/releases/2da95dfb052f477380608d59d32b4ab9/files/ \
  -X POST \
  -H "Authorization: Bearer $token" \
  -F file=@$filePath \
  -F name="$mapName"

