require('dotenv').config({
    path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env'
});

const env = (key, defaultValue = null) => process.env[key] || defaultValue;
const isEnabled = (key) => env(key) && env(key) === 'true';

if (!['production', 'development', 'test'].includes(env('NODE_ENV'))) {
    console.log('NODE_ENV has wrong option');
    process.exit();
}

const config = {
    app: {
        env: env('NODE_ENV'),
        url: env('APP_URL', 'http://localhost:3001'),
        port: parseInt(env('PORT', 3001)),
        frontendUrl: env('APP_FRONTEND_URL'),
        adminUrl: env('APP_ADMIN_URL'),
        corsSites: env('APP_CORS_SITES', ''),
        routesWithoutBodyParser: env('APP_ROUTES_WITHOUT_BODY_PARSER', ''),
        jsonRequestSizeLimit: env('APP_JSON_REQUEST_SIZE_LIMIT', '1mb')
    },
    session: {
        secret: env('SESSION_SECRET')
    },
    db: {
        url: env('DATABASE_URL'),
        host: env('DATABASE_HOST', 'localhost'),
        name: env('DATABASE_NAME'),
        username: env('DATABASE_USERNAME'),
        password: env('DATABASE_PASSWORD'),
        port: parseInt(env('DATABASE_PORT'), 27017),
        logging: isEnabled('SEQUELIZE_LOGGING') ? console.log : false,
        define: {
            charset: 'utf8mb4',
            collate: 'utf8mb4_unicode_ci',
            timestamps: false
        },
        dialect: 'mysql'
    },
    authentication: {
        jwtSecret: process.env.JWT_SECRET || 'secret'
    }
};

module.exports = config;
