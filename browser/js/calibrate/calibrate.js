core.config(function($stateProvider) {
    $stateProvider.state('calibrate', {
        url: '/calibrate',
        templateUrl: '/js/calibrate/calibrate.html',
        controller: 'CalibrateCtrl'
    })
});



core.controller('CalibrateCtrl', ($scope, CalibrateFactory, $state, $rootScope, ActionFactory, $interval) => {

    $scope.calibrateActive = false;
    $scope.calibrating = {
        open: false,
        closed: false,
        finished: false
    }


    $scope.openCal = 50;


    $scope.start = () => {
        $scope.calibrateActive = true;
        $scope.calibrating.open = true;
        console.log($scope.calibrating);
        CalibrateFactory.runOpenCalibration();
    }



    

    //used for % calibration
    $scope.$watch(function() {
        return CalibrateFactory.openCount
    }, function(newVal, oldVal) {
        if (typeof newVal !== 'undefined') {
            $scope.openCount = CalibrateFactory.openCount;
            console.log("update", $scope.openCount);
        }
    });


    $scope.$watch(function() {
        return CalibrateFactory.closedCount
    }, function(newVal, oldVal) {
        if (typeof newVal !== 'undefined') {
            $scope.closedCount = CalibrateFactory.closedCount;
            console.log("update", $scope.closedCount);
        }
    });

    $scope.$watch(function() {
        return CalibrateFactory.openCalibrationComplete
    }, function(newVal, oldVal) {
        if (typeof newVal !== 'undefined') {
            $scope.openCalibrationComplete = CalibrateFactory.openCalibrationComplete;
            $scope.calibrating.open = false;
            $scope.calibrating.closed = CalibrateFactory.openCalibrationComplete;
            // CalibrateFactory.runClosedCalibration();
        }
    });




});