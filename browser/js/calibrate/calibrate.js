core.config(function($stateProvider) {
    $stateProvider.state('calibrate', {
        url: '/calibrate',
        templateUrl: 'js/calibrate/calibrate.html',
        controller: 'CalibrateCtrl',
        onExit: (CalibrateFactory) => {
            CalibrateFactory.reset();
        }
    });
});

core.controller('CalibrateCtrl', function($scope, $state, $timeout, CalibrateFactory, ActionFactory, DialogFactory, TrackingFactory, onRoot) {
    CalibrateFactory.reset();

    $scope.cal = CalibrateFactory;
    $scope.calibrateActive = false;
    $scope.calibrating = { open: false, closed: false };
    $scope.showInstructions = false;

    $scope.show = () => {
        $scope.showInstructions = !$scope.showInstructions;
    };

    $scope.start = () => {
        if (TrackingFactory.convergence() > 50) {
            DialogFactory.noConvergance();
            return;
        }
        $scope.calibrateActive = true;
        $scope.calibrating.open = true;
        DialogFactory.openInstructions(CalibrateFactory.runOpenCalibration);
    };

    $scope.gotoClosed = () => {
        $scope.calibrating.open = false;
        $scope.calibrating.closed = true;
        DialogFactory.closedInstructions(CalibrateFactory.runClosedCalibration);
    };

    $scope.$watch('cal.closedCalibrationComplete', (done) => {
        if (done) {
            $scope.calibrating.closed = false;
            $scope.calibrationComplete = true;
        }
    });

    $scope.leaveCalibration = () => {
        $scope.calibrationComplete = false;
        $state.go('tutorial');
    };

    $scope.showGraph = () => {
        $scope.calibrationComplete = true;
    };

    let blinkTimer;
    onRoot($scope, 'singleBlink', () => {
        if (!ActionFactory.isActive('calibrate')) return;
        $scope.blinkDetected = true;
        $timeout.cancel(blinkTimer);
        blinkTimer = $timeout(() => { $scope.blinkDetected = false; }, 500);
    });

    $scope.$on('$destroy', () => CalibrateFactory.reset());
});
