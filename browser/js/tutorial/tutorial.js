core.config(function($stateProvider) {
    $stateProvider.state('tutorial', {
        url: '/tutorial',
        templateUrl: 'js/tutorial/tutorial.html',
        controller: 'TutorialCtrl',
        cache: false,
        onEnter: (DialogFactory) => {
            //DialogFactory.hint();
        },
        onExit: (TicTacFactory) => {
            TicTacFactory.resetGame();
        }
    })
});



core.controller('TutorialCtrl', function($scope, $rootScope, ActionFactory, $interval, $timeout, ConstantsFactory, DialogFactory, StateFactory) {

    // $scope.selectedTab = 1;
    $scope.switchView = true;

    $scope.blinkDetected = false;
    let currentTest;
    $scope.blinkCount = 0;
    $scope.tictac = true;

    // $scope.selectedTab = 4;


    $scope.blinkText = "Waiting for a blink...."


    $rootScope.$on('nextTab', function() {
        $scope.selectedTab++;
        if ($scope.selectedTab === 2) {
            currentTest = fillTheBar;
        } else if ($scope.selectedTab === 3) {
            currentTest = null;
        }
    });



    let fillTheBar = () => {
        $scope.blinkCount++
            $scope.blinkFill = ($scope.blinkCount / 10) * 100;
        if ($scope.blinkCount === 10) {
            $scope.blinkCount = 0;
            $scope.blinkFill = 0;
            $rootScope.$emit("nextTab");
        }
    }



    $scope.changeIndex = () => {
        $scope.selectedTab++;
    }

    $scope.adjustBlink = (add) => {
        ConstantsFactory.adjustValue(add, 'blinkRatio');
    }


    $scope.startTest = () => {
        currentTest = fillTheBar;
        $scope.testStart = true;
        $scope.selectedTab = 1;
    }

    $scope.closeDialog = () => {
        DialogFactory.hide();
    }
    $scope.nextTab = () => {
        $rootScope.$emit("nextTab");
    }


    $scope.goto = (step) => {
        $scope[step] = true;
    }



    let styleDelay = () => {
        $timeout(() => {
            $scope.blinkDetected = false;
            $scope.activeBlink = {
                'background': 'none'
            }
            $scope.activeText = {
                'font-size': '1em'
            }
            $scope.blinkText = "Waiting for a blink...."
        }, 500)
    }


    $rootScope.$on('singleBlink', () => {
        if (ActionFactory.isActive('tutorial')) {
            if (currentTest) {
                currentTest();
            }
            $scope.activeBlink = {
                'background': 'rgba(105,240,174, 0.2)',
                'font-weight': 'bold'
            }
            $scope.activeText = {
                'font-size': '2em'
            }
            $scope.blinkDetected = true;
            $scope.blinkText = "Blink!!"
            styleDelay()
        }
    });

    if (StateFactory.lastState === 'calibrate') {
        $scope.selectedTab = 1;
    } 

})