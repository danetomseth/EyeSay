'use strict';
const http = require('http');
const mongoose = require('mongoose');
const config = require('./config');
const createApp = require('./app');

async function main() {
    let sessionStore;
    const accounts = Boolean(config.databaseUri);

    if (accounts) {
        await mongoose.connect(config.databaseUri);
        const { MongoStore } = require('connect-mongo');
        sessionStore = MongoStore.create({ client: mongoose.connection.getClient(), touchAfter: 24 * 3600 });
        console.log('MongoDB connected — accounts enabled');
    } else {
        console.log('No MONGODB_URI set — running in guest-only mode (settings are saved in the browser)');
    }

    const app = createApp({
        production: config.production,
        sessionSecret: config.sessionSecret,
        accounts,
        sessionStore,
    });

    const server = http.createServer(app);
    server.listen(config.port, () => console.log(`(Eye)Say listening on http://localhost:${config.port}`));

    const shutdown = () => {
        server.close(() => mongoose.disconnect().finally(() => process.exit(0)));
        setTimeout(() => process.exit(0), 5000).unref();
    };
    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
