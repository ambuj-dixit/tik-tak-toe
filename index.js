const startBtn = document.getElementById('startBtn');

startBtn.addEventListener('click', () => {
  const mode = document.getElementById('mode').value;
  const theme = document.getElementById('theme').value;

  localStorage.setItem('gameMode', mode);
  localStorage.setItem('theme', theme);

  // ✅ Only set score if not already set
  if (!localStorage.getItem('score')) {
    localStorage.setItem('score', JSON.stringify({
      player1: 0,
      player2: 0,
      human: 0,
      computer: 0
    }));
  }

  window.location.href = 'game.html';
});
