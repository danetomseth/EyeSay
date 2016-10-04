app.config(function($stateProvider) {

    $stateProvider.state('login', {
        url: '/login',
        templateUrl: 'js/user/login/login.html',
        controller: 'LoginCtrl'
    });

});


app.config(function($stateProvider) {

    $stateProvider.state('logout', {
        url: '/logout',
        controller: function(AuthService, $state) {
            AuthService.logout().then(function() {
                $state.go('home');
            });
        }
    });

});

app.controller('LoginCtrl', function($scope, AuthService, $state, Session, ConstantsFactory) {

    $scope.login = {};
    $scope.error = null;

    $scope.sendLogin = function(loginInfo) {

        $scope.error = null;

        AuthService.login(loginInfo).then(function() {
            ConstantsFactory.setUser(Session.user);
            $state.go('calibrate');
        }).catch(function() {
            $scope.error = 'Invalid login credentials.';
        });

    };


});