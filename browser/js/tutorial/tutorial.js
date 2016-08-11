core.config(function($stateProvider) {
    $stateProvider.state('tutorial', {
        url: '/tutorial',
        templateUrl: '/templates/tutorial.html',
        controller: 'TutorialCtrl'
    })
});



core.controller('TutorialCtrl', function($scope, $rootScope, ActionFactory, $interval, $timeout, $mdDialog) {


	$scope.showAlert = function(ev) {
    // Appending dialog to document.body to cover sidenav in docs app
    // Modal dialogs should fully cover application
    // to prevent interaction outside of dialog
    $mdDialog.show(
      $mdDialog.alert()
        .parent(angular.element(document.querySelector('#tutorialContainer')))
        .clickOutsideToClose(true)
        .title('Nice work!!')
        .textContent('Blink to move to next test')
        .ariaLabel('Alert Dialog Demo')
        .ok('Got it!')
        .targetEvent(ev)
    );
  };
    
    $scope.testStart = false;
    $scope.stepOne = false;
    $scope.stepTwo = false;
    $scope.stepThree = false;
    $scope.activeLink = 0;


    $scope.selectedTab = 0


    $scope.active = {
    	'color' : 'red'
    }


    $scope.blinkCount = 0;
    $scope.countDown = 5;


    let testCountDown = () => {
    	$interval(() => {
    		$scope.countDown--;
    		if($scope.countDown === 0) {
    			$scope.selectedTab = 1;
    			$scope.testStart = true;
    		}
    	}, 1000, 5)
    }


    let fillTheBar = () => {
    	$scope.blinkCount++
    	$scope.blinkFill = ($scope.blinkCount / 10) * 100;

    	if($scope.blinkCount === 10) {
    		$scope.showAlert();
    		currentTest = linkTest;
    		$scope.selectedTab = 2;
    		navigateTiming();
    	}
    }

    let linkTest = () => {
    	console.log('blink!!!', $scope.activeLink);
    	if($scope.activeLink === 1) {
    		$scope.showAlert();
    		currentTest = sayHello;
    		$scope.selectedTab = 3

    	}
    }

    let navigateTiming = () => {
    	$interval(() => {
    		$scope.activeLink++
    		if($scope.activeLink === 3) {
    			$scope.activeLink = 0;
    		}
    	}, 1000)
    }

    let sayHello = () => {
    	
    }


    let styleDelay = () => {
    	$timeout(() => {
    		$scope.activeBlink = {
            	'background' : 'none'
            }
    	}, 500)
    }

    let currentTest = fillTheBar

    $rootScope.$on('singleBlink', () => {
        if (ActionFactory.isActive('tutorial') && $scope.testStart) {
            currentTest();
            $scope.activeBlink = {
            	'background' : 'rgba(21,101,192, 0.5)'
            }
            styleDelay()
        }
    });

    testCountDown()
})