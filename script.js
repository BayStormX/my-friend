/* ==========================================
   💕 Love Confession - script.js
   ========================================== */

// ==========================================
// State
// ==========================================
let currentScreen = 1;
let noCount = 0;
let gameScore = 0;
let gameTimer = 20;
let gameInterval = null;
let gameHeartInterval = null;
let gameRunning = false;
let gameOver = false;
let confessionStep = 0;
let confessionDone = false;

const TOTAL_SCREENS = 8;
const CONFESSION_PHRASES = [
  { text: "ชอบเธอ", class: "pink" },
  { text: "มากๆ", class: "purple" },
  { text: "เลยนะ!", class: "pink" },
  { text: "💕", class: "" },
];

const NO_MESSAGES = [
  "อย่าเลยนะ!! 🥺",
  "ลองกด 'ได้เลย' ดูก็ได้นะ...",
  "ปุ่มนี้หายไปแล้วนะ 😅",
  "มันหนีไปแล้ว!",
  "เธอหากไม่เจอหรอก 555",
  "คิดใหม่ได้เลย!! 💖",
  "ปุ่มนี้จะเล็กลงเรื่อยๆ นะ 😂",
  "อีกนิดเดียวก็พอแล้วนะ! 🌸",
  "ฉันรอนะ... ไม่ไปไหนหรอก",
  "โอเค ฉันยังรอ... 😢",
];

const TOAST_MESSAGES_SCREEN3 = [
  "น่ารักดีมั้ย! 💕",
  "กดทุกอันเลยนะ!",
  "ยังมีอีก~ ✨",
];

// ==========================================
// Init
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  initLoadingScreen();
  initCursorGlow();
  initBgHearts();
  initProgressDots();
  initEnvelope();
  initButtons();
  initReasonCards();
  initGame();
  initClickParticles();
  initSparkles();
});

// ==========================================
// Loading Screen
// ==========================================
function initLoadingScreen() {
  const loader = document.createElement('div');
  loader.className = 'loading-heart';
  loader.innerHTML = '<div class="loading-heart-icon">💕</div>';
  document.body.appendChild(loader);

  setTimeout(() => {
    loader.classList.add('done');
    setTimeout(() => loader.remove(), 500);
  }, 1000);
}

// ==========================================
// Cursor Glow
// ==========================================
function initCursorGlow() {
  const glow = document.getElementById('cursorGlow');
  let mouseX = 0, mouseY = 0;
  let glowX = 0, glowY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function animateCursor() {
    glowX += (mouseX - glowX) * 0.12;
    glowY += (mouseY - glowY) * 0.12;
    glow.style.left = glowX + 'px';
    glow.style.top = glowY + 'px';
    requestAnimationFrame(animateCursor);
  }
  animateCursor();
}

// ==========================================
// Background Floating Hearts
// ==========================================
function initBgHearts() {
  const container = document.getElementById('bgHearts');
  const heartEmojis = ['💕', '💖', '💗', '💓', '🌸', '✨', '⭐', '🌺', '💫', '🌷'];

  for (let i = 0; i < 20; i++) {
    createBgHeart(container, heartEmojis, i * 300);
  }

  setInterval(() => {
    createBgHeart(container, heartEmojis, 0);
  }, 1800);
}

function createBgHeart(container, emojis, delay) {
  const heart = document.createElement('div');
  heart.className = 'bg-heart';
  heart.textContent = emojis[Math.floor(Math.random() * emojis.length)];
  heart.style.left = Math.random() * 100 + 'vw';
  heart.style.fontSize = (0.8 + Math.random() * 1.5) + 'rem';
  const duration = 8 + Math.random() * 12;
  heart.style.animationDuration = duration + 's';
  heart.style.animationDelay = delay + 'ms';
  container.appendChild(heart);
  setTimeout(() => heart.remove(), (duration + delay / 1000 + 1) * 1000);
}

// ==========================================
// Sparkles on cursor
// ==========================================
function initSparkles() {
  let lastX = 0, lastY = 0;
  const sparkContainer = document.getElementById('sparkles');

  document.addEventListener('mousemove', (e) => {
    const dist = Math.hypot(e.clientX - lastX, e.clientY - lastY);
    if (dist > 40) {
      createSparkle(e.clientX, e.clientY, sparkContainer);
      lastX = e.clientX;
      lastY = e.clientY;
    }
  });
}

