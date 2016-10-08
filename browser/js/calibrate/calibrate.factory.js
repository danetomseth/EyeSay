core.factory('CalibrateFactory', function($rootScope, $state, ConstantsFactory, SettingsFactory, TrackingFactory, PositionFactory, ActionFactory) {
    let blinkZero = 0;
    let blinkRatio = 0;
    let maxVals = [];
    let minVals = [];
    let maxSum = 0;
    let minSum = 0;
    let count = 0;
    let frameId = 0;

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


    let resetCalValues = () => {
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


    // service.openCalibration = (total) => {
    //     count++;
    //     if (maxVals.length < 50) {
    //         service.openCount = (maxVals.length / 50) * 100;
    //     } else {
    //         service.openCount = 100
    //     }
    //     if (maxVals.length > 50) {
    //         count = 0;
    //         service.setOpenValue();
    //     }
    //     //starting the array - with a little buffer
    //     if (count > 40 && count < 50) {
    //         maxVals.push(total) * 1.3;
    //     }
    //     if (count > 50) {
    //         if (total) {
    //             avgMax(total);
    //         }
    //     }
    // }

    service.openCalibration = (total) => {
        count++;
        if (maxVals.length < 100) {
            service.openCount = (maxVals.length / 100) * 100;
        } else {
            service.openCount = 100
        }
        if (maxVals.length > 100) {
            count = 0;
            service.setOpenValue();
        }
        //starting the array - with a little buffer
        if (count > 40 && count < 50) {
            maxVals.push(total) * 1.3;
        }
        if (count > 50) {
            if (total) {
                avgMax(total);
            }
        }
    }

    service.closedCalibration = (total) => {
        count++;
        if (minVals.length < 50) {
            service.closedCount = (minVals.length / 50) * 100;
        }
        else {
            service.closedCount = 100
        }
        
        if (minVals.length > 50) {
            service.setClosedValue();
        }
        //starting the array - with a little buffer
        if (count > 40 && count < 50) {
            minVals.push(total) * 0.7;
        }
        if (count > 50) {
            if (total) {
                avgMin(total);
            }
        }
    }

    service.setOpenValue = () => {
        maxVals.forEach(function(val) {
            maxSum += val;
        })
        maxSum = maxSum / maxVals.length;
        service.openCalibrationComplete = true;
    }

    service.setClosedValue = () => {
        minVals.forEach(function(val) {
            minSum += val;
        })
        minSum = minSum / minVals.length;
        service.closedCalibrationComplete = true;
        setValues();
    }

    service.runOpenCalibration = () => {
        let positions = TrackingFactory.getPositions();
        if (positions) {
            service.openCalibration(PositionFactory.getBlinkValue(positions));
        }
        if (!service.openCalibrationComplete && ActionFactory.isActive('calibrate')) {
            frameId = requestAnimationFrame(service.runOpenCalibration);
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
        blinkZero = maxSum.toFixed(2);
        blinkRatio = (minSum / maxSum).toFixed(2);
        ConstantsFactory.setBlink(blinkRatio, blinkZero);
        service.calibrationSet = true;
        // resetCalValues();
    }

    return service;
});