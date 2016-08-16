core.config(function($stateProvider) {
    $stateProvider.state('tutorial', {
        url: '/tutorial',
        templateUrl: 'js/tutorial/tutorial.html',
        controller: 'TutorialCtrl',
        onEnter: (DialogFactory) => {
            DialogFactory.hint();
        }
    })
});



core.controller('TutorialCtrl', function($scope, $rootScope, ActionFactory, $interval, $timeout, ConstantsFactory, $mdDialog, DialogFactory) {
  
    $scope.settings = ConstantsFactory.settings;

    
    $scope.activeLink = 0;
    let currentTest;


    $scope.selectedTab = 0;


    $scope.active = {
    	'color' : 'red'
    }


    $scope.blinkCount = 0;


    let fillTheBar = () => {
    	$scope.blinkCount++
    	$scope.blinkFill = ($scope.blinkCount / 10) * 100;
        if($scope.blinkCount === 10) {
    		$scope.selectedTab++;
            currentTest = null;
            $scope.blinkCount = 0;
            $scope.blinkFill = 0;
    	}
    }

    $scope.continue = () => {
        currentTest = linkTest;
        $scope.selectedTab++;
        navigateTiming();
    }

    $scope.adjust = () => {
        currentTest = null;
        $scope.selectedTab = 0;
    }

    $scope.changeIndex = () => {
        $scope.selectedTab++;
    }

    let changeIndex = () => {
        $scope.selectedTab--;
    }

    

    let linkTest = () => {
    	if($scope.activeLink === 1) {
    		currentTest = sayHello;
    		$scope.selectedTab++
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

    $scope.closeDialog = () => {
        DialogFactory.hide();
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