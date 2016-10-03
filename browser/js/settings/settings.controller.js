core.controller('SettingsCtrl', function($scope, SettingsFactory, Session, ConstantsFactory, DialogFactory) {
   


    $scope.settings = ConstantsFactory.settings;
    $scope.options = ConstantsFactory.options;



    $scope.adjustValue = (add, property, key) => {
        console.log("before", $scope.settings[key].value);
        if(add) {
            $scope.settings[key].value += ($scope.settings[key].value * .01);
        }
        else {
            $scope.settings[key].value -= ($scope.settings[key].value * .01);
        }

        if($scope.settings[key].value < 1) {
            $scope.settings[key].value = ($scope.settings[key].value.toFixed(3)) / 1;
        }
        else {
            $scope.settings[key].value = Math.floor($scope.settings[key].value)
        }
        ConstantsFactory.saveUser(key, $scope.settings[key].value)
    }


    $scope.saveValues = () => {
        ConstantsFactory.setValues($scope.settings);
    }


    $scope.toggle = (key, value) => {
        ConstantsFactory.saveUser(key, value);
    }

    $scope.scopeText = "message";

    $scope.sharedScope = () => {
        DialogFactory.sharedScope($scope)
    }

    
});