#!/bin/sh
set -e

echo "Environment check:"
echo "PORT: ${PORT:-not set}"
echo "DATABASE_URL: ${DATABASE_URL:-not set}"
echo "PGHOST: ${PGHOST:-not set}"

# Try PG variables first (Render PostgreSQL service provides these)
if [ -n "$PGHOST" ] && [ -n "$PGDATABASE" ]; then
  echo "Using PG* environment variables"
  JDBC_URL="jdbc:postgresql://${PGHOST}:${PGPORT:-5432}/${PGDATABASE}"
  export SPRING_DATASOURCE_URL="$JDBC_URL"
  export SPRING_DATASOURCE_USERNAME="${PGUSER}"
  export SPRING_DATASOURCE_PASSWORD="${PGPASSWORD}"
  echo "JDBC URL: $JDBC_URL"
elif [ -n "$DATABASE_URL" ]; then
  echo "Using DATABASE_URL"
  
  # Handle both postgres:// and postgresql:// schemes
  if echo "$DATABASE_URL" | grep -q '^postgres://'; then
    CLEAN_URL=$(echo "$DATABASE_URL" | sed 's|^postgres://|jdbc:postgresql://|')
  elif echo "$DATABASE_URL" | grep -q '^postgresql://'; then
    CLEAN_URL=$(echo "$DATABASE_URL" | sed 's|^postgresql://|jdbc:postgresql://|')
  else
    CLEAN_URL="$DATABASE_URL"
  fi
  
  export SPRING_DATASOURCE_URL="$CLEAN_URL"
  echo "JDBC URL: $CLEAN_URL"
fi

# Run the app
exec java -Dserver.port="${PORT:-8080}" -jar app.jar