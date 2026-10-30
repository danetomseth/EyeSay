// Blink-driven tic-tac-toe for practising selection timing (tutorial page five).
core.factory('TicTacFactory', function($state, $timeout, $interval, DialogFactory) {
    const tic = {};
    let available = [];
    let boxInterval = null;
    let timers = [];

    const stopTimers = () => {
        $interval.cancel(boxInterval);
        boxInterval = null;
        timers.forEach((t) => $timeout.cancel(t));
        timers = [];
    };

    tic.resetGame = () => {
        stopTimers();
        tic.gameBoard = ['', '', '', '', '', '', '', '', ''];
        available = [0, 1, 2, 3, 4, 5, 6, 7, 8];
        tic.currentBox = null;
        tic.gameFinished = false;
        tic.computerChoosing = false;
        tic.choiceAvailable = true;
    };

    // Highlight the next empty square.
    tic.moveBox = () => {
        if (!available.length) return null;
        let next = tic.currentBox === null ? 0 : tic.currentBox + 1;
        for (let i = 0; i < 9; i++, next++) {
            if (!tic.gameBoard[next % 9]) break;
        }
        tic.currentBox = next % 9;
        return tic.currentBox;
    };

    const scan = () => {
        $interval.cancel(boxInterval);
        boxInterval = $interval(tic.moveBox, 1000);
    };

    tic.startGame = () => {
        tic.resetGame();
        tic.currentBox = null;
        tic.moveBox();
        scan();
    };

    const finish = (winner) => {
        stopTimers();
        tic.gameFinished = true;
        tic.computerChoosing = false;
        tic.currentBox = null;
        const title = winner === 'X' ? 'You win!!!' : winner === 'O' ? 'You lost :(' : "It's a draw!!";
        DialogFactory.promptMessage({ title, listContent: ['Proceed'] }, () => $state.go('type'));
    };

    const take = (box, player) => {
        tic.gameBoard[box] = player;
        available.splice(available.indexOf(box), 1);
        const winner = EyeSayLib.ticTacToeWinner(tic.gameBoard);
        if (winner || !available.length) {
            finish(winner);
            return true;
        }
        return false;
    };

    tic.userChoice = () => {
        if (tic.currentBox === null || tic.gameBoard[tic.currentBox]) return;
        tic.choiceAvailable = false;
        $interval.cancel(boxInterval);
        const box = tic.currentBox;
        tic.currentBox = null;
        if (take(box, 'X')) return;

        // Computer "thinks" briefly, picks a random empty square, then the user's turn resumes.
        tic.computerChoosing = true;
        timers.push($timeout(() => {
            const choice = available[Math.floor(Math.random() * available.length)];
            if (take(choice, 'O')) return;
            timers.push($timeout(() => {
                tic.computerChoosing = false;
                tic.choiceAvailable = true;
                tic.moveBox();
                scan();
            }, 700));
        }, 500 + Math.floor(Math.random() * 300)));
    };

    tic.resetGame();
    return tic;
});
