// Row/column scanning keyboard driven by 'iterate' (advance highlight) and
// 'singleBlink' (select) events.
core.factory('TypeFactory', function($rootScope, $timeout, ActionFactory, PredictFactory, SpeechFactory) {
    const keyboard = {};

    // The suggestion row is shared by both layouts so predictions survive a layout switch.
    const suggestions = ["I", "I'M", "CAN", "WE", "HELLO"];
    const ACTIONS = ['SPACE', 'SAY', 'BACK', 'STOP', 'NAV', 'ALT'];

    keyboard.alphabetA = [
        { row: 0, letters: suggestions },
        { row: 1, letters: ['A', 'B', 'C', 'D', 'E', 'F'] },
        { row: 2, letters: ['G', 'H', 'I', 'J', 'K', 'L'] },
        { row: 3, letters: ['M', 'N', 'O', 'P', 'Q', '.'] },
        { row: 4, letters: ['R', 'S', 'T', 'U', 'V', '.COM'] },
        { row: 5, letters: ['W', 'X', 'Y', 'Z', '@', '.ORG'] },
        { row: 6, letters: ACTIONS },
    ];

    // Frequency-ordered layout: the most common letters are reached soonest.
    keyboard.alphabetB = [
        { row: 0, letters: suggestions },
        { row: 1, letters: ['A', 'I', 'W', 'S', 'L'] },
        { row: 2, letters: ['O', 'R', 'T', 'J', 'B'] },
        { row: 3, letters: ['E', 'N', 'C', 'U', 'G'] },
        { row: 4, letters: ['H', 'Y', 'M', 'Z', '.'] },
        { row: 5, letters: ['K', 'P', 'F', '?'] },
        { row: 6, letters: ['D', 'Q', 'V', 'X'] },
        { row: 7, letters: ACTIONS },
    ];

    keyboard.alphabet = keyboard.alphabetA;
    keyboard.scopeValue = [];
    keyboard.selectedLetter = null;
    keyboard.word = '';
    keyboard.typeReady = false;
    keyboard.paused = false;

    let rowIndex = 0;
    let letterIndex = 0;
    let returnRow = 0;
    let returnLetter = 0;
    let phrase = '';
    let selectingLetter = false;
    let debounce = true;
    const undoStack = [];

    const setSuggestions = (words) => {
        if (words.length) angular.copy(words, suggestions);
    };

    const pushUndo = () => {
        if (undoStack.length > 5) undoStack.shift();
        undoStack.push(phrase);
    };

    // Briefly ignore blinks after a selection so one long blink can't select twice.
    const keyDebounce = () => {
        debounce = false;
        $timeout(() => {
            debounce = true;
            keyboard.selectedLetter = null;
        }, 500);
    };

    const resetKeyboardPosition = () => {
        letterIndex = 0;
        rowIndex = 0;
        selectingLetter = false;
    };

    const changeKeyboard = () => {
        keyboard.alphabet = keyboard.alphabet === keyboard.alphabetA ? keyboard.alphabetB : keyboard.alphabetA;
        resetKeyboardPosition();
        keyboard.scopeValue = [];
    };

    // Ends the current word: add a space and suggest likely next words.
    const finishWord = () => {
        setSuggestions(PredictFactory.nextWords(phrase));
        pushUndo();
        phrase += ' ';
        return phrase;
    };

    const iterateRow = () => {
        returnRow = rowIndex;
        rowIndex = rowIndex >= keyboard.alphabet.length - 1 ? 0 : rowIndex + 1;
        return [returnRow, null];
    };

    const iterateLetter = () => {
        returnLetter = letterIndex;
        letterIndex = letterIndex >= keyboard.alphabet[returnRow].letters.length - 1 ? 0 : letterIndex + 1;
        return returnLetter;
    };

    const runAction = (action) => {
        switch (action) {
            case 'SPACE':
                return finishWord();
            case 'SAY':
                SpeechFactory.say(phrase);
                PredictFactory.learn(phrase);
                pushUndo();
                phrase = '';
                return phrase;
            case 'BACK':
                pushUndo();
                phrase = phrase.slice(0, -1);
                return phrase;
            case 'STOP':
                // Pause scanning so the user can rest; the next blink resumes.
                keyboard.paused = true;
                keyboard.scopeValue = [];
                return phrase;
            case 'NAV':
                ActionFactory.runEvents('nav');
                return phrase;
            case 'ALT':
                changeKeyboard();
                return phrase;
            default:
                return phrase;
        }
    };

    const selectLetter = () => {
        resetKeyboardPosition();
        const key = keyboard.alphabet[returnRow].letters[returnLetter];
        if (returnRow === keyboard.alphabet.length - 1) {
            return runAction(key);
        }
        pushUndo();
        if (returnRow === 0) {
            // Suggestion: replace the partial word being typed, or append a new word.
            if (phrase.length && phrase[phrase.length - 1] !== ' ') {
                phrase = phrase.replace(/[^\s]+$/, key);
            } else {
                phrase += key;
            }
            return finishWord();
        }
        phrase += key;
        setSuggestions(PredictFactory.completeWord(phrase));
        return phrase;
    };

    const moveKeyboard = () => {
        if (!selectingLetter) {
            keyboard.scopeValue = iterateRow();
            return;
        }
        keyboard.scopeValue = [keyboard.scopeValue[0], iterateLetter()];
        if (keyboard.scopeValue[1] === 0) {
            // Went all the way along the row without a selection: back to row scanning.
            letterIndex = 0;
            keyboard.scopeValue = [keyboard.scopeValue[0], null];
            selectingLetter = false;
        }
    };

    const selectAction = () => {
        if (keyboard.paused) {
            keyboard.paused = false;
            resetKeyboardPosition();
            return;
        }
        if (selectingLetter) {
            keyboard.selectedLetter = [returnRow, returnLetter];
            keyboard.word = selectLetter();
            selectingLetter = false;
            keyDebounce();
        } else if (debounce) {
            keyboard.scopeValue = [keyboard.scopeValue[0], iterateLetter()];
            selectingLetter = true;
        }
    };

    keyboard.clearInput = () => {
        resetKeyboardPosition();
        phrase = '';
        keyboard.word = '';
    };

    keyboard.reset = () => {
        keyboard.alphabet = keyboard.alphabetA;
        keyboard.scopeValue = [];
        keyboard.typeReady = false;
        keyboard.paused = false;
        keyboard.clearInput();
        returnRow = 0;
        returnLetter = 0;
    };

    $rootScope.$on('singleBlink', () => {
        if (ActionFactory.isActive('type') && keyboard.typeReady) selectAction();
    });

    $rootScope.$on('iterate', () => {
        if (ActionFactory.isActive('type') && keyboard.typeReady && !keyboard.paused) moveKeyboard();
    });

    return keyboard;
});
