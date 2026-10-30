/*
 * Framework-free logic shared by the Angular factories. Kept separate so it can
 * be unit tested in Node (see tests/lib.test.js).
 */
(function (root) {
    'use strict';
    var lib = root.EyeSayLib = root.EyeSayLib || {};

    // ---------------------------------------------------------------------
    // Eye openness from clmtrackr's 71 face points.
    // Each eye: (lower lid points) - (upper lid points), summed over both eyes.
    // Left eye: upper 29/67/68, lower 31/69/70. Right eye: upper 24/63/64, lower 26/65/66.
    lib.eyeOpenness = function (p) {
        var left = (p[69][1] + p[31][1] + p[70][1]) - (p[68][1] + p[29][1] + p[67][1]);
        var right = (p[66][1] + p[26][1] + p[65][1]) - (p[63][1] + p[24][1] + p[64][1]);
        return left + right;
    };

    // ---------------------------------------------------------------------
    // Blink detection. A frame is "closed" when openness / openZero drops below
    // the user's calibrated ratio. A blink fires on a closed frame only if the eye
    // has been open for at least `minOpenMs` since the previous closed frame, so a
    // single blink (or a held closure) never fires twice.
    function BlinkDetector(minOpenMs) {
        this.minOpenMs = minOpenMs || 150;
        this.lastClosed = -Infinity;
    }
    BlinkDetector.prototype.update = function (openness, openZero, ratio, now) {
        if (!(openZero > 0) || !isFinite(openness)) return null;
        if (openness / openZero >= ratio) return null;
        var openFor = now - this.lastClosed;
        this.lastClosed = now;
        return openFor >= this.minOpenMs ? 'singleBlink' : null;
    };
    BlinkDetector.prototype.reset = function () {
        this.lastClosed = -Infinity;
    };
    lib.BlinkDetector = BlinkDetector;

    // Mean of the values between two percentiles (drops outliers at both ends).
    lib.trimmedMean = function (values, lowFrac, highFrac) {
        if (!values.length) return NaN;
        var sorted = values.slice().sort(function (a, b) { return a - b; });
        var lo = Math.floor(sorted.length * lowFrac);
        var hi = Math.max(lo + 1, Math.ceil(sorted.length * highFrac));
        var slice = sorted.slice(lo, hi);
        return slice.reduce(function (s, v) { return s + v; }, 0) / slice.length;
    };

    // ---------------------------------------------------------------------
    // Word prediction: prefix completion from a frequency-ranked word list, and
    // next-word suggestions from bigram counts (seed phrases + what the user says).
    var WORD_RE = /[a-z0-9']+/g;
    function tokens(text) {
        return (String(text).toLowerCase().replace(/[‘’]/g, "'").match(WORD_RE) || []);
    }

    function Predictor(rankedWords, corpus, learned) {
        this.words = rankedWords.map(function (w) { return w.toLowerCase(); });
        this.bigrams = Object.create(null); // word -> { next: count }
        this.starts = Object.create(null);  // first word of a sentence -> count
        this.learnedWords = Object.create(null);
        var self = this;
        (corpus || []).forEach(function (s) { self.learn(s, true); });
        if (learned) this.importLearned(learned);
    }

    Predictor.prototype.learn = function (sentence, seed) {
        var t = tokens(sentence);
        if (!t.length) return;
        this.starts[t[0]] = (this.starts[t[0]] || 0) + 1;
        for (var i = 0; i < t.length; i++) {
            if (!seed) this.learnedWords[t[i]] = (this.learnedWords[t[i]] || 0) + 1;
            if (i + 1 < t.length) {
                var row = this.bigrams[t[i]] || (this.bigrams[t[i]] = Object.create(null));
                row[t[i + 1]] = (row[t[i + 1]] || 0) + 1;
            }
        }
        if (!seed) {
            this.learnedPhrases = (this.learnedPhrases || []).concat([t.join(' ')]).slice(-500);
        }
    };

    // Only what the user said is persisted; the seed corpus is rebuilt each load.
    Predictor.prototype.exportLearned = function () {
        return { phrases: this.learnedPhrases || [] };
    };
    Predictor.prototype.importLearned = function (data) {
        var self = this;
        ((data && data.phrases) || []).forEach(function (p) { self.learn(p, false); });
    };

    function topKeys(counts, n, exclude) {
        return Object.keys(counts)
            .filter(function (k) { return !exclude || !exclude[k]; })
            .sort(function (a, b) { return counts[b] - counts[a]; })
            .slice(0, n);
    }

    // Words most likely to follow `previousWord` (or to start a sentence).
    Predictor.prototype.next = function (previousWord, n) {
        n = n || 5;
        var prev = tokens(previousWord || '').pop();
        var out = prev && this.bigrams[prev] ? topKeys(this.bigrams[prev], n) : [];
        if (out.length < n) {
            var seen = {};
            out.forEach(function (w) { seen[w] = true; });
            out = out.concat(topKeys(this.starts, n - out.length, seen));
        }
        return out;
    };

    // Words that start with `prefix`: the user's own words first, then by frequency.
    Predictor.prototype.complete = function (prefix, n) {
        n = n || 5;
        var p = tokens(prefix).pop();
        if (!p) return [];
        var out = [];
        var seen = Object.create(null);
        var add = function (w) {
            if (out.length < n && !seen[w] && w.lastIndexOf(p, 0) === 0) {
                seen[w] = true;
                out.push(w);
            }
        };
        topKeys(this.learnedWords, 50).forEach(add);
        for (var i = 0; i < this.words.length && out.length < n; i++) add(this.words[i]);
        return out;
    };
    lib.Predictor = Predictor;

    // ---------------------------------------------------------------------
    // Tic-tac-toe (tutorial practice game).
    var LINES = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
    lib.ticTacToeWinner = function (board) {
        for (var i = 0; i < LINES.length; i++) {
            var a = board[LINES[i][0]];
            if (a && a === board[LINES[i][1]] && a === board[LINES[i][2]]) return a;
        }
        return null;
    };

    if (typeof module !== 'undefined') module.exports = lib;
})(typeof window !== 'undefined' ? window : globalThis);
