core.controller('SidebarCtrl', function($scope, $state, $rootScope, Session, AuthService, AUTH_EVENTS, ActionFactory, ConstantsFactory) {

    $scope.logOut = function() {
        return AuthService.logout()
            .then(function() {
                $state.go('home');
            });
    }
   
    let lastBlinkTime = 0;
    $scope.blink = () => {
        let blinkDt = Date.now() - lastBlinkTime;
        lastBlinkTime = Date.now();
        if (blinkDt < 250) {
            return false
        } else {
            if (blinkDt <= 500) {
                console.log('doubleeeee');
                $rootScope.$broadcast('doubleBlink', 'Event');
            } else {
                console.log('singleee');
                $rootScope.$broadcast('singleBlink', 'Event');
            }
        }
    }


     AuthService.getLoggedInUser()
        .then(user => {
            console.log('user logged in', user);
            console.log('session', Session.user);
            if (Session.user) {
                $scope.loggedIn = true;
                console.log('logged in', $scope.loggedIn);
            }
        })

    var setUser = function() {
        if (Session.user) {
            console.log('user');
            $scope.loggedIn = true;
        } else {
            console.log('no user');
            $scope.loggedIn = false;
        }
    };

    $rootScope.$on(AUTH_EVENTS.loginSuccess, setUser);
    $rootScope.$on(AUTH_EVENTS.logoutSuccess, setUser);


    $scope.move = () => {
        $rootScope.$broadcast('iterate', 'Event');
    }

    $scope.dblBlink = () => {
        $rootScope.$broadcast('doubleBlink', 'Event');
    }

    $scope.toggleTracking = (val) => {
        ConstantsFactory.saveUser('blinkActive', $rootScope.settings.blinkActive.value)
    }

});