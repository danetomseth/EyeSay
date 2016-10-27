core.factory('CalibrateFactory', function($rootScope, $state, $timeout, ConstantsFactory, SettingsFactory, TrackingFactory, PositionFactory, ActionFactory) {
    let blinkZero = 0;
    let blinkRatio = 0;
    let maxVals = [];
    let minVals = [];
    let maxInit = [];
    let minInit = [];
    let maxSum = 0;
    let minSum = 0;
    let count = 0;
    let frameId = 0;
    let maxAvg = 0;
    let minAvg = 0;

    let service = {};
    service.currentValue = 0;
    service.blinkCounts = [0, 0];

    service.blinkStatus = [{
        'opacity': '0.3'
    }, {
        'opacity': '0.3'
    }, {
        'opacity': '0.3'
    }];

    service.calibrationSet = false;
    service.startCalibration = false;

    service.openCalibrationComplete = false;
    service.openCount = 0;

    service.closedCalibrationComplete = false;
    service.closedCount = 0;

    let blinkProfile = [];


    let resetCalValues = () => {
        service.openCalibrationComplete = false;
        service.openCount = 0;
        service.closedCalibrationComplete = false;
        service.closedCount = 0;
        maxVals = [];
        minVals = [];
        minInit = [];
        maxInit = [];
        maxAvg = 0;
        minAvg = 0;
        maxSum = 0;
        minSum = 0;
        count = 0;
    }

    function avgMax(sum) {
        maxVals.push(sum);
        maxInit.push(sum);
    }

    function avgMin(sum) {
        minSum = 0;
        minVals.forEach(function(val) {
            minSum += val;
        })
        minSum = minSum / minVals.length;
        if (sum < minSum) {
            minVals.push(sum);
        }
    }


    let getAvgMax = (arr) => {
        arr.sort(function compareNumbers(a, b) {
            return a - b;
        })
        let numCount = 0;
        for (let i = 20; i <= 90; i++) {
            numCount++;
            maxAvg += arr[i];
        }


        maxAvg = (maxAvg / numCount);
    }

    let getAvgMin = (arr) => {
        arr.sort(function compareNumbers(a, b) {
            return a - b;
        })
        let numCount = 0;
        for (let i = 20; i <= arr.length - 1; i++) {
            numCount++;
            minAvg += arr[i];
        }
        minAvg = (minAvg / numCount);
    }


    let checkMin = (total) => {
        if (total < (maxAvg * 0.92)) {
            minInit.push(total);
        }
    }



    service.openCalibration = (total) => {
        count++;

        if (maxInit.length < 100) {
            service.openCount = (maxInit.length / 100) * 100;
        } else {
            service.openCount = 100
        }
        if (maxInit.length > 100) {
            count = 0;
            service.setOpenValue();
        }

        // avgMax(total);
        maxVals.push(total);
        maxInit.push(total);
    }

    service.closedCalibration = (total) => {
        let dataPoint = {};
        dataPoint.x = blinkProfile.length + 1;
        dataPoint.y = total;
        if (count >= 50) {
            blinkProfile.push(dataPoint);
        }

        count++;


        checkMin(total);
        if (minInit.length < 100) {
            service.closedCount = minInit.length;
            // service.closedCount = minInit.length
        } else {
            service.closedCount = 100
        }

        if (minInit.length >= 100) {
            count = 0;
            service.setClosedValue();
        }
        //starting the array - with a little buffer
        // if (count > 40 && count < 50) {
        //     minVals.push(total) * 0.7;
        // }
        // if (count > 50) {
        //     if (total) {
        //         avgMin(total);
        //     }
        // }
    }

    service.setOpenValue = () => {
        // maxVals.forEach(function(val) {
        //     maxSum += val;
        // })
        // maxSum = maxSum / maxVals.length;
        service.openCalibrationComplete = true;
        getAvgMax(maxInit);
    }

    service.setClosedValue = () => {
        getAvgMin(minInit);

        // minVals.forEach(function(val) {
        //     minSum += val;
        // })
        // minSum = minSum / minVals.length;
        service.closedCalibrationComplete = true;
        setValues();
    }

    service.runOpenCalibration = () => {
        let positions = TrackingFactory.getPositions();
        if (positions) {
            service.openCalibration(PositionFactory.getBlinkValue(positions));
        }
        if (!service.openCalibrationComplete && ActionFactory.isActive('calibrate')) {
            // frameId = requestAnimationFrame(service.runOpenCalibration);
            $timeout(service.runOpenCalibration, 25);
        }
    }

    service.runClosedCalibration = () => {
        let positions = TrackingFactory.getPositions();
        if (positions) {
            service.closedCalibration(PositionFactory.getBlinkValue(positions));
        }
        if (!service.closedCalibrationComplete && ActionFactory.isActive('calibrate')) {
            frameId = requestAnimationFrame(service.runClosedCalibration);
        }
    }


    service.reset = () => {
        service.openCalibrationComplete = false;
        service.openCount = 0;
        service.closedCalibrationComplete = false;
        service.closedCount = 0;
        maxVals = [];
        minVals = [];
        maxSum = 0;
        minSum = 0;
        count = 0;
    }


    //once calibration arrays are full, set values
    let setValues = function() {
        // blinkZero = maxSum.toFixed(2);
        // console.log("Before max: ", maxSum);
        console.log("After max: ", maxAvg);
        // console.log("Before min: ", minSum);
        console.log("After min: ", minAvg);

        blinkZero = maxAvg.toFixed(2);
        // blinkRatio = (minSum / maxSum).toFixed(2);
        blinkRatio = (minAvg / maxAvg).toFixed(2);
        ConstantsFactory.setBlink(blinkRatio, blinkZero, blinkProfile);
        ConstantsFactory.saveCalibration(blinkRatio, blinkZero, blinkProfile);
        service.calibrationSet = true;
        // resetCalValues();
    }

    return service;
});