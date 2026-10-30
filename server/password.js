'use strict';
// Password hashing with scrypt. Accounts created by the original app stored
// sha1(password + salt); those still verify, and `needsRehash` tells the caller
// to upgrade them to scrypt on the next successful login.

const crypto = require('crypto');
const { promisify } = require('util');

const scrypt = promisify(crypto.scrypt);
const KEYLEN = 64;
const PREFIX = 'scrypt$';

async function hash(plain) {
    const salt = crypto.randomBytes(16).toString('base64');
    const derived = await scrypt(plain, salt, KEYLEN);
    return `${PREFIX}${salt}$${derived.toString('base64')}`;
}

function safeEqual(a, b) {
    const bufA = Buffer.from(a);
    const bufB = Buffer.from(b);
    return bufA.length === bufB.length && crypto.timingSafeEqual(bufA, bufB);
}

// `user` is { password, salt } as stored on the model.
async function verify(plain, user) {
    if (!user || !user.password || typeof plain !== 'string') return false;
    if (user.password.startsWith(PREFIX)) {
        const [salt, expected] = user.password.slice(PREFIX.length).split('$');
        const derived = await scrypt(plain, salt, KEYLEN);
        return safeEqual(derived.toString('base64'), expected);
    }
    if (!user.salt) return false;
    const legacy = crypto.createHash('sha1').update(plain).update(user.salt).digest('hex');
    return safeEqual(legacy, user.password);
}

function needsRehash(user) {
    return !user.password.startsWith(PREFIX);
}

module.exports = { hash, verify, needsRehash };
