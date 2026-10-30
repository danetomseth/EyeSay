'use strict';
// All configuration comes from environment variables.
//
//   PORT            port to listen on (default 1337)
//   MONGODB_URI     enables user accounts; without it the app runs in guest-only mode
//   SESSION_SECRET  required when MONGODB_URI is set in production
//   NODE_ENV        'production' turns on HTTPS redirect, secure cookies, trust proxy

const crypto = require('crypto');

const production = process.env.NODE_ENV === 'production';
const databaseUri = process.env.MONGODB_URI || null;

let sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
    if (production && databaseUri) {
        throw new Error('SESSION_SECRET must be set in production when MONGODB_URI is set');
    }
    // Development only: a random secret means sessions reset on restart, which is fine.
    sessionSecret = crypto.randomBytes(32).toString('hex');
}

module.exports = {
    production,
    port: Number(process.env.PORT) || 1337,
    databaseUri,
    sessionSecret,
};
