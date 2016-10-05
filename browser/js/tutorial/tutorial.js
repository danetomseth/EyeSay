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



core.controller('TutorialCtrl', function($scope, $rootScope, ActionFactory, $interval, $timeout, ConstantsFactory, $mdDialog, DialogFactory) {

    $scope.user = ConstantsFactory.getUser();
    let currentTest;
    $scope.blinkCount = 0;

    $scope.blinkText = "Waiting for a blink...."


    let setVariables = () => {
        $scope.selectedTab = 0;
        $scope.blinkCount = 0;
        $scope.blinkFill = 0;
        currentTest = null;
    }

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
        // $rootScope.$emit("fillBar")
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
        if ($scope.activeLink === 1) {
            currentTest = sayHello;
            $scope.selectedTab++
        }
    }

    let navigateTiming = () => {
        $interval(() => {
            $scope.activeLink++
            if ($scope.activeLink === 3) {
                $scope.activeLink = 0;
            }
        }, 1000)
    }


    let styleDelay = () => {
        $timeout(() => {
            $scope.activeBlink = {
                'background': 'none'
            }
            $scope.activeText = {
                'font-size': '1em'
            }
            $scope.blinkText = "Waiting for a blink...."
        }, 500)
    }


    $scope.adjustValue = (add, key) => {
        if (add) {
            ConstantsFactory.user[key] += ConstantsFactory.user[key] * .01;
        } else {
            ConstantsFactory.user[key] -= ConstantsFactory.user[key] * .01;
        }
        ConstantsFactory.saveUser(key, ConstantsFactory.user[key])
    }


    $scope.adjustBlink = (add) => {
        if (add) {
            ConstantsFactory.user.blinkZero -= ConstantsFactory.user.blinkZero * .05;
            ConstantsFactory.user.blinkRatio += ConstantsFactory.user.blinkRatio * .05;
        } else {
            ConstantsFactory.user.blinkZero += ConstantsFactory.user.blinkZero * .05;
            ConstantsFactory.user.blinkRatio -= ConstantsFactory.user.blinkRatio * .05;
        }

        ConstantsFactory.user.blinkZero = Math.floor(ConstantsFactory.user.blinkZero);
        ConstantsFactory.user.blinkRatio = (ConstantsFactory.user.blinkRatio.toFixed(3)) / 1;

        ConstantsFactory.saveUser("blinkRatio", ConstantsFactory.user.blinkRatio)
        ConstantsFactory.saveUser("blinkZero", ConstantsFactory.user.blinkZero)
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

    $scope.tictac = true;


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
            $scope.blinkText = "Blink!!"
            styleDelay()
        }
    });

    $rootScope.$on('$stateChangeStart',
        function(event, toState, toParams, fromState, fromParams, options) {
            setVariables();
            // transitionTo() promise will be rejected with 
            // a 'transition prevented' error
        })

})