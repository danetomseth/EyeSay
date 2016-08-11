core.directive('blSidebar', function($rootScope, ActionFactory, AuthService, AUTH_EVENTS, SidebarFactory) {
    return {
        restrict: 'E',
        scope: {
            control: '='
        },
        templateUrl: 'js/sidebar/sidebar.html',
        controller: 'SidebarCtrl',
        link: function(scope) {
            scope.userLoggedIn = false;

            scope.items = SidebarFactory.getLinks(scope.userLoggedIn);

            // var setUser = function() {
            //     AuthService.getLoggedInUser().then(function(user) {
            //         $rootScope.user = user;
            //         if(user) {
            //             scope.username = user.firstName;
            //             scope.userLoggedIn = true;
            //         }
            //         scope.items = SidebarFactory.getLinks(scope.userLoggedIn);
            //     });
            // };

            // $rootScope.$on(AUTH_EVENTS.loginSuccess, setUser);
            // $rootScope.$on(AUTH_EVENTS.logoutSuccess, removeUser);
            // $rootScope.$on(AUTH_EVENTS.sessionTimeout, removeUser);

            // setUser();
            

            var removeUser = function() {
                $rootScope.user = null;
                scope.items = SidebarFactory.getLinks(false);
            };


            scope.items = SidebarFactory.getLinks(scope.userLoggedIn);
            scope.selectedLink; //// WORKING ON THIS

          

            $rootScope.$on("iterate", () => {
                if(ActionFactory.isActive('nav')){
                    scope.selectedLink = SidebarFactory.moveSelected();
                }
            })

            $rootScope.$on("singleBlink", () => {
                if(ActionFactory.isActive('nav')){
                    SidebarFactory.changeState();
                }
            })
        }
    }
});