function createSparkle(x, y, container) {
  const colors = ['#ff6eb4', '#a78bfa', '#ffd54f', '#ff4d6d', '#c9b8ff'];
  for (let i = 0; i < 3; i++) {
    const s = document.createElement('div');
    s.className = 'sparkle';
    s.style.left = (x + (Math.random() - 0.5) * 20) + 'px';
    s.style.top = (y + (Math.random() - 0.5) * 20) + 'px';
    s.style.background = colors[Math.floor(Math.random() * colors.length)];
    s.style.width = s.style.height = (4 + Math.random() * 5) + 'px';
    container.appendChild(s);
    setTimeout(() => s.remove(), 600);
  }
}

// ==========================================
// Progress Dots
// ==========================================
function initProgressDots() {
  const container = document.createElement('div');
  container.className = 'progress-dots';
  for (let i = 1; i <= 6; i++) {
    const dot = document.createElement('div');
    dot.className = 'progress-dot' + (i === 1 ? ' active' : '');
    dot.id = `dot${i}`;
    container.appendChild(dot);
  }
  document.body.appendChild(container);
}

function updateProgressDots(screen) {
  for (let i = 1; i <= 6; i++) {
    const dot = document.getElementById(`dot${i}`);
    if (dot) dot.classList.toggle('active', i === screen);
  }
}

// ==========================================
// Screen Transitions
// ==========================================
function goToScreen(num) {
  const current = document.getElementById(`screen${currentScreen}`);
  const next = document.getElementById(`screen${num}`);

  if (!next) return;

  current.classList.add('exit');
  setTimeout(() => {
    current.classList.remove('active', 'exit');
  }, 400);

  setTimeout(() => {
    next.classList.add('active');
    currentScreen = num;
    updateProgressDots(Math.min(num, 6));
    onScreenEnter(num);
  }, 350);
}

function onScreenEnter(num) {
  if (num === 4) initTimelineAnimation();
  if (num === 6) startConfession();
  if (num === 7) startCelebration();
  if (num === 8) startRain();
}

// ==========================================
// Envelope Click - Screen 1
// ==========================================
function initEnvelope() {
  const env = document.getElementById('envelope');
  env.addEventListener('click', () => {
    env.style.transform = 'scale(1.2) rotate(10deg)';
    env.style.transition = 'transform 0.3s ease';
    setTimeout(() => {
      showParticles(env, ['💌', '💕', '✨', '🌸']);
      goToScreen(2);
    }, 300);
  });
}

// ==========================================
// Button Wiring
// ==========================================
function initButtons() {
  document.getElementById('btn2to3').addEventListener('click', () => {
    goToScreen(3);
    showToast('มาดูเหตุผลกันเลย! 💕');
  });
  document.getElementById('btn3to4').addEventListener('click', () => {
    goToScreen(4);
  });
  document.getElementById('btn4to5').addEventListener('click', () => {
    goToScreen(5);
    showToast('มาเล่นเกมกันก่อน! 🎮');
  });
  document.getElementById('btn5to6').addEventListener('click', () => {
    goToScreen(6);
  });
}

// ==========================================
// Reason Cards - Screen 3
// ==========================================
function initReasonCards() {
  const cards = document.querySelectorAll('.reason-card');
  let openCard = null;
  let openedCount = 0;

  cards.forEach((card, i) => {
    // Build desc overlay
    const desc = document.createElement('div');
    desc.className = 'reason-desc';
    desc.textContent = card.dataset.desc;
    card.appendChild(desc);

    card.addEventListener('click', () => {
      if (openCard && openCard !== card) {
        openCard.classList.remove('open');
      }
      card.classList.toggle('open');
      openCard = card.classList.contains('open') ? card : null;

      if (card.classList.contains('open')) {
        openedCount++;
        showParticles(card, ['💕', '✨', '💖']);
        if (openedCount <= 3) {
          showToast(TOAST_MESSAGES_SCREEN3[openedCount - 1]);
        }
        if (openedCount === cards.length) {
          showToast('เปิดครบทุกอันแล้ว! 🎉', 2500);
        }
      }
    });
  });
}

