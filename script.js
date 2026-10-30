// Получаем доступ к игровому холсту
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Фиксированное пиксельное разрешение (формат 9:16)
canvas.width = 360;
canvas.height = 640;

// Объект главного героя — рокерской капибары
const player = {
  width: 48,
  height: 48,
  x: canvas.width / 2 - 24,
  y: canvas.height / 2 - 60,
  vy: 0,              // Текущая вертикальная скорость
  gravity: 0.35,      // Сила притяжения (тянет вниз)
  jumpStrength: -10.5 // Сила толчка при прыжке (толкает вверх)
};

// Стартовая платформа для проверки прыжков
const startPlatform = {
  width: 90,
  height: 16,
  x: canvas.width / 2 - 45,
  y: canvas.height / 2 + 120
};

// Палитра цветов для капибары
const palette = {
  'B': '#a66a38', // Коричневый мех капибары
  'D': '#4a2c11', // Тёмно-коричневый нос по центру и ушки
  'K': '#111115', // Чёрная кожаная куртка, очки, ноздри и ботинки
  'G': '#8b93a6'  // Серебристый воротник куртки-косухи
};

// Пиксельная карта капибары 16x16 (вид прямо анфас)
const capySprite = [
  "..DD........DD..",
  ".DDBBBBBBBBBBDD.",
  ".BBBBBBBBBBBBBB.",
  ".KKKKKKKKKKKKKK.",
  ".BKKKKKBBKKKKKB.",
  ".BKKKKKBBKKKKKB.",
  ".BBBBDDDDDDBBBB.",
  ".BBBBDKDDKDBBBB.",
  "..BBBDDDDDDBBB..",
  "...BBBBDDBBBB...",
  ".KKKKGBBBBGKKKK.",
  "KKKKKGBBBBGKKKKK",
  "KKKKKKGBBGKKKKKK",
  "BBBBKKKKKKKKBBBB",
  "..KKKKKKKKKKKK..",
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

// Функция отрисовки стартовой платформы
function drawPlatform() {
  // Основная фиолетовая плашка
  ctx.fillStyle = '#a855f7';
  ctx.fillRect(startPlatform.x, startPlatform.y, startPlatform.width, startPlatform.height);

  // Ярко-оранжевая неоновая полоска сверху
  ctx.fillStyle = '#ff7b00';
  ctx.fillRect(startPlatform.x, startPlatform.y, startPlatform.width, 4);
}

// Функция отрисовки пиксельной капибары
function drawPlayer() {
  const pixelSize = 3;

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

// Функция расчёта физики прыжков и падения
function updatePhysics() {
  // Применяем гравитацию и двигаем персонажа по вертикали
  player.vy += player.gravity;
  player.y += player.vy;

  // Проверяем приземление на платформу (только когда капибара летит вниз)
  if (player.vy > 0) {
    const isWithinX =
      player.x + player.width > startPlatform.x &&
      player.x < startPlatform.x + startPlatform.width;

    const isTouchingY =
      player.y + player.height >= startPlatform.y &&
      player.y + player.height <= startPlatform.y + startPlatform.height + player.vy;

    if (isWithinX && isTouchingY) {
      player.y = startPlatform.y - player.height;
      player.vy = player.jumpStrength; // Автоматический прыжок вверх
    }
  }

  // Страховка: если капибара упадёт ниже экрана, возвращаем её сверху
  if (player.y > canvas.height) {
    player.y = 0;
    player.vy = 0;
  }
}

// Главный игровой цикл (обновляет экран 60 раз в секунду)
function gameLoop() {
  updatePhysics();
  drawBackground();
  drawPlatform();
  drawPlayer();

  requestAnimationFrame(gameLoop);
}

// Запускаем игру
gameLoop();
