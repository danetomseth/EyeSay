core.controller('HomeCtrl', function($scope, $rootScope, $timeout, Session, StateFactory) {
	let run = () => {
		if(Session.user) {
			$scope.loggedIn = true;			
		}
		else {
			$scope.loggedIn = false;
		}
	}

	run();


	let startHome = () => {
		// $scope.currentTab = 1;
		// return;
		$scope.currentTab = 0;
		$timeout(function() {
			$scope.currentTab = 1;
		}, 5000);
	}
	if(!StateFactory.lastState && !$scope.loggedIn) {
		startHome();
	}
	else {
		$scope.currentTab = 1;
	}

	$scope.calibrateTip = false;
	$scope.accountTip = false;

	$scope.skip = () => {
		$scope.currentTab = 1;
	}
	
});