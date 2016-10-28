'use strict';
const core = angular.module('core', ['ui.router', 'ngAnimate', 'ngMaterial', 'ngMdIcons', 'angular-svg-round-progressbar'])




window.app = angular.module('BlinkApp', ['blinkAuth', 'core']);





app.config(function($urlRouterProvider, $locationProvider, $mdThemingProvider, $mdIconProvider) {
    // This turns off hashbang urls (/#about) and changes it to something normal (/about)

    $mdIconProvider
    .defaultIconSet('assets/svg/mdi.svg')

    
    $locationProvider.html5Mode(true);
    // If we go to a URL that ui-router doesn't have registered, go to the "/" url.
    $urlRouterProvider.otherwise('/');
    // Trigger page refresh when accessing an OAuth route
    $urlRouterProvider.when('/auth/:provider', function() {
        window.location.reload();
    });


     var customAccent = {
        '50': '#277446',
        '100': '#2e8751',
        '200': '#349a5d',
        '300': '#3aad68',
        '400': '#42bf74',
        '500': '#55c682',
        '600': '#7bd29e',
        '700': '#8ed9ac',
        '800': '#a1dfba',
        '900': '#b4e6c8',
        'A100': '#7bd29e',
        'A200': '#68cc90',
        'A400': '#55c682',
        'A700': '#c7ecd6'
    };
    $mdThemingProvider
        .definePalette('customAccent', 
                        customAccent);

      var customWarn = {
        '50': '#fbb6b3',
        '100': '#fa9e9b',
        '200': '#f98783',
        '300': '#f76f6b',
        '400': '#f65852',
        '500': '#F5403A',
        '600': '#f42822',
        '700': '#f0130c',
        '800': '#d8120b',
        '900': '#bf100a',
        'A100': '#fccdcc',
        'A200': '#fee5e4',
        'A400': '#fffcfc',
        'A700': '#a70e08'
    };
    $mdThemingProvider
        .definePalette('customWarn', 
                        customWarn);

    $mdThemingProvider.theme('default')
    .primaryPalette('blue')
    .accentPalette('customAccent')
    .warnPalette('customWarn')

});

// This app.run is for controlling access to specific states.
app.run(function($rootScope, AuthService, $state, Session, ConstantsFactory, ErrorFactory) {
    $rootScope.isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);

    if(!$rootScope.isChrome) {
        ErrorFactory.browserError();
    }
    // The given state requires an authenticated user.

    AuthService.getLoggedInUser().then(function(user) {
            // If a user is retrieved, then renavigate to the destination
            // (the second time, AuthService.isAuthenticated() will work)
            // otherwise, if no user is logged in, go to "login" state.
        });

    
    var destinationStateRequiresAuth = function(state) {
        return state.data && state.data.authenticate;
    };


    // $stateChangeStart is an event fired
    // whenever the process of changing a state begins.
    $rootScope.$on('$stateChangeStart', function(event, toState, toParams) {


        if (!destinationStateRequiresAuth(toState)) {
            // The destination state does not require authentication
            // Short circuit with return.
            return;
        }

        if (AuthService.isAuthenticated()) {
            // The user is authenticated.
            // Short circuit with return.
            return;
        }

        // Cancel navigating to new state.
        event.preventDefault();

        // AuthService.getLoggedInUser().then(function(user) {
        //     debugger;
        //     // If a user is retrieved, then renavigate to the destination
        //     // (the second time, AuthService.isAuthenticated() will work)
        //     // otherwise, if no user is logged in, go to "login" state.

        //     if (user) {
        //         $state.go(toState.name, toParams);
        //     } else {
        //         $state.go('login');
        //     }


        // });

    });

});
