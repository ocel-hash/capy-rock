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
  x: canvas.width / 2 - 24,  // Ставим по центру экрана по горизонтали
  y: canvas.height / 2 - 24  // Ставим по центру экрана по вертикали
};

// Палитра цветов для 16-битного спрайта капибары
const palette = {
  'O': '#ff7b00', // Оранжевый ирокез в цвет неона
  'B': '#9c6334', // Основной тёплый коричневый мех
  'D': '#5c3818', // Тёмно-коричневый нос и ушки
  'K': '#14111a', // Чёрная кожаная куртка, очки и ботинки
  'G': '#3b354a', // Серые отвороты косухи и ремень
  'W': '#ffffff', // Белые блики на очках и металлические шипы
  'P': '#a855f7'  // Фиолетовый неоновый акцент на очках
};

// Пиксельная карта капибары 16x16 (точка — прозрачный фон)
const capySprite = [
  ".....OOOO.......",
  "....OOOOOO......",
  "..DD.BBBBBB.....",
  "..DDBBBBBBBBB...",
  "...BKKKKKKKKKK..",
  "...BKKWPWKWKKDD.",
  "...BBBBBBBBDDDD.",
  "...BBBBBBBBDDDD.",
  "....BBBBBBBBBB..",
  "..KKKKKKKKKKKK..",
  ".KKGKKKKKKKKGKK.",
  ".KKGWKKKKKKWGKK.",
  ".BBBBKKKKKKBBBB.",
  "..KKKKGGGGKKKK..",
  "...BBBB..BBBB...",
  "...KKKK..KKKK..."
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

      // Если символ есть в палитре, закрашиваем квадратик
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
