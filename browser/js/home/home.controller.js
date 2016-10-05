core.controller('HomeCtrl', function($scope, Session) {
	let run = () => {
		if(Session.user) {
			$scope.loggedIn = true;			
		}
		else {
			$scope.loggedIn = false;
		}
	}

	run();

	



});