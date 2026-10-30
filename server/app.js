'use strict';
const path = require('path');
const fs = require('fs');
const express = require('express');
const compression = require('compression');
const helmet = require('helmet');
const session = require('express-session');

const ROOT = path.join(__dirname, '..');
const PUBLIC = path.join(ROOT, 'public');
const ASSETS = path.join(ROOT, 'browser', 'assets');

// options.accounts: true when a database is connected (enables login/signup)
// options.sessionStore: express-session store (defaults to in-memory)
function createApp({ production = false, sessionSecret, accounts = false, sessionStore } = {}) {
    const app = express();
    app.disable('x-powered-by');

    if (production) {
        app.set('trust proxy', 1);
        app.use((req, res, next) => {
            if (req.secure) return next();
            res.redirect(301, `https://${req.headers.host}${req.originalUrl}`);
        });
    }

    app.use(helmet({
        strictTransportSecurity: production,
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                // AngularJS evaluates template expressions with Function().
                scriptSrc: ["'self'", "'unsafe-eval'"],
                styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
                fontSrc: ["'self'", 'https://fonts.gstatic.com', 'data:'],
                imgSrc: ["'self'", 'data:', 'blob:'],
                mediaSrc: ["'self'", 'blob:'],
                connectSrc: ["'self'"],
                upgradeInsecureRequests: production ? [] : null,
            },
        },
    }));
    app.use((req, res, next) => {
        // The app only ever needs the camera, and only on our own origin.
        res.setHeader('Permissions-Policy', 'camera=(self), microphone=(), geolocation=()');
        next();
    });
    app.use(compression());

    // Built bundle: URLs carry a content hash (?v=...), so cache aggressively.
    app.use(express.static(PUBLIC, { index: false, maxAge: '1y', immutable: true }));
    app.use('/assets', express.static(ASSETS, { maxAge: '7d' }));
    app.get('/favicon.ico', (req, res) => res.sendFile(path.join(__dirname, 'views', 'favicon.ico'), { maxAge: '7d' }));

    app.use(express.json({ limit: '100kb' }));

    app.use(session({
        name: 'eyesay.sid',
        secret: sessionSecret,
        store: sessionStore,
        resave: false,
        saveUninitialized: false,
        cookie: { httpOnly: true, sameSite: 'lax', secure: production, maxAge: 30 * 24 * 3600 * 1000 },
    }));

    if (accounts) {
        const auth = require('./auth');
        app.use(auth.loadUser);
        app.use(auth.router());
        app.use('/api/users', require('./routes/users')(auth.requireUser));
    } else {
        app.use(['/login', '/signup', '/api/users'], (req, res, next) => {
            if (req.method === 'GET') return next();
            res.status(503).json({ error: 'Accounts are not enabled on this server.' });
        });
    }

    app.get('/session', (req, res) => {
        res.set('Cache-Control', 'no-store');
        res.json({ accounts, user: req.user ? req.user.sanitize() : null });
    });

    app.use('/api', (req, res) => res.status(404).json({ error: 'Not found' }));

    // Anything that looks like a file and wasn't served above is a real 404.
    app.use((req, res, next) => (path.extname(req.path) ? res.status(404).end() : next()));

    // Single-page app: every other GET gets index.html.
    const indexPath = path.join(PUBLIC, 'index.html');
    app.get('/{*splat}', (req, res) => {
        if (!fs.existsSync(indexPath)) return res.status(500).send('Bundle not built. Run `npm run build`.');
        res.set('Cache-Control', 'no-cache');
        res.sendFile(indexPath);
    });

    // eslint-disable-next-line no-unused-vars
    app.use((err, req, res, next) => {
        const status = err.status || err.statusCode || 500;
        if (status >= 500) console.error(err);
        res.status(status).json({ error: status >= 500 ? 'Internal server error' : err.message });
    });

    return app;
}

module.exports = createApp;
