core.controller('SidebarCtrl', function($scope, $state, $rootScope, Session, AuthService, AUTH_EVENTS, ActionFactory, ConstantsFactory) {
    if (Session.user) {
        $scope.username = Session.user.firstName;
    } else {
        $scope.username = false;
    }




    AuthService.getLoggedInUser()
        .then(user => {
            if (Session.user) {
                $scope.loggedIn = true;

            }
        })



    let setUser = function() {
        if (Session.user) {
            $scope.loggedIn = true;
            $scope.username = Session.user.firstName;
        } else {
            $scope.loggedIn = false;
            $scope.username = false;
        }
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