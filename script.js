/* ===================================================
   💌 CONFESSION PAGE — script.js
   Full-featured, maximalist JS
   =================================================== */

"use strict";

/* ─────────────────────────────────────────────────────
   CONFIG & DATA
   ───────────────────────────────────────────────────── */

const STORY_LINES = [
  "รู้มั้ย... ช่วงนี้ฉันนึกถึงแกบ่อยมากเลย 🌸",
  "ทุกครั้งที่เห็นแก ใจมันเต้นแรงขึ้นทุกที 💓",
  "อยากคุยด้วยตลอดเวลาเลยอ่ะ ทำไมวะ 🤔",
  "แล้วก็... ยิ้มทุกทีที่ได้รับข้อความจากแก 😊",
];

const FEELINGS = [
  "🌸 ตื่นเต้น", "💭 คิดถึงบ่อย", "😊 มีความสุข",
  "🦋 ใจเต้นแรง", "☕ อยากนั่งคุย", "🌙 นึกถึงก่อนนอน",
  "🎶 ฟังเพลงแล้วนึกถึง", "🥺 อยากอยู่ด้วยกัน",
  "✨ รู้สึกดีทุกครั้ง", "💌 อยากส่งข้อความ",
];

const CONFETTI_COLORS = [
  "#ff6b9d","#ffb347","#7ee8c5","#87ceeb",
  "#c8a4e8","#fff176","#ff80ab","#b2ff59",
];

const HEART_EMOJIS = ["💗","💖","💝","💞","💓","💕","❤️","🩷"];
const SPARKLE_CHARS = ["✨","⭐","🌟","💫","✦","✧"];

let currentStep = 0;
let noClickCount = 0;
let noButtonActive = true;
let floatHeartTimer = null;
let ambientHeartTimer = null;
let heartAnimFrame = null;
let feelingsSelected = 0;

/* ─────────────────────────────────────────────────────
   ELEMENT REFS
   ───────────────────────────────────────────────────── */

const scene        = document.getElementById("scene");
const bgLayer      = document.getElementById("bgLayer");
const firefliesEl  = document.getElementById("fireflies");
const confettiEl   = document.getElementById("confettiContainer");
const progressDots = document.querySelectorAll(".dot");

const cardIntro    = document.getElementById("card-intro");
const cardStory    = document.getElementById("card-story");
const cardFeelings = document.getElementById("card-feelings");
const cardQuestion = document.getElementById("card-question");
const cardYes      = document.getElementById("card-yes");

const btnStart  = document.getElementById("btnStart");
const btnNext1  = document.getElementById("btnNext1");
const btnNext2  = document.getElementById("btnNext2");
const btnYes    = document.getElementById("btnYes");
const btnNo     = document.getElementById("btnNo");
const btnRestart = document.getElementById("btnRestart");

/* ─────────────────────────────────────────────────────
   BACKGROUND PARTICLES
   ───────────────────────────────────────────────────── */

function createBgParticles() {
  const colors = ["#ffb3cc","#c8a4e8","#87ceeb","#7ee8c5","#ffe066"];
  for (let i = 0; i < 28; i++) {
    const el = document.createElement("div");
    el.className = "bg-particle";
    const size = rand(20, 80);
    const color = colors[Math.floor(rand(0, colors.length))];
    el.style.cssText = `
      width:${size}px; height:${size}px;
      left:${rand(0,100)}%;
      background: radial-gradient(circle, ${color} 0%, transparent 70%);
      animation-duration: ${rand(12,30)}s;
      animation-delay: -${rand(0,20)}s;
    `;
    bgLayer.appendChild(el);
  }
}

/* ─────────────────────────────────────────────────────
   FIREFLIES
   ───────────────────────────────────────────────────── */

