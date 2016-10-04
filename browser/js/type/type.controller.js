core.controller('TypeCtrl', function($scope, $state, ConstantsFactory, $rootScope, TimerFactory) {

    // Key-value pairs for keyboard speed based on user's settings

    $scope.restart = () => {
    	$state.reload();
    }


});