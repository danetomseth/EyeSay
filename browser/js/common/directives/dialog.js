core.directive("blDialog", ($mdDialog) => {
	return {
		restrict: 'E',
		scope: {
			message: '='
		},
		templateUrl: 'js/common/directives/dialog.html',
		link: (scope, elem, attr) => {
			console.log("Message: ",scope.message);
			$mdDialog.show(
				$mdDialog.alert()
				.parent(angular.element(document.querySelector('#tutorialContainer')))
				.clickOutsideToClose(true)
				.title(scope.message)
				.textContent('Blink to move to next test')
				.ariaLabel('Alert Dialog Demo')
				.ok('Got it!')
				);
		}

	}
});