function createFireflies() {
  for (let i = 0; i < 22; i++) {
    const el = document.createElement("div");
    el.className = "firefly";
    el.style.cssText = `
      left: ${rand(5,95)}%;
      top:  ${rand(5,95)}%;
      --dx:  ${rand(-120,120)}px;
      --dy:  ${rand(-120,120)}px;
      --dx2: ${rand(-200,200)}px;
      --dy2: ${rand(-200,200)}px;
      animation-duration: ${rand(6,16)}s;
      animation-delay:   -${rand(0,12)}s;
      width:  ${rand(4,8)}px;
      height: ${rand(4,8)}px;
    `;
    firefliesEl.appendChild(el);
  }
}

/* ─────────────────────────────────────────────────────
   AMBIENT WOBBLE HEARTS (background decoration)
   ───────────────────────────────────────────────────── */

function createWobbleHearts() {
  const emojis = ["💗","🌸","✦","💫","🌷","⭐"];
  for (let i = 0; i < 16; i++) {
    const el = document.createElement("div");
    el.className = "wobble-heart";
    const sz = rand(20, 55);
    el.style.cssText = `
      left: ${rand(0,100)}%;
      top:  ${rand(0,100)}%;
      --sz: ${sz}px;
      font-size: ${sz}px;
      --wx: ${rand(-30,30)}px;
      --wy: ${rand(-30,30)}px;
      animation-duration: ${rand(4,10)}s;
      animation-delay: -${rand(0,8)}s;
    `;
    el.textContent = emojis[Math.floor(rand(0, emojis.length))];
    document.body.appendChild(el);
  }
}

/* ─────────────────────────────────────────────────────
   FLOATING HEARTS (continuous ambient)
   ───────────────────────────────────────────────────── */

function spawnFloatHeart() {
  const el = document.createElement("div");
  el.className = "float-heart";
  const emoji = HEART_EMOJIS[Math.floor(rand(0, HEART_EMOJIS.length))];
  el.textContent = emoji;
  el.style.cssText = `
    left: ${rand(5,90)}%;
    bottom: ${rand(0,15)}%;
    font-size: ${rand(16,36)}px;
    --r0: ${rand(-20,20)}deg;
    --r1: ${rand(-25,25)}deg;
    animation-duration: ${rand(3,6)}s;
  `;
  document.body.appendChild(el);
  el.addEventListener("animationend", () => el.remove());
}

function startFloatingHearts(interval = 900) {
  stopFloatingHearts();
  spawnFloatHeart();
  floatHeartTimer = setInterval(spawnFloatHeart, interval);
}

function stopFloatingHearts() {
  if (floatHeartTimer) { clearInterval(floatHeartTimer); floatHeartTimer = null; }
}

/* ─────────────────────────────────────────────────────
   SPARKLE BURST (on click / celebrate)
   ───────────────────────────────────────────────────── */

function spawnSparkles(x, y, count = 8) {
  for (let i = 0; i < count; i++) {
    const el = document.createElement("div");
    el.className = "sparkle";
    el.textContent = SPARKLE_CHARS[Math.floor(rand(0, SPARKLE_CHARS.length))];
    const angle = (i / count) * Math.PI * 2;
    const dist  = rand(40, 100);
    el.style.cssText = `
      left: ${x}px; top: ${y}px;
      --sx: ${Math.cos(angle) * dist}px;
      --sy: ${Math.sin(angle) * dist}px;
      font-size: ${rand(14,28)}px;
      animation-delay: ${i * 0.04}s;
    `;
    document.body.appendChild(el);
    el.addEventListener("animationend", () => el.remove());
  }
}

document.addEventListener("click", (e) => {
  if (currentStep >= 3) {
    spawnSparkles(e.clientX, e.clientY, 6);
  }
});

/* ─────────────────────────────────────────────────────
   CONFETTI
   ───────────────────────────────────────────────────── */

