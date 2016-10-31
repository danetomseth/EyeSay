core.config(function($stateProvider) {
    $stateProvider.state('calibrate', {
        url: '/calibrate',
        templateUrl: '/js/calibrate/calibrate.html',
        controller: 'CalibrateCtrl',
        cache: false,
        onExit: (CalibrateFactory) => {
            CalibrateFactory.reset()
        }
    })
});




core.controller('CalibrateCtrl', function($scope, CalibrateFactory, $state, $rootScope, ActionFactory, DialogFactory, TrackingFactory, $interval, $timeout, SettingsFactory) {

    $scope.calibrateActive = false;
    $scope.success = false;
    $scope.calibrating = {
        open: false,
        closed: false,
        finished: false
    }


    $scope.showInstructions = false;

    $scope.show = () => {
        $scope.showInstructions = !$scope.showInstructions
    }



    $scope.start = () => {
        if (TrackingFactory.convergence() > 50) {
            DialogFactory.noConvergance();
        } else {
            $scope.calibrateActive = true;
            $scope.calibrating.open = true;
            DialogFactory.openInstructions();
        }
    }





    //used for % calibration
    $scope.$watch(function() {
        return CalibrateFactory.openCount
    }, function(newVal, oldVal) {
        if (typeof newVal !== 'undefined') {
            $scope.openCount = CalibrateFactory.openCount;
        }
    });


    $scope.$watch(function() {
        return CalibrateFactory.openCalibrationComplete
    }, function(newVal, oldVal) {
        if (newVal === true) {
            $scope.openCalibrationComplete = CalibrateFactory.openCalibrationComplete;
            $scope.success = true;
        }
    });

    $scope.gotoClosed = () => {
        $scope.success = false;
        $scope.calibrating.open = false;
        $scope.calibrating.closed = CalibrateFactory.openCalibrationComplete;
        DialogFactory.closedInstructions();
    }


    $scope.$watch(function() {
        return CalibrateFactory.closedCount
    }, function(newVal, oldVal) {
        if (typeof newVal !== 'undefined') {
            $scope.closedCount = CalibrateFactory.closedCount;
        }
    });

    $scope.$watch(function() {
        return CalibrateFactory.closedCalibrationComplete
    }, function(newVal, oldVal) {
        if (newVal === true) {
            $scope.calibrating.closed = false;
            $scope.calibrationComplete = true;
        }
    });

    let styleDelay = () => {
        $timeout(() => {
            $scope.blinkDetected = false;
        }, 500)
    }


    $scope.leaveCalibration = () => {
        $scope.calibrationComplete = false;
        $state.go("tutorial");
    }

    $scope.showGraph = () => {
        $scope.calibrationComplete = true;
    }


    $rootScope.$on('singleBlink', () => {
        if (ActionFactory.isActive('calibrate')) {
            $scope.blinkDetected = true;
            styleDelay()
        }
    });

    $scope.$on(
        "$destroy",
        function handleDestroyEvent() {
            CalibrateFactory.reset();
        }
    );


});