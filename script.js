// Game State
let currentPlayer = 'X';
let gameBoard = ['', '', '', '', '', '', '', '', ''];
let gameActive = true;
let scoreX = 0;
let scoreO = 0;

// DOM Elements
const cells = document.querySelectorAll('.cell');
const currentPlayerDisplay = document.getElementById('current-player');
const gameStatus = document.getElementById('game-status');
const restartBtn = document.getElementById('restart-btn');
const resetBtn = document.getElementById('reset-btn');
const winnerOverlay = document.getElementById('winner-overlay');
const winnerText = document.getElementById('winner-text');
const playAgainBtn = document.getElementById('play-again-btn');
const scoreXDisplay = document.getElementById('score-x');
const scoreODisplay = document.getElementById('score-o');

// Winning Combinations
const winningCombinations = [
    [0, 1, 2], // Top row
    [3, 4, 5], // Middle row
    [6, 7, 8], // Bottom row
    [0, 3, 6], // Left column
    [1, 4, 7], // Middle column
    [2, 5, 8], // Right column
    [0, 4, 8], // Diagonal top-left to bottom-right
    [2, 4, 6]  // Diagonal top-right to bottom-left
];

// Initialize Game
function initGame() {
    cells.forEach((cell, index) => {
        cell.addEventListener('click', () => handleCellClick(index));
    });

    restartBtn.addEventListener('click', restartGame);
    resetBtn.addEventListener('click', resetScore);
    playAgainBtn.addEventListener('click', playAgain);

    loadScore();
    updateScoreDisplay();
}

// Handle Cell Click
function handleCellClick(index) {
    if (!gameActive || gameBoard[index] !== '') {
        return;
    }

    // Update game board
    gameBoard[index] = currentPlayer;
    cells[index].textContent = currentPlayer;
    cells[index].classList.add(currentPlayer.toLowerCase());

    // Add click animation
    cells[index].style.animation = 'none';
    setTimeout(() => {
        cells[index].style.animation = '';
    }, 10);

    // Check for winner or draw
    if (checkWinner()) {
        endGame(false);
    } else if (checkDraw()) {
        endGame(true);
    } else {
        // Switch player
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        updateCurrentPlayerDisplay();
    }
}

// Check for Winner
function checkWinner() {
    for (let combination of winningCombinations) {
        const [a, b, c] = combination;

        if (gameBoard[a] &&
            gameBoard[a] === gameBoard[b] &&
            gameBoard[a] === gameBoard[c]) {

            // Highlight winning cells
            cells[a].classList.add('winner');
            cells[b].classList.add('winner');
            cells[c].classList.add('winner');

            return true;
        }
    }
    return false;
}

// Check for Draw
function checkDraw() {
    return gameBoard.every(cell => cell !== '');
}

// End Game
function endGame(isDraw) {
    gameActive = false;

    // Disable all cells
    cells.forEach(cell => {
        cell.classList.add('disabled');
    });

    setTimeout(() => {
        if (isDraw) {
            showWinnerOverlay("It's a Draw!");
        } else {
            // Update score
            if (currentPlayer === 'X') {
                scoreX++;
            } else {
                scoreO++;
            }
            saveScore();
            updateScoreDisplay();
            showWinnerOverlay(`Player ${currentPlayer} Wins!`);
        }
    }, 500);
}

// Show Winner Overlay
function showWinnerOverlay(message) {
    winnerText.textContent = message;
    winnerOverlay.classList.add('show');
}

// Hide Winner Overlay
function hideWinnerOverlay() {
    winnerOverlay.classList.remove('show');
}

// Play Again
function playAgain() {
    hideWinnerOverlay();
    restartGame();
}

// Restart Game
function restartGame() {
    currentPlayer = 'X';
    gameBoard = ['', '', '', '', '', '', '', '', ''];
    gameActive = true;

    cells.forEach(cell => {
        cell.textContent = '';
        cell.className = 'cell';
    });

    gameStatus.textContent = '';
    updateCurrentPlayerDisplay();
}

// Reset Score
function resetScore() {
    if (confirm('Are you sure you want to reset the score?')) {
        scoreX = 0;
        scoreO = 0;
        saveScore();
        updateScoreDisplay();
        restartGame();
    }
}

// Update Current Player Display
function updateCurrentPlayerDisplay() {
    currentPlayerDisplay.textContent = currentPlayer;
    currentPlayerDisplay.style.animation = 'none';
    setTimeout(() => {
        currentPlayerDisplay.style.animation = '';
    }, 10);
}

// Update Score Display
function updateScoreDisplay() {
    scoreXDisplay.textContent = scoreX;
    scoreODisplay.textContent = scoreO;
}

// Save Score to LocalStorage
function saveScore() {
    localStorage.setItem('tictactoe_scoreX', scoreX);
    localStorage.setItem('tictactoe_scoreO', scoreO);
}

// Load Score from LocalStorage
function loadScore() {
    const savedScoreX = localStorage.getItem('tictactoe_scoreX');
    const savedScoreO = localStorage.getItem('tictactoe_scoreO');

    if (savedScoreX !== null) {
        scoreX = parseInt(savedScoreX);
    }
    if (savedScoreO !== null) {
        scoreO = parseInt(savedScoreO);
    }
}

// Add touch support for better mobile experience
function addTouchSupport() {
    cells.forEach(cell => {
        cell.addEventListener('touchstart', (e) => {
            e.preventDefault();
            cell.click();
        }, { passive: false });
    });
}

// Prevent zoom on double tap for mobile
function preventZoom() {
    document.addEventListener('touchstart', (e) => {
        if (e.touches.length > 1) {
            e.preventDefault();
        }
    }, { passive: false });

    let lastTouchEnd = 0;
    document.addEventListener('touchend', (e) => {
        const now = Date.now();
        if (now - lastTouchEnd <= 300) {
            e.preventDefault();
        }
        lastTouchEnd = now;
    }, false);
}

// Keyboard Support
function addKeyboardSupport() {
    document.addEventListener('keydown', (e) => {
        if (e.key === 'r' || e.key === 'R') {
            restartGame();
        }
    });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initGame();
    addTouchSupport();
    preventZoom();
    addKeyboardSupport();
});

// Add visual feedback for button presses
function addButtonFeedback() {
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 100);
        });
    });
}

// Call button feedback on load
window.addEventListener('load', addButtonFeedback);
