core.directive('blSidebar', function($rootScope, ActionFactory, AuthService, AUTH_EVENTS, SidebarFactory) {
    return {
        restrict: 'E',
        // scope: {
        //     control: '='
        // },
        templateUrl: 'js/sidebar/sidebar.html',
        controller: 'SidebarCtrl',
        link: function(scope) {
            // scope.userLoggedIn = false;

            scope.items = SidebarFactory.getLinks(scope.userLoggedIn);




            var removeUser = function() {
                $rootScope.user = null;
                scope.items = SidebarFactory.getLinks(false);
            };

           


            scope.items = SidebarFactory.getLinks(scope.userLoggedIn);
            scope.selectedLink; //// WORKING ON THIS



            $rootScope.$on("iterate", () => {
                if (ActionFactory.isActive('nav')) {
                    scope.selectedLink = SidebarFactory.moveSelected();
                }
            })

            $rootScope.$on("singleBlink", () => {
                if (ActionFactory.isActive('nav')) {
                    SidebarFactory.changeState();
                }
            })
        }
    }
});