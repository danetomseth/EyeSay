core.controller('HomeCtrl', function($scope, $rootScope, Session, ConstantsFactory, ActionFactory) {

    //$scope.boxInput = "";
   


    $scope.calibrated = ConstantsFactory.blinkCalibrated;

    //let goToNav = false;


    //Starts nav iterate
    // $rootScope.$on('singleBlink', () => {
    //     if ($scope.calibrated && !goToNav) {
    //         goToNav = true;
    //         setTimeout(() => {
    //             ActionFactory.runEvents('nav');
    //         }, 500);
    //     }
    // });



    $scope.showCalibration = () => {
        $scope.calibrated = false;
    }


    $scope.getUser = () => {
        console.log('session', Session.user);
    }

});