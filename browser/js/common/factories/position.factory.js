// Analysis of tracker positions
core.factory('PositionFactory', function($rootScope) {
    let diffZeroL = 0;
    let diffZeroR = 0;
    let lastBlinkTime;
    let prevDiff;
    let service = {};


    let checkDoubleBlink = (blinkDt) => {
        if (blinkDt < 125) {
            return false
        } else {
            if (blinkDt <= 320 && $rootScope.user.doubleBlink) {
                return 'doubleBlink';
            } else {
                return 'singleBlink'
            }
        }
    }

    service.eyeValue = 0;


    service.blinkCompare = (positions) => { // only used in TimerFactory - which is used everywhere
            let change = 0
            var diffL = (positions[69][1] + positions[31][1] + positions[70][1]) - (positions[68][1] + positions[29][1] + positions[67][1]);
            var diffR = (positions[69][1] + positions[31][1] + positions[70][1]) - (positions[68][1] + positions[29][1] + positions[67][1]);
            service.eyeValue = (diffL + diffR);

            change = ((diffL + diffR) / $rootScope.user.blinkZero);

            if (change < $rootScope.user.blinkRatio) {
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
        service.getBlinkValue = (positions) => { // used in calibrate.js only
            if(positions) {
                diffZeroL = (positions[69][1] + positions[31][1] + positions[70][1]) - (positions[68][1] + positions[29][1] + positions[67][1]);
                diffZeroR = (positions[66][1] + positions[26][1] + positions[65][1]) - (positions[63][1] + positions[24][1] + positions[64][1]);
                prevDiff = diffZeroL + diffZeroR
                service.eyeValue = (diffZeroL + diffZeroR);
                return diffZeroL + diffZeroR;
            }
            else {
                return prevDiff
            }
        }


    return service
});