// ==========================================
// CAPY ROCK — НОВАЯ СТИЛЬНАЯ ЦВЕТОВАЯ ПАЛИТРА
// ==========================================

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Фиксированное вертикальное разрешение 9:16
canvas.width = 360;
canvas.height = 640;

// ==========================================
// МУЗЫКАЛЬНЫЙ ДВИЖОК (Web Audio API)
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
  } else if (type === 'shoot') {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(523.25, now);
    osc.frequency.exponentialRampToValueAtTime(783.99, now + 0.06);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);

    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(now);
    osc.stop(now + 0.07);
  } else if (type === 'break') {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(180, now);
    osc.frequency.exponentialRampToValueAtTime(45, now + 0.16);

    gain.gain.setValueAtTime(0.16, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(now);
    osc.stop(now + 0.18);
  } else if (type === 'headphones') {
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
// НОВАЯ ПАЛИТРА (Циан, Розовый неон, Индиго)
// ==========================================
const palette = {
  'B': '#a66a38', // Коричневый мех капибары
  'D': '#4a2c11', // Тёмно-коричневый нос и ушки
  'K': '#111115', // Чёрная кожаная куртка, очки и штаны
  'G': '#8b93a6', // Серебристый гриф гитары
  'O': '#00e5ff', // Бирюзовый неон (циан)
  'P': '#ff2a6d', // Ярко-розовый малиновый неон
  'Y': '#ffd700', // Золотой
  'S': '#e0ac69', // Лицо рэпера
  'W': '#ffffff', // Белый
  'C': '#3b82f6'  // Насыщенно-синий
};

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

const rapperSprite = [
  "    PPPPPPPP    ",
  "  PPPPPPPPPPPP  ",
  "   KKKKKKKKKK   ",
  "   KKKKSSKKKK   ",
  "   KKKKKKKKKK   ",
  "    SSSSSSSS    ",
  "  OOOOOOOOOOOO  ",
  " .OOOPOOOPOOO.  ",
  " .OOOPPOOPPOO.  ",
  " .OOOOOPPOOOO.  ",
  " .OOOOOPPOOOO.  ",
  " .OOOOOOOOOOOO. ",
  "  KKKKKKKKKKKK  ",
  "  KKKKK..KKKKK  ",
  "  KKKKK..KKKKK  ",
  " PPPPPP..PPPPpp "
];

const pickSprite = [
  "...OO...",
  "..OOOO..",
  ".OOWWOO.",
  "OOYYYYOO",
  "OOYYYYOO",
  ".OOOOOO.",
  "..OOOO..",
  "........"
];

const headphonesSprite = [
  "...OOOO...",
  "..OOOOOO..",
  ".OO......OO.",
  ".GG......GG.",
  "PPPW....WPPP",
  "PPPW....WPPP",
  "PPPW....WPPP",
  "PPPW....WPPP",
  ".PP......PP.",
  "............",
  "............",
  "............"
];

const bassSprite = [
  ".........GGG",
  "........GGGG",
  ".......GGG..",
  "......GGG...",
  "...PPGGG....",
  "..PPPPG.....",
  ".PPPPPPP....",
  "PPPPWWPPP...",
  "PPPWWWWPP...",
  "PPPPWWPPP...",
  ".PPPPPPP....",
  "..PPPPP....."
];

const soloSprite = [
  ".........YYY",
  "........YYYY",
  ".......GGG..",
  "......GGG...",
  "..PP.GGG....",
  ".PPPPGG.....",
  ".PPPPPPP....",
  "PPPPWWPPPP..",
  "PPPWWWWPPP..",
  "PPPYWWYPPP..",
  "PPP....PPP..",
  "PP......PP.."
];

// ==========================================
// ИГРОВЫЕ ПЕРЕМЕННЫЕ
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
  bassJumpStrength: -19.2,
  soloFlightSpeed: -13.5,
  maxFallSpeed: 10,
  shieldTimer: 0,
  soloTimer: 0,
  shootCooldown: 0
};

let moveLeft = false;
let moveRight = false;
let lastTime = performance.now();

let climbDistance = 0;
let bonusScore = 0;
let score = 0;
let highScore = Number(localStorage.getItem('capyRockHighScore')) || 0;
let isGameOver = false;
let gridOffsetY = 0;

const platforms = [];
const picks = [];
const particles = [];
const floatingTexts = [];

const platformWidth = 76;
const platformHeight = 18;

const restartBtn = {
  x: canvas.width / 2 - 95,
  y: canvas.height / 2 + 55,
  width: 190,
  height: 48
};

// ==========================================
// ЭФФЕКТЫ И ЧАСТИЦЫ
// ==========================================
function shootPick() {
  if (isGameOver || player.shootCooldown > 0) return;

  picks.push({
    width: 16,
    height: 16,
    x: player.x + player.width / 2 - 8,
    y: player.y - 6,
    vy: -12.5
  });

  player.shootCooldown = 0.28;
  playSound('shoot');
}

function spawnParticles(x, y, color, count = 10) {
  for (let i = 0; i < count; i++) {
    particles.push({
      x: x,
      y: y,
      vx: (Math.random() - 0.5) * 6,
      vy: (Math.random() - 0.5) * 6,
      size: 3 + Math.random() * 3.5,
      color: color,
      life: 1.0
    });
  }
}

function spawnFloatingText(text, x, y, color = '#ffd700') {
  floatingTexts.push({
    text: text,
    x: x,
    y: y,
    vy: -1.6,
    color: color,
    life: 1.0
  });
}

function updateAndDrawEffects(dt) {
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

  for (let i = floatingTexts.length - 1; i >= 0; i--) {
    const ft = floatingTexts[i];
    ft.y += ft.vy * dt;
    ft.life -= 0.025 * dt;

    if (ft.life <= 0) {
      floatingTexts.splice(i, 1);
      continue;
    }

    ctx.globalAlpha = Math.max(ft.life, 0);
    ctx.fillStyle = ft.color;
    ctx.font = 'bold 16px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(ft.text, ft.x, ft.y);
  }

  ctx.globalAlpha = 1.0;
}

// ==========================================
// ГЕНЕРАЦИЯ УРОВНЯ
// ==========================================
function getNextPlatformGap(previousHadEnemy) {
  if (previousHadEnemy) {
    return 55 + Math.random() * 15;
  }

  const difficulty = Math.min(climbDistance / 7000, 1);
  const minGap = 60 + difficulty * 25;
  const maxGap = 95 + difficulty * 35;

  return minGap + Math.random() * (maxGap - minGap);
}

function createPlatform(x, y, allowSpecial) {
  const difficulty = Math.min(climbDistance / 7000, 1);

  let type = 'normal';
  let vx = 0;

  if (allowSpecial) {
    const typeRoll = Math.random();
    const movingChance = 0.20 + difficulty * 0.12;
    const fragileChance = 0.16 + difficulty * 0.10;

    if (typeRoll < movingChance) {
      type = 'moving';
      const moveSpeed = 1.2 + Math.random() * 1.1 + difficulty * 0.7;
      vx = moveSpeed * (Math.random() < 0.5 ? -1 : 1);
    } else if (typeRoll < movingChance + fragileChance) {
      type = 'fragile';
    }
  }

  let enemy = null;
  let bonus = null;
  const enemyChance = 0.18 + difficulty * 0.14;

  if (allowSpecial && type !== 'fragile' && Math.random() < enemyChance) {
    const enemySize = 40;
    enemy = {
      width: enemySize,
      height: enemySize,
      offsetX: (platformWidth - enemySize) / 2,
      speed: 0.75 + Math.random() * 0.55,
      direction: Math.random() < 0.5 ? -1 : 1
    };
  } else if (allowSpecial && Math.random() < 0.18) {
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
    type: type,
    vx: vx,
    broken: false,
    enemy: enemy,
    bonus: bonus
  };
}

function updateTotalScore() {
  const newScore = Math.floor(climbDistance / 10) + bonusScore;
  if (newScore > score) {
    score = newScore;
    if (score > highScore) {
      highScore = score;
      localStorage.setItem('capyRockHighScore', String(highScore));
    }
  }
}

function resetStage() {
  platforms.length = 0;
  picks.length = 0;
  particles.length = 0;
  floatingTexts.length = 0;

  climbDistance = 0;
  bonusScore = 0;
  score = 0;
  gridOffsetY = 0;
  isGameOver = false;
  noteIndex = 0;

  player.shieldTimer = 0;
  player.soloTimer = 0;
  player.shootCooldown = 0;
  player.vx = 0;

  const startX = canvas.width / 2 - platformWidth / 2;
  const startY = canvas.height - 70;

  const firstPlatform = createPlatform(startX, startY, false);
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

    const canSpawnSpecial = stepCount > 2 && !lastHadEnemy;
    const newPlatform = createPlatform(randomX, currentY, canSpawnSpecial);
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
// УПРАВЛЕНИЕ
// ==========================================
function handleTouch(event) {
  event.preventDefault();
  initAudio();

  if (isGameOver) {
    if (event.type === 'touchstart') {
      resetStage();
    }
    return;
  }

  if (event.type === 'touchstart') {
    shootPick();
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

canvas.addEventListener('mousedown', () => {
  initAudio();
  if (isGameOver) {
    resetStage();
  } else {
    shootPick();
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
  if (event.key === 'ArrowUp' || event.key === 'w' || event.key === ' ') shootPick();
});

window.addEventListener('keyup', (event) => {
  if (event.key === 'ArrowLeft' || event.key === 'a') moveLeft = false;
  if (event.key === 'ArrowRight' || event.key === 'd') moveRight = false;
});

// ==========================================
// ОТРИСОВКА (НОВАЯ ПАЛИТРА)
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
  // Ночной киберпанк-градиент (глубокий индиго и тёмно-синий)
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, '#060412');
  gradient.addColorStop(0.5, '#0f172a');
  gradient.addColorStop(1, '#080c1e');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Мягкая голубая неоновая сетка
  ctx.strokeStyle = 'rgba(0, 229, 255, 0.05)';
  ctx.lineWidth = 1.5;
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
    if (p.broken) continue;

    let primaryColor = '#00e5ff';   // Циан (неоновый бирюзовый) для обычных
    let secondaryColor = '#3b82f6'; // Синий для обычных
    let glowColor = 'rgba(0, 229, 255, 0.45)';

    if (p.type === 'moving') {
      primaryColor = '#38bdf8';     // Небесно-голубой
      secondaryColor = '#6366f1';   // Индиго
      glowColor = 'rgba(56, 189, 248, 0.45)';
    } else if (p.type === 'fragile') {
      primaryColor = '#ff2a6d';     // Ярко-розовый неон
      secondaryColor = '#fbbf24';   // Золотистый
      glowColor = 'rgba(255, 42, 109, 0.45)';
    }

    ctx.shadowBlur = 10;
    ctx.shadowColor = glowColor;

    const floatOffset = Math.sin(performance.now() * 0.005 + p.x) * 1.5;
    const drawY = p.y + floatOffset;

    if (p.type === 'fragile') {
      const halfBar = (p.width - 18) / 2;
      ctx.fillStyle = primaryColor;
      ctx.fillRect(p.x + 8, drawY, halfBar, 4);
      ctx.fillRect(p.x + 14 + halfBar, drawY, halfBar, 4);

      ctx.fillStyle = secondaryColor;
      ctx.fillRect(p.x + 8, drawY + 4, halfBar - 2, 4);
      ctx.fillRect(p.x + 16 + halfBar, drawY + 4, halfBar - 2, 4);
    } else {
      ctx.fillStyle = primaryColor;
      ctx.fillRect(p.x + 8, drawY, p.width - 12, 4);

      ctx.fillStyle = secondaryColor;
      ctx.fillRect(p.x + 8, drawY + 4, p.width - 12, 4);
    }

    ctx.fillStyle = secondaryColor;
    ctx.fillRect(p.x + 10, drawY, 4, 16);
    ctx.fillRect(p.x + p.width - 8, drawY, 4, 16);

    ctx.fillStyle = primaryColor;
    ctx.fillRect(p.x, drawY + 10, 14, 8);
    ctx.fillRect(p.x + p.width - 18, drawY + 10, 14, 8);

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(p.x + 3, drawY + 12, 4, 2);
    ctx.fillRect(p.x + p.width - 15, drawY + 12, 4, 2);

    ctx.shadowBlur = 0;

    if (p.bonus) {
      const bonusX = p.x + p.bonus.offsetX;
      const bFloat = Math.sin(performance.now() * 0.007) * 3;
      const bonusY = drawY - p.bonus.height + 2 + bFloat;

      if (p.bonus.type === 'headphones') {
        drawSprite(headphonesSprite, bonusX, bonusY, 2);
      } else if (p.bonus.type === 'bass') {
        drawSprite(bassSprite, bonusX, bonusY, 2);
      } else if (p.bonus.type === 'solo') {
        drawSprite(soloSprite, bonusX, bonusY, 2);
      }
    }

    if (p.enemy) {
      const enemyX = p.x + p.enemy.offsetX;
      const enemyY = drawY - p.enemy.height;
      drawSprite(rapperSprite, enemyX, enemyY, 2.5);
    }
  }
}

function drawPicks() {
  for (const pick of picks) {
    ctx.shadowBlur = 8;
    ctx.shadowColor = 'rgba(0, 229, 255, 0.8)';
    drawSprite(pickSprite, pick.x, pick.y, 2);
    ctx.shadowBlur = 0;
  }
}

function drawPlayer() {
  const centerX = player.x + player.width / 2;
  const centerY = player.y + player.height / 2;

  if (player.soloTimer > 0) {
    ctx.beginPath();
    ctx.arc(centerX, centerY, 36, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 215, 0, 0.32)';
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#00e5ff';
    ctx.stroke();
  }

  if (player.shieldTimer > 0) {
    const isVisible = player.shieldTimer > 1.0 || Math.floor(performance.now() / 100) % 2 === 0;

    if (isVisible) {
      const pulse = Math.sin(performance.now() * 0.01) * 3;

      ctx.beginPath();
      ctx.arc(centerX, centerY, 33 + pulse, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 42, 109, 0.25)';
      ctx.fill();
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = '#ff2a6d';
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(centerX, centerY, 27 - pulse * 0.5, 0, Math.PI * 2);
      ctx.strokeStyle = '#00e5ff';
      ctx.stroke();
    }
  }

  drawSprite(capySprite, player.x, player.y, 3);
}

function drawHUD() {
  ctx.fillStyle = 'rgba(8, 12, 30, 0.90)';
  ctx.fillRect(0, 0, canvas.width, 46);
  ctx.fillStyle = '#00e5ff';
  ctx.fillRect(0, 44, canvas.width, 2);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 16px monospace';
  ctx.textAlign = 'left';
  ctx.fillText('СЧЁТ: ' + score, 14, 28);

  ctx.fillStyle = '#ffd700';
  ctx.textAlign = 'right';
  ctx.fillText('РЕКОРД: ' + Math.max(score, highScore), canvas.width - 14, 28);

  if (player.soloTimer > 0) {
    const barWidth = (player.soloTimer / 3.5) * (canvas.width - 28);
    ctx.fillStyle = '#ffd700';
    ctx.fillRect(14, 52, barWidth, 6);
  } else if (player.shieldTimer > 0) {
    const barWidth = (player.shieldTimer / 5.0) * (canvas.width - 28);
    ctx.fillStyle = '#ff2a6d';
    ctx.fillRect(14, 52, barWidth, 6);
  }
}

function drawGameOverScreen() {
  if (!isGameOver) return;

  ctx.fillStyle = 'rgba(6, 4, 18, 0.88)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const boxX = 28;
  const boxY = canvas.height / 2 - 140;
  const boxW = canvas.width - 56;
  const boxH = 280;

  ctx.fillStyle = '#0b132b';
  ctx.fillRect(boxX, boxY, boxW, boxH);
  ctx.lineWidth = 3;
  ctx.strokeStyle = '#00e5ff';
  ctx.strokeRect(boxX, boxY, boxW, boxH);

  ctx.fillStyle = '#00e5ff';
  ctx.font = 'bold 30px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('GAME OVER', canvas.width / 2, boxY + 52);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 18px monospace';
  ctx.fillText('ИТОГОВЫЙ СЧЁТ', canvas.width / 2, boxY + 98);

  ctx.fillStyle = '#ffd700';
  ctx.font = 'bold 26px monospace';
  ctx.fillText(score, canvas.width / 2, boxY + 132);

  ctx.fillStyle = '#ff2a6d';
  ctx.font = '14px monospace';
  ctx.fillText('РЕКОРД: ' + highScore, canvas.width / 2, boxY + 160);

  ctx.fillStyle = '#00e5ff';
  ctx.fillRect(restartBtn.x, restartBtn.y + 10, restartBtn.width, restartBtn.height);

  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2;
  ctx.strokeRect(restartBtn.x, restartBtn.y + 10, restartBtn.width, restartBtn.height);

  ctx.fillStyle = '#060412';
  ctx.font = 'bold 18px monospace';
  ctx.fillText('ИГРАТЬ СНОВА', canvas.width / 2, restartBtn.y + 40);
}

// ==========================================
// ФИЗИКА И ЛОГИКА
// ==========================================
function updatePhysics(dt) {
  if (isGameOver) return;

  if (player.shootCooldown > 0) {
    player.shootCooldown -= dt / 60;
    if (player.shootCooldown < 0) player.shootCooldown = 0;
  }

  if (player.shootCooldown <= 0) {
    const hasEnemyAbove = platforms.some(
      (p) => !p.broken && p.enemy && p.y > 0 && p.y < player.y
    );
    if (hasEnemyAbove) {
      shootPick();
      player.shootCooldown = 0.55;
    }
  }

  if (player.shieldTimer > 0) {
    player.shieldTimer -= dt / 60;
    if (player.shieldTimer < 0) player.shieldTimer = 0;
  }

  if (player.soloTimer > 0) {
    player.soloTimer -= dt / 60;
    player.vy = player.soloFlightSpeed;

    if (Math.random() < 0.6) {
      spawnParticles(
        player.x + player.width / 2,
        player.y + player.height,
        Math.random() < 0.5 ? '#00e5ff' : '#ffd700',
        1
      );
    }

    if (player.soloTimer <= 0) {
      player.soloTimer = 0;
      player.vy = player.jumpStrength;
    }
  }

  if (moveLeft) {
    player.vx = -player.speed;
  } else if (moveRight) {
    player.vx = player.speed;
  } else {
    player.vx = 0;
  }

  player.x += player.vx * dt;

  if (player.x + player.width / 2 < 0) {
    player.x = canvas.width - player.width / 2;
  } else if (player.x + player.width / 2 > canvas.width) {
    player.x = -player.width / 2;
  }

  if (player.soloTimer <= 0) {
    player.vy += player.gravity * dt;
    if (player.vy > player.maxFallSpeed) {
      player.vy = player.maxFallSpeed;
    }
  }

  const prevBottom = player.y + player.height;
  player.y += player.vy * dt;
  const currentBottom = player.y + player.height;

  for (let i = picks.length - 1; i >= 0; i--) {
    const pick = picks[i];
    pick.y += pick.vy * dt;

    if (Math.random() < 0.35) {
      spawnParticles(pick.x + 8, pick.y + 14, '#00e5ff', 1);
    }

    if (pick.y + pick.height < 0) {
      picks.splice(i, 1);
      continue;
    }

    let hitEnemy = false;
    for (const p of platforms) {
      if (p.broken || !p.enemy) continue;

      const enemyX = p.x + p.enemy.offsetX;
      const enemyY = p.y - p.enemy.height;

      const overlapX =
        pick.x + pick.width > enemyX + 4 &&
        pick.x < enemyX + p.enemy.width - 4;

      const overlapY =
        pick.y + pick.height > enemyY + 4 &&
        pick.y < enemyY + p.enemy.height - 4;

      if (overlapX && overlapY) {
        spawnParticles(enemyX + 20, enemyY + 20, '#00e5ff', 16);
        spawnParticles(enemyX + 20, enemyY + 20, '#ffd700', 8);
        spawnFloatingText('+25', enemyX + 20, enemyY, '#ffd700');
        playSound('knockout');

        p.enemy = null;
        bonusScore += 25;
        updateTotalScore();

        hitEnemy = true;
        break;
      }
    }

    if (hitEnemy) {
      picks.splice(i, 1);
    }
  }

  for (const p of platforms) {
    if (p.broken) continue;

    if (p.type === 'moving') {
      p.x += p.vx * dt;

      if (p.x <= 8) {
        p.x = 8;
        p.vx *= -1;
      } else if (p.x + p.width >= canvas.width - 8) {
        p.x = canvas.width - 8 - p.width;
        p.vx *= -1;
      }
    }

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
          spawnParticles(bonusX + 12, bonusY + 12, '#ff2a6d', 12);
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
        if (player.shieldTimer > 0 || player.soloTimer > 0) {
          spawnParticles(enemyX + 20, enemyY + 20, '#00e5ff', 14);
          spawnFloatingText('+25', enemyX + 20, enemyY, '#ffd700');
          playSound('knockout');
          p.enemy = null;
          bonusScore += 25;
          updateTotalScore();
        } else {
          triggerGameOver();
          return;
        }
      }
    }
  }

  if (player.vy > 0 && player.soloTimer <= 0) {
    for (const p of platforms) {
      if (p.broken) continue;

      const isWithinX =
        player.x + player.width - 8 > p.x &&
        player.x + 8 < p.x + p.width;

      const isLandingY =
        prevBottom <= p.y + 8 &&
        currentBottom >= p.y;

      if (isWithinX && isLandingY) {
        player.y = p.y - player.height;
        player.vy = player.jumpStrength;

        if (p.type === 'fragile') {
          p.broken = true;
          playSound('break');
          spawnParticles(p.x + p.width / 2, p.y + 6, '#ff2a6d', 14);
          spawnParticles(p.x + p.width / 2, p.y + 6, '#fbbf24', 8);
        } else {
          playSound('jump');
          const sparkColor = p.type === 'moving' ? '#38bdf8' : '#00e5ff';
          spawnParticles(player.x + player.width / 2, p.y, sparkColor, 5);
        }
        break;
      }
    }
  }

  const cameraThreshold = canvas.height * 0.42;
  if (player.y < cameraThreshold) {
    const shift = cameraThreshold - player.y;
    player.y = cameraThreshold;
    climbDistance += shift;

    updateTotalScore();

    gridOffsetY = (gridOffsetY + shift * 0.5) % 40;

    for (const p of platforms) {
      p.y += shift;
    }

    for (const pick of picks) {
      pick.y += shift;
    }

    for (const pt of particles) {
      pt.y += shift;
    }

    for (const ft of floatingTexts) {
      ft.y += shift;
    }

    for (let i = platforms.length - 1; i >= 0; i--) {
      if (platforms[i].y > canvas.height + 50) {
        platforms.splice(i, 1);
      }
    }

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

  if (player.y > canvas.height) {
    triggerGameOver();
  }
}
// ==========================================
// ГЛАВНЫЙ ЦИКЛ
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
  drawPicks();
  updateAndDrawEffects(dt);
  drawPlayer();
  drawHUD();
  drawGameOverScreen();

  requestAnimationFrame(gameLoop);
}

resetStage();
requestAnimationFrame(gameLoop);
