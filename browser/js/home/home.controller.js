core.controller('HomeCtrl', function($scope, $rootScope, Session, ConstantsFactory, ActionFactory) {


    $scope.calibrated = ConstantsFactory.blinkCalibrated;

   



    $scope.showCalibration = () => {
        $scope.calibrated = false;
    }


});