function launchConfetti(count = 120) {
  for (let i = 0; i < count; i++) {
    setTimeout(() => {
      const el = document.createElement("div");
      el.className = "confetti-piece";
      const color = CONFETTI_COLORS[Math.floor(rand(0, CONFETTI_COLORS.length))];
      const w = rand(6, 14); const h = rand(8, 18);
      el.style.cssText = `
        left: ${rand(0,100)}%;
        width: ${w}px; height: ${h}px;
        background: ${color};
        transform: rotate(${rand(0,360)}deg);
        animation-duration: ${rand(2.5,5)}s;
        animation-delay: ${rand(0,0.5)}s;
        border-radius: ${rand(0,50)}%;
      `;
      confettiEl.appendChild(el);
      el.addEventListener("animationend", () => el.remove());
    }, i * 18);
  }
}

/* ─────────────────────────────────────────────────────
   HEART CANVAS (step 3 bg)
   ───────────────────────────────────────────────────── */

function initHeartCanvas() {
  const canvas = document.getElementById("heartCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  function resize() {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener("resize", resize);

  const particles = [];
  for (let i = 0; i < 50; i++) {
    particles.push({
      t: rand(0, Math.PI * 2),
      speed: rand(0.005, 0.018),
      size: rand(4, 14),
      alpha: rand(0.05, 0.25),
      color: CONFETTI_COLORS[Math.floor(rand(0, CONFETTI_COLORS.length))],
      drift: rand(-0.5, 0.5),
      driftSpeed: rand(0.002, 0.008),
    });
  }

  function heartX(t) { return 16 * Math.pow(Math.sin(t), 3); }
  function heartY(t) { return -(13*Math.cos(t) - 5*Math.cos(2*t) - 2*Math.cos(3*t) - Math.cos(4*t)); }

  function draw() {
    if (!canvas.isConnected) { cancelAnimationFrame(heartAnimFrame); return; }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const cx = canvas.width / 2, cy = canvas.height / 2;
    const scale = Math.min(canvas.width, canvas.height) / 36;

    particles.forEach(p => {
      p.t += p.speed;
      p.drift += p.driftSpeed;
      const x = cx + heartX(p.t) * scale + Math.sin(p.drift) * 8;
      const y = cy + heartY(p.t) * scale + Math.cos(p.drift) * 6;
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(x, y, p.size / 2, 0, Math.PI * 2);
      ctx.fill();
    });

    heartAnimFrame = requestAnimationFrame(draw);
  }
  draw();
}

/* ─────────────────────────────────────────────────────
   TYPEWRITER
   ───────────────────────────────────────────────────── */

function typewriter(el, text, speed = 60, cb) {
  el.textContent = "";
  let i = 0;
  function tick() {
    if (i < text.length) {
      el.textContent += text[i++];
      setTimeout(tick, speed);
    } else if (cb) { cb(); }
  }
  tick();
}

/* ─────────────────────────────────────────────────────
   PROGRESS DOTS
   ───────────────────────────────────────────────────── */

function updateDots(step) {
  progressDots.forEach((dot, i) => {
    dot.classList.toggle("active", i === step);
  });
}

/* ─────────────────────────────────────────────────────
   STEP TRANSITIONS
   ───────────────────────────────────────────────────── */

function showCard(incoming) {
  const all = [cardIntro, cardStory, cardFeelings, cardQuestion, cardYes];
  const outgoing = all.find(c => !c.classList.contains("hidden"));

  if (outgoing) {
    outgoing.style.animation = "none";
    outgoing.style.transition = "opacity 0.3s, transform 0.3s";
    outgoing.style.opacity = "0";
    outgoing.style.transform = "scale(0.92) translateY(-20px)";
    setTimeout(() => {
      outgoing.classList.add("hidden");
      outgoing.style.cssText = "";
    }, 320);
  }

  setTimeout(() => {
    incoming.classList.remove("hidden");
    incoming.style.animation = "cardIn 0.7s cubic-bezier(0.34,1.56,0.64,1) both";
  }, outgoing ? 300 : 0);
}

/* ─────────────────────────────────────────────────────
   STEP 0 → 1  (Intro → Story)
   ───────────────────────────────────────────────────── */

btnStart.addEventListener("click", () => {
  spawnSparkles(
    btnStart.getBoundingClientRect().left + btnStart.offsetWidth / 2,
    btnStart.getBoundingClientRect().top,
    10
  );
  currentStep = 1;
  updateDots(1);
  showCard(cardStory);
  buildStoryLines();
  startFloatingHearts(1100);
});

function buildStoryLines() {
  const container = document.getElementById("storyLines");
  container.innerHTML = "";
  STORY_LINES.forEach((line, i) => {
    const el = document.createElement("div");
    el.className = "story-line";
    el.textContent = line;
    el.style.animationDelay = `${0.2 + i * 0.22}s`;
    container.appendChild(el);
  });
  // Show next button after last line
  const delay = 0.2 + STORY_LINES.length * 0.22 + 0.4;
  setTimeout(() => {
    btnNext1.style.opacity = "0";
    btnNext1.style.transform = "translateY(14px)";
    btnNext1.style.transition = "opacity 0.5s, transform 0.5s";
    setTimeout(() => {
      btnNext1.style.opacity = "1";
      btnNext1.style.transform = "translateY(0)";
    }, 60);
  }, delay * 1000);
}

/* ─────────────────────────────────────────────────────
   STEP 1 → 2  (Story → Feelings)
   ───────────────────────────────────────────────────── */

btnNext1.addEventListener("click", () => {
  currentStep = 2;
  updateDots(2);
  showCard(cardFeelings);
  buildFeelingChips();
  const feelTitle = document.getElementById("feelTitle");
  setTimeout(() => typewriter(feelTitle, "รู้สึกยังไงกับแก... 🌸", 55), 400);
});

function buildFeelingChips() {
  const grid = document.getElementById("feelingGrid");
  grid.innerHTML = "";
  feelingsSelected = 0;
  FEELINGS.forEach((f, i) => {
    const el = document.createElement("div");
    el.className = "feel-chip";
    el.textContent = f;
    el.style.animationDelay = `${0.1 + i * 0.08}s`;
    el.addEventListener("click", () => {
      el.classList.toggle("active");
      feelingsSelected += el.classList.contains("active") ? 1 : -1;
      spawnSparkles(
        el.getBoundingClientRect().left + el.offsetWidth / 2,
        el.getBoundingClientRect().top + el.offsetHeight / 2,
        5
      );
      if (feelingsSelected >= 3) {
        btnNext2.classList.remove("hidden");
        btnNext2.style.animation = "cardIn 0.5s cubic-bezier(0.34,1.56,0.64,1)";
      } else {
        btnNext2.classList.add("hidden");
      }
    });
    grid.appendChild(el);
  });
}

/* ─────────────────────────────────────────────────────
   STEP 2 → 3  (Feelings → Question)
   ───────────────────────────────────────────────────── */

btnNext2.addEventListener("click", () => {
  currentStep = 3;
  updateDots(3);
  showCard(cardQuestion);
  setTimeout(() => {
    initHeartCanvas();
    const q = document.getElementById("bigQuestion");
    typewriter(q, "ເວົ້າຕົງໆເລີຍເດີະ😅", 65);
  }, 500);
  startFloatingHearts(700);
  setupNoButton();
});

/* ─────────────────────────────────────────────────────
   NO BUTTON — shrinks and escapes
   ───────────────────────────────────────────────────── */

function setupNoButton() {
  noClickCount   = 0;
  noLastFired    = 0;
  noCurrentX     = 0;
  noCurrentY     = 0;
  noButtonActive = true;
  resetNoButton();
  // delay 120ms ให้ card render เสร็จก่อนอ่าน position
  setTimeout(initNoButtonPosition, 120);
}

function resetNoButton() {
  btnNo.style.cssText       = "";
  btnNo.style.position      = "";
  btnNo.style.transition    = "none";
  btnNo.style.animation     = "none";
  btnNo.style.transform     = "none";
  btnNo.textContent         = "ຍັງກ່ອນ... 😅";
  btnNo.style.opacity       = "1";
  btnNo.style.pointerEvents = "auto";
  btnNo.style.display       = "";
}

// ── NO BUTTON — หนีไปเรื่อยๆ 10 ครั้ง แล้วถึงหาย ──
// ไม่มีการหดขนาด, มี animation bounce ทุกครั้งที่หนี
// ใช้ timestamp cooldown กัน double-fire จาก touch→click

const NO_MAX   = 10;
const NO_TEXTS = [
  "ຍັງກ່ອນ... 😅",
  "ຢ່າຟ້າວວ! 🫣",
  "ຖ້າແປປນຶງ 🙈",
  "ຂໍຄິດກ່ອນ 🤔",
  "ຢ່າກົດເລີຍ 😤",
  "ຫນີແລ້ວເດະະ! 🏃",
  "ຈັບບໍ່ໄດ້ດອກກແບຮ່ 🙊",
  "ເຫມື່ອຍແລ້ວນິ 😮‍💨",
  "ຍອມແພ້ສາາເນາະ 🥺",
  "ບ໊າຍບາຍໄປລະ~ 👋",
];

let noLastFired = 0;
let noCurrentX  = 0;
let noCurrentY  = 0;

// วาง btnNo เป็น fixed ตั้งแต่แรก เพื่อให้ขยับได้อิสระ
function initNoButtonPosition() {
  // ไม่ต้องทำอะไร — ปุ่มอยู่ใน flow ปกติ
  // runAwayNoButton จะ translate ใน card เอง
}

function runAwayNoButton() {
  // ขยับในกรอบของ card โดยใช้ translate
  // card กว้างสุด 480px, ปุ่มกว้างประมาณ 140px
  // เลยจำกัด translate ไว้แค่ ±120px x, ±80px y
  const maxX = 110;
  const maxY = 70;

  // สุ่มตำแหน่งใหม่ที่ต่างจากเดิม
  const curX = noCurrentX || 0;
  const curY = noCurrentY || 0;
  let tx, ty, attempts = 0;
  do {
    tx = rand(-maxX, maxX);
    ty = rand(-maxY, maxY);
    attempts++;
  } while (attempts < 20 && Math.abs(tx - curX) < 50 && Math.abs(ty - curY) < 50);

  noCurrentX = tx;
  noCurrentY = ty;

  btnNo.style.transition = "transform 0.38s cubic-bezier(0.34,1.56,0.64,1)";
  btnNo.style.transform  = `translate(${tx}px, ${ty}px)`;

  // wiggle หลังถึงที่
  setTimeout(() => {
    btnNo.style.transition = "transform 0.38s cubic-bezier(0.34,1.56,0.64,1)";
    btnNo.style.animation  = "none";
    void btnNo.offsetWidth;
    btnNo.style.animation  = "noWiggle 0.4s ease";
  }, 400);
}

// inject keyframes สำหรับ wiggle
(function injectNoStyles() {
  const s = document.createElement("style");
  s.textContent = `
    @keyframes noWiggle {
      0%   { transform: rotate(0deg) scale(1); }
      20%  { transform: rotate(-10deg) scale(1.08); }
      40%  { transform: rotate(10deg)  scale(1.08); }
      60%  { transform: rotate(-6deg)  scale(1.04); }
      80%  { transform: rotate(4deg)   scale(1.02); }
      100% { transform: rotate(0deg)   scale(1); }
    }
    @keyframes noVanish {
      0%   { opacity: 1; transform: scale(1) rotate(0); }
      40%  { opacity: 0.8; transform: scale(1.2) rotate(-5deg); }
      100% { opacity: 0; transform: scale(0) rotate(20deg); }
    }
  `;
  document.head.appendChild(s);
})();

function handleNoAction(e) {
  e.preventDefault();
  e.stopPropagation();
  if (!noButtonActive) return;

  const now = Date.now();
  if (now - noLastFired < 700) return; // cooldown 700ms กัน double-fire เด็ดขาด
  noLastFired = now;

  noClickCount++;

  // เปลี่ยนข้อความ
  btnNo.textContent = NO_TEXTS[Math.min(noClickCount - 1, NO_TEXTS.length - 1)];

  if (noClickCount >= NO_MAX) {
    // ครั้งที่ 10 — หายไปพร้อม animation
    noButtonActive = false;
    btnNo.style.pointerEvents = "none";
    btnNo.style.transition    = "transform 0.5s ease, opacity 0.5s ease";
    btnNo.style.transform     = `translate(${noCurrentX}px, ${noCurrentY}px) scale(0) rotate(20deg)`;
    btnNo.style.opacity       = "0";
    setTimeout(() => { btnNo.style.display = "none"; }, 550);
  } else {
    runAwayNoButton();
  }

  showNoReaction(noClickCount);
}

btnNo.addEventListener("touchend", handleNoAction, { passive: false });
btnNo.addEventListener("click",    handleNoAction);

function showNoReaction(count) {
  const reactions = [
    "แกจะกดอีกเหรอ?! 🥲",
    "หนีเก่งมากเลย 😮",
    "แต่ฉันยังรอนะ 💗",
    "ได้เลยๆ ค่อยๆ คิด 🌸",
    "ฮ่าๆ แกซน 😄",
    "กดปุ่มนึงก็ได้นะ 🥺",
    "หาปุ่มใช่อยู่ตรงนั้น 👆",
  ];
  const msg = reactions[Math.min(count - 1, reactions.length - 1)];
  const toast = document.createElement("div");
  toast.textContent = msg;
  toast.style.cssText = `
    position:fixed; bottom:80px; left:50%; transform:translateX(-50%);
    background:rgba(255,107,157,0.9); color:#fff;
    padding:10px 22px; border-radius:100px;
    font-family:'Mitr',sans-serif; font-size:0.95rem;
    z-index:10000; pointer-events:none;
    animation: toastIn 0.4s ease both, toastOut 0.4s ease 2s both;
  `;
  document.body.appendChild(toast);

  // Inline keyframes via style tag
  if (!document.getElementById("toast-kf")) {
    const s = document.createElement("style");
    s.id = "toast-kf";
    s.textContent = `
      @keyframes toastIn  { from{opacity:0;transform:translateX(-50%) translateY(14px)} to{opacity:1;transform:translateX(-50%) translateY(0)} }
      @keyframes toastOut { from{opacity:1} to{opacity:0;transform:translateX(-50%) translateY(-10px)} }
    `;
    document.head.appendChild(s);
  }
  setTimeout(() => toast.remove(), 2500);
}

/* ─────────────────────────────────────────────────────
   YES BUTTON
   ───────────────────────────────────────────────────── */

btnYes.addEventListener("click", () => {
  spawnSparkles(
    btnYes.getBoundingClientRect().left + btnYes.offsetWidth / 2,
    btnYes.getBoundingClientRect().top,
    16
  );
  currentStep = 4;
  updateDots(4);
  if (heartAnimFrame) cancelAnimationFrame(heartAnimFrame);
  showCard(cardYes);
  launchConfetti(160);
  startFloatingHearts(400);
  showYesCard();
});

function showYesCard() {
  const title = document.getElementById("yesTitle");
  setTimeout(() => typewriter(title, "ยินดีด้วยนะ 🎉💕", 70), 500);
  setTimeout(() => {
    launchConfetti(80);
    spawnMegaSparkles();
  }, 1200);
}

function spawnMegaSparkles() {
  for (let i = 0; i < 20; i++) {
    setTimeout(() => {
      spawnSparkles(
        rand(80, window.innerWidth - 80),
        rand(80, window.innerHeight - 80),
        6
      );
    }, i * 120);
  }
}

/* ─────────────────────────────────────────────────────
   RESTART
   ───────────────────────────────────────────────────── */

btnRestart.addEventListener("click", () => {
  stopFloatingHearts();
  currentStep = 0;
  updateDots(0);
  noClickCount = 0;
  noButtonActive = true;

  // Reset No button position
  btnNo.style.cssText = "";
  btnNo.style.display = "";
  btnNo.textContent = "ยังก่อน... 😅";

  // Remove all wobble hearts & float hearts
  document.querySelectorAll(".float-heart, .wobble-heart").forEach(e => e.remove());

  showCard(cardIntro);
  createWobbleHearts();
  startFloatingHearts(1200);
});

/* ─────────────────────────────────────────────────────
   CLICK RIPPLE on body
   ───────────────────────────────────────────────────── */

document.addEventListener("click", (e) => {
  const ripple = document.createElement("div");
  ripple.style.cssText = `
    position:fixed; left:${e.clientX}px; top:${e.clientY}px;
    width:20px; height:20px; border-radius:50%;
    border:2px solid rgba(255,107,157,0.6);
    transform:translate(-50%,-50%) scale(0);
    pointer-events:none; z-index:9998;
    animation: rippleOut 0.6s ease forwards;
  `;
  document.body.appendChild(ripple);
  if (!document.getElementById("ripple-kf")) {
    const s = document.createElement("style");
    s.id = "ripple-kf";
    s.textContent = `
      @keyframes rippleOut {
        to { transform:translate(-50%,-50%) scale(5); opacity:0; }
      }
    `;
    document.head.appendChild(s);
  }
  setTimeout(() => ripple.remove(), 700);
});

/* ─────────────────────────────────────────────────────
   CURSOR TRAIL
   ───────────────────────────────────────────────────── */

let lastTrailTime = 0;
const isTouchDevice = () => window.matchMedia("(pointer: coarse)").matches;

document.addEventListener("mousemove", (e) => {
  if (isTouchDevice()) return; // skip trail on touch screens
  const now = Date.now();
  if (now - lastTrailTime < 60) return;
  lastTrailTime = now;

  const trail = document.createElement("div");
  trail.textContent = HEART_EMOJIS[Math.floor(rand(0, HEART_EMOJIS.length))];
  trail.style.cssText = `
    position:fixed; left:${e.clientX}px; top:${e.clientY}px;
    font-size:${rand(10,22)}px; pointer-events:none;
    z-index:9990; transform:translate(-50%,-50%);
    animation:trailFade 0.9s ease forwards;
  `;
  document.body.appendChild(trail);
  if (!document.getElementById("trail-kf")) {
    const s = document.createElement("style");
    s.id = "trail-kf";
    s.textContent = `
      @keyframes trailFade {
        0%   { opacity:0.9; transform:translate(-50%,-50%) scale(1) rotate(0); }
        100% { opacity:0; transform:translate(-50%,-100%) scale(0.3) rotate(${rand(-30,30)}deg); }
      }
    `;
    document.head.appendChild(s);
  }
  setTimeout(() => trail.remove(), 1000);
});

/* ─────────────────────────────────────────────────────
   SHAKE ANIMATION for card on YES click
   ───────────────────────────────────────────────────── */

btnYes.addEventListener("click", () => {
  if (!document.getElementById("shake-kf")) {
    const s = document.createElement("style");
    s.id = "shake-kf";
    s.textContent = `
      @keyframes cardShake {
        0%,100% { transform: translateX(0) rotate(0); }
        15%  { transform: translateX(-8px) rotate(-2deg); }
        30%  { transform: translateX(8px) rotate(2deg); }
        45%  { transform: translateX(-5px) rotate(-1deg); }
        60%  { transform: translateX(5px) rotate(1deg); }
        75%  { transform: translateX(-3px); }
        90%  { transform: translateX(3px); }
      }
    `;
    document.head.appendChild(s);
  }
  scene.style.animation = "cardShake 0.6s ease";
  scene.addEventListener("animationend", () => { scene.style.animation = ""; }, { once: true });
});

/* ─────────────────────────────────────────────────────
   KEYBOARD SHORTCUT (Enter = Yes when on question step)
   ───────────────────────────────────────────────────── */

document.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && currentStep === 3) {
    btnYes.click();
  }
  if ((e.key === "Escape" || e.key === "ArrowRight") && currentStep < 3) {
    const nextBtns = [btnStart, btnNext1, btnNext2];
    const nb = nextBtns[currentStep];
    if (nb && !nb.classList.contains("hidden")) nb.click();
  }
});

