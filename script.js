// ==========================================
// CAPY ROCK — ПОЛНАЯ ВЕРСИЯ ИГРЫ (ЭТАПЫ 1–12)
// ==========================================

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Фиксированное вертикальное разрешение 9:16
canvas.width = 360;
canvas.height = 640;

// ==========================================
// МУЗЫКАЛЬНЫЙ ДВИЖОК (Web Audio API без внешних файлов)
// ==========================================
let audioCtx = null;
const rockScale = [164.81, 196.00, 220.00, 246.94, 293.66, 329.63]; // Пентатоника Ми-минор
let noteIndex = 0;

function initAudio() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
}

function playSound(type) {
  if (!audioCtx) return;

  const now = audioCtx.currentTime;

  if (type === 'jump') {
    // Музыкальная нота при прыжке
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'triangle';
    const freq = rockScale[noteIndex % rockScale.length];
    noteIndex++;

    osc.frequency.setValueAtTime(freq, now);
    osc.frequency.exponentialRampToValueAtTime(freq * 1.25, now + 0.12);

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(now);
    osc.stop(now + 0.14);
  } else if (type === 'headphones') {
    // Аккорд включения защитных наушников
    [329.63, 440.00, 659.25].forEach((freq, idx) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.04);

      gain.gain.setValueAtTime(0.1, now + idx * 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now + idx * 0.04);
      osc.stop(now + 0.35);
    });
  } else if (type === 'bass') {
    // Мощный басовый слайд вверх
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(65.41, now);
    osc.frequency.exponentialRampToValueAtTime(261.63, now + 0.35);

    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);

    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(now);
    osc.stop(now + 0.38);
  } else if (type === 'solo') {
    // Рок-рифф соло-гитары
    const riff = [329.63, 392.00, 440.00, 587.33, 659.25];
    riff.forEach((freq, idx) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, now + idx * 0.06);

      gain.gain.setValueAtTime(0.12, now + idx * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.22);

      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now + idx * 0.06);
      osc.stop(now + idx * 0.06 + 0.22);
    });
  } else if (type === 'knockout') {
    // Звук сбивания рэпера
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.exponentialRampToValueAtTime(55, now + 0.15);

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);

    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(now);
    osc.stop(now + 0.16);
  } else if (type === 'gameover') {
    // Проигрышная ретро-мелодия
    const sadNotes = [246.94, 220.00, 196.00, 146.83];
    sadNotes.forEach((freq, idx) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, now + idx * 0.12);

      gain.gain.setValueAtTime(0.12, now + idx * 0.12);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.12 + 0.2);

      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now + idx * 0.12);
      osc.stop(now + idx * 0.12 + 0.2);
    });
  }
}

// ==========================================
// ПАЛИТРА И ПИКСЕЛЬНЫЕ СПРАЙТЫ (16-bit)
// ==========================================
const palette = {
  'B': '#a66a38', // Коричневый мех капибары
  'D': '#4a2c11', // Тёмно-коричневый нос и ушки
  'K': '#111115', // Чёрная кожаная куртка, очки и штаны
  'G': '#8b93a6', // Серебристый гриф гитары и металл
  'O': '#ff7b00', // Оранжевый неон (гитара, кепка, наушники)
  'P': '#7e22ce', // Фиолетовый (толстовка, дужка наушников)
  'Y': '#ffd700', // Золотая цепь и соло-гитара
  'S': '#e0ac69', // Лицо рэпера
  'W': '#ffffff', // Белые блики и накладка гитары
  'C': '#00e5ff'  // Голубой неон для бас-гитары
};

// Капибара анфас в очках, косухе и с электрогитарой (16x16)
const capySprite = [
  "..DD........DD..",
  ".DDBBBBBBBBBBDD.",
  ".BBBBBBBBBBBBBB.",
  ".KKKKKKKKKKKKKK.",
  ".BKKKKKBBKKKKKB.",
  ".BKKKKKBBKKKKKB.",
  ".BBBBDDDDDDBBBB.",
  ".BBBBDKDDKDBBBOO",
  "..BBBDDDDDDBBGOO",
  "...BBBBDDBBBGG..",
  ".KKOOGBBBBGGGKK.",
  "KKOOOOOWGGGGKKKK",
  "BBBBOOWWWOBBKKKK",
  ".KKOOOOOOOOKKKK.",
  "..KKKKKKKKKKKK..",
  "..KKKK....KKKK.."
];

