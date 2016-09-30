core.factory('CalibrateFactory', function($rootScope, $state, ConstantsFactory, SettingsFactory, TrackingFactory, PositionFactory) {
    let blinkZero = 0;
    let blinkRatio = 0;
    let maxVals = [];
    let minVals = [];
    let maxSum = 0;
    let minSum = 0;
    let count = 0;
    let frameId = 0;

    let calibrateObj = {};
    calibrateObj.currentValue = 0;
    calibrateObj.blinkCounts = [0, 0];

    calibrateObj.blinkStatus = [{
        'opacity': '0.3'
    }, {
        'opacity': '0.3'
    }, {
        'opacity': '0.3'
    }];

    calibrateObj.calibrationSet = false;
    calibrateObj.startCalibration = false;

    calibrateObj.openCalibrationComplete = false;
    calibrateObj.openCount = 0;

    calibrateObj.closedCalibrationComplete = false;
    calibrateObj.closedCount = 0;


    let resetCalValues = () => {
        calibrateObj.openCalibrationComplete = false;
        calibrateObj.openCount = 0;
        calibrateObj.closedCalibrationComplete = false;
        calibrateObj.closedCount = 0;
        maxVals = [];
        minVals = [];
        maxSum = 0;
        minSum = 0;
        count = 0;
    }

    function avgMax(sum) {
        maxSum = 0;
        maxVals.forEach(function(val) {
            maxSum += val;
        })
        maxSum = maxSum / maxVals.length;
        if (sum > maxSum) {
            maxVals.push(sum);
        }
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


    calibrateObj.openCalibration = (total) => {
        count++;
        if (maxVals.length < 50) {
            calibrateObj.openCount = (maxVals.length / 50) * 100;
        } else {
            calibrateObj.openCount = 100
        }
        if (maxVals.length > 50) {
            count = 0;
            calibrateObj.setOpenValue();
        }
        //starting the array - with a little buffer
        if (count > 40 && count < 50) {
            maxVals.push(total);
        }
        if (count > 50) {
            if (total) {
                avgMax(total);
            }
        }
    }

    calibrateObj.closedCalibration = (total) => {
        count++;
        if (minVals.length < 50) {
            calibrateObj.closedCount = (minVals.length / 50) * 100;
        }
        else {
            calibrateObj.closedCount = 100
        }
        
        if (minVals.length > 50) {
            calibrateObj.setClosedValue();
        }
        //starting the array - with a little buffer
        if (count > 40 && count < 50) {
            minVals.push(total);
        }
        if (count > 50) {
            if (total) {
                avgMin(total);
            }
        }
    }

    calibrateObj.setOpenValue = () => {
        maxVals.forEach(function(val) {
            maxSum += val;
        })
        maxSum = maxSum / maxVals.length;
        calibrateObj.openCalibrationComplete = true;
        console.log("open val", maxSum);
    }

    calibrateObj.setClosedValue = () => {
        minVals.forEach(function(val) {
            minSum += val;
        })
        minSum = minSum / minVals.length;
        calibrateObj.closedCalibrationComplete = true;
        setValues();
    }

    calibrateObj.runOpenCalibration = () => {
        let positions = TrackingFactory.getPositions();
        if (positions) {
            calibrateObj.openCalibration(PositionFactory.getBlinkValue(positions));
        }
        if (!calibrateObj.openCalibrationComplete) {
            frameId = requestAnimationFrame(calibrateObj.runOpenCalibration);
        }
    }

    calibrateObj.runClosedCalibration = () => {
        let positions = TrackingFactory.getPositions();
        if (positions) {
            calibrateObj.closedCalibration(PositionFactory.getBlinkValue(positions));
        }
        if (!calibrateObj.closedCalibrationComplete) {
            frameId = requestAnimationFrame(calibrateObj.runClosedCalibration);
        }
    }


    //once calibration arrays are full, set values
    let setValues = function() {
        blinkZero = maxSum.toFixed(2);
        blinkRatio = (minSum / maxSum).toFixed(2);
        console.log("Zero", blinkZero);
        console.log("Ratio", blinkRatio);
        ConstantsFactory.setBlink(blinkRatio, blinkZero);
        calibrateObj.calibrationSet = true;
        // resetCalValues();
    }

    return calibrateObj;
});