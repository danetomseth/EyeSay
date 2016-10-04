core.controller('SidebarCtrl', function($scope, $state, $rootScope, Session, AuthService, AUTH_EVENTS, ActionFactory, ConstantsFactory) {

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
            console.log("user",Session.user);
            $scope.username = Session.user.firstName;
        } else {
            $scope.loggedIn = false;
        }
    };

    $rootScope.$on(AUTH_EVENTS.loginSuccess, setUser);
    $rootScope.$on(AUTH_EVENTS.logoutSuccess, setUser);


    $scope.toggleTracking = (val) => {
        ConstantsFactory.saveUser('blinkActive', $rootScope.settings.blinkActive.value)
    }

    $scope.showWebcam = ConstantsFactory.settings.blinkActive.value;

    $scope.$watch(function() {
        return ConstantsFactory.settings.blinkActive.value
    }, function(newVal, oldVal) {
        if (typeof newVal !== 'undefined') {
            $scope.showWebcam = ConstantsFactory.settings.blinkActive.value;
        }
    });

   
    $scope.$on('$viewContentLoaded',
        function() {
            $scope.currentState = $state.current.name;

        });

});