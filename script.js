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
  y: canvas.height - 150,
  vx: 0,
  vy: 0,
  speed: 5,
  gravity: 0.35,
  jumpStrength: -10.8,
  maxFallSpeed: 10
};

// Переменные состояния управления
let moveLeft = false;
let moveRight = false;

// Переменная времени для стабильной скорости на экранах 60 и 120 Гц
let lastTime = performance.now();

// Высота подъёма (влияет на сложность) и смещение фоновой сетки
let climbDistance = 0;
let gridOffsetY = 0;

// Массив всех музыкальных платформ на экране
const platforms = [];
const platformWidth = 76;
const platformHeight = 18;

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

// Функция расчёта расстояния до следующей ноты с учётом высоты подъёма
function getNextPlatformGap() {
  // Сложность плавно растёт от 0 до 1 по мере подъёма вверх
  const difficulty = Math.min(climbDistance / 6000, 1);
  const minGap = 60 + difficulty * 25; // От 60 до 85 пикселей
  const maxGap = 95 + difficulty * 35; // От 95 до 130 пикселей (прыжок всегда достижим)

  return minGap + Math.random() * (maxGap - minGap);
}

// Функция создания стартового набора музыкальных платформ и сброса позиции
function resetStage() {
  platforms.length = 0;
  climbDistance = 0;
  gridOffsetY = 0;

  // Первая платформа всегда прямо под капибарой на старте
  const startX = canvas.width / 2 - platformWidth / 2;
  const startY = canvas.height - 70;

  platforms.push({
    x: startX,
    y: startY,
    width: platformWidth,
    height: platformHeight
  });

  // Ставим капибару над стартовой нотой
  player.x = canvas.width / 2 - player.width / 2;
  player.y = startY - player.height;
  player.vy = player.jumpStrength;

  // Генерируем остальные платформы вверх до самого края экрана
  let currentY = startY;

  while (currentY > 20) {
    currentY -= getNextPlatformGap();
    const randomX = 12 + Math.random() * (canvas.width - platformWidth - 24);

    platforms.push({
      x: randomX,
      y: currentY,
      width: platformWidth,
      height: platformHeight
    });
  }
}

// Функция обработки касания экрана смартфона
function handleTouch(event) {
  event.preventDefault();

  if (event.touches.length > 0) {
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
    moveLeft = false;
    moveRight = false;
  }
}

// Подключаем сенсорное управление для смартфона
window.addEventListener('touchstart', handleTouch, { passive: false });
window.addEventListener('touchmove', handleTouch, { passive: false });
window.addEventListener('touchend', handleTouch, { passive: false });
window.addEventListener('touchcancel', handleTouch, { passive: false });

// Дополнительное управление с клавиатуры
window.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowLeft' || event.key === 'a') moveLeft = true;
  if (event.key === 'ArrowRight' || event.key === 'd') moveRight = true;
});

window.addEventListener('keyup', (event) => {
  if (event.key === 'ArrowLeft' || event.key === 'a') moveLeft = false;
  if (event.key === 'ArrowRight' || event.key === 'd') moveRight = false;
});

// Функция отрисовки фона в стиле 16-bit с движущейся сеткой
function drawBackground() {
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, '#0a0818');
  gradient.addColorStop(0.6, '#1f1135');
  gradient.addColorStop(1, '#121a3a');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Декоративная неоновая сетка (двигается вниз при подъёме камеры)
  ctx.strokeStyle = 'rgba(255, 123, 0, 0.08)';
  ctx.lineWidth = 2;
  const gridSize = 40;

  for (let x = 0; x < canvas.width; x += gridSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }

  for (let y = gridOffsetY - gridSize; y < canvas.height; y += gridSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }
}

