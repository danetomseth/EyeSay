core.controller('ErrorCtrl', function($scope, $mdBottomSheet, $timeout, message) {
	$scope.message = message;

	(function() {
		$timeout(() => {
		$mdBottomSheet.hide();
	}, 2000);
	})();


	
});