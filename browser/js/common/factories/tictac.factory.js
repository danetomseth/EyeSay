core.factory('TicTac', function() {
	let tic = {}
	tic.checkForWin = (player, gameBoard) => {
                //check rows first
                let letterCount = 0;
                let winCheck = true;

                for (var i = 0; i <= 2; i++) {
                    if (gameBoard[i] !== player) {
                        winCheck = false;
                        break;
                    }

                }
                if (winCheck) {
                    return true
                }

                winCheck = true;


                for (var i = 3; i <= 5; i++) {
                    if (gameBoard[i] !== player) {
                        winCheck = false;
                        break;
                    }
                }

                if (winCheck) {
                    console.log("Winner!!");
                    return true
                }
                winCheck = true;

                for (var i = 0; i <= 2; i++) {
                    if (gameBoard[i] !== player) {
                        winCheck = false;
                        break;
                    }
                }

                if (winCheck) {
                    console.log("Winner!!");
                    return true
                }
                winCheck = true;

                if (gameBoard[0] === player && gameBoard[4] === player && gameBoard[8] === player) {
                    console.log("Winner!!");
                    return true
                }

                if (gameBoard[2] === player && gameBoard[4] === player && gameBoard[6] === player) {
                    console.log("Winner!!");
                    return true
                }

                if (gameBoard[0] === player && gameBoard[3] === player && gameBoard[6] === player) {
                    console.log("Winner!!");
                    return true
                }

                if (gameBoard[1] === player && gameBoard[4] === player && gameBoard[7] === player) {
                    console.log("Winner!!");
                    return true
                }

                if (gameBoard[2] === player && gameBoard[5] === player && gameBoard[8] === player) {
                    console.log("Winner!!");
                    return true
                }

                return false
            }

	return tic;
});