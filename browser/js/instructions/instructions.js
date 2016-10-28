core.config(function($stateProvider) {
    $stateProvider.state('instructions', {
        url: '/instructions',
        templateUrl: 'js/instructions/instructions.html',
        controller: 'InstructionsCtrl'
    })
});



core.controller('InstructionsCtrl', function($scope, $rootScope, PositionFactory, TrackingFactory) {
    $scope.title = "Instructions";


    // let elem = angular.element(document.querySelector('#graph-content'))[0];
      $scope.showGraph = () => {
        $scope.calibrationComplete = true;
    }
    $scope.switch = false;
    $scope.switchTab = () => {
        $scope.switch = !$scope.switch;
    }



});