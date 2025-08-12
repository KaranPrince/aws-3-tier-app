// DbConfig.js

require('dotenv').config(); // Loads variables from .env in local/dev environments

module.exports = {
    host: process.env.DB_HOST || "localhost", // Default to localhost for dev
    user: process.env.DB_USER || "root",      // Default user for dev
    password: process.env.DB_PASS || "",      // Default password for dev
    database: process.env.DB_NAME || "transactions",
    port: process.env.DB_PORT || 3306         // Optional, defaults to 3306 for MySQL
};
