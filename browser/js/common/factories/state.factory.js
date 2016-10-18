core.factory('StateFactory', function($rootScope) {
    let service = {
        lastState: null,
        currentState: null,
        nextState: null
    }

    $rootScope.$on('$stateChangeStart',
        function(event, toState, toParams, fromState, fromParams) {
            service.lastState = fromState.name;
            service.nextState = toState.name;
        });
    $rootScope.$on('$stateChangeSuccess',
        function(event, toState, toParams, fromState, fromParams) {
            service.currentState = toState.name;
        });

    return service
});