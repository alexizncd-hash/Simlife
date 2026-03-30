const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Tamaño del canvas adaptado a la pantalla del teléfono
canvas.width = window.innerWidth > 420 ? 400 : window.innerWidth - 20;
canvas.height = window.innerHeight - 40;

// ── PERSONAJE ─────────────────────────────────────────────
const player = {
  x: canvas.width / 2,
  y: canvas.height / 2,

  // destino: hacia donde se está moviendo
  tx: canvas.width / 2,
  ty: canvas.height / 2,

  size: 20,
  moving: false,
  frame: 0        // contador para animar las piernas
};

// ── MOVIMIENTO AL TOCAR ───────────────────────────────────
// Detectamos toque en móvil
canvas.addEventListener('touchstart', (e) => {
  e.preventDefault(); // evita que la página haga scroll

  const rect = canvas.getBoundingClientRect();
  const touch = e.touches[0];

  // Convertimos coordenadas del toque a coordenadas del canvas
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;

  player.tx = (touch.clientX - rect.left) * scaleX;
  player.ty = (touch.clientY - rect.top) * scaleY;
  player.moving = true;
});

// También funciona con clic en computadora
canvas.addEventListener('click', (e) => {
  const rect = canvas.getBoundingClientRect();
  player.tx = (e.clientX - rect.left) * (canvas.width / rect.width);
  player.ty = (e.clientY - rect.top) * (canvas.height / rect.height);
  player.moving = true;
});

// ── LERP ──────────────────────────────────────────────────
// Avanza 'a' hacia 'b' un 10% cada frame → movimiento suave
function lerp(a, b, t) {
  return a + (b - a) * t;
}

// ── ACTUALIZAR POSICIÓN ───────────────────────────────────
function updatePlayer() {
  if (!player.moving) return;

  // Mover suavemente hacia el destino
  player.x = lerp(player.x, player.tx, 0.1);
  player.y = lerp(player.y, player.ty, 0.1);

  // Animar las piernas mientras camina
  player.frame++;

  // Si llegó lo suficientemente cerca, parar
  const dx = player.tx - player.x;
  const dy = player.ty - player.y;
  if (Math.abs(dx) < 1.5 && Math.abs(dy) < 1.5) {
    player.x = player.tx;
    player.y = player.ty;
    player.moving = false;
    player.frame = 0;
  }
}

// ── DIBUJAR CUARTO ────────────────────────────────────────
function drawRoom() {
  ctx.fillStyle = '#252535';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

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

  ctx.strokeStyle = '#4a4a6a';
  ctx.lineWidth = 3;
  ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);
}

// ── DIBUJAR PERSONAJE ─────────────────────────────────────
function drawPlayer() {
  const x = player.x;
  const y = player.y;

  // Oscilación de piernas mientras camina
  const legSwing = player.moving ? Math.sin(player.frame * 0.3) * 6 : 0;

  // Sombra en el piso
  ctx.fillStyle = 'rgba(0,0,0,0.3)';
  ctx.beginPath();
  ctx.ellipse(x, y + 22, 12, 5, 0, 0, Math.PI * 2);
  ctx.fill();

  // Pierna izquierda
  ctx.fillStyle = '#1a1a3a';
  ctx.fillRect(x - 10, y + 8, 9, 16 + legSwing);

  // Pierna derecha
  ctx.fillRect(x + 1, y + 8, 9, 16 - legSwing);

  // Cuerpo
  ctx.fillStyle = '#2a5298';
  ctx.beginPath();
  ctx.roundRect(x - 13, y - 8, 26, 20, 4);
  ctx.fill();

  // Brazos
  ctx.fillStyle = '#2a5298';
  ctx.fillRect(x - 20, y - 6, 8, 14);
  ctx.fillRect(x + 12, y - 6, 8, 14);

  // Cabeza
  ctx.fillStyle = '#c68642';
  ctx.beginPath();
  ctx.arc(x, y - 22, 14, 0, Math.PI * 2);
  ctx.fill();

  // Cabello
  ctx.fillStyle = '#1a1a1a';
  ctx.beginPath();
  ctx.arc(x, y - 28, 14, Math.PI, 0);
  ctx.fill();

  // Ojos
  ctx.fillStyle = '#1a1a1a';
  ctx.beginPath();
  ctx.arc(x - 5, y - 24, 2.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(x + 5, y - 24, 2.5, 0, Math.PI * 2);
  ctx.fill();

  // Sonrisa
  ctx.strokeStyle = '#8B5E3C';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(x, y - 18, 6, 0.1 * Math.PI, 0.9 * Math.PI);
  ctx.stroke();

  // Indicador de destino (círculo donde vas a caminar)
  if (player.moving) {
    ctx.strokeStyle = '#7F77DD';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(player.tx, player.ty, 8, 0, Math.PI * 2);
    ctx.stroke();
  }
}

// ── GAME LOOP ─────────────────────────────────────────────
function gameLoop() {
  drawRoom();
  updatePlayer();  // actualiza posición antes de dibujar
  drawPlayer();
  requestAnimationFrame(gameLoop);
}

gameLoop();
