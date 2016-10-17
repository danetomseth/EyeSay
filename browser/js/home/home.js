core.config(function($stateProvider) {
    $stateProvider.state('home', {
        url: '/',
        templateUrl: 'js/home/home.html',
        controller: 'HomeCtrl',
        onEnter: ($rootScope) => {
            $rootScope.isHome = true;
        },
        onExit: ($rootScope) => {
            $rootScope.isHome = false;
        }
    });

});