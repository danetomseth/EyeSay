core.factory('TicTacFactory', function($state, $timeout, $interval, DialogFactory) {
    let tic = {}
    let boxDelay = true;
    tic.currentBox = null;
    tic.gameBoard = ["", "", "", "", "", "", "", "", ""] //initial board state
    tic.gameFinished = false;

    let availableChoices = [0, 1, 2, 3, 4, 5, 6, 7, 8]; // squares computer can still choose


    let boxInterval;
    let changeBox = () => {
        boxInterval = $interval(() => {
            if (boxDelay) {
                tic.moveBox();
            }
        }, 1000)
    }

    let debounce = () => {
        boxDelay = false;
        $interval.cancel(boxInterval);
        tic.currentBox = null;
        $timeout(() => {
            boxDelay = true;
            tic.moveBox();
            changeBox();
        }, 1000)
    }


    tic.startGame = () => {
        tic.currentBox = 0;
        changeBox();
    }

    tic.moveBox = () => {
        if (tic.currentBox === null) {
            tic.currentBox = 0;
        } else {
            tic.currentBox++;
        }
        if (tic.currentBox >= tic.gameBoard.length) {
            tic.currentBox = 0;
        }
        while (tic.gameBoard[tic.currentBox]) {
            tic.currentBox++;
        }
        return tic.currentBox;
    }


    tic.userChoice = () => {
        tic.gameBoard[tic.currentBox] = "X";
        let elemToSlice = availableChoices.indexOf(tic.currentBox);
        availableChoices.splice(elemToSlice, 1);
        if (tic.checkForWin("X")) {
            tic.finishGame("X");
            return
        };
        if (!availableChoices.length) {
            tic.finishGame();
            return
        }
        tic.computerChoice();
        if (tic.checkForWin("O")) {
            tic.finishGame("O");
            return
        };
        debounce();
    }



    tic.computerChoice = () => {
        let randomDelay = Math.floor(Math.random() * 300) + 250;
        $timeout(() => {
            let randNum = Math.floor(Math.random() * (availableChoices.length))
            let randChoice = availableChoices[randNum];
            tic.gameBoard[randChoice] = "O";
            availableChoices.splice(randNum, 1);
        }, randomDelay);

    }


    tic.checkForWin = (player) => {
        //check rows first
        let winCheck = true;
        for (var i = 0; i <= 2; i++) {
            if (tic.gameBoard[i] !== player) {
                winCheck = false;
                break;
            }

        }
        if (winCheck) {
            return true
        }
        winCheck = true;
        for (var i = 3; i <= 5; i++) {
            if (tic.gameBoard[i] !== player) {
                winCheck = false;
                break;
            }
        }
        if (winCheck) {
            return true
        }
        winCheck = true;
        for (var i = 0; i <= 2; i++) {
            if (tic.gameBoard[i] !== player) {
                winCheck = false;
                break;
            }
        }
        if (winCheck) {
            return true
        }
        winCheck = true;
        if (tic.gameBoard[0] === player && tic.gameBoard[4] === player && tic.gameBoard[8] === player) {
            return true
        }

        if (tic.gameBoard[2] === player && tic.gameBoard[4] === player && tic.gameBoard[6] === player) {
            return true
        }
        if (tic.gameBoard[0] === player && tic.gameBoard[3] === player && tic.gameBoard[6] === player) {
            return true
        }
        if (tic.gameBoard[1] === player && tic.gameBoard[4] === player && tic.gameBoard[7] === player) {
            return true
        }
        if (tic.gameBoard[2] === player && tic.gameBoard[5] === player && tic.gameBoard[8] === player) {
            return true
        }
        return false
    }

    tic.finishGame = (player) => {
        tic.gameFinished = true;
        tic.currentBox = null;
        $interval.cancel(boxInterval);
        let message = {
            title: "It's a draw!!",
            listContent: ["Proceed"],
        }
        let action = () => {
            $state.go("type");
        }
        if (player === "X") {
            message.title = "You win!!!"
            DialogFactory.promptMessage(message, action);
        } else if (player === "O") {
            message.title = "You lost :("
            DialogFactory.promptMessage(message, action);
        } else {
           DialogFactory.promptMessage(message, action);
        }
    }


    tic.resetGame = () => {
        tic.gameBoard = ["", "", "", "", "", "", "", "", ""] //initial board state
        $interval.cancel(boxInterval);
    }



    return tic;
});