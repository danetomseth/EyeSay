// Analysis of tracker positions
core.factory('PositionFactory', function(ConstantsFactory) {
    let diffZeroL = 0;
    let diffZeroR = 0;
    let lastBlinkTime;


    let checkDoubleBlink = (blinkDt) => {
        if (blinkDt < 125) {
            return false
        } else {
            if (blinkDt <= 320 && ConstantsFactory.user.doubleBlink) {
                return 'doubleBlink';
            } else {
                return 'singleBlink'
            }
        }
    }

    return {
        blinkCompare: (positions) => { // only used in TimerFactory - which is used everywhere
            let change = 0
            var diffL = (positions[69][1] + positions[31][1] + positions[70][1]) - (positions[68][1] + positions[29][1] + positions[67][1]);
            var diffR = (positions[69][1] + positions[31][1] + positions[70][1]) - (positions[68][1] + positions[29][1] + positions[67][1]);

            change = ((diffL + diffR) / ConstantsFactory.user.blinkZero);

            if (change < ConstantsFactory.user.blinkRatio) {
                let blinkDt = Date.now() - lastBlinkTime;
                lastBlinkTime = Date.now();
                if (blinkDt < 150) {
                    return false
                } else {
                    return 'singleBlink'
                    // return checkDoubleBlink() // use this to activate double blink function 
                }
            } 
        },
        getBlinkValue: (positions) => { // used in calibrate.js only
            diffZeroL = (positions[69][1] + positions[31][1] + positions[70][1]) - (positions[68][1] + positions[29][1] + positions[67][1]);
            diffZeroR = (positions[66][1] + positions[26][1] + positions[65][1]) - (positions[63][1] + positions[24][1] + positions[64][1]);
            return diffZeroL + diffZeroR;
        }
    }
});