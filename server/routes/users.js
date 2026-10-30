'use strict';
const express = require('express');
const User = require('../models/user');

// A user can only read and change their own settings.
module.exports = function usersRouter(requireUser) {
    const r = express.Router();
    r.use(requireUser);

    r.get('/me', (req, res) => {
        res.json(req.user.sanitize());
    });

    r.put('/me', async (req, res, next) => {
        try {
            const updates = User.pickSettings(req.body);
            if (!Object.keys(updates).length) return res.status(400).json({ error: 'No valid settings in request.' });
            req.user.set(updates);
            await req.user.save();
            res.json(req.user.sanitize());
        } catch (err) {
            next(err);
        }
    });

    return r;
};
