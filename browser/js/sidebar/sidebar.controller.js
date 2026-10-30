core.controller('SidebarCtrl', function($scope, $state, $rootScope, Session, AUTH_EVENTS, TimerFactory, ConstantsFactory, onRoot) {
    onRoot($scope, 'trackerInitialized', () => TimerFactory.start());

    const setUser = () => {
        $scope.loggedIn = !!Session.user;
    };
    onRoot($scope, AUTH_EVENTS.loginSuccess, setUser);
    onRoot($scope, AUTH_EVENTS.logoutSuccess, setUser);
    setUser();

    $scope.webcamError = !$rootScope.browserSupported;
    $scope.toggleTracking = () => ConstantsFactory.save();

    onRoot($scope, '$stateChangeSuccess', (event, toState) => {
        $scope.currentState = toState.name;
    });
});
