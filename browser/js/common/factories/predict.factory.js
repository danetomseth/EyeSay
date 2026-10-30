'use strict';
// Word completion and next-word prediction, entirely in the browser. Phrases the
// user speaks are learned and remembered in localStorage, so suggestions adapt.
core.factory('PredictFactory', function() {
    const STORAGE_KEY = 'eyesay.learnedPhrases';
    let learned = null;
    try {
        learned = JSON.parse(window.localStorage.getItem(STORAGE_KEY));
    } catch (e) { /* ignore */ }

    const predictor = new EyeSayLib.Predictor(EyeSayLib.words, EyeSayLib.corpus, learned);
    const upper = (words) => words.map((w) => w.toUpperCase());

    return {
        // Suggestions for the word after the last word of `sentence`.
        nextWords: (sentence) => upper(predictor.next(String(sentence).trim().split(/\s+/).pop(), 5)),
        // Completions for the partial last word of `sentence`.
        completeWord: (sentence) => upper(predictor.complete(String(sentence).split(/\s+/).pop(), 5)),
        learn: (sentence) => {
            predictor.learn(sentence);
            try {
                window.localStorage.setItem(STORAGE_KEY, JSON.stringify(predictor.exportLearned()));
            } catch (e) { /* storage unavailable */ }
        },
    };
});
