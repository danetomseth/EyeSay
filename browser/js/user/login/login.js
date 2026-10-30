core.config(function($stateProvider) {
    $stateProvider.state('login', {
        url: '/login',
        templateUrl: 'js/user/login/login.html',
        controller: 'LoginCtrl'
    });

    $stateProvider.state('logout', {
        url: '/logout',
        controller: function(AuthService, $state) {
            AuthService.logout().finally(() => $state.go('home'));
        }
    });
});

core.controller('LoginCtrl', function($scope, AuthService, $state, ErrorFactory) {
    $scope.login = {};

    $scope.sendLogin = function(loginInfo) {
        AuthService.login(loginInfo)
            .then(() => $state.go('calibrate'))
            .catch((ex) => {
                $scope.login.password = '';
                ErrorFactory.error(ex.message);
            });
    };
});
