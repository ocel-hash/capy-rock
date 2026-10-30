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

// Высота подъёма и смещение фоновой сетки
let climbDistance = 0;
let gridOffsetY = 0;

// Массив всех музыкальных платформ на экране
const platforms = [];
const platformWidth = 76;
const platformHeight = 18;

// Единая палитра цветов для капибары и рэперов
const palette = {
  'B': '#a66a38', // Коричневый мех капибары
  'D': '#4a2c11', // Тёмно-коричневый нос и ушки
  'K': '#111115', // Чёрная кожаная куртка, очки и широкие штаны
  'G': '#8b93a6', // Серебристый воротник куртки
  'O': '#ff7b00', // Оранжевая кепка и кроссовки рэпера
  'P': '#7e22ce', // Фиолетовая свободная толстовка рэпера
  'Y': '#ffd700', // Золотая цепь рэпера
  'S': '#e0ac69'  // Лицо рэпера
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

// Пиксельная карта рэпера-врага 16x16 (в кепке, очках, худи и с золотой цепью)
const rapperSprite = [
  "....OOOOOOOO....",
  "..OOOOOOOOOOOO..",
  "...KKKKKKKKKK...",
  "...KKKKSSKKKK...",
  "...KKKKKKKKKK...",
  "....SSSSSSSS....",
  "..PPPPPPPPPPPP..",
  ".PPPPYPPPPYPPPP.",
  ".PPPPYYPPYYPPPP.",
  ".PPPPPPYYPPPPPP.",
  ".PPPPPPYYPPPPPP.",
  ".PPPPPPPPPPPPPP.",
  "..KKKKKKKKKKKK..",
  "..KKKKK..KKKKK..",
  "..KKKKK..KKKKK..",
  ".OOOOOO..OOOOOO."
];

// Функция расчёта расстояния до следующей ноты
function getNextPlatformGap(previousHadEnemy) {
  // Если на предыдущей ноте стоит рэпер, делаем следующую ноту ближе, чтобы врага можно было перепрыгнуть
  if (previousHadEnemy) {
    return 55 + Math.random() * 15;
  }

  const difficulty = Math.min(climbDistance / 6000, 1);
  const minGap = 60 + difficulty * 25;
  const maxGap = 95 + difficulty * 35;

  return minGap + Math.random() * (maxGap - minGap);
}

// Функция создания одной платформы (с возможным рэпером на ней)
function createPlatform(x, y, allowEnemy) {
  let enemy = null;

  // Шанс появления рэпера (растёт от 18% до 30% с высотой)
  const difficulty = Math.min(climbDistance / 6000, 1);
  const enemyChance = 0.18 + difficulty * 0.12;

  if (allowEnemy && Math.random() < enemyChance) {
    const enemySize = 40;
    enemy = {
      width: enemySize,
      height: enemySize,
      // Позиция рэпера относительно левого края платформы
      offsetX: (platformWidth - enemySize) / 2,
      speed: 0.7 + Math.random() * 0.5,
      direction: Math.random() < 0.5 ? -1 : 1
    };
  }

  return {
    x: x,
    y: y,
    width: platformWidth,
    height: platformHeight,
    enemy: enemy
  };
}

// Функция создания стартового набора платформ и сброса игры
function resetStage() {
  platforms.length = 0;
  climbDistance = 0;
  gridOffsetY = 0;

  // Первая платформа всегда прямо под капибарой и без врагов
  const startX = canvas.width / 2 - platformWidth / 2;
  const startY = canvas.height - 70;

  platforms.push(createPlatform(startX, startY, false));

  // Ставим капибару над стартовой нотой
  player.x = canvas.width / 2 - player.width / 2;
  player.y = startY - player.height;
  player.vy = player.jumpStrength;

  // Генерируем остальные платформы вверх
  let currentY = startY;
  let stepCount = 0;
  let lastHadEnemy = false;

  while (currentY > 20) {
    currentY -= getNextPlatformGap(lastHadEnemy);
    const randomX = 12 + Math.random() * (canvas.width - platformWidth - 24);
    stepCount++;

    // Не ставим двух рэперов подряд и оставляем первые 3 прыжка безопасными
    const canSpawnEnemy = stepCount > 3 && !lastHadEnemy;
    const newPlatform = createPlatform(randomX, currentY, canSpawnEnemy);
    lastHadEnemy = newPlatform.enemy !== null;

    platforms.push(newPlatform);
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

// Универсальная функция отрисовки пиксельного спрайта по матрице
function drawSprite(spriteMap, x, y, pixelSize) {
  for (let row = 0; row < spriteMap.length; row++) {
    for (let col = 0; col < spriteMap[row].length; col++) {
      const colorCode = spriteMap[row][col];

      if (palette[colorCode]) {
        ctx.fillStyle = palette[colorCode];
        ctx.fillRect(
          x + col * pixelSize,
          y + row * pixelSize,
          pixelSize,
          pixelSize
        );
      }
    }
  }
}

// Функция отрисовки фона в стиле 16-bit с движущейся сеткой
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

  for (let y = gridOffsetY - gridSize; y < canvas.height; y += gridSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }
}

// Функция отрисовки музыкальных платформ и рэперов на них
function drawPlatformsAndEnemies() {
  for (const p of platforms) {
    // Верхняя перекладина ноты (оранжевый неон)
    ctx.fillStyle = '#ff7b00';
    ctx.fillRect(p.x + 8, p.y, p.width - 12, 4);

    // Вторая полоска перекладины (фиолетовый неон)
    ctx.fillStyle = '#a855f7';
    ctx.fillRect(p.x + 8, p.y + 4, p.width - 12, 4);

    // Вертикальные ножки ноты
    ctx.fillStyle = '#a855f7';
    ctx.fillRect(p.x + 10, p.y, 4, 16);
    ctx.fillRect(p.x + p.width - 8, p.y, 4, 16);

    // Головки нот по краям внизу
    ctx.fillStyle = '#ff7b00';
    ctx.fillRect(p.x, p.y + 10, 14, 8);
    ctx.fillRect(p.x + p.width - 18, p.y + 10, 14, 8);

    // Блик внутри головок нот
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(p.x + 3, p.y + 12, 4, 2);
    ctx.fillRect(p.x + p.width - 15, p.y + 12, 4, 2);

    // Если на этой ноте есть рэпер — рисуем его
    if (p.enemy) {
      const enemyX = p.x + p.enemy.offsetX;
      const enemyY = p.y - p.enemy.height;
      drawSprite(rapperSprite, enemyX, enemyY, 2.5);
    }
  }
}

// Функция отрисовки пиксельной капибары
function drawPlayer() {
  drawSprite(capySprite, player.x, player.y, 3);
}

// Функция расчёта физики, движения врагов и камеры
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

  // Обновляем движение рэперов и проверяем столкновения
  for (const p of platforms) {
    if (p.enemy) {
      // Рэпер ходит влево и вправо вдоль своей платформы
      p.enemy.offsetX += p.enemy.speed * p.enemy.direction * dt;

      const minOffset = -6;
      const maxOffset = p.width - p.enemy.width + 6;

      if (p.enemy.offsetX <= minOffset) {
        p.enemy.offsetX = minOffset;
        p.enemy.direction = 1;
      } else if (p.enemy.offsetX >= maxOffset) {
        p.enemy.offsetX = maxOffset;
        p.enemy.direction = -1;
      }

      // Проверка столкновения капибары с рэпером
      const enemyX = p.x + p.enemy.offsetX;
      const enemyY = p.y - p.enemy.height;
      const pad = 6; // Небольшой отступ для честного касания

      const hitX =
        player.x + player.width - pad > enemyX + pad &&
        player.x + pad < enemyX + p.enemy.width - pad;

      const hitY =
        player.y + player.height - pad > enemyY + pad &&
        player.y + pad < enemyY + p.enemy.height - pad;

      if (hitX && hitY) {
        resetStage();
        return;
      }
    }
  }

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

    gridOffsetY = (gridOffsetY + shift * 0.5) % 40;

    for (const p of platforms) {
      p.y += shift;
    }

    // Удаляем платформы, которые ушли за нижний край экрана
    for (let i = platforms.length - 1; i >= 0; i--) {
      if (platforms[i].y > canvas.height + 50) {
        platforms.splice(i, 1);
      }
    }

    // Находим самую верхнюю платформу
    let highestPlatform = platforms[0];
    for (const p of platforms) {
      if (p.y < highestPlatform.y) {
        highestPlatform = p;
      }
    }

    // Создаём новые ноты сверху
    let highestY = highestPlatform.y;
    let lastHadEnemy = highestPlatform.enemy !== null;

    while (highestY > 20) {
      highestY -= getNextPlatformGap(lastHadEnemy);
      const randomX = 12 + Math.random() * (canvas.width - platformWidth - 24);

      const newPlatform = createPlatform(randomX, highestY, !lastHadEnemy);
      lastHadEnemy = newPlatform.enemy !== null;
      platforms.push(newPlatform);
    }
  }

  // Если капибара упала ниже экрана — перезапускаем подъём
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
  drawPlatformsAndEnemies();
  drawPlayer();

  requestAnimationFrame(gameLoop);
}

// Запускаем генерацию старта и игровой цикл
resetStage();
requestAnimationFrame(gameLoop);
