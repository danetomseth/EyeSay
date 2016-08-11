// Analysis of tracker positions
core.factory('PositionFactory', function(ConstantsFactory) {
    let diffZeroL = 0;
    let diffZeroR = 0;
    let lastBlinkTime;

    return {
        blinkCompare: (positions) => { // only used in TimerFactory - which is used everywhere
            let change = 0
            var diffL = (positions[69][1] + positions[31][1] + positions[70][1]) - (positions[68][1] + positions[29][1] + positions[67][1]);
            var diffR = (positions[69][1] + positions[31][1] + positions[70][1]) - (positions[68][1] + positions[29][1] + positions[67][1]);
            
            change = ((diffL + diffR) / ConstantsFactory.settings.blinkZero.value);

            if (change < ConstantsFactory.settings.blinkRatio.value) {
                let blinkDt = Date.now() - lastBlinkTime;
                lastBlinkTime = Date.now();
                if (blinkDt < 125) {
                    return false
                } else {
                    if (blinkDt <= 320 && ConstantsFactory.settings.doubleBlink.value) {
                        return 'doubleBlink';
                    } else {
                        return 'singleBlink'
                    }
                }
            }
            else if(change < ConstantsFactory.settings.blinkRatio.value * 1.1 && change > ConstantsFactory.settings.blinkRatio.value) {
                // console.log('almost', (change / ConstantsFactory.settings.blinkRatio.value).toFixed(2));
            }
            // if (change < ConstantsFactory.blinkRatio) {
            //     let blinkDt = Date.now() - lastBlinkTime;
            //     lastBlinkTime = Date.now();
            //     if(blinkDt < 250) {return false} // debounce
            //     return (blinkDt <= 750) ? "doubleBlink" : "singleBlink"
            // } else {
            //     return false;
            // }
        },
        getBlinkValue: (positions) => { // used in calibrate.js only
            diffZeroL = (positions[69][1] + positions[31][1] + positions[70][1]) - (positions[68][1] + positions[29][1] + positions[67][1]);
            diffZeroR = (positions[66][1] + positions[26][1] + positions[65][1]) - (positions[63][1] + positions[24][1] + positions[64][1]);
            return diffZeroL + diffZeroR;
        }
    }
});