core.directive("blTutorialFive", ($rootScope, ActionFactory, $timeout, $interval, DialogFactory, TrackingFactory, TicTacFactory, $mdDialog) => {
    return {
        restrict: 'E',
        templateUrl: 'js/tutorial/pageFive.html',
        link: (scope, elem, attr) => {
            let startGame = () => {
                TicTacFactory.startGame();
            }

            let message = {
                    title: "Tic-Tac-Toe",
                    listContent: ["1. The goal is to beat the computer", "2. The highlighted box is the current selection", "3. Blink to select the current box"]
                }
            DialogFactory.promptMessage(message, startGame) //initial prompt message to start game


          

            scope.gameBoard = TicTacFactory.gameBoard;
            scope.computerChoosing = TicTacFactory.computerChoosing;

            scope.$watch(() => {
                return TicTacFactory.currentBox
            }, (newVal) => {
                scope.currentBox = newVal;
            })

            scope.showLoading = TicTacFactory.computerChoosing;

            scope.$watchCollection('gameBoard', (newVal) => {
                scope.gameBoard = newVal;
            })


            

            scope.$watch(() => {
                return TicTacFactory.computerChoosing
            }, (newVal) => {
                scope.computerChoosing = newVal;
            })


            $rootScope.$on('singleBlink', () => {
                if (scope.selectedTab === 4 && !TicTacFactory.gameFinished && ActionFactory.isActive('tutorial')) {
                    if(scope.currentBox) {
                        TicTacFactory.userChoice();
                    }
                }
            });

        }

    }
});