// Функция отрисовки платформ в виде пиксельных музыкальных нот (♫)
function drawPlatforms() {
  for (const p of platforms) {
    // Верхняя соединяющая перекладина ноты (оранжевый неон)
    ctx.fillStyle = '#ff7b00';
    ctx.fillRect(p.x + 8, p.y, p.width - 12, 4);

    // Вторая полоска перекладины (фиолетовый неон)
    ctx.fillStyle = '#a855f7';
    ctx.fillRect(p.x + 8, p.y + 4, p.width - 12, 4);

    // Вертикальные штили (ножки ноты слева и справа)
    ctx.fillStyle = '#a855f7';
    ctx.fillRect(p.x + 10, p.y, 4, 16);
    ctx.fillRect(p.x + p.width - 8, p.y, 4, 16);

    // Пиксельные головки нот по краям внизу
    ctx.fillStyle = '#ff7b00';
    ctx.fillRect(p.x, p.y + 10, 14, 8);
    ctx.fillRect(p.x + p.width - 18, p.y + 10, 14, 8);

    // Светящийся блик внутри головок нот
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(p.x + 3, p.y + 12, 4, 2);
    ctx.fillRect(p.x + p.width - 15, p.y + 12, 4, 2);
  }
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

// Функция расчёта физики и движения камеры вверх
function updatePhysics(dt) {
  if (moveLeft) {
    player.vx = -player.speed;
  } else if (moveRight) {
    player.vx = player.speed;
  } else {
    player.vx = 0;
  }

  player.x += player.vx * dt;

  // Переход через левую и правую границы экрана
  if (player.x + player.width / 2 < 0) {
    player.x = canvas.width - player.width / 2;
  } else if (player.x + player.width / 2 > canvas.width) {
    player.x = -player.width / 2;
  }

  // Гравитация и ограничение максимальной скорости падения
  player.vy += player.gravity * dt;
  if (player.vy > player.maxFallSpeed) {
    player.vy = player.maxFallSpeed;
  }

  const prevBottom = player.y + player.height;
  player.y += player.vy * dt;
  const currentBottom = player.y + player.height;

  // Проверяем приземление на любую из музыкальных платформ (только при падении)
  if (player.vy > 0) {
    for (const p of platforms) {
      const isWithinX =
        player.x + player.width - 8 > p.x &&
        player.x + 8 < p.x + p.width;

      const isLandingY =
        prevBottom <= p.y + 8 &&
        currentBottom >= p.y;

      if (isWithinX && isLandingY) {
        player.y = p.y - player.height;
        player.vy = player.jumpStrength;
        break;
      }
    }
  }

  // Движение камеры вверх, когда капибара поднимается выше линии 42% экрана
  const cameraThreshold = canvas.height * 0.42;
  if (player.y < cameraThreshold) {
    const shift = cameraThreshold - player.y;
    player.y = cameraThreshold;
    climbDistance += shift;

    // Смещаем фоновую сетку с эффектом глубины
    gridOffsetY = (gridOffsetY + shift * 0.5) % 40;

    // Опускаем все платформы вниз
    for (const p of platforms) {
      p.y += shift;
    }

    // Удаляем платформы, которые ушли за нижний край экрана
    for (let i = platforms.length - 1; i >= 0; i--) {
      if (platforms[i].y > canvas.height) {
        platforms.splice(i, 1);
      }
    }

    // Находим самую верхнюю платформу и создаём новые ноты выше неё
    let highestY = canvas.height;
    for (const p of platforms) {
      if (p.y < highestY) {
        highestY = p.y;
      }
    }

    while (highestY > 20) {
      highestY -= getNextPlatformGap();
      const randomX = 12 + Math.random() * (canvas.width - platformWidth - 24);

      platforms.push({
        x: randomX,
        y: highestY,
        width: platformWidth,
        height: platformHeight
      });
    }
  }

  // Если капибара упала ниже экрана — перезапускаем подъём с самого низа
  if (player.y > canvas.height) {
    resetStage();
  }
}

// Главный игровой цикл
function gameLoop(currentTime) {
  let dt = (currentTime - lastTime) / 16.67;
  lastTime = currentTime;

  if (dt > 2.5 || dt < 0 || isNaN(dt)) {
    dt = 1;
  }

  updatePhysics(dt);
  drawBackground();
  drawPlatforms();
  drawPlayer();

  requestAnimationFrame(gameLoop);
}

// Запускаем генерацию старта и игровой цикл
resetStage();
requestAnimationFrame(gameLoop);
