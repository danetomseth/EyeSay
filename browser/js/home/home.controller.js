core.controller('HomeCtrl', function($scope, $timeout, Session) {
	let run = () => {
		if(Session.user) {
			$scope.loggedIn = true;			
		}
		else {
			$scope.loggedIn = false;
		}
	}

	run();

	$scope.currentTab = 1;



	let startHome = () => {
		$timeout(function() {
			$scope.currentTab= 1;
		}, 5000);
	}

	startHome();

	



});