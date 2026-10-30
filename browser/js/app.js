'use strict';
window.core = angular.module('core', ['ui.router', 'ngAnimate', 'ngMaterial', 'angular-svg-round-progressbar']);
window.app = angular.module('BlinkApp', ['blinkAuth', 'core']);

app.config(function($urlRouterProvider, $locationProvider, $mdThemingProvider, $compileProvider, $httpProvider) {
    // Production performance: no debug info on DOM nodes, coalesce $http digests.
    $compileProvider.debugInfoEnabled(false);
    $compileProvider.commentDirectivesEnabled(false);
    $compileProvider.cssClassDirectivesEnabled(false);
    $httpProvider.useApplyAsync(true);

    $locationProvider.html5Mode(true);
    $locationProvider.hashPrefix('');
    $urlRouterProvider.otherwise('/');

    $mdThemingProvider.definePalette('customAccent', {
        '50': '#277446', '100': '#2e8751', '200': '#349a5d', '300': '#3aad68',
        '400': '#42bf74', '500': '#55c682', '600': '#7bd29e', '700': '#8ed9ac',
        '800': '#a1dfba', '900': '#b4e6c8', 'A100': '#7bd29e', 'A200': '#68cc90',
        'A400': '#55c682', 'A700': '#c7ecd6'
    });
    $mdThemingProvider.definePalette('customWarn', {
        '50': '#fbb6b3', '100': '#fa9e9b', '200': '#f98783', '300': '#f76f6b',
        '400': '#f65852', '500': '#F5403A', '600': '#f42822', '700': '#f0130c',
        '800': '#d8120b', '900': '#bf100a', 'A100': '#fccdcc', 'A200': '#fee5e4',
        'A400': '#fffcfc', 'A700': '#a70e08'
    });
    $mdThemingProvider.theme('default')
        .primaryPalette('blue')
        .accentPalette('customAccent')
        .warnPalette('customWarn');
});

app.run(function($rootScope, AuthService, ErrorFactory) {
    // Feature detection instead of user-agent sniffing: any browser with camera
    // access and speech synthesis can run the app.
    $rootScope.browserSupported = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia &&
        window.speechSynthesis && window.isSecureContext !== false);

    if (!$rootScope.browserSupported) {
        ErrorFactory.browserError();
    }

    AuthService.getLoggedInUser();
});

// Helper for controllers/directives: subscribe to a $rootScope event and
// automatically unsubscribe when `scope` is destroyed (prevents duplicate
// handlers piling up each time a view is re-entered).
core.factory('onRoot', function($rootScope) {
    return function(scope, eventName, handler) {
        scope.$on('$destroy', $rootScope.$on(eventName, handler));
    };
});
