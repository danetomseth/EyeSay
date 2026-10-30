core.controller('SettingsCtrl', function($scope, $rootScope, $timeout, SettingsFactory, ConstantsFactory) {
    const canvas = () => document.getElementById('blink-chart');

    $scope.profileSet = !!($rootScope.user.blinkProfile && $rootScope.user.blinkProfile.length);

    const redraw = () => {
        if ($scope.profileSet && canvas()) SettingsFactory.createGraph(canvas());
    };
    $timeout(redraw, 0, false); // after the view has rendered

    $scope.adjustValue = (add, key) => {
        ConstantsFactory.adjustValue(add, key);
        redraw(); // threshold line moves with blinkZero
    };

    $scope.toggleTracking = () => ConstantsFactory.save();
});
