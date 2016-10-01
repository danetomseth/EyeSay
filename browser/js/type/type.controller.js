core.controller('TypeCtrl', function($scope, ConstantsFactory, $rootScope, TimerFactory) {

    // Key-value pairs for keyboard speed based on user's settings

    $scope.blink = () => {
        $rootScope.$emit("singleBlink");
        TimerFactory.resetBlinkTime();
    }


});