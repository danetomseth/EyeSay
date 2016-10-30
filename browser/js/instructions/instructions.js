core.config(function($stateProvider) {
    $stateProvider.state('instructions', {
        url: '/instructions',
        templateUrl: 'js/instructions/instructions.html',
        controller: 'InstructionsCtrl'
    })
});



core.controller('InstructionsCtrl', function($scope, $rootScope, DialogFactory) {


   
    $scope.switch = false;
    $scope.switchTab = () => {
        $scope.switch = !$scope.switch;
    }


    $scope.show = () => {
        DialogFactory.hint();
    }



});