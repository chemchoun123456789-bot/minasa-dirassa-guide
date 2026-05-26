"use strict";

const canvas = document.getElementById("starsCanvas");
const ctx = canvas.getContext("2d");
let stars = [];
let mouseX = 0,
  mouseY = 0,
  targetMX = 0,
  targetMY = 0;

function initStars() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  stars = [];
  /* Reduce particle count on mobile for better performance */
  const isMobile = window.innerWidth < 900;
  const m = isMobile ? 0.45 : 1;
  createStars(Math.round(280 * m), 0.8, 0.14, 0.34, 0);
  createStars(Math.round(140 * m), 1.6, 0.3, 0.58, 1);
  createStars(Math.round(55 * m), 2.4, 0.5, 0.85, 2);
}
function createStars(count, size, speed, opacity, layer) {
  for (let i = 0; i < count; i++) {
    stars.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size,
      speed,
      opacity,
      baseOpacity: opacity,
      twinkleSpeed: 0.003 + Math.random() * 0.007,
      twinklePhase: Math.random() * Math.PI * 2,
      layer,
    });
  }
}
function animateStars() {
  targetMX += (mouseX - targetMX) * 0.04;
  targetMY += (mouseY - targetMY) * 0.04;
  const grad = ctx.createRadialGradient(
    canvas.width / 2,
    canvas.height,
    0,
    canvas.width / 2,
    canvas.height,
    canvas.height,
  );
  grad.addColorStop(0, "#111a36");
  grad.addColorStop(0.4, "#070d1e");
  grad.addColorStop(1, "#020508");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const ps = [0.006, 0.014, 0.026];
  for (const s of stars) {
    s.twinklePhase += s.twinkleSpeed;
    const tw = s.baseOpacity + Math.sin(s.twinklePhase) * 0.14;
    ctx.fillStyle = `rgba(255,255,255,${Math.max(0, Math.min(1, tw))})`;
    ctx.beginPath();
    ctx.arc(
      s.x + targetMX * ps[s.layer],
      s.y + targetMY * ps[s.layer],
      s.size / 2,
      0,
      Math.PI * 2,
    );
    ctx.fill();
    s.y -= s.speed;
    if (s.y < -s.size) {
      s.y = canvas.height + s.size;
      s.x = Math.random() * canvas.width;
    }
  }
  requestAnimationFrame(animateStars);
}
window.addEventListener("mousemove", (e) => {
  mouseX = e.clientX - window.innerWidth / 2;
  mouseY = e.clientY - window.innerHeight / 2;
});
initStars();
animateStars();

const progressBar = document.getElementById("scrollProgress");
window.addEventListener(
  "scroll",
  () => {
    if (window.innerWidth <= 900 || !progressBar) return;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progressBar.style.width =
      (max > 0 ? (window.scrollY / max) * 100 : 0) + "%";
  },
  { passive: true },
);

const SECTIONS = [
  {
    id: "sec-why",
    color: "amber",
    name: "لماذا منصة دراسة؟",
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
  },
  {
    id: "sec-account",
    color: "blue",
    name: "الحساب والدخول",
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`,
  },
  {
    id: "sec-schedule",
    color: "blue",
    name: "الجدول الدراسي",
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`,
  },
  {
    id: "sec-tasks",
    color: "green",
    name: "المهام والتقدم",
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
  },
  {
    id: "sec-pomo",
    color: "red",
    name: "مؤقت بومودورو",
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
  },
  {
    id: "sec-notes",
    color: "purple",
    name: "الملاحظات",
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>`,
  },
  {
    id: "sec-stats",
    color: "amber",
    name: "الإحصائيات",
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>`,
  },
  {
    id: "sec-grades",
    color: "red",
    name: "تتبع الدرجات",
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>`,
  },
  {
    id: "sec-exams",
    color: "cyan",
    name: "الفروض والامتحانات",
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><line x1="8" y1="14" x2="8" y2="14"/><line x1="12" y1="14" x2="12" y2="14"/><line x1="16" y1="14" x2="16" y2="14"/></svg>`,
  },
  {
    id: "sec-resources",
    color: "teal",
    name: "الموارد والروابط",
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>`,
  },
  {
    id: "sec-focus",
    color: "blue",
    name: "وضع التركيز",
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`,
  },
  {
    id: "sec-search",
    color: "blue",
    name: "البحث السريع",
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`,
  },
  {
    id: "sec-privacy",
    color: "green",
    name: "الخصوصية والأمان",
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
  },
  {
    id: "sec-settings",
    color: "purple",
    name: "الإعدادات",
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`,
  },
];

