core.directive('blSidebar', function(ActionFactory, SidebarFactory, onRoot) {
    return {
        restrict: 'E',
        templateUrl: 'js/sidebar/sidebar.html',
        controller: 'SidebarCtrl',
        link: function(scope) {
            scope.items = SidebarFactory.getLinks();

            // 'NAV' on the keyboard hands scanning to the sidebar links.
            onRoot(scope, 'iterate', () => {
                if (ActionFactory.isActive('nav')) scope.selectedLink = SidebarFactory.moveSelected();
            });
            onRoot(scope, 'singleBlink', () => {
                if (ActionFactory.isActive('nav')) {
                    scope.selectedLink = null;
                    SidebarFactory.changeState();
                }
            });
        }
    };
});
