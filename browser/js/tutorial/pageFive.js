core.directive("blTutorialFive", ($rootScope, ActionFactory, $timeout, $mdDialog) => {
    return {
        restrict: 'E',
        templateUrl: 'js/tutorial/pageFive.html',
        link: (scope, elem, attr) => {
            scope.currentBox = 0;

            let gameFinished = false;
            let winner = null;
            let playCount = 0;

            scope.gameBoard = [false, false, false, false, false, false, false, false, false] //initial board state
            let availableChoices = [0, 1, 2, 3, 4, 5, 6, 7, 8]; // squares computer can still choose

            let computerChoice = () => {
                if (availableChoices.length === 0) {
                    console.log('empty board');
                } else if (availableChoices.length === 1) {
                    scope.gameBoard[availableChoices[0]] = "O";
                } else if (availableChoices.length) {
                    let choice = Math.floor((Math.random() * availableChoices.length));
                    console.log("choice", choice);
                    scope.gameBoard[availableChoices[choice]] = "O";
                    availableChoices.splice(choice, 1);
                    console.log("available", availableChoices);
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

            let checkForWin = (player) => {
                //check rows first
                let letterCount = 0;
                let winCheck = true;

                for (var i = 0; i <= 2; i++) {
                    if (scope.gameBoard[i] !== player) {
                        winCheck = false;
                        break;
                    }

                }
                if (winCheck) {
                    displayWinner()
                    console.log("Winner!!");
                    return
                }

                winCheck = true;


                for (var i = 3; i <= 5; i++) {
                    if (scope.gameBoard[i] !== player) {
                        winCheck = false;
                        break;
                    }
                }

                if (winCheck) {
                    console.log("Winner!!");
                    displayWinner()
                    return
                }
                winCheck = true;

                for (var i = 0; i <= 2; i++) {
                    if (scope.gameBoard[i] !== player) {
                        winCheck = false;
                        break;
                    }
                }

                if (winCheck) {
                    console.log("Winner!!");
                    displayWinner()
                    return
                }
                winCheck = true;

                if (scope.gameBoard[0] === player && scope.gameBoard[4] === player && scope.gameBoard[8] === player) {
                    console.log("Winner!!");
                    displayWinner()
                }

                if (scope.gameBoard[2] === player && scope.gameBoard[4] === player && scope.gameBoard[6] === player) {
                    console.log("Winner!!");
                    displayWinner()
                }

                if (scope.gameBoard[0] === player && scope.gameBoard[3] === player && scope.gameBoard[6] === player) {
                    console.log("Winner!!");
                    displayWinner()
                }

                if (scope.gameBoard[1] === player && scope.gameBoard[4] === player && scope.gameBoard[7] === player) {
                    console.log("Winner!!");
                    displayWinner()
                }

                if (scope.gameBoard[2] === player && scope.gameBoard[5] === player && scope.gameBoard[8] === player) {
                    console.log("Winner!!");
                    displayWinner()
                }
            }
            let debounce = true;


            $rootScope.$on('iterate', () => {
                if (scope.selectedTab === 4 && debounce && !gameFinished) { //only run if current tab is the tic tac board
                    scope.currentBox++;
                    if (scope.currentBox === scope.gameBoard.length) {
                        scope.currentBox = 0;
                    }
                    while (scope.gameBoard[scope.currentBox]) {
                        scope.currentBox++;
                    }
                }
            });

            $rootScope.$on('singleBlink', () => {
                if (scope.selectedTab === 4 && debounce && !gameFinished) {
                    if (!scope.gameBoard[scope.currentBox]) {
                        scope.gameBoard[scope.currentBox] = "X";
                        availableChoices.splice(scope.currentBox, 1);
                        checkForWin("X");
                        debounce = false;
                        scope.currentBox = null;
                        playCount++;
                        $timeout(() => {
                            debounce = true;
                            if (playCount < 9) {
                                scope.currentBox = 0;
                                computerChoice();
                                playCount++;
                            }
                        }, 500)
                        checkForWin("0");
                    }
                    while (scope.gameBoard[scope.currentBox]) {
                        scope.currentBox++;
                    }

                }
            });


        }

    }
});