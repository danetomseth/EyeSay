core.config(function($stateProvider) {
    $stateProvider.state('tutorial', {
        url: '/tutorial',
        templateUrl: 'js/tutorial/tutorial.html',
        controller: 'TutorialCtrl'
    })
});



core.controller('TutorialCtrl', function($scope, $rootScope, ActionFactory, $interval, $timeout, ConstantsFactory, $mdDialog) {


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
    $scope.settings = ConstantsFactory.settings;
    
    //$scope.testStart = false;
    $scope.stepOne = false;
    $scope.stepTwo = false;
    $scope.stepThree = false;
    $scope.activeLink = 0;
    let currentTest;


    $scope.selectedTab = 0;


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
            $scope.activeText = {
                'font-size': '1em'
            }
    	}, 500)
    }


    $scope.adjustValue = (add, key) => {
        if(add) {
            $scope.settings[key].value += $scope.settings[key].value * .01;
        }
        else {
            $scope.settings[key].value -= $scope.settings[key].value * .01;
        }
        ConstantsFactory.saveUser(key, $scope.settings[key].value)
    }


    $scope.startTest = () => {
        currentTest = fillTheBar;
        $scope.testStart = true;
        $scope.selectedTab = 1;
    }


    $rootScope.$on('singleBlink', () => {
        if (ActionFactory.isActive('tutorial')) {
            if(currentTest) {
                currentTest();
            }
            $scope.activeBlink = {
            	'background' : 'rgba(105,240,174, 0.2)'
            }
            $scope.activeText = {
                'font-size': '2em'
            }
            styleDelay()
        }
    });

})