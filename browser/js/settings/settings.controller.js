core.controller('SettingsCtrl', function($scope, $rootScope, SettingsFactory, Session, ConstantsFactory, DialogFactory, WebcamFactory) {
   
    $scope.user = ConstantsFactory.user;



     $scope.adjustValue = (add, key) => {
        ConstantsFactory.adjustValue(add, key);
    }


    $scope.saveValues = () => {
        ConstantsFactory.setValues($scope.user);
    }


    $scope.scopeText = "message";

    $scope.sharedScope = () => {
        DialogFactory.sharedScope($scope)
    }

    $scope.$watch(() => {
                return ConstantsFactory.user
            }, (newVal) => {
                    $scope.user= newVal;
            })


});