// Load settings
const gameMode = localStorage.getItem('gameMode') || 'friend';
const currentTheme = localStorage.getItem('theme') || 'light';

// Fallback if localStorage score is missing
let score = JSON.parse(localStorage.getItem('score')) || {
  player1: 0,
  player2: 0,
  human: 0,
  computer: 0
};

// Apply theme
document.body.classList.remove('dark');
if (currentTheme === 'dark') {
  document.body.classList.add('dark');
}

// DOM elements
const cells = document.querySelectorAll('[data-cell]');
const messageEl = document.getElementById('message');
const restartBtn = document.getElementById('restartBtn');
const resetScoreBtn = document.getElementById('resetScoreBtn');
const label1 = document.getElementById('label1');
const label2 = document.getElementById('label2');
const score1 = document.getElementById('score1');
const score2 = document.getElementById('score2');

let currentPlayer = 'X';
let gameActive = true;

const winningCombos = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6]
];

// Set labels and initial scores
function loadScores() {
  if (gameMode === 'computer') {
    label1.textContent = "You:";
    label2.textContent = "Computer:";
    score1.textContent = score.human || 0;
    score2.textContent = score.computer || 0;
  } else {
    label1.textContent = "Player 1:";
    label2.textContent = "Player 2:";
    score1.textContent = score.player1 || 0;
    score2.textContent = score.player2 || 0;
  }
}
loadScores();

// Click event
function handleClick(e) {
  const cell = e.target;
  if (!gameActive || cell.textContent !== '') return;

  makeMove(cell, currentPlayer);

  if (checkWin(currentPlayer)) {
    handleWin(currentPlayer);
    return;
  }

  if (isDraw()) {
    messageEl.textContent = "It's a Draw 😅";
    gameActive = false;
    return;
  }

  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';

  if (gameMode === 'computer' && currentPlayer === 'O') {
    setTimeout(makeComputerMove, 400);
  }
}

function makeMove(cell, player) {
  cell.textContent = player;
  cell.classList.add(player);
}

function makeComputerMove() {
  const emptyCells = [...cells].filter(cell => cell.textContent === '');
  const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
  makeMove(randomCell, 'O');

  if (checkWin('O')) {
    handleWin('O');
    return;
  }

  if (isDraw()) {
    messageEl.textContent = "It's a Draw 😅";
    gameActive = false;
    return;
  }

  currentPlayer = 'X';
}

function checkWin(player) {
  return winningCombos.some(combo =>
    combo.every(index => cells[index].textContent === player)
  );
}

function isDraw() {
  return [...cells].every(cell => cell.textContent !== '');
}

function handleWin(winner) {
  gameActive = false;

  if (gameMode === 'computer') {
    if (winner === 'X') {
      messageEl.textContent = "You Win! 🎉";
      score.human++;
    } else {
      messageEl.textContent = "Computer Wins! 🤖";
      score.computer++;
    }
  } else {
    if (winner === 'X') {
      messageEl.textContent = "Player 1 Wins! 🎉";
      score.player1++;
    } else {
      messageEl.textContent = "Player 2 Wins! 🥳";
      score.player2++;
    }
  }

  updateScoreDisplay();
  localStorage.setItem('score', JSON.stringify(score));
}

function updateScoreDisplay() {
  if (gameMode === 'computer') {
    score1.textContent = score.human;
    score2.textContent = score.computer;
  } else {
    score1.textContent = score.player1;
    score2.textContent = score.player2;
  }
}

function restartGame() {
  cells.forEach(cell => {
    cell.textContent = '';
    cell.classList.remove('X', 'O');
  });
  messageEl.textContent = '';
  currentPlayer = 'X';
  gameActive = true;
}

function resetScores() {
  score = {
    player1: 0,
    player2: 0,
    human: 0,
    computer: 0
  };
  localStorage.setItem('score', JSON.stringify(score));
  updateScoreDisplay();
}

cells.forEach(cell => cell.addEventListener('click', handleClick));
restartBtn.addEventListener('click', restartGame);
resetScoreBtn.addEventListener('click', resetScores);