// Рэпер-враг в кепке, очках, худи и с золотой цепью (16x16)
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

// Бонус 1: Наушники (12x12) — щит на 5 секунд
const headphonesSprite = [
  "...PPPPPP...",
  "..PPPPPPPP..",
  ".PP......PP.",
  ".GG......GG.",
  "OOOW....WOOO",
  "OOOW....WOOO",
  "OOOW....WOOO",
  "OOOW....WOOO",
  ".OO......OO.",
  "............",
  "............",
  "............"
];

// Бонус 2: Бас-гитара (12x12) — мощный супер-прыжок
const bassSprite = [
  ".........GGG",
  "........GGGG",
  ".......GGG..",
  "......GGG...",
  "...CCGGG....",
  "..CCCCG.....",
  ".CCCCCCC....",
  "CCCCWWCCC...",
  "CCCWWWWCC...",
  "CCCCWWCCC...",
  ".CCCCCCC....",
  "..CCCCC....."
];

// Бонус 3: Соло-гитара (12x12) — стремительный полёт сквозь платформы
const soloSprite = [
  ".........YYY",
  "........YYYY",
  ".......GGG..",
  "......GGG...",
  "..OO.GGG....",
  ".OOOOGG.....",
  ".OOOOOOO....",
  "OOOOWWOOOO..",
  "OOOWWWWOOO..",
  "OOOYWWYOOO..",
  "OOO....OOO..",
  "OO......OO.."
];

// ==========================================
// ИГРОВЫЕ ПЕРЕМЕННЫЕ И СОСТОЯНИЕ
// ==========================================
const player = {
  width: 48,
  height: 48,
  x: canvas.width / 2 - 24,
  y: canvas.height - 150,
  vx: 0,
  vy: 0,
  speed: 5.2,
  gravity: 0.35,
  jumpStrength: -10.8,
  bassJumpStrength: -19.2, // Сила толчка от бас-гитары
  soloFlightSpeed: -13.5,  // Скорость полёта на соло-гитаре
  maxFallSpeed: 10,
  shieldTimer: 0,          // Таймер защиты наушников (сек)
  soloTimer: 0             // Таймер полёта соло-гитары (сек)
};

let moveLeft = false;
let moveRight = false;
let lastTime = performance.now();

let climbDistance = 0;
let score = 0;
let highScore = Number(localStorage.getItem('capyRockHighScore')) || 0;
let isGameOver = false;
let gridOffsetY = 0;

const platforms = [];
const particles = [];
const platformWidth = 76;
const platformHeight = 18;

// Координаты кнопки перезапуска на экране Game Over
const restartBtn = {
  x: canvas.width / 2 - 95,
  y: canvas.height / 2 + 55,
  width: 190,
  height: 48
};

// ==========================================
// ЧАСТИЦЫ И ВИЗУАЛЬНЫЕ ЭФФЕКТЫ
// ==========================================
function spawnParticles(x, y, color, count = 10) {
  for (let i = 0; i < count; i++) {
    particles.push({
      x: x,
      y: y,
      vx: (Math.random() - 0.5) * 6,
      vy: (Math.random() - 0.5) * 6,
      size: 3 + Math.random() * 3,
      color: color,
      life: 1.0
    });
  }
}

function updateAndDrawParticles(dt) {
  for (let i = particles.length - 1; i >= 0; i--) {
    const pt = particles[i];
    pt.x += pt.vx * dt;
    pt.y += pt.vy * dt;
    pt.life -= 0.035 * dt;

    if (pt.life <= 0) {
      particles.splice(i, 1);
      continue;
    }

    ctx.fillStyle = pt.color;
    ctx.globalAlpha = Math.max(pt.life, 0);
    ctx.fillRect(pt.x, pt.y, pt.size, pt.size);
  }
  ctx.globalAlpha = 1.0;
}