/* ─────────────────────────────────────────────────────
   RANDOM HEART BURSTS (idle on question step)
   ───────────────────────────────────────────────────── */

function startIdleHeartBursts() {
  setInterval(() => {
    if (currentStep !== 3) return;
    const rect = cardQuestion.getBoundingClientRect();
    spawnSparkles(
      rect.left + rand(20, rect.width - 20),
      rect.top  + rand(20, rect.height - 20),
      4
    );
  }, 2200);
}

/* ─────────────────────────────────────────────────────
   TOUCH EVENTS — prevent zoom on double tap
   ───────────────────────────────────────────────────── */

document.addEventListener("touchend", (e) => {
  if (e.touches.length === 0) {
    const touch = e.changedTouches[0];
    spawnSparkles(touch.clientX, touch.clientY, 4);
  }
}, { passive: true });

/* ─────────────────────────────────────────────────────
   PERIODIC CONFETTI SHOWERS
   ───────────────────────────────────────────────────── */

function startPeriodicConfetti() {
  setInterval(() => {
    if (currentStep === 4) {
      launchConfetti(40);
    }
  }, 5000);
}

/* ─────────────────────────────────────────────────────
   UTILITY
   ───────────────────────────────────────────────────── */

function rand(min, max) {
  return Math.random() * (max - min) + min;
}

