#!/bin/sh

# 1. Pull dump from Atlas
echo "Pulling latest Atlas data..."
mongodump --uri "$ATLAS_URI" --out /tmp/dump

# 2. Restore to local MongoDB
echo "Restoring to local MongoDB..."
mongorestore --host mongo_database --port 27017 \
    --username root --password example --authenticationDatabase admin --drop /tmp/dump/

# 3. Start backend server
echo "Starting backend..."
exec npm run dev
