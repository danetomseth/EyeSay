core.controller('SettingsCtrl', function($scope, $rootScope, SettingsFactory, Session, ConstantsFactory, DialogFactory, WebcamFactory) {
   
    $scope.user = ConstantsFactory.user;



     $scope.adjustValue = (add, key) => {
        ConstantsFactory.adjustValue(add, key);
    }


    // $scope.saveValues = () => {
    //     ConstantsFactory.setValues($scope.user);
    // }



});