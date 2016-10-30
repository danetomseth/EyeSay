core.controller('HomeCtrl', function($scope, $rootScope, Session, ErrorFactory) {
	

	let run = () => {
		$scope.loggedIn = (Session.user) ? true : false;

	}

	run();





	

	$scope.calibrateTip = false;
	$scope.accountTip = false;

	
	
});