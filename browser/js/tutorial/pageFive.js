core.directive("blTutorialFive", ($rootScope, ActionFactory, $timeout, $interval, DialogFactory, TrackingFactory, TicTacFactory, $mdDialog) => {
    return {
        restrict: 'E',
        templateUrl: 'js/tutorial/pageFive.html',
        link: (scope, elem, attr) => {



            let startGame = () => {
                if (TrackingFactory.checkTracking()) {
                    return
                } else {
                    TicTacFactory.startGame();
                }
                // TicTacFactory.startGame();
            }

            let message = {
                title: "Tic-Tac-Toe",
                listContent: ["Play the god damn game"]
            }
            DialogFactory.promptMessage(message, startGame) //initial prompt message to start game


            scope.run = () => {
                TicTacFactory.userChoice();
            }


            scope.gameBoard = TicTacFactory.gameBoard;

            scope.$watch(() => {
                return TicTacFactory.currentBox
            }, (newVal) => {
                    scope.currentBox = newVal;
            })


            scope.$watchCollection('gameBoard',(newVal) => {
                scope.gameBoard = newVal;
            })


            $rootScope.$on('singleBlink', () => {
                if (scope.selectedTab === 4 && !TicTacFactory.gameFinished && ActionFactory.isActive('tutorial')) {
                    TicTacFactory.userChoice();
                }
            });

        }

    }
});