// ==========================================
// Timeline Animation - Screen 4
// ==========================================
function initTimelineAnimation() {
  const items = document.querySelectorAll('.timeline-item');
  items.forEach((item, i) => {
    setTimeout(() => {
      item.classList.add('visible');
    }, parseInt(item.dataset.delay) || i * 200);
  });
}

// ==========================================
// Mini Game - Screen 5
// ==========================================
function initGame() {
  document.getElementById('startGame').addEventListener('click', startGame);
}

function startGame() {
  if (gameRunning) return;
  gameRunning = true;
  gameScore = 0;
  gameTimer = 20;
  gameOver = false;

  document.getElementById('gameOverlay').style.display = 'none';
  document.getElementById('scoreCount').textContent = '0';
  document.getElementById('timerCount').textContent = '20';
  document.getElementById('gameHearts').innerHTML = '';

  // Timer countdown
  gameInterval = setInterval(() => {
    gameTimer--;
    document.getElementById('timerCount').textContent = gameTimer;
    if (gameTimer <= 5) {
      document.getElementById('timerCount').style.color = '#ff4d6d';
    }
    if (gameTimer <= 0) {
      endGame(false);
    }
  }, 1000);

  // Spawn hearts
  spawnGameHeart();
  gameHeartInterval = setInterval(() => {
    if (!gameOver) spawnGameHeart();
    if (!gameOver) spawnGameHeart();
  }, 800);
}

function spawnGameHeart() {
  const area = document.getElementById('gameHearts');
  const hearts = ['❤️', '💕', '💖', '💗', '💓', '💝', '🌸', '⭐'];
  const heart = document.createElement('div');
  heart.className = 'game-heart';
  heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];

  const x = 5 + Math.random() * 85;
  heart.style.left = x + '%';

  const fallDuration = 2.5 + Math.random() * 3;
  heart.style.animationDuration = fallDuration + 's';

  heart.addEventListener('click', (e) => {
    e.stopPropagation();
    if (gameOver) return;
    heart.style.animation = 'none';
    heart.style.transform = 'scale(2)';
    heart.style.opacity = '0';
    heart.style.transition = 'transform 0.25s ease, opacity 0.25s ease';
    showParticles(heart, ['💕', '✨']);

    gameScore++;
    document.getElementById('scoreCount').textContent = gameScore;

    if (gameScore >= 10) {
      endGame(true);
    }
    setTimeout(() => heart.remove(), 250);
  });

  // Miss handler
  heart.addEventListener('animationend', () => {
    if (!gameOver && heart.parentNode) {
      heart.remove();
      // flash miss
      const flash = document.createElement('div');
      flash.className = 'game-miss-flash';
      document.getElementById('gameArea').appendChild(flash);
      setTimeout(() => flash.remove(), 300);
    }
  });

  area.appendChild(heart);
  setTimeout(() => {
    if (heart.parentNode) heart.remove();
  }, (fallDuration + 0.5) * 1000);
}

function endGame(won) {
  gameOver = true;
  gameRunning = false;
  clearInterval(gameInterval);
  clearInterval(gameHeartInterval);

  setTimeout(() => {
    if (won) {
      showToast('เก่งมากเลย! 🎉 ผ่านแล้ว!', 2500);
      const btn = document.getElementById('btn5to6');
      btn.classList.remove('hidden');
      btn.style.animation = 'superBounce 0.6s cubic-bezier(0.34,1.56,0.64,1) both';
      launchConfetti();
    } else {
      showToast(`ได้ ${gameScore}/10 💕 ลองใหม่ได้นะ!`, 2500);
      // Reset game
      setTimeout(() => {
        gameOver = false;
        gameScore = 0;
        gameTimer = 20;
        document.getElementById('gameOverlay').style.display = 'flex';
        document.getElementById('gameHearts').innerHTML = '';
        document.getElementById('timerCount').style.color = '';
        document.getElementById('scoreCount').textContent = '0';
        document.getElementById('timerCount').textContent = '20';
      }, 2000);
    }
  }, 300);
}

