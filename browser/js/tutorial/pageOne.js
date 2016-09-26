core.directive("blTutorialOne", ($rootScope) => {
	return {
		restrict: 'E',
		scope: {},
		templateUrl: 'js/tutorial/pageOne.html',
		link: (scope, elem, attr) => {
			scope.calibrate = () => {
				// $rootScope.emit("nextTab");
				console.log("calibrate");
			}

			scope.startTutorial = () => {
				$rootScope.$emit("nextTab");	
			}
		}

	}
});