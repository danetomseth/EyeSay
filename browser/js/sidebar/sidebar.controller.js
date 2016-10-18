core.controller('SidebarCtrl', function($scope, $state, $rootScope, Session, AuthService, AUTH_EVENTS, ActionFactory, ConstantsFactory) {
    $scope.user = ConstantsFactory.user;
    if(Session.user) {
        $scope.username = Session.user.firstName;
    }
    else {
        $scope.username = false;
    }
    $scope.trackingStatus = $scope.user.blinkActive;
    $scope.logOut = function() {
        return AuthService.logout()
            .then(function() {
                $state.go('home');
            });
    }


    AuthService.getLoggedInUser()
        .then(user => {
            if (Session.user) {
                $scope.loggedIn = true;

            }
        })

    var setUser = function() {
        if (Session.user) {
            $scope.loggedIn = true;
            $scope.username = Session.user.firstName;
        } else {
            $scope.loggedIn = false;
            $scope.username = false;
        }
    };

    $rootScope.$on(AUTH_EVENTS.loginSuccess, setUser);
    $rootScope.$on(AUTH_EVENTS.logoutSuccess, setUser);


    $scope.toggleTracking = (val) => {
        console.log("toggled", $scope.user.blinkActive);
        console.log("factory", ConstantsFactory.user.blinkActive);
        // ConstantsFactory.saveUser('blinkActive', $scope.user.blinkActive)
    }



    $rootScope.$watchCollection('user',(newVal) => {
            $scope.user = ConstantsFactory.user
            // $scope.trackingStatus = true;
            })

   
    $scope.$on('$viewContentLoaded',
        function() {
            $scope.currentState = $state.current.name;
        });


});