// ==========================================
// Confession - Screen 6
// ==========================================
function startConfession() {
  confessionStep = 0;
  const wordsContainer = document.getElementById('confessionWords');
  wordsContainer.innerHTML = '';

  // Animate in big heart
  const bigHeart = document.getElementById('bigHeart');
  bigHeart.style.animation = 'none';
  setTimeout(() => {
    bigHeart.style.animation = 'heartbeat 1.2s ease-in-out infinite';
  }, 50);

  // Type out confession words
  const title = document.querySelector('.confession-title');
  title.style.opacity = '0';
  title.style.transform = 'translateY(20px)';
  setTimeout(() => {
    title.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    title.style.opacity = '1';
    title.style.transform = 'translateY(0)';
  }, 300);

  CONFESSION_PHRASES.forEach((phrase, i) => {
    setTimeout(() => {
      const word = document.createElement('span');
      word.className = `confession-word ${phrase.class}`;
      word.textContent = phrase.text;
      word.style.animationDelay = '0s';
      wordsContainer.appendChild(word);

      if (i === CONFESSION_PHRASES.length - 1) {
        setTimeout(() => {
          document.getElementById('questionBox').classList.remove('hidden');
          document.getElementById('questionBox').style.animation = 'superBounce 0.6s cubic-bezier(0.34,1.56,0.64,1) both';
        }, 800);
      }
    }, 600 + i * 500);
  });
}

// ==========================================
// YES / NO Handlers
// ==========================================
function handleYes() {
  const btn = document.getElementById('btnYes');
  btn.textContent = '💖💖💖';
  btn.style.transform = 'scale(1.3)';
  launchConfetti();
  showParticlesAtCenter(['🎉', '💕', '✨', '💖', '🌸', '⭐']);
  showToast('ขอบคุณนะ! 💕💕💕', 1500);
  setTimeout(() => {
    goToScreen(7);
  }, 1200);
}

function handleNo(btn) {
  noCount++;
  document.getElementById('noCount').textContent = noCount;
  document.getElementById('noCounter').classList.remove('hidden');

  const noMessages = NO_MESSAGES;
  const msg = noMessages[Math.min(noCount - 1, noMessages.length - 1)];
  showToast(msg, 1800);

  // Move the button
  moveNoButton(btn);

  // Make it smaller each press
  const scale = Math.max(0.5, 1 - noCount * 0.06);
  btn.style.transform = `scale(${scale})`;

  if (noCount >= 10) {
    btn.style.display = 'none';
    showToast('ปุ่มหนีไปแล้ว! 😂 กด ได้เลย สิ~', 3000);
  }
}

function moveNoButton(btn) {
  const questionBox = document.getElementById('questionBox');
  const rect = questionBox.getBoundingClientRect();

  const maxX = rect.width - 140;
  const maxY = rect.height - 60;

  const randomX = Math.random() * maxX - maxX / 2;
  const randomY = Math.random() * maxY - maxY / 2;

  btn.style.position = 'relative';
  btn.style.left = randomX + 'px';
  btn.style.top = randomY + 'px';
  btn.style.transition = 'left 0.2s ease, top 0.2s ease, transform 0.2s ease';
}

function goBackToQuestion() {
  goToScreen(6);
  noCount = 0;
  const noBtn = document.getElementById('btnNo');
  if (noBtn) {
    noBtn.style.display = '';
    noBtn.style.position = '';
    noBtn.style.left = '';
    noBtn.style.top = '';
    noBtn.style.transform = '';
  }
  document.getElementById('noCounter').classList.add('hidden');
  startConfession();
}

// ==========================================
// Celebration - Screen 7
// ==========================================
function startCelebration() {
  launchConfetti();
  launchFireworks();

  const finalHearts = document.getElementById('finalHearts');
  finalHearts.innerHTML = '';
  ['💕', '💖', '💗', '💓', '💝'].forEach((h, i) => {
    const span = document.createElement('span');
    span.className = 'final-heart-item';
    span.textContent = h;
    span.style.animationDelay = `${i * 0.15}s`;
    finalHearts.appendChild(span);
  });

  showToast('ยินดีด้วยนะ!! 🎉🎉', 2000);
  setTimeout(() => showToast('เราเป็นแฟนกันแล้ว! 💕', 2000), 2200);
}

