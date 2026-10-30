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
  vx: 0,              // Текущая горизонтальная скорость
  vy: 0,              // Текущая вертикальная скорость
  speed: 5,           // Скорость движения влево и вправо
  gravity: 0.35,      // Сила притяжения
  jumpStrength: -10.5 // Сила толчка при прыжке
};

// Переменные состояния управления
let moveLeft = false;
let moveRight = false;

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

// Функция обработки касания экрана смартфона
function handleTouch(event) {
  event.preventDefault(); // Запрещаем стандартную прокрутку браузера

  if (event.touches.length > 0) {
    // Берём координату нажатия пальца по горизонтали
    const touchX = event.touches[0].clientX;
    const screenMiddle = window.innerWidth / 2;

    if (touchX < screenMiddle) {
      moveLeft = true;
      moveRight = false;
    } else {
      moveRight = true;
      moveLeft = false;
    }
  } else {
    // Если палец убрали с экрана — останавливаем движение вбок
    moveLeft = false;
    moveRight = false;
  }
}

// Подключаем сенсорное управление для смартфона
window.addEventListener('touchstart', handleTouch, { passive: false });
window.addEventListener('touchmove', handleTouch, { passive: false });
window.addEventListener('touchend', handleTouch, { passive: false });
window.addEventListener('touchcancel', handleTouch, { passive: false });

// Дополнительное управление стрелками (если откроешь на компьютере)
window.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowLeft' || event.key === 'a') moveLeft = true;
  if (event.key === 'ArrowRight' || event.key === 'd') moveRight = true;
});

window.addEventListener('keyup', (event) => {
  if (event.key === 'ArrowLeft' || event.key === 'a') moveLeft = false;
  if (event.key === 'ArrowRight' || event.key === 'd') moveRight = false;
});

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
  ctx.fillStyle = '#a855f7';
  ctx.fillRect(startPlatform.x, startPlatform.y, startPlatform.width, startPlatform.height);

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

// Функция расчёта физики, движения и границ экрана
function updatePhysics() {
  // Движение влево и вправо
  if (moveLeft) {
    player.vx = -player.speed;
  } else if (moveRight) {
    player.vx = player.speed;
  } else {
    player.vx = 0;
  }

  player.x += player.vx;

  // Переход через границы экрана: ушёл влево — появился справа, и наоборот
  if (player.x + player.width / 2 < 0) {
    player.x = canvas.width - player.width / 2;
  } else if (player.x + player.width / 2 > canvas.width) {
    player.x = -player.width / 2;
  }

  // Гравитация и движение по вертикали
  player.vy += player.gravity;
  player.y += player.vy;

  // Проверяем приземление на платформу (только при падении вниз)
  if (player.vy > 0) {
    const isWithinX =
      player.x + player.width > startPlatform.x &&
      player.x < startPlatform.x + startPlatform.width;

    const isTouchingY =
      player.y + player.height >= startPlatform.y &&
      player.y + player.height <= startPlatform.y + startPlatform.height + player.vy;

    if (isWithinX && isTouchingY) {
      player.y = startPlatform.y - player.height;
      player.vy = player.jumpStrength;
    }
  }

  // Временная страховка для теста: если упал мимо платформы, возвращаем сверху
  if (player.y > canvas.height) {
    player.y = -player.height;
    player.vy = 0;
  }
}

// Главный игровой цикл
function gameLoop() {
  updatePhysics();
  drawBackground();
  drawPlatform();
  drawPlayer();

  requestAnimationFrame(gameLoop);
}

// Запускаем игру
gameLoop();
