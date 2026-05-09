#!/bin/sh
set -e

# Parse DATABASE_URL if set (format: postgres://user:password@host:port/database)
if [ -n "$DATABASE_URL" ]; then
  # Extract components from DATABASE_URL
  DB_USER=$(echo "$DATABASE_URL" | sed -E 's/postgres:\/\/([^:]+):.*/\1/')
  DB_PASSWORD=$(echo "$DATABASE_URL" | sed -E 's/postgres:\/\/[^:]+:([^@]+)@.*/\1/')
  DB_HOST=$(echo "$DATABASE_URL" | sed -E 's/postgres:\/\/[^@]+@([^:]+):.*/\1/')
  DB_PORT=$(echo "$DATABASE_URL" | sed -E 's/postgres:\/\/[^@]+@[^:]+:([^/]+)\/.*/\1/')
  DB_NAME=$(echo "$DATABASE_URL" | sed -E 's/postgres:\/\/[^@]+@[^/]+\/([^?]*).*/\1/')
  
  # Export as Spring datasource properties
  export SPRING_DATASOURCE_URL="jdbc:postgresql://${DB_HOST}:${DB_PORT}/${DB_NAME}"
  export SPRING_DATASOURCE_USERNAME="$DB_USER"
  export SPRING_DATASOURCE_PASSWORD="$DB_PASSWORD"
fi

# Run the app
java -Dserver.port="${PORT:-8080}" -jar app.jar