function launchFireworks() {
  const container = document.getElementById('fireworks');
  const emojis = ['🎉', '🎊', '✨', '⭐', '💥', '🌟'];

  let count = 0;
  const interval = setInterval(() => {
    for (let i = 0; i < 5; i++) {
      const fw = document.createElement('div');
      fw.className = 'firework';
      fw.textContent = emojis[Math.floor(Math.random() * emojis.length)];
      fw.style.left = Math.random() * 100 + '%';
      fw.style.top = Math.random() * 60 + '%';
      fw.style.fontSize = (1 + Math.random() * 2) + 'rem';
      fw.style.animationDelay = Math.random() * 0.5 + 's';
      container.appendChild(fw);
      setTimeout(() => fw.remove(), 1500);
    }
    count++;
    if (count >= 10) clearInterval(interval);
  }, 400);
}

// ==========================================
// Sad Rain - Screen 8
// ==========================================
function startRain() {
  const container = document.getElementById('rainContainer');
  container.innerHTML = '';

  for (let i = 0; i < 40; i++) {
    const drop = document.createElement('div');
    drop.className = 'raindrop';
    drop.style.left = Math.random() * 100 + '%';
    drop.style.height = (10 + Math.random() * 20) + 'px';
    drop.style.opacity = 0.3 + Math.random() * 0.5;
    const duration = 0.8 + Math.random() * 1.2;
    drop.style.animationDuration = duration + 's';
    drop.style.animationDelay = Math.random() * 2 + 's';
    container.appendChild(drop);
  }

  // Animate crying emoji
  const emoji = document.getElementById('cryingEmoji');
  const cryEmojis = ['😢', '😭', '🥲', '😔', '💔'];
  let cryIdx = 0;
  const cryInterval = setInterval(() => {
    cryIdx = (cryIdx + 1) % cryEmojis.length;
    emoji.textContent = cryEmojis[cryIdx];
  }, 1200);

  // Clear when leaving screen
  const observer = new MutationObserver(() => {
    if (!document.getElementById('screen8').classList.contains('active')) {
      clearInterval(cryInterval);
      observer.disconnect();
    }
  });
  observer.observe(document.getElementById('screen8'), { attributes: true });
}

// ==========================================
// Particles & Confetti Effects
// ==========================================
function initClickParticles() {
  document.addEventListener('click', (e) => {
    if (e.target.closest('.btn-next') ||
        e.target.closest('.btn-yes') ||
        e.target.closest('.reason-card') ||
        e.target.closest('#envelope')) return;

    const emojis = ['💕', '✨', '⭐', '🌸'];
    for (let i = 0; i < 3; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      p.textContent = emojis[Math.floor(Math.random() * emojis.length)];
      p.style.left = e.clientX + 'px';
      p.style.top = e.clientY + 'px';
      const angle = Math.random() * Math.PI * 2;
      const dist = 40 + Math.random() * 60;
      p.style.setProperty('--tx', Math.cos(angle) * dist + 'px');
      p.style.setProperty('--ty', Math.sin(angle) * dist + 'px');
      document.body.appendChild(p);
      setTimeout(() => p.remove(), 800);
    }
  });
}

function showParticles(element, emojis) {
  const rect = element.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;

  for (let i = 0; i < 6; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    p.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    p.style.left = cx + 'px';
    p.style.top = cy + 'px';
    const angle = (i / 6) * Math.PI * 2;
    const dist = 50 + Math.random() * 50;
    p.style.setProperty('--tx', Math.cos(angle) * dist + 'px');
    p.style.setProperty('--ty', Math.sin(angle) * dist + 'px');
    document.body.appendChild(p);
    setTimeout(() => p.remove(), 800);
  }
}

function showParticlesAtCenter(emojis) {
  const cx = window.innerWidth / 2;
  const cy = window.innerHeight / 2;

  for (let i = 0; i < 16; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    p.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    p.style.left = (cx + (Math.random() - 0.5) * 200) + 'px';
    p.style.top = (cy + (Math.random() - 0.5) * 200) + 'px';
    const angle = Math.random() * Math.PI * 2;
    const dist = 80 + Math.random() * 120;
    p.style.setProperty('--tx', Math.cos(angle) * dist + 'px');
    p.style.setProperty('--ty', Math.sin(angle) * dist + 'px');
    p.style.fontSize = (1 + Math.random()) + 'rem';
    document.body.appendChild(p);
    setTimeout(() => p.remove(), 900);
  }
}

