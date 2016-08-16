core.config(function($stateProvider){
    $stateProvider.state('signup', {
        url: '/signup',
        controller: 'SignupCtrl',
        templateUrl: 'js/user/signup/signup.html'
    });
});


core.controller('SignupCtrl', function($state, $scope, AuthService, SidebarFactory){
    $scope.signup = {};
    $scope.user = {};
    $scope.error = null;

    $scope.submit = () => {
        $scope.error = null;
        $scope.user.blinkZero = 42.00;
        $scope.user.blinkRatio = 0.68;

        AuthService.signup($scope.user)
        .then((user) => $state.go('home'))
    }
});
