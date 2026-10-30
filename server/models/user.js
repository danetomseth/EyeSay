'use strict';
const mongoose = require('mongoose');

// Blink settings a client is allowed to change, with validation for each.
// Anything else in a request body is ignored.
const SETTINGS = {
    cursorDelay: (v) => Number.isFinite(v) && v >= 200 && v <= 5000,
    blinkRatio: (v) => Number.isFinite(v) && v > 0.2 && v < 1,
    blinkZero: (v) => Number.isFinite(v) && v > 0 && v < 1000,
    doubleBlink: (v) => typeof v === 'boolean',
    blinkActive: (v) => typeof v === 'boolean',
    calibrated: (v) => typeof v === 'boolean',
    blinkProfile: (v) => Array.isArray(v) && v.length <= 400 &&
        v.every((p) => p && Number.isFinite(p.x) && Number.isFinite(p.y)),
};

function pickSettings(body) {
    const out = {};
    if (!body || typeof body !== 'object') return out;
    for (const key of Object.keys(SETTINGS)) {
        let value = body[key];
        // Older clients sent numbers as strings (toFixed); accept those.
        if (typeof value === 'string' && value.trim() !== '' && !Number.isNaN(Number(value))) value = Number(value);
        if (key === 'blinkProfile' && Array.isArray(value)) value = value.map((p) => ({ x: Number(p && p.x), y: Number(p && p.y) }));
        if (value !== undefined && SETTINGS[key](value)) out[key] = value;
    }
    return out;
}

const schema = new mongoose.Schema({
    firstName: { type: String, required: true, trim: true, maxlength: 100 },
    lastName: { type: String, required: true, trim: true, maxlength: 100 },
    email: { type: String, required: true, unique: true, trim: true, maxlength: 254 },
    password: { type: String },
    salt: { type: String }, // only present on accounts still using the legacy sha1 hash
    role: { type: String, enum: ['user', 'admin', 'caregiver'], default: 'user' },
    cursorDelay: { type: Number, default: 750 },
    blinkRatio: { type: Number, default: 0.78 },
    blinkZero: { type: Number, default: 42 },
    doubleBlink: { type: Boolean, default: false },
    blinkActive: { type: Boolean, default: true },
    calibrated: { type: Boolean, default: false },
    blinkProfile: { type: [{ _id: false, x: Number, y: Number }], default: [] },
});

schema.methods.sanitize = function () {
    const obj = this.toObject({ versionKey: false });
    delete obj.password;
    delete obj.salt;
    return obj;
};

schema.statics.pickSettings = pickSettings;

module.exports = mongoose.models.User || mongoose.model('User', schema);
