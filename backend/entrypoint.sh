#!/bin/sh
set -e

echo "Environment check:"
echo "PORT: ${PORT:-not set}"
echo "DATABASE_URL: ${DATABASE_URL:-not set}"

# Parse DATABASE_URL if set
if [ -n "$DATABASE_URL" ]; then
  echo "Parsing DATABASE_URL"
  
  # Convert postgresql:// to jdbc:postgresql://
  JDBC_URL="${DATABASE_URL/postgresql:\/\//jdbc:postgresql:\/\/}"
  
  # Add port 5432 if missing (after @hostname/ should be @hostname:5432/)
  if echo "$JDBC_URL" | grep -qE '@[^/]+/'; then
    JDBC_URL=$(echo "$JDBC_URL" | sed -E 's|@([^/]+)/|@\1:5432/|')
  fi
  
  export SPRING_DATASOURCE_URL="$JDBC_URL"
  echo "JDBC URL: $JDBC_URL"
fi

# Run the app
exec java -Dserver.port="${PORT:-8080}" -jar app.jar