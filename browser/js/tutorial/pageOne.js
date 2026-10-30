core.directive('blTutorialOne', ($rootScope) => ({
    restrict: 'E',
    scope: {},
    templateUrl: 'js/tutorial/pageOne.html',
    link: (scope) => {
        scope.switchView = true;
        scope.startTutorial = () => $rootScope.$emit('nextTab');
    }
}));
