core.config(function($stateProvider) {

    $stateProvider.state('login', {
        url: '/login',
        templateUrl: 'js/user/login/login.html',
        controller: 'LoginCtrl'
    });

});


core.config(function($stateProvider) {

    $stateProvider.state('logout', {
        url: '/logout',
        controller: function(AuthService, $state) {
            AuthService.logout().then(function() {
                $state.go('home');
            });
        }
    });

});

app.controller('LoginCtrl', function($scope, AuthService, $state, Session, ConstantsFactory, ErrorFactory) {

    $scope.login = {};
    $scope.error = null;

    $scope.sendLogin = function(loginInfo) {

        $scope.error = null;

        AuthService.login(loginInfo).then(function() {
            ConstantsFactory.setUser(Session.user);
            $state.go('calibrate');
        }).catch(function(ex) {
            // let error = new Error
            ErrorFactory.error(ex.message, ex)
            .then(res => {
                $scope.login = {};
            })
            
        });

    };

    $scope.throwError = () => {
        try {
            throw new Error("Triggered Exception");
        } catch(ex) {
            ErrorFactory.error(ex.message, ex)
            .then(res => {
                $scope.login = {};
            })
        }
    }


});