// Получаем доступ к игровому холсту
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Фиксированное пиксельное разрешение (формат 9:16)
canvas.width = 360;
canvas.height = 640;

// Объект главного героя — рокерской капибары
const player = {
  width: 48,  // Ширина персонажа (16 пикселей по 3 точки)
  height: 48, // Высота персонажа (16 пикселей по 3 точки)
  x: canvas.width / 2 - 24,  // По центру экрана по горизонтали
  y: canvas.height / 2 - 24  // По центру экрана по вертикали
};

// Чистая палитра цветов для капибары
const palette = {
  'B': '#a66a38', // Коричневый мех капибары
  'D': '#4a2c11', // Тёмно-коричневый нос и ушки
  'K': '#111115', // Чёрная кожаная куртка, очки и ботинки
  'G': '#8b93a6'  // Серебристый воротник и молния куртки
};

// Исправленная пиксельная карта капибары 16x16
const capySprite = [
  "..DD.....DD.....",
  ".DDBBBBBBBDD....",
  ".BBBBBBBBBBBB...",
  ".KKKKKKKKKKKKBB.",
  ".BKKKKBKKKKBDDDD",
  ".BKKKKBKKKKBDDDD",
  ".BBBBBBBBBBBDDDD",
  "..BBBBBBBBBBBB..",
  ".KKKKGBBBBGKKKK.",
  "KKKKKGBBBBGKKKKK",
  "KKKKKKGBBGKKKKKK",
  "KKKKKKKGGKKKKKKK",
  "BBBBKKKKKKKKBBBB",
  "..KKKKKKKKKKKK..",
  "..BBBB....BBBB..",
  "..KKKK....KKKK.."
];

// Функция отрисовки фона в стиле 16-bit
function drawBackground() {
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, '#0a0818');
  gradient.addColorStop(0.6, '#1f1135');
  gradient.addColorStop(1, '#121a3a');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Декоративная неоновая сетка
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

// Функция отрисовки пиксельной капибары
function drawPlayer() {
  const pixelSize = 3; // Размер одного «пикселя» персонажа на холсте

  for (let row = 0; row < capySprite.length; row++) {
    for (let col = 0; col < capySprite[row].length; col++) {
      const colorCode = capySprite[row][col];

      if (palette[colorCode]) {
        ctx.fillStyle = palette[colorCode];
        ctx.fillRect(
          player.x + col * pixelSize,
          player.y + row * pixelSize,
          pixelSize,
          pixelSize
        );
      }
    }
  }
}

// Главная функция отрисовки кадра
function render() {
  drawBackground();
  drawPlayer();
}

// Запускаем отрисовку игры
render();
