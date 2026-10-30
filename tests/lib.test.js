'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const lib = require('../browser/js/lib/eyesay.js');
const words = require('../browser/js/lib/words.js');
const corpus = require('../browser/js/lib/corpus.js');

// 71 clmtrackr points; set eyelid y-coordinates so each eye has a given opening.
function face(leftOpen, rightOpen) {
    const p = Array.from({ length: 71 }, () => [0, 0]);
    [29, 67, 68].forEach((i) => { p[i] = [0, 100]; });
    [31, 69, 70].forEach((i) => { p[i] = [0, 100 + leftOpen / 3]; });
    [24, 63, 64].forEach((i) => { p[i] = [0, 100]; });
    [26, 65, 66].forEach((i) => { p[i] = [0, 100 + rightOpen / 3]; });
    return p;
}

test('eyeOpenness uses both eyes', () => {
    assert.equal(lib.eyeOpenness(face(20, 22)), 42);
    // The original runtime check counted the left eye twice; a right-eye-only change must register.
    assert.ok(lib.eyeOpenness(face(20, 2)) < lib.eyeOpenness(face(20, 22)));
});

test('BlinkDetector fires once per blink and ignores held closures', () => {
    const d = new lib.BlinkDetector(150);
    const zero = 42, ratio = 0.78;
    assert.equal(d.update(42, zero, ratio, 0), null);
    assert.equal(d.update(20, zero, ratio, 16), 'singleBlink');
    for (let t = 32; t <= 600; t += 16) {
        assert.equal(d.update(20, zero, ratio, t), null, 'held closed: one blink only');
    }
    assert.equal(d.update(42, zero, ratio, 616), null);
    assert.equal(d.update(20, zero, ratio, 700), null, 'reopened for < 150ms (flicker)');
    assert.equal(d.update(42, zero, ratio, 716), null);
    assert.equal(d.update(20, zero, ratio, 900), 'singleBlink');
});

test('BlinkDetector tolerates missing calibration', () => {
    const d = new lib.BlinkDetector();
    assert.equal(d.update(10, undefined, 0.78, 0), null);
    assert.equal(d.update(NaN, 42, 0.78, 0), null);
});

test('trimmedMean drops the extremes', () => {
    const values = Array.from({ length: 100 }, (_, i) => i);
    assert.equal(lib.trimmedMean(values, 0.2, 0.9), (20 + 89) / 2);
    assert.equal(lib.trimmedMean([5], 0.2, 1), 5);
});

test('Predictor completes prefixes by frequency and handles punctuation safely', () => {
    const p = new lib.Predictor(words, corpus);
    assert.deepEqual(p.complete('HI', 3), ['his', 'him', 'high']);
    assert.deepEqual(p.complete('.'), []);
    assert.doesNotThrow(() => p.complete('(['));
    assert.doesNotThrow(() => p.complete('C++'));
});

test('Predictor suggests next words from bigrams and learns', () => {
    const p = new lib.Predictor(words, corpus);
    assert.ok(p.next('the').length === 5);
    assert.ok(!p.next('zebra').includes('crossing'));
    p.learn('zebra crossing ahead');
    p.learn('zebra crossing now');
    assert.equal(p.next('zebra')[0], 'crossing');
    assert.equal(p.complete('zeb')[0], 'zebra', "user's own words come first");
    const restored = new lib.Predictor(words, corpus, JSON.parse(JSON.stringify(p.exportLearned())));
    assert.equal(restored.next('zebra')[0], 'crossing');
});

test('ticTacToeWinner checks every line', () => {
    const lines = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
    for (const line of lines) {
        const board = Array(9).fill('');
        line.forEach((i) => { board[i] = 'O'; });
        assert.equal(lib.ticTacToeWinner(board), 'O', `line ${line}`);
    }
    assert.equal(lib.ticTacToeWinner(['X', 'O', 'X', 'X', 'O', 'O', 'O', 'X', 'X']), null);
});
