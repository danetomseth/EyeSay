core.controller('SettingsCtrl', function($scope, SettingsFactory, Session, ConstantsFactory) {
   

    $scope.getUser = () => {
       console.log(ConstantsFactory.settings);
    }


    $scope.settings = ConstantsFactory.settings;
    $scope.options = ConstantsFactory.options;



    $scope.adjustValue = (add, property, key) => {
        if(add) {
            $scope.settings[key].value += $scope.settings[key].value * .01;
        }
        else {
            $scope.settings[key].value -= $scope.settings[key].value * .01;
        }
    }


    $scope.saveValues = () => {
        ConstantsFactory.setValues($scope.settings);
    }


    
    $scope.adjustZero = (add) => {
        if (add) {
            $scope.blinkZero = ConstantsFactory.increaseZero();
        } else {
            $scope.blinkZero = ConstantsFactory.decreaseZero();
        }
        ConstantsFactory.setBlink($scope.blinkRatio, $scope.blinkZero);

    }

    $scope.adjustRatio = (add) => {
        if (add) {
            $scope.blinkRatio = ConstantsFactory.increaseRatio();
        } else {
            $scope.blinkRatio = ConstantsFactory.decreaseRatio();
        }

        ConstantsFactory.setBlink($scope.blinkRatio, $scope.blinkZero);
    }

    $scope.blinkRatio = ConstantsFactory.blinkRatio;
    $scope.blinkZero = ConstantsFactory.blinkZero;
});