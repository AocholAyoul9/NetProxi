#!/bin/sh
set -e

# Parse DATABASE_URL if set (Render provides: postgres://user:password@host:port/database)
if [ -n "$DATABASE_URL" ]; then
  echo "DATABASE_URL is set, parsing..."
  
  # Extract components
  DB_USER=$(echo "$DATABASE_URL" | sed -E 's/postgres:\/\/([^:]+):.*/\1/')
  DB_PASSWORD=$(echo "$DATABASE_URL" | sed -E 's/postgres:\/\/[^:]+:([^@]+)@.*/\1/')
  DB_HOST=$(echo "$DATABASE_URL" | sed -E 's/postgres:\/\/[^@]+@([^:]+):.*/\1/')
  DB_PORT=$(echo "$DATABASE_URL" | sed -E 's/postgres:\/\/[^@]+@[^:]+:([0-9]+)\/.*/\1/')
  DB_NAME=$(echo "$DATABASE_URL" | sed -E 's/postgres:\/\/[^@]+@[^/]+\/([^?]*).*/\1/')
  
  echo "Host: $DB_HOST, Port: $DB_PORT, DB: $DB_NAME, User: $DB_USER"
  
  # Export JDBC URL and credentials for Spring Boot
  export SPRING_DATASOURCE_URL="jdbc:postgresql://${DB_HOST}:${DB_PORT}/${DB_NAME}"
  export SPRING_DATASOURCE_USERNAME="$DB_USER"
  export SPRING_DATASOURCE_PASSWORD="$DB_PASSWORD"
else
  echo "DATABASE_URL not set, using application.properties defaults"
fi

# Run the app
exec java -Dserver.port="${PORT:-8080}" -jar app.jar