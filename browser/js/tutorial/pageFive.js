core.directive("blTutorialFive", ($rootScope, ActionFactory, $timeout, $interval, DialogFactory, TrackingFactory, TicTac, $mdDialog) => {
    return {
        restrict: 'E',
        templateUrl: 'js/tutorial/pageFive.html',
        link: (scope, elem, attr) => {
            let winner = null; //no winner initially 
            let debounce = true;


            //Game Board variables
            scope.gameBoard = ["", "", "", "", "", "", "", "", ""] //initial board state
            let availableChoices = [0, 1, 2, 3, 4, 5, 6, 7, 8]; // squares computer can still choose
            let playCount = 0;
            let gameFinished = true;
            scope.currentBox = null;

            let boxInterval;
            let moveBox = () => {
                boxInterval = $interval(() => {
                    if (scope.selectedTab === 4 && debounce && !gameFinished) { //only run if current tab is the tic tac board
                        scope.currentBox++;
                        if (scope.currentBox === scope.gameBoard.length) {
                            scope.currentBox = 0;
                        }
                        while (scope.gameBoard[scope.currentBox]) {
                            scope.currentBox++;
                        }
                    }
                }, 1250);
            }

            let startGame = () => {
                gameFinished = false;
                scope.currentBox = 0;
                if (TrackingFactory.convergence() > 50) {
                    alert("Facial Tracking Not Aquired!")
                } else {
                    moveBox();
                }
            }

            let message = {
                title: "Tic-Tac-Toe",
                listContent: ["Play the god damn game"]
            }
            DialogFactory.promptMessage(message, startGame)

            let computerChoice = () => {
                if (availableChoices.length === 0) {
                    console.log('empty board');
                } else if (availableChoices.length === 1) {
                    scope.gameBoard[availableChoices[0]] = "O";
                } else if (availableChoices.length) {
                    let choice = Math.floor((Math.random() * availableChoices.length));
                    scope.gameBoard[availableChoices[choice]] = "O";
                    availableChoices.splice(choice, 1);
                }


            }

            let displayWinner = () => {
                $mdDialog.show(
                    $mdDialog.alert()
                    .parent(angular.element(document.querySelector('#tutorialContainer')))
                    .clickOutsideToClose(true)
                    .title('Winner!!!')
                );
                gameFinished = true;
                scope.currentBox = null;
            }


            //Make move function Here



            $rootScope.$on('singleBlink', () => {
                if (scope.selectedTab === 4 && debounce && !gameFinished) {
                    if (!scope.gameBoard[scope.currentBox]) {
                        scope.gameBoard[scope.currentBox] = "X";
                        availableChoices.splice(scope.currentBox, 1);
                        debounce = false;
                        playCount++;
                        $interval.cancel(boxInterval);
                        if (TicTac.checkForWin("X", scope.gameBoard)) {
                            displayWinner();
                            $interval.cancel(boxInterval);
                        }
                        else {
                        scope.currentBox = null;
                        let delayInterval = Math.random() * (1200 - 600) + 600;
                        $timeout(() => {
                            debounce = true;
                            if (playCount < 9) {
                                scope.currentBox = 0;
                                computerChoice();
                                playCount++;
                                if (TicTac.checkForWin("0", scope.gameBoard)) {
                                    displayWinner();
                                    $interval.cancel(boxInterval);
                                }
                            }
                        }, delayInterval)
                    }

                    }
                    while (scope.gameBoard[scope.currentBox]) {
                        scope.currentBox++;
                    }

                }
            });





        }

    }
});