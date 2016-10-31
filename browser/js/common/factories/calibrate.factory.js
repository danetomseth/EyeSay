core.factory('CalibrateFactory', function($rootScope, $state, $timeout, ConstantsFactory, SettingsFactory, TrackingFactory, PositionFactory, ActionFactory) {
    let service = {};
    
    let blinkZero = 0;
    let blinkRatio = 0;
    let maxInit = [];
    let minInit = [];
    let maxAvg = 0;
    let minAvg = 0;
    
    let count = 0;

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
        minInit = [];
        maxInit = [];
        maxAvg = 0;
        minAvg = 0;
        count = 0;
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
        } else {
            service.closedCount = 100
        }

        if (minInit.length >= 100) {
            count = 0;
            service.setClosedValue();
        }
    }

    service.setOpenValue = () => {
     
        service.openCalibrationComplete = true;
        getAvgMax(maxInit);
    }

    service.setClosedValue = () => {
        getAvgMin(minInit);
        service.closedCalibrationComplete = true;
        setValues();
    }

    service.runOpenCalibration = () => {
        let positions = TrackingFactory.getPositions();
        if (positions) {
            service.openCalibration(PositionFactory.getBlinkValue(positions));
        }
        if (!service.openCalibrationComplete && ActionFactory.isActive('calibrate')) {
            $timeout(service.runOpenCalibration, 25);
        }
    }

    service.runClosedCalibration = () => {
        let positions = TrackingFactory.getPositions();
        if (positions) {
            service.closedCalibration(PositionFactory.getBlinkValue(positions));
        }
        if (!service.closedCalibrationComplete && ActionFactory.isActive('calibrate')) {
            requestAnimationFrame(service.runClosedCalibration);
        }
    }


    service.reset = () => {
        service.openCalibrationComplete = false;
        service.openCount = 0;
        service.closedCalibrationComplete = false;
        service.closedCount = 0;
        minInit = [];
        maxInit = [];
        maxAvg = 0;
        minAvg = 0;
        count = 0;
    }


    //once calibration arrays are full, set values
    let setValues = function() {

        blinkZero = maxAvg.toFixed(2);
        blinkRatio = (minAvg / maxAvg).toFixed(2);
        ConstantsFactory.setBlink(blinkRatio, blinkZero, blinkProfile);
        ConstantsFactory.saveCalibration(blinkRatio, blinkZero, blinkProfile);
        service.calibrationSet = true;
        // resetCalValues();
    }

    return service;
});