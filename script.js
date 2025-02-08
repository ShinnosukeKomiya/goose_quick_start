class TicTacToe {
    constructor() {
        this.board = Array(9).fill('');
        this.currentPlayer = 'X';
        this.gameActive = true;
        this.cells = document.querySelectorAll('.cell');
        this.statusDisplay = document.getElementById('status');
        this.restartButton = document.getElementById('restart');
        
        this.initializeGame();
    }

    initializeGame() {
        this.cells.forEach(cell => {
            cell.addEventListener('click', () => this.handleCellClick(cell));
        });
        this.restartButton.addEventListener('click', () => this.restartGame());
    }

    handleCellClick(cell) {
        const index = cell.getAttribute('data-index');

        if (this.board[index] === '' && this.gameActive && this.currentPlayer === 'X') {
            this.makeMove(index);
            
            if (this.gameActive) {
                // Bot's turn
                setTimeout(() => this.botMove(), 500);
            }
        }
    }

    makeMove(index) {
        this.board[index] = this.currentPlayer;
        this.cells[index].textContent = this.currentPlayer;
        
        if (this.checkWin()) {
            this.statusDisplay.textContent = `${this.currentPlayer} wins!`;
            this.gameActive = false;
            return;
        }
        
        if (this.checkDraw()) {
            this.statusDisplay.textContent = "Game ended in a draw!";
            this.gameActive = false;
            return;
        }
        
        this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
        this.statusDisplay.textContent = `${this.currentPlayer === 'X' ? 'Your' : "Bot's"} turn! (${this.currentPlayer})`;
    }

    botMove() {
        if (!this.gameActive) return;

        // Try to win
        const winningMove = this.findWinningMove('O');
        if (winningMove !== -1) {
            this.makeMove(winningMove);
            return;
        }

        // Block player's winning move
        const blockingMove = this.findWinningMove('X');
        if (blockingMove !== -1) {
            this.makeMove(blockingMove);
            return;
        }

        // Take center if available
        if (this.board[4] === '') {
            this.makeMove(4);
            return;
        }

        // Take any available corner
        const corners = [0, 2, 6, 8];
        const availableCorners = corners.filter(corner => this.board[corner] === '');
        if (availableCorners.length > 0) {
            const randomCorner = availableCorners[Math.floor(Math.random() * availableCorners.length)];
            this.makeMove(randomCorner);
            return;
        }

        // Take any available side
        const sides = [1, 3, 5, 7];
        const availableSides = sides.filter(side => this.board[side] === '');
        if (availableSides.length > 0) {
            const randomSide = availableSides[Math.floor(Math.random() * availableSides.length)];
            this.makeMove(randomSide);
        }
    }

    findWinningMove(player) {
        for (let i = 0; i < 9; i++) {
            if (this.board[i] === '') {
                this.board[i] = player;
                if (this.checkWin()) {
                    this.board[i] = '';
                    return i;
                }
                this.board[i] = '';
            }
        }
        return -1;
    }

    checkWin() {
        const winPatterns = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
            [0, 4, 8], [2, 4, 6] // Diagonals
        ];

        return winPatterns.some(pattern => {
            const [a, b, c] = pattern;
            return this.board[a] !== '' &&
                   this.board[a] === this.board[b] &&
                   this.board[a] === this.board[c];
        });
    }

    checkDraw() {
        return !this.board.includes('');
    }

    restartGame() {
        this.board = Array(9).fill('');
        this.currentPlayer = 'X';
        this.gameActive = true;
        this.cells.forEach(cell => cell.textContent = '');
        this.statusDisplay.textContent = 'Your turn! (X)';
    }
}

// Start the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new TicTacToe();
});