'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const crypto = require('crypto');
const request = require('supertest');
const mongoose = require('mongoose');
const createApp = require('../server/app');

let mongod;
let app;
let User;

test.before(async () => {
    const { MongoMemoryServer } = require('mongodb-memory-server-core');
    mongod = await MongoMemoryServer.create();
    await mongoose.connect(mongod.getUri());
    User = require('../server/models/user');
    await User.init();
    app = createApp({ sessionSecret: 'test-secret', accounts: true });
});

test.after(async () => {
    await mongoose.disconnect();
    if (mongod) await mongod.stop();
});

const signup = (agent, overrides = {}) => agent.post('/signup').send({
    firstName: 'Ada',
    lastName: 'Lovelace',
    email: 'ada@example.com',
    password: 'correct horse',
    ...overrides,
});

test('signup creates a session, hashes with scrypt, ignores privileged fields', async () => {
    const agent = request.agent(app);
    const res = await signup(agent, { role: 'admin', settings: { blinkZero: 50, blinkRatio: 0.7, calibrated: true } });
    assert.equal(res.status, 201);
    assert.equal(res.body.user.password, undefined);
    assert.equal(res.body.user.salt, undefined);
    assert.equal(res.body.user.role, 'user');
    assert.equal(res.body.user.blinkZero, 50, 'guest calibration carried over');

    const stored = await User.findOne({ email: 'ada@example.com' });
    assert.match(stored.password, /^scrypt\$/);

    const session = await agent.get('/session');
    assert.equal(session.body.accounts, true);
    assert.equal(session.body.user.email, 'ada@example.com');
});

test('signup validates input and rejects duplicate emails', async () => {
    assert.equal((await signup(request(app), { email: 'not-an-email' })).status, 400);
    assert.equal((await signup(request(app), { email: 'x@example.com', password: 'short' })).status, 400);
    assert.equal((await signup(request(app), { email: 'ADA@example.com' })).status, 409);
});

test('settings: only whitelisted, valid fields can be changed, and only by the owner', async () => {
    const agent = request.agent(app);
    await agent.post('/login').send({ email: 'ada@example.com', password: 'correct horse' }).expect(200);

    const res = await agent.put('/api/users/me').send({ cursorDelay: 900, blinkRatio: '0.81', role: 'admin', email: 'evil@example.com' });
    assert.equal(res.status, 200);
    assert.equal(res.body.cursorDelay, 900);
    assert.equal(res.body.blinkRatio, 0.81);
    assert.equal(res.body.role, 'user');
    assert.equal(res.body.email, 'ada@example.com');

    assert.equal((await agent.put('/api/users/me').send({ cursorDelay: -5 })).status, 400);
    assert.equal((await agent.put('/api/users/me').send({ blinkProfile: Array(1000).fill({ x: 1, y: 1 }) })).status, 400);

    assert.equal((await request(app).put('/api/users/me').send({ cursorDelay: 900 })).status, 401);
    assert.equal((await request(app).get('/api/users/me')).status, 401);
});

test('login rejects bad credentials; logout ends the session', async () => {
    assert.equal((await request(app).post('/login').send({ email: 'ada@example.com', password: 'nope' })).status, 401);
    assert.equal((await request(app).post('/login').send({ email: 'nobody@example.com', password: 'x' })).status, 401);

    const agent = request.agent(app);
    await agent.post('/login').send({ email: 'ADA@Example.com', password: 'correct horse' }).expect(200);
    await agent.post('/logout').expect(204);
    assert.equal((await agent.get('/session')).body.user, null);
});

test('accounts from the original app (sha1) still log in and are upgraded to scrypt', async () => {
    const salt = crypto.randomBytes(16).toString('base64');
    const legacyHash = crypto.createHash('sha1').update('old password').update(salt).digest('hex');
    await User.collection.insertOne({ firstName: 'Old', lastName: 'User', email: 'Old.User@Example.com', password: legacyHash, salt });

    const res = await request(app).post('/login').send({ email: 'old.user@example.com', password: 'old password' });
    assert.equal(res.status, 200);
    const upgraded = await User.collection.findOne({ email: 'Old.User@Example.com' });
    assert.match(upgraded.password, /^scrypt\$/);
    assert.equal(upgraded.salt, undefined);

    await request(app).post('/login').send({ email: 'old.user@example.com', password: 'old password' }).expect(200);
    await request(app).post('/login').send({ email: 'old.user@example.com', password: 'wrong' }).expect(401);
});

test('guest-only mode: app works without a database, account endpoints say so', async () => {
    const guest = createApp({ sessionSecret: 'x', accounts: false });
    const session = await request(guest).get('/session');
    assert.deepEqual(session.body, { accounts: false, user: null });
    assert.equal((await request(guest).post('/login').send({})).status, 503);
    assert.equal((await request(guest).put('/api/users/me').send({})).status, 503);
});

test('static hardening: no node_modules exposure, security headers, unknown files 404', async () => {
    const res = await request(app).get('/angular/angular.js');
    assert.equal(res.status, 404);
    assert.equal((await request(app).get('/api/words/..%2f..%2fpackage')).status, 404);
    const home = await request(app).get('/settings');
    assert.ok(home.headers['content-security-policy']);
    assert.equal(home.headers['x-powered-by'], undefined);
});