// ==========================================
// ГЕНЕРАЦИЯ ПЛАТФОРМ, ВРАГОВ И БОНУСОВ
// ==========================================
function getNextPlatformGap(previousHadEnemy) {
  // Если на предыдущей ноте стоит рэпер, следующая нота ближе, чтобы прыжок всегда был возможен
  if (previousHadEnemy) {
    return 55 + Math.random() * 15;
  }

  const difficulty = Math.min(climbDistance / 7000, 1);
  const minGap = 60 + difficulty * 25;
  const maxGap = 95 + difficulty * 35;

  return minGap + Math.random() * (maxGap - minGap);
}

function createPlatform(x, y, allowEnemy) {
  let enemy = null;
  let bonus = null;

  const difficulty = Math.min(climbDistance / 7000, 1);
  const enemyChance = 0.17 + difficulty * 0.13;

  if (allowEnemy && Math.random() < enemyChance) {
    const enemySize = 40;
    enemy = {
      width: enemySize,
      height: enemySize,
      offsetX: (platformWidth - enemySize) / 2,
      speed: 0.75 + Math.random() * 0.55,
      direction: Math.random() < 0.5 ? -1 : 1
    };
  } else if (Math.random() < 0.18) {
    // Выбираем один из 3 бонусов: Наушники (45%), Бас-гитара (35%), Соло-гитара (20%)
    const roll = Math.random();
    let bonusType = 'headphones';
    if (roll > 0.80) {
      bonusType = 'solo';
    } else if (roll > 0.45) {
      bonusType = 'bass';
    }

    const bonusSize = 24;
    bonus = {
      type: bonusType,
      width: bonusSize,
      height: bonusSize,
      offsetX: (platformWidth - bonusSize) / 2
    };
  }

  return {
    x: x,
    y: y,
    width: platformWidth,
    height: platformHeight,
    enemy: enemy,
    bonus: bonus
  };
}

function resetStage() {
  platforms.length = 0;
  particles.length = 0;
  climbDistance = 0;
  score = 0;
  gridOffsetY = 0;
  isGameOver = false;
  noteIndex = 0;

  player.shieldTimer = 0;
  player.soloTimer = 0;
  player.vx = 0;

  // Стартовая безопасная платформа внизу
  const startX = canvas.width / 2 - platformWidth / 2;
  const startY = canvas.height - 70;

  const firstPlatform = createPlatform(startX, startY, false);
  firstPlatform.bonus = null;
  platforms.push(firstPlatform);

  player.x = canvas.width / 2 - player.width / 2;
  player.y = startY - player.height;
  player.vy = player.jumpStrength;

  let currentY = startY;
  let stepCount = 0;
  let lastHadEnemy = false;

  while (currentY > 20) {
    currentY -= getNextPlatformGap(lastHadEnemy);
    const randomX = 12 + Math.random() * (canvas.width - platformWidth - 24);
    stepCount++;

    const canSpawnEnemy = stepCount > 3 && !lastHadEnemy;
    const newPlatform = createPlatform(randomX, currentY, canSpawnEnemy);
    lastHadEnemy = newPlatform.enemy !== null;

    platforms.push(newPlatform);
  }
}

function triggerGameOver() {
  if (isGameOver) return;
  isGameOver = true;
  moveLeft = false;
  moveRight = false;

  if (score > highScore) {
    highScore = score;
    localStorage.setItem('capyRockHighScore', String(highScore));
  }

  playSound('gameover');
}

