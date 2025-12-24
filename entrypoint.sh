#!/bin/bash

# Wait for database to be ready
echo "Waiting for database to be ready..."
until php artisan migrate:status > /dev/null 2>&1; do
    echo "Database not ready, waiting..."
    sleep 2
done

# Install PHP dependencies if not present
if [ ! -f vendor/autoload.php ]; then
    echo "Installing PHP dependencies..."
    composer install --no-dev --optimize-autoloader
fi

# Install Node dependencies if not present
if [ ! -d node_modules ]; then
    echo "Installing Node dependencies..."
    npm install
fi

# Build assets if not present
if [ ! -d public/build ]; then
    echo "Building assets..."
    npm run build
fi

# Generate app key if not set
if [ -z "$APP_KEY" ] || [ "$APP_KEY" = "" ]; then
    echo "Generating app key..."
    php artisan key:generate
fi

# Run migrations
echo "Running migrations..."
php artisan migrate --force

# Execute the main command
exec "$@"
