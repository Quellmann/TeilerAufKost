#!/bin/sh
set -e

echo "Pulling latest Atlas data..."
mongodump --uri "$ATLAS_URI_PROD" --out /tmp/dump

echo "Restoring to local MongoDB..."
mongorestore --host mongo_database --port 27017 \
    --username root --password example \
    --authenticationDatabase admin --drop /tmp/dump/

echo "Sync completed!"