/* ─────────────────────────────────────────────────────
   PULSING RIPPLES on card borders
   ───────────────────────────────────────────────────── */

function animateBorderGlow() {
  const cards = [cardIntro, cardStory, cardFeelings, cardQuestion, cardYes];
  let hue = 320;
  setInterval(() => {
    hue = (hue + 1) % 360;
    cards.forEach(c => {
      if (!c.classList.contains("hidden")) {
        c.style.borderColor = `hsla(${hue}, 80%, 80%, 0.5)`;
        c.style.boxShadow = `0 20px 60px hsla(${hue}, 70%, 60%, 0.22), 0 4px 16px hsla(${hue}, 70%, 70%, 0.18)`;
      }
    });
  }, 40);
}

/* ─────────────────────────────────────────────────────
   WOBBLE HEARTS (on yes card)
   ───────────────────────────────────────────────────── */

function startYesAmbience() {
  // extra sparkle explosions on yes
  for (let i = 0; i < 8; i++) {
    setTimeout(() => {
      spawnSparkles(
        rand(window.innerWidth * 0.1, window.innerWidth * 0.9),
        rand(window.innerHeight * 0.1, window.innerHeight * 0.9),
        8
      );
    }, i * 400 + 300);
  }
}

btnYes.addEventListener("click", startYesAmbience);

/* ─────────────────────────────────────────────────────
   INIT — runs on page load
   ───────────────────────────────────────────────────── */

(function init() {
  createBgParticles();
  createFireflies();
  createWobbleHearts();
  startFloatingHearts(1200);
  startIdleHeartBursts();
  startPeriodicConfetti();
  animateBorderGlow();
  updateDots(0);
})();
