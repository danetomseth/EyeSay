core.directive('blTutorialFive', (ActionFactory, DialogFactory, TicTacFactory, onRoot) => {
    return {
        restrict: 'E',
        templateUrl: 'js/tutorial/pageFive.html',
        link: (scope) => {
            scope.tic = TicTacFactory;
            TicTacFactory.resetGame();

            DialogFactory.promptMessage({
                title: 'Tic-Tac-Toe',
                listContent: [
                    '1. The goal is to practice blink selection',
                    '2. The highlighted box is the current selection',
                    '3. Blink to put your letter in the highlighted box'
                ]
            }, TicTacFactory.startGame);

            onRoot(scope, 'singleBlink', () => {
                if (scope.selectedTab === 4 && ActionFactory.isActive('tutorial') &&
                    !TicTacFactory.gameFinished && TicTacFactory.choiceAvailable && TicTacFactory.currentBox !== null) {
                    TicTacFactory.userChoice();
                }
            });

            scope.$on('$destroy', TicTacFactory.resetGame);
        }
    };
});
