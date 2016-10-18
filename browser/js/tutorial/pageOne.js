core.directive("blTutorialOne", ($rootScope) => {
	return {
		restrict: 'E',
		scope: {},
		templateUrl: 'js/tutorial/pageOne.html',
		link: (scope, elem, attr) => {

			scope.startTutorial = () => {
				$rootScope.$emit("nextTab");	
			}

			scope.switchView = true;
		}

	}
});