core.config(function($stateProvider) {
    $stateProvider.state('tutorial', {
        url: '/tutorial',
        templateUrl: 'js/tutorial/tutorial.html',
        controller: 'TutorialCtrl',
        onExit: (TicTacFactory) => {
            TicTacFactory.resetGame();
        }
    });
});

core.controller('TutorialCtrl', function($scope, $rootScope, $timeout, ActionFactory, ConstantsFactory, DialogFactory, StateFactory, onRoot) {
    const WAITING = 'Waiting for a blink....';
    let currentTest = null;
    let blinkTimer;

    $scope.switchView = true;
    $scope.tictac = true;
    $scope.blinkDetected = false;
    $scope.blinkCount = 0;
    $scope.blinkFill = 0;
    $scope.blinkText = WAITING;
    $scope.selectedTab = StateFactory.lastState === 'calibrate' ? 1 : 0;

    // Page three: blink ten times to fill the bar.
    const fillTheBar = () => {
        $scope.blinkCount++;
        $scope.blinkFill = ($scope.blinkCount / 10) * 100;
        if ($scope.blinkCount === 10) {
            $scope.blinkCount = 0;
            $scope.blinkFill = 0;
            $rootScope.$emit('nextTab');
        }
    };

    onRoot($scope, 'nextTab', () => {
        $scope.selectedTab++;
        currentTest = $scope.selectedTab === 2 ? fillTheBar : null;
    });

    $scope.changeIndex = () => { $scope.selectedTab++; };
    $scope.nextTab = () => $rootScope.$emit('nextTab');
    $scope.adjustBlink = (add) => ConstantsFactory.adjustValue(add, 'blinkRatio');
    $scope.closeDialog = () => DialogFactory.hide();
    $scope.goto = (step) => { $scope[step] = true; };
    $scope.startTest = () => {
        currentTest = fillTheBar;
        $scope.testStart = true;
        $scope.selectedTab = 1;
    };

    onRoot($scope, 'singleBlink', () => {
        if (!ActionFactory.isActive('tutorial')) return;
        if (currentTest) currentTest();
        $scope.activeBlink = { 'background': 'rgba(105,240,174, 0.2)', 'font-weight': 'bold' };
        $scope.activeText = { 'font-size': '2em' };
        $scope.blinkDetected = true;
        $scope.blinkText = 'Blink!!';
        $timeout.cancel(blinkTimer);
        blinkTimer = $timeout(() => {
            $scope.blinkDetected = false;
            $scope.activeBlink = { 'background': 'none' };
            $scope.activeText = { 'font-size': '1em' };
            $scope.blinkText = WAITING;
        }, 500);
    });
});
