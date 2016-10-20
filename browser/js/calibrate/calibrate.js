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




core.controller('CalibrateCtrl', function($scope, $mdDialog, CalibrateFactory, $state, $rootScope, ActionFactory, DialogFactory, TrackingFactory, $interval, $timeout) {

    $scope.calibrateActive = false;
    $scope.success = false;
    $scope.calibrating = {
        open: false,
        closed: false,
        finished: false
    }


    $scope.showInstructions = false;

    $scope.show = () => {
        console.log("switch");
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
            $timeout(() => {
                $scope.success = false;
                $scope.calibrating.open = false;
                $scope.calibrating.closed = CalibrateFactory.openCalibrationComplete;
                DialogFactory.closedInstructions();
            }, 1000);

        }
    });


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
            let action = () => {
                $state.go("tutorial");
            }
            let message = {
                title: "Calibration Complete",
                listContent: ["Proceed to tuorial"]
            }
            DialogFactory.promptMessage(message, action)
        }
    });






});