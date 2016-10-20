core.controller('SidebarCtrl', function($scope, $state, $rootScope, Session, AuthService, AUTH_EVENTS, TimerFactory, ConstantsFactory) {


    $rootScope.$on("trackerInitialized", () => {
        TimerFactory.start();
    });


    let setUser = function() {
        $scope.loggedIn = Session.user ? true : false;
        AuthService.getLoggedInUser().then(user => {
            ConstantsFactory.setUser(user);
        })
    };


    $scope.logOut = function() {
        return AuthService.logout()
            .then(function() {
                $state.reload();
                $state.go('home');
            });
    }





    $scope.$on('$viewContentLoaded',
        function() {
            $scope.currentState = $state.current.name;
        });

    $rootScope.$on(AUTH_EVENTS.loginSuccess, setUser);
    $rootScope.$on(AUTH_EVENTS.logoutSuccess, setUser);

    setUser();


});