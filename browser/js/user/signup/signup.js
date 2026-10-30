core.config(function($stateProvider) {
    $stateProvider.state('signup', {
        url: '/signup',
        controller: 'SignupCtrl',
        templateUrl: 'js/user/signup/signup.html'
    });
});

core.controller('SignupCtrl', function($state, $scope, AuthService, ErrorFactory) {
    $scope.user = {};

    $scope.submit = () => {
        AuthService.signup($scope.user)
            .then(() => $state.go('calibrate'))
            .catch((ex) => ErrorFactory.error(ex.message));
    };
});
