core.controller('SidebarCtrl', function($scope, $state, $rootScope, Session, AuthService, AUTH_EVENTS) {





    let setUser = function() {
        $scope.loggedIn = Session.user ? true : false;
    };


    $scope.logOut = function() {
        return AuthService.logout()
            .then(function() {
                $state.go('home');
            });
    }





    $scope.$on('$viewContentLoaded',
        function() {
            $scope.currentState = $state.current.name;
        });

    $rootScope.$on(AUTH_EVENTS.loginSuccess, setUser);
    $rootScope.$on(AUTH_EVENTS.logoutSuccess, setUser);


});