function launchConfetti() {
  const colors = ['#ff6eb4', '#a78bfa', '#ffd54f', '#ff4d6d', '#c9b8ff', '#ffb3d1', '#7c3aed'];
  const shapes = ['circle', 'rect'];

  for (let i = 0; i < 80; i++) {
    setTimeout(() => {
      const c = document.createElement('div');
      c.className = 'confetti-piece';
      const color = colors[Math.floor(Math.random() * colors.length)];
      c.style.background = color;
      c.style.left = Math.random() * 100 + 'vw';
      c.style.top = -10 + 'px';
      const size = 6 + Math.random() * 10;
      c.style.width = size + 'px';
      c.style.height = size + 'px';
      if (shapes[Math.floor(Math.random() * 2)] === 'circle') {
        c.style.borderRadius = '50%';
      }
      const duration = 2 + Math.random() * 3;
      c.style.animationDuration = duration + 's';
      c.style.animationDelay = Math.random() * 0.5 + 's';
      document.body.appendChild(c);
      setTimeout(() => c.remove(), (duration + 1) * 1000);
    }, i * 30);
  }
}

// ==========================================
// Toast System
// ==========================================
function showToast(message, duration = 2000) {
  const container = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('out');
    setTimeout(() => toast.remove(), 400);
  }, duration);
}

// ==========================================
// Share feature
// ==========================================
function shareConfession() {
  if (navigator.share) {
    navigator.share({
      title: '💕 ข่าวดีมาแล้ว!',
      text: 'เราเป็นแฟนกันแล้ว! 🎉💕',
      url: window.location.href,
    }).catch(() => {});
  } else {
    // Fallback: copy to clipboard
    navigator.clipboard.writeText('เราเป็นแฟนกันแล้ว! 💕 ' + window.location.href)
      .then(() => showToast('คัดลอกลิงก์แล้ว! 📋', 2000))
      .catch(() => showToast('ส่งความสุขให้คนอื่นด้วยนะ! 💕', 2000));
  }
  showParticlesAtCenter(['🎉', '💕', '✨', '💖', '🌸']);
}

// ==========================================
// Keyboard Shortcuts (Easter Egg)
// ==========================================
let keySequence = '';
document.addEventListener('keydown', (e) => {
  keySequence += e.key;
  if (keySequence.includes('love')) {
    keySequence = '';
    showToast('Secret: ฉันรักเธอนะ! 💕💕💕', 3000);
    launchConfetti();
    showParticlesAtCenter(['💕', '💖', '💗', '💓', '💝']);
  }
  if (keySequence.length > 20) keySequence = keySequence.slice(-10);
});

// ==========================================
// Prevent Right-click for fun
// ==========================================
document.addEventListener('contextmenu', (e) => {
  e.preventDefault();
  showToast('ห้ามขวา click! กด Yes สิ 😄', 1500);
});

// ==========================================
// Window visibility / tab attention
// ==========================================
let tabTitle = document.title;
let tabBlink = null;

document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    let blink = true;
    tabBlink = setInterval(() => {
      document.title = blink ? '💕 กลับมาดูนะ!' : tabTitle;
      blink = !blink;
    }, 1000);
  } else {
    clearInterval(tabBlink);
    document.title = tabTitle;
  }
});

// ==========================================
// Mobile touch: swipe not needed, tap works
// ==========================================
document.addEventListener('touchstart', () => {}, { passive: true });

// ==========================================
// Screensaver: if idle for 10s, animate bg
// ==========================================
let idleTimer = null;
let idleBgInterval = null;

function resetIdle() {
  clearTimeout(idleTimer);
  clearInterval(idleBgInterval);
  document.body.style.backgroundSize = '';
  idleTimer = setTimeout(startIdleAnimation, 10000);
}

function startIdleAnimation() {
  let hue = 0;
  idleBgInterval = setInterval(() => {
    hue = (hue + 1) % 360;
    document.body.style.filter = `hue-rotate(${hue * 0.5}deg)`;
  }, 50);
}

['mousemove', 'keydown', 'click', 'touchstart'].forEach(ev => {
  document.addEventListener(ev, () => {
    document.body.style.filter = '';
    resetIdle();
  });
});
resetIdle();

console.log('%c💕 สวัสดีนะ! ', 'font-size:24px; color:#ff6eb4; font-weight:bold;');
console.log('%c ถ้าอยากรู้ว่าฉันชอบเธอมากแค่ไหน... กด Yes สิ! 💖', 'font-size:14px; color:#a78bfa;');