// ==========================================
// УПРАВЛЕНИЕ НА СМАРТФОНЕ И КЛАВИАТУРЕ
// ==========================================
function handleTouch(event) {
  event.preventDefault();
  initAudio();

  // Если игра окончена — нажатие перезапускает игру
  if (isGameOver) {
    if (event.type === 'touchstart') {
      resetStage();
    }
    return;
  }

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

window.addEventListener('touchstart', handleTouch, { passive: false });
window.addEventListener('touchmove', handleTouch, { passive: false });
window.addEventListener('touchend', handleTouch, { passive: false });
window.addEventListener('touchcancel', handleTouch, { passive: false });

// Поддержка клика мышкой для перезапуска и теста в браузере
canvas.addEventListener('mousedown', () => {
  initAudio();
  if (isGameOver) {
    resetStage();
  }
});

window.addEventListener('keydown', (event) => {
  initAudio();
  if (isGameOver && (event.key === 'Enter' || event.key === ' ')) {
    resetStage();
    return;
  }
  if (event.key === 'ArrowLeft' || event.key === 'a') moveLeft = true;
  if (event.key === 'ArrowRight' || event.key === 'd') moveRight = true;
});

window.addEventListener('keyup', (event) => {
  if (event.key === 'ArrowLeft' || event.key === 'a') moveLeft = false;
  if (event.key === 'ArrowRight' || event.key === 'd') moveRight = false;
});

// ==========================================
// ОТРИСОВКА ГРАФИКИ И ИНТЕРФЕЙСА
// ==========================================
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

function drawBackground() {
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, '#0a0818');
  gradient.addColorStop(0.6, '#1f1135');
  gradient.addColorStop(1, '#121a3a');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Неоновая ретро-сетка
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

function drawPlatformsAndEntities() {
  for (const p of platforms) {
    // Верхняя перекладина ноты (оранжевый неон)
    ctx.fillStyle = '#ff7b00';
    ctx.fillRect(p.x + 8, p.y, p.width - 12, 4);

    // Вторая полоска перекладины (фиолетовый неон)
    ctx.fillStyle = '#a855f7';
    ctx.fillRect(p.x + 8, p.y + 4, p.width - 12, 4);

    // Вертикальные штили ноты
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

    // Отрисовка бонусов на платформе
    if (p.bonus) {
      const bonusX = p.x + p.bonus.offsetX;
      const floatY = Math.sin(performance.now() * 0.006) * 2;
      const bonusY = p.y - p.bonus.height + 2 + floatY;

      if (p.bonus.type === 'headphones') {
        drawSprite(headphonesSprite, bonusX, bonusY, 2);
      } else if (p.bonus.type === 'bass') {
        drawSprite(bassSprite, bonusX, bonusY, 2);
      } else if (p.bonus.type === 'solo') {
        drawSprite(soloSprite, bonusX, bonusY, 2);
      }
    }

    // Отрисовка рэпера
    if (p.enemy) {
      const enemyX = p.x + p.enemy.offsetX;
      const enemyY = p.y - p.enemy.height;
      drawSprite(rapperSprite, enemyX, enemyY, 2.5);
    }
  }
}

function drawPlayer() {
  const centerX = player.x + player.width / 2;
  const centerY = player.y + player.height / 2;

  // Эффект огненного рок-полёта от Соло-гитары
  if (player.soloTimer > 0) {
    ctx.beginPath();
    ctx.arc(centerX, centerY, 34, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 215, 0, 0.28)';
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#ff7b00';
    ctx.stroke();
  }

  // Защитная аура от Наушников
  if (player.shieldTimer > 0) {
    const isVisible = player.shieldTimer > 1.0 || Math.floor(performance.now() / 100) % 2 === 0;

    if (isVisible) {
      const pulse = Math.sin(performance.now() * 0.01) * 3;

      ctx.beginPath();
      ctx.arc(centerX, centerY, 32 + pulse, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(168, 85, 247, 0.22)';
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#a855f7';
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(centerX, centerY, 27 - pulse * 0.5, 0, Math.PI * 2);
      ctx.strokeStyle = '#ff7b00';
      ctx.stroke();
    }
  }

  drawSprite(capySprite, player.x, player.y, 3);
}

function drawHUD() {
  // Верхняя полупрозрачная панель очков
  ctx.fillStyle = 'rgba(10, 8, 24, 0.78)';
  ctx.fillRect(0, 0, canvas.width, 44);
  ctx.fillStyle = '#ff7b00';
  ctx.fillRect(0, 42, canvas.width, 2);

  // Текущий счёт
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 16px monospace';
  ctx.textAlign = 'left';
  ctx.fillText('СЧЁТ: ' + score, 12, 27);

  // Рекорд
  ctx.fillStyle = '#ffd700';
  ctx.textAlign = 'right';
  ctx.fillText('РЕКОРД: ' + Math.max(score, highScore), canvas.width - 12, 27);

  // Полоска таймера активных бонусов под панелью
  if (player.soloTimer > 0) {
    const barWidth = (player.soloTimer / 3.5) * (canvas.width - 24);
    ctx.fillStyle = '#ffd700';
    ctx.fillRect(12, 50, barWidth, 6);
  } else if (player.shieldTimer > 0) {
    const barWidth = (player.shieldTimer / 5.0) * (canvas.width - 24);
    ctx.fillStyle = '#a855f7';
    ctx.fillRect(12, 50, barWidth, 6);
  }
}

function drawGameOverScreen() {
  if (!isGameOver) return;

  // Затемнение фона
  ctx.fillStyle = 'rgba(8, 4, 15, 0.82)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Рамка окна Game Over
  const boxX = 30;
  const boxY = canvas.height / 2 - 135;
  const boxW = canvas.width - 60;
  const boxH = 265;

  ctx.fillStyle = '#190d2e';
  ctx.fillRect(boxX, boxY, boxW, boxH);
  ctx.lineWidth = 3;
  ctx.strokeStyle = '#ff7b00';
  ctx.strokeRect(boxX, boxY, boxW, boxH);

  // Заголовок
  ctx.fillStyle = '#ff7b00';
  ctx.font = 'bold 30px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('GAME OVER', canvas.width / 2, boxY + 52);

  // Очки и рекорд
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 18px monospace';
  ctx.fillText('ТВОЙ СЧЁТ: ' + score, canvas.width / 2, boxY + 100);

  ctx.fillStyle = '#ffd700';
  ctx.font = 'bold 16px monospace';
  ctx.fillText('РЕКОРД: ' + highScore, canvas.width / 2, boxY + 132);

  // Кнопка перезапуска
  ctx.fillStyle = '#ff7b00';
  ctx.fillRect(restartBtn.x, restartBtn.y, restartBtn.width, restartBtn.height);

  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2;
  ctx.strokeRect(restartBtn.x, restartBtn.y, restartBtn.width, restartBtn.height);

  ctx.fillStyle = '#0a0818';
  ctx.font = 'bold 18px monospace';
  ctx.fillText('ИГРАТЬ СНОВА', canvas.width / 2, restartBtn.y + 30);
}

// ==========================================
// ФИЗИКА И ИГРОВАЯ ЛОГИКА
// ==========================================
function updatePhysics(dt) {
  if (isGameOver) return;

  // Обновляем таймер защитных наушников
  if (player.shieldTimer > 0) {
    player.shieldTimer -= dt / 60;
    if (player.shieldTimer < 0) player.shieldTimer = 0;
  }

  // Обновляем таймер полёта на соло-гитаре
  if (player.soloTimer > 0) {
    player.soloTimer -= dt / 60;
    player.vy = player.soloFlightSpeed;

    // Огненный шлейф во время рок-полёта
    if (Math.random() < 0.6) {
      spawnParticles(
        player.x + player.width / 2,
        player.y + player.height,
        Math.random() < 0.5 ? '#ff7b00' : '#ffd700',
        1
      );
    }

    if (player.soloTimer <= 0) {
      player.soloTimer = 0;
      player.vy = player.jumpStrength;
    }
  }

  // Горизонтальное движение
  if (moveLeft) {
    player.vx = -player.speed;
  } else if (moveRight) {
    player.vx = player.speed;
  } else {
    player.vx = 0;
  }

  player.x += player.vx * dt;

  // Сквозной проход через левую и правую границы экрана
  if (player.x + player.width / 2 < 0) {
    player.x = canvas.width - player.width / 2;
  } else if (player.x + player.width / 2 > canvas.width) {
    player.x = -player.width / 2;
  }

  // Гравитация (если не летим на соло-гитаре)
  if (player.soloTimer <= 0) {
    player.vy += player.gravity * dt;
    if (player.vy > player.maxFallSpeed) {
      player.vy = player.maxFallSpeed;
    }
  }

  const prevBottom = player.y + player.height;
  player.y += player.vy * dt;
  const currentBottom = player.y + player.height;

  // Проверка бонусов и врагов
  for (const p of platforms) {
    // Подбор бонусов
    if (p.bonus) {
      const bonusX = p.x + p.bonus.offsetX;
      const bonusY = p.y - p.bonus.height + 2;

      const touchX =
        player.x + player.width > bonusX &&
        player.x < bonusX + p.bonus.width;

      const touchY =
        player.y + player.height > bonusY &&
        player.y < bonusY + p.bonus.height;

      if (touchX && touchY) {
        if (p.bonus.type === 'headphones') {
          player.shieldTimer = 5.0;
          playSound('headphones');
          spawnParticles(bonusX + 12, bonusY + 12, '#a855f7', 12);
        } else if (p.bonus.type === 'bass') {
          player.vy = player.bassJumpStrength;
          playSound('bass');
          spawnParticles(bonusX + 12, bonusY + 12, '#00e5ff', 16);
        } else if (p.bonus.type === 'solo') {
          player.soloTimer = 3.5;
          player.vy = player.soloFlightSpeed;
          playSound('solo');
          spawnParticles(bonusX + 12, bonusY + 12, '#ffd700', 20);
        }
        p.bonus = null;
      }
    }

    // Движение рэпера и проверка столкновения
    if (p.enemy) {
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

      const enemyX = p.x + p.enemy.offsetX;
      const enemyY = p.y - p.enemy.height;
      const pad = 6;

      const hitX =
        player.x + player.width - pad > enemyX + pad &&
        player.x + pad < enemyX + p.enemy.width - pad;

      const hitY =
        player.y + player.height - pad > enemyY + pad &&
        player.y + pad < enemyY + p.enemy.height - pad;

      if (hitX && hitY) {
        // Если активны наушники или полёт на соло-гитаре — сбиваем рэпера!
        if (player.shieldTimer > 0 || player.soloTimer > 0) {
          spawnParticles(enemyX + 20, enemyY + 20, '#ff7b00', 14);
          playSound('knockout');
          p.enemy = null;
        } else {
          triggerGameOver();
          return;
        }
      }
    }
  }

  // Приземление на музыкальные платформы (только при падении и вне полёта соло-гитары)
  if (player.vy > 0 && player.soloTimer <= 0) {
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
        playSound('jump');
        spawnParticles(player.x + player.width / 2, p.y, '#ff7b00', 5);
        break;
      }
    }
  }

  // Движение камеры вверх и начисление очков за высоту
  const cameraThreshold = canvas.height * 0.42;
  if (player.y < cameraThreshold) {
    const shift = cameraThreshold - player.y;
    player.y = cameraThreshold;
    climbDistance += shift;

    const newScore = Math.floor(climbDistance / 10);
    if (newScore > score) {
      score = newScore;
      if (score > highScore) {
        highScore = score;
        localStorage.setItem('capyRockHighScore', String(highScore));
      }
    }

    gridOffsetY = (gridOffsetY + shift * 0.5) % 40;

    for (const p of platforms) {
      p.y += shift;
    }

    for (const pt of particles) {
      pt.y += shift;
    }

    // Удаляем пройденные платформы внизу
    for (let i = platforms.length - 1; i >= 0; i--) {
      if (platforms[i].y > canvas.height + 50) {
        platforms.splice(i, 1);
      }
    }

    // Генерируем новые ноты сверху
    let highestPlatform = platforms[0];
    for (const p of platforms) {
      if (p.y < highestPlatform.y) {
        highestPlatform = p;
      }
    }

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

  // Падение ниже экрана приводит к Game Over
  if (player.y > canvas.height) {
    triggerGameOver();
  }
}

// ==========================================
// ГЛАВНЫЙ ИГРОВОЙ ЦИКЛ
// ==========================================
function gameLoop(currentTime) {
  let dt = (currentTime - lastTime) / 16.67;
  lastTime = currentTime;

  if (dt > 2.5 || dt < 0 || isNaN(dt)) {
    dt = 1;
  }

  updatePhysics(dt);
  drawBackground();
  drawPlatformsAndEntities();
  updateAndDrawParticles(dt);
  drawPlayer();
  drawHUD();
  drawGameOverScreen();

  requestAnimationFrame(gameLoop);
}

// Старт игры
resetStage();
requestAnimationFrame(gameLoop);
