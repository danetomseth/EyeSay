core.controller('SidebarCtrl', function($scope, $state, $rootScope, Session, AuthService, AUTH_EVENTS, TimerFactory, ConstantsFactory) {


    $rootScope.$on("trackerInitialized", () => {
        TimerFactory.start();
    });


    let setUser = function() {
        $scope.loggedIn = Session.user ? true : false;
        
    };


    $scope.logOut = function() {
        return AuthService.logout()
            .then(function() {
                $state.reload();
                $state.go('home');
            });
    }

    $scope.webcamError = false;





    $scope.$on('$viewContentLoaded',
        function() {
            $scope.currentState = $state.current.name;
            if(!$rootScope.isChrome) {
                $scope.webcamError = true;
            }
        });

    $rootScope.$on(AUTH_EVENTS.loginSuccess, setUser);
    $rootScope.$on(AUTH_EVENTS.logoutSuccess, setUser);

    setUser();


});