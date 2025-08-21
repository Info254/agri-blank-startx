# Start services
docker compose up -d

# Wait for database to be ready
echo "Waiting for database to be ready..."
sleep 10

# Run migrations
echo "Running migrations..."
PGPASSWORD=postgres psql -h localhost -U postgres -d postgres -f supabase/migrations/20250819000000_farm_statistics_system.sql
PGPASSWORD=postgres psql -h localhost -U postgres -d postgres -f supabase/migrations/20250819010000_farm_statistics_advanced.sql

# Verify migrations
echo "Verifying migrations..."
PGPASSWORD=postgres psql -h localhost -U postgres -d postgres -c "\dt"

# Run tests if they exist
if [ -f "supabase/tests/farm_statistics_test.sql" ]; then
    echo "Running tests..."
    PGPASSWORD=postgres psql -h localhost -U postgres -d postgres -f supabase/tests/farm_statistics_test.sql
fi
