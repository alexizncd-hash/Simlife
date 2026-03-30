const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 400;
canvas.height = 600;

const player = {
  x: 200,
  y: 300,
  size: 20
};

function drawRoom() {
  // Piso oscuro
  ctx.fillStyle = '#252535';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Cuadrícula
  ctx.strokeStyle = '#2e2e45';
  ctx.lineWidth = 1;
  for (let x = 0; x < canvas.width; x += 40) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }
  for (let y = 0; y < canvas.height; y += 40) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }

  // Paredes
  ctx.strokeStyle = '#4a4a6a';
  ctx.lineWidth = 3;
  ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);
}

function drawPlayer() {
  // Cuerpo
  ctx.fillStyle = '#2a5298';
  ctx.fillRect(
    player.x - 12,
    player.y - 6,
    24,
    28
  );

  // Cabeza
  ctx.fillStyle = '#c68642';
  ctx.beginPath();
  ctx.arc(player.x, player.y - 18, 14, 0, Math.PI * 2);
  ctx.fill();

  // Cabello
  ctx.fillStyle = '#1a1a1a';
  ctx.beginPath();
  ctx.arc(player.x, player.y - 24, 14, Math.PI, 0);
  ctx.fill();

  // Ojos
  ctx.fillStyle = '#1a1a1a';
  ctx.beginPath();
  ctx.arc(player.x - 5, player.y - 20, 2.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(player.x + 5, player.y - 20, 2.5, 0, Math.PI * 2);
  ctx.fill();

  // Sonrisa
  ctx.strokeStyle = '#8B5E3C';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(player.x, player.y - 14, 6, 0.1 * Math.PI, 0.9 * Math.PI);
  ctx.stroke();
}

function gameLoop() {
  drawRoom();
  drawPlayer();
  requestAnimationFrame(gameLoop);
}

gameLoop();
