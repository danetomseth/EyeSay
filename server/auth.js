'use strict';
// Session-based email/password accounts. Only mounted when a database is configured.

const express = require('express');
const rateLimit = require('express-rate-limit');
const User = require('./models/user');
const password = require('./password');

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD = 8;

const normalizeEmail = (email) => (typeof email === 'string' ? email.trim().toLowerCase() : '');
const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

function startSession(req, user) {
    // Regenerate to prevent session fixation.
    return new Promise((resolve, reject) => {
        req.session.regenerate((err) => {
            if (err) return reject(err);
            req.session.userId = user.id;
            req.session.save((saveErr) => (saveErr ? reject(saveErr) : resolve()));
        });
    });
}

// Loads req.user from the session, if any.
async function loadUser(req, res, next) {
    try {
        if (req.session && req.session.userId) {
            req.user = await User.findById(req.session.userId);
            if (!req.user) delete req.session.userId;
        }
        next();
    } catch (err) {
        next(err);
    }
}

function requireUser(req, res, next) {
    if (!req.user) return res.status(401).json({ error: 'Not logged in' });
    next();
}

function router() {
    const r = express.Router();
    const limiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 20, standardHeaders: 'draft-8', legacyHeaders: false });

    r.post('/signup', limiter, async (req, res, next) => {
        try {
            const body = req.body || {};
            const email = normalizeEmail(body.email);
            const firstName = typeof body.firstName === 'string' ? body.firstName.trim() : '';
            const lastName = typeof body.lastName === 'string' ? body.lastName.trim() : '';
            if (!EMAIL_RE.test(email)) return res.status(400).json({ error: 'Please enter a valid email address.' });
            if (!firstName || !lastName) return res.status(400).json({ error: 'Please enter your first and last name.' });
            if (typeof body.password !== 'string' || body.password.length < MIN_PASSWORD) {
                return res.status(400).json({ error: `Password must be at least ${MIN_PASSWORD} characters.` });
            }
            if (await User.exists({ email })) return res.status(409).json({ error: 'An account with that email already exists.' });

            // A guest who calibrated before signing up keeps their calibration.
            const user = await User.create({
                ...User.pickSettings(body.settings),
                firstName,
                lastName,
                email,
                password: await password.hash(body.password),
            });
            await startSession(req, user);
            res.status(201).json({ user: user.sanitize() });
        } catch (err) {
            if (err && err.code === 11000) return res.status(409).json({ error: 'An account with that email already exists.' });
            next(err);
        }
    });

    r.post('/login', limiter, async (req, res, next) => {
        try {
            const body = req.body || {};
            const email = normalizeEmail(body.email);
            // Accounts from the original app may have stored email with mixed case.
            const user = await User.findOne({ email }) ||
                (email && await User.findOne({ email: new RegExp(`^${escapeRegex(email)}$`, 'i') }));
            if (!user || !(await password.verify(body.password, user))) {
                return res.status(401).json({ error: 'Invalid login credentials.' });
            }
            if (password.needsRehash(user)) {
                user.password = await password.hash(body.password);
                user.salt = undefined;
                await user.save();
            }
            await startSession(req, user);
            res.json({ user: user.sanitize() });
        } catch (err) {
            next(err);
        }
    });

    r.post('/logout', (req, res, next) => {
        req.session.destroy((err) => {
            if (err) return next(err);
            res.clearCookie('eyesay.sid');
            res.status(204).end();
        });
    });

    return r;
}

module.exports = { router, loadUser, requireUser };