const TOC_ICON = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>`;

const pageWrap = document.querySelector(".page-wrap");
const sectionEls = Array.from(document.querySelectorAll(".section[id]"));

let activeIdx = 0;

const reducedMotion = window.matchMedia(
  "(prefers-reduced-motion:reduce)",
).matches;

function initReveal() {
  if (reducedMotion) {
    sectionEls.forEach((s) => s.classList.add("visible"));
    return;
  }
  const revObs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("visible");
          revObs.unobserve(e.target);
        }
      });
    },
    { threshold: 0.07, rootMargin: "0px 0px -50px 0px" },
  );
  sectionEls.forEach((s) => revObs.observe(s));
}
initReveal();

document.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener("click", (e) => {
    const href = a.getAttribute("href");
    if (href === "#") return;
    e.preventDefault();
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

function setActive(i) {
  activeIdx = i;

  document.querySelectorAll("#bubbleNav .bubble-item").forEach((item, j) => {
    const isActive = j === i + 1;
    item.classList.toggle("active", isActive);
  });

  document.querySelectorAll("#mobileDotNav .mdot").forEach((dot, j) => {
    dot.classList.toggle("active", j === i);
  });

  document.querySelectorAll(".toc-item").forEach((item) => {
    const href = item.getAttribute("href") || "";
    const secId = sectionEls[i]?.id;
    item.classList.toggle("active", !!secId && href === "#" + secId);
  });
}

const actObs = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        const idx = sectionEls.indexOf(e.target);
        if (idx !== -1) setActive(idx);
      }
    });
  },
  { rootMargin: "-35% 0px -55% 0px", threshold: 0 },
);
sectionEls.forEach((s) => actObs.observe(s));

const heroEl = document.querySelector(".hero");
if (heroEl) {
  const tocTopObs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          document
            .querySelectorAll("#bubbleNav .bubble-item")
            .forEach((item, j) => {
              item.classList.toggle("active", j === 0);
            });
          document.querySelectorAll("#mobileDotNav .mdot").forEach((dot) => {
            dot.classList.remove("active");
          });
        }
      });
    },
    { rootMargin: "0px 0px -80% 0px", threshold: 0 },
  );
  tocTopObs.observe(heroEl);
}

function buildDesktopBubbles() {
  const nav = document.getElementById("bubbleNav");
  if (!nav) return;
  nav.innerHTML = "";

  const tocItem = makeBubbleItem({
    name: "فهرس المحتويات",
    color: "blue",
    icon: TOC_ICON,
    onClick: () => {
      const tocEl = document.querySelector(".toc");
      if (tocEl) tocEl.scrollIntoView({ behavior: "smooth", block: "start" });
      else window.scrollTo({ top: 0, behavior: "smooth" });
    },
  });
  tocItem.classList.add("active");
  nav.appendChild(tocItem);

  const sep = document.createElement("div");
  sep.className = "bubble-sep";
  nav.appendChild(sep);

  SECTIONS.forEach((sec, i) => {
    const el = document.getElementById(sec.id);
    const item = makeBubbleItem({
      name: sec.name,
      color: sec.color,
      icon: sec.icon,
      onClick: () => el?.scrollIntoView({ behavior: "smooth", block: "start" }),
    });
    item.dataset.color = sec.color;
    nav.appendChild(item);
  });
}

function makeBubbleItem({ name, color, icon, onClick }) {
  const item = document.createElement("div");
  item.className = "bubble-item";
  item.dataset.color = color;
  item.setAttribute("role", "button");
  item.setAttribute("tabindex", "0");
  item.setAttribute("aria-label", name);

  const iconWrap = document.createElement("div");
  iconWrap.className = "bubble-icon-wrap";
  iconWrap.innerHTML = icon;

  const label = document.createElement("span");
  label.className = "bubble-label";
  label.textContent = name;

  item.appendChild(label);
  item.appendChild(iconWrap);

  item.addEventListener("click", onClick);
  item.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onClick();
    }
  });
  return item;
}

function buildMobileDots() {
  const bar = document.getElementById("mobileDotNav");
  if (!bar) return;
  bar.innerHTML = "";

  SECTIONS.forEach((sec, i) => {
    const dot = document.createElement("button");
    dot.className = `mdot c-${sec.color}`;
    dot.setAttribute("aria-label", sec.name);
    dot.addEventListener("click", () => {
      const el = document.getElementById(sec.id);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    });
    bar.appendChild(dot);
  });
}

function scrollToSection(idx) {
  const clamped = Math.max(0, Math.min(idx, SECTIONS.length - 1));
  const el = document.getElementById(SECTIONS[clamped].id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

document.addEventListener("keydown", (e) => {
  const tag = document.activeElement?.tagName;
  if (tag === "INPUT" || tag === "TEXTAREA") return;
  if (e.key === "ArrowDown" || e.key === "ArrowRight") {
    e.preventDefault();
    scrollToSection(activeIdx + 1);
  }
  if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
    e.preventDefault();
    scrollToSection(activeIdx - 1);
  }
});

function addKeyboardHint() {
  if (window.innerWidth <= 900) return;
  if (document.getElementById("keyboardHint")) return;
  const hint = document.createElement("div");
  hint.id = "keyboardHint";
  hint.innerHTML = `<kbd>↑</kbd><span style="color:rgba(255,255,255,0.28)">أو</span><kbd>↓</kbd><span>للتنقل بين الأقسام</span>`;
  document.body.appendChild(hint);
}

function initCardGlow() {
  if (window.innerWidth <= 900) return;
  const colorMap = {
    blue: "rgba(59,130,246,0.08)",
    cyan: "rgba(6,182,212,0.08)",
    green: "rgba(16,185,129,0.08)",
    amber: "rgba(245,158,11,0.08)",
    red: "rgba(244,63,94,0.08)",
    purple: "rgba(139,92,246,0.08)",
    pink: "rgba(236,72,153,0.08)",
    teal: "rgba(20,184,166,0.08)",
  };
  document.querySelectorAll(".card").forEach((card) => {
    const secIcon = card.closest(".section")?.querySelector(".section-icon");
    const color = secIcon
      ? [...secIcon.classList].find((c) => colorMap[c])
      : "blue";
    const glow = colorMap[color] || colorMap.blue;
    card.addEventListener("mouseenter", () => {
      card.style.boxShadow = `inset 0 1px 0 rgba(255,255,255,0.08),0 20px 56px rgba(0,0,0,0.38),0 0 40px ${glow}`;
    });
    card.addEventListener("mouseleave", () => {
      card.style.boxShadow = "";
    });
  });
}

function initParallax() {
  if (reducedMotion || window.innerWidth <= 900) return;
  const hero = document.querySelector(".hero");
  if (!hero) return;
  window.addEventListener(
    "scroll",
    () => {
      const y = window.scrollY;
      hero.style.transform = `translateY(${y * 0.18}px)`;
      hero.style.opacity = Math.max(0, 1 - y / 420);
    },
    { passive: true },
  );
}

window.addEventListener("load", () => {
  buildDesktopBubbles();
  buildMobileDots();
  addKeyboardHint();
  initCardGlow();
  initParallax();
  setActive(0);
});

let resizeTimer;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    initStars();
    buildDesktopBubbles();
    buildMobileDots();
    addKeyboardHint();
  }, 220);
});
