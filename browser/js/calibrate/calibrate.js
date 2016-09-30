core.config(function($stateProvider) {
    $stateProvider.state('calibrate', {
        url: '/calibrate',
        templateUrl: '/js/calibrate/calibrate.html',
        controller: 'CalibrateCtrl'
    })
});




core.controller('CalibrateCtrl', ($scope, $mdDialog, CalibrateFactory, $state, $rootScope, ActionFactory, DialogFactory, TrackingFactory, $interval, $timeout) => {
    let noConvergance = () => {
        var parentEl = angular.element(document.body);
        $mdDialog.show({
            parent: parentEl,
            controller: ($scope, TypeFactory) => {
                $scope.closeDialog = () => {
                    $mdDialog.hide();
                }
            },
            templateUrl: 'js/calibrate/dialog.html'
        });
    }
    let closedInstructions = () => {
        var parentEl = angular.element(document.body);
        $mdDialog.show({
            parent: parentEl,
            controller: ($scope, CalibrateFactory) => {
                $scope.closeDialog = () => {
                    $mdDialog.hide();
                    CalibrateFactory.runClosedCalibration();
                }
            },
            templateUrl: 'js/calibrate/closedInstructions.html'
        });
    }



    let openInstructions = () => {
        var parentEl = angular.element(document.body);
        $mdDialog.show({
            parent: parentEl,
            controller: ($scope, CalibrateFactory) => {
                $scope.closeDialog = () => {
                    $mdDialog.hide();
                    CalibrateFactory.runOpenCalibration();
                }
            },
            templateUrl: 'js/calibrate/openInstructions.html'
        });
    }



    $scope.calibrateActive = false;
    $scope.success = false;
    $scope.calibrating = {
        open: false,
        closed: false,
        finished: false
    }


    $scope.openCal = 50;



    $scope.start = () => {
        if (TrackingFactory.convergence() > 50) {
            noConvergance();
        } else {
            $scope.calibrateActive = true;
            $scope.calibrating.open = true;
            openInstructions();
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
            console.log("Open cal complete");
            $scope.openCalibrationComplete = CalibrateFactory.openCalibrationComplete;
            $scope.success = true;
            $timeout(() => {
                $scope.success = false;
                $scope.calibrating.open = false;
                $scope.calibrating.closed = CalibrateFactory.openCalibrationComplete;
                closedInstructions();
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
            console.log("Finished");
            alert("Finished");
        }
    });






});