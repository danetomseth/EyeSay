'use strict';
// Text to speech with the browser's built-in Web Speech API (works offline and
// needs no third-party script). Prefers a British English male voice, as before.
core.factory('SpeechFactory', function() {
    const synth = window.speechSynthesis;
    let voice = null;

    const pickVoice = () => {
        if (!synth) return;
        const voices = synth.getVoices();
        const english = voices.filter((v) => /^en/i.test(v.lang));
        voice = english.find((v) => /en-GB/i.test(v.lang) && /male|daniel|arthur|george/i.test(v.name) && !/female/i.test(v.name)) ||
            english.find((v) => /en-GB/i.test(v.lang)) ||
            english.find((v) => v.default) ||
            english[0] || voices[0] || null;
    };

    if (synth) {
        pickVoice();
        synth.addEventListener('voiceschanged', pickVoice);
    }

    return {
        say(sentence) {
            const text = String(sentence || '').trim();
            if (!synth || !text) return;
            synth.cancel(); // never queue up behind an earlier sentence
            const utterance = new SpeechSynthesisUtterance(text.toLowerCase());
            if (voice) utterance.voice = voice;
            utterance.lang = voice ? voice.lang : 'en-GB';
            synth.speak(utterance);
        },
    };
});
