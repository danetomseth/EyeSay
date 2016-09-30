core.controller('SettingsCtrl', function($scope, SettingsFactory, Session, ConstantsFactory, DialogFactory) {
   

    $scope.getUser = () => {
       console.log(Session.user);
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
        ConstantsFactory.saveUser(key, $scope.settings[key].value)
    }


    $scope.saveValues = () => {
        ConstantsFactory.setValues($scope.settings);
    }


    $scope.toggle = (key, value) => {
        ConstantsFactory.saveUser(key, value);
        console.log('key', key);
        console.log('value', value);
    }

    $scope.scopeText = "message";

    $scope.sharedScope = () => {
        DialogFactory.sharedScope($scope)
    }

    $scope.message = () => {
        let message = {
            title: "Settings",
            listContent: ["1. First Step", "2. Second Step", "3. Third Step"]
        }
        DialogFactory.promptMessage(message)
    }
    
});