core.controller('SettingsCtrl', function($scope, $rootScope, SettingsFactory, Session, ConstantsFactory, DialogFactory, AuthService) {

    let checkForProfile = () => {
        console.log($rootScope.user.blinkProfile);
    }
    $scope.profileSet = false;

    (function() {
        if($rootScope.user.blinkProfile.length) {
            $scope.profileSet = true;
            SettingsFactory.createGraph();
        }
    })();



    $scope.adjustValue = (add, key) => {
        ConstantsFactory.adjustValue(add, key);
    }

  


});