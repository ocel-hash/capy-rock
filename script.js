// Получаем доступ к игровому холсту
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Фиксированное пиксельное разрешение (формат 9:16)
canvas.width = 360;
canvas.height = 640;

// Функция отрисовки фона в стиле 16-bit
function drawBackground() {
  // Тёмно-синий и фиолетовый ночной градиент
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, '#0a0818'); // Почти чёрный сверху
  gradient.addColorStop(0.6, '#1f1135'); // Глубокий фиолетовый в центре
  gradient.addColorStop(1, '#121a3a'); // Тёмно-синий внизу
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Декоративная неоновая сетка для ретро-атмосферы
  ctx.strokeStyle = 'rgba(255, 123, 0, 0.08)';
  ctx.lineWidth = 2;
  const gridSize = 40;

  for (let x = 0; x < canvas.width; x += gridSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }

  for (let y = 0; y < canvas.height; y += gridSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }
}

// Временная тестовая надпись для проверки работы экрана
function drawTestScreen() {
  drawBackground();

  ctx.fillStyle = '#ff7b00'; // Оранжевый цвет
  ctx.font = 'bold 28px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('CAPY ROCK', canvas.width / 2, canvas.height / 2 - 10);

  ctx.fillStyle = '#a855f7'; // Светло-фиолетовый цвет
  ctx.font = '14px monospace';
  ctx.fillText('СЦЕНА ГОТОВА!', canvas.width / 2, canvas.height / 2 + 20);
}

// Запускаем отрисовку первого экрана
drawTestScreen();
