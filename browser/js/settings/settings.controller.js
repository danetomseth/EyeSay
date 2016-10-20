core.controller('SettingsCtrl', function($scope, $rootScope, SettingsFactory, Session, ConstantsFactory, DialogFactory, WebcamFactory) {

    let checkForProfile = () => {
        console.log($rootScope.user.blinkProfile);
    }
    $scope.profileSet = false;

    (function() {
        if($rootScope.user.blinkProfile.length) {
            console.log("create graph");
            $scope.profileSet = true;
            SettingsFactory.createGraph();
        }
    })();



    $scope.adjustValue = (add, key) => {
        ConstantsFactory.adjustValue(add, key);
    }


});