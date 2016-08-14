app.config(function ($stateProvider) {

    // Register our *about* state.
    $stateProvider.state('about', {
        url: '/about',
        controller: 'AboutController',
        templateUrl: 'js/about/about.html'
    });

});

app.controller('AboutController', function ($scope) {
	$scope.change = () => {
		console.log('clicked');
		$scope.changeClass = 'highlight-item';
	}

	$scope.clear = () => {
		console.log('clicked clear');
		$scope.changeClass = '';
	}

});
