/* ══════════════════════════════════════════════════════
   منصة دراسة — Script Guide (Carousel Edition)
   ══════════════════════════════════════════════════════ */

// ── STARFIELD ──
const canvas = document.getElementById("starsCanvas");
const ctx = canvas.getContext("2d");
let stars = [];
let mouseX = 0,
  mouseY = 0;
let targetMX = 0,
  targetMY = 0;

function initStars() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  stars = [];
  createStars(300, 0.9, 0.16, 0.38, 0);
  createStars(160, 1.7, 0.32, 0.6, 1);
  createStars(65, 2.6, 0.52, 0.88, 2);
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
  grad.addColorStop(0, "#152048");
  grad.addColorStop(0.4, "#080e20");
  grad.addColorStop(1, "#030608");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  const ps = [0.006, 0.014, 0.026];
  for (let s of stars) {
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

// ── SCROLL PROGRESS (Desktop) ──
const progressBar = document.getElementById("scrollProgress");
window.addEventListener(
  "scroll",
  () => {
    if (isMobile() || !progressBar) return;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progressBar.style.width =
      (max > 0 ? (window.scrollY / max) * 100 : 0) + "%";
  },
  { passive: true },
);

function isMobile() {
  return window.innerWidth <= 1100;
}

const COLORS = [
  "blue",
  "cyan",
  "green",
  "amber",
  "red",
  "purple",
  "pink",
  "teal",
];
function getSectionColor(sec) {
  return (
    sec
      .querySelector(".section-icon")
      ?.className.split(" ")
      .find((c) => COLORS.includes(c)) || "blue"
  );
}

// ── DOM references ──
const pageWrap = document.querySelector(".page-wrap");
const heroEl = pageWrap.querySelector(".hero");
const tocEl = pageWrap.querySelector(".toc");
const dividerEl = pageWrap.querySelector(".divider");
const footerEl = pageWrap.querySelector(".footer");
const sectionEls = Array.from(pageWrap.querySelectorAll(".section[id]"));

/* ══════════════════════════════════════════════════════
   DESKTOP
   ══════════════════════════════════════════════════════ */
function setupDesktop() {
  if (pageWrap) pageWrap.style.display = "";

  // Reveal
  const revObs = new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        if (e.isIntersecting) e.target.classList.add("visible");
      }),
    { threshold: 0.06 },
  );
  sectionEls.forEach((s) => revObs.observe(s));

  // Smooth scroll
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const href = a.getAttribute("href");
      // href="#" فقط — تجاهل، onclick يتولى
      if (href === "#") return;
      e.preventDefault();
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  buildDesktopBubbles();

  let activeIdx = 0;
  function setActive(i) {
    activeIdx = i;
    // bubbles: index 0 = TOC, index 1+ = sections (i+1)
    document.querySelectorAll(".bubble-item").forEach((item, j) => {
      const isActive = j === i + 1;
      item.classList.toggle("active", isActive);
      if (isActive) item.dataset.color = getSectionColor(sectionEls[i]);
    });
    // toc-items: لا تُفعّل أول عنصر (لماذا منصة) لأنه ليس section تنقل حقيقي
    document.querySelectorAll(".toc-item").forEach((item) => {
      const href = item.getAttribute("href") || "";
      const secId = sectionEls[i]?.id;
      // تجاهل sec-why وsec-toc-guide من التفعيل التلقائي
      const isNavSection = secId && secId !== "sec-why" && secId !== "sec-toc-guide";
      item.classList.toggle(
        "active",
        isNavSection && href === "#" + secId
      );
    });
  }

  const actObs = new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        if (e.isIntersecting) {
          const idx = sectionEls.indexOf(e.target);
          if (idx !== -1) setActive(idx);
        }
      }),
    { rootMargin: "-35% 0px -55% 0px", threshold: 0 },
  );
  sectionEls.forEach((s) => actObs.observe(s));

  // فقاعة TOC تكون active لما المستخدم في أعلى الصفحة (قبل أول قسم)
  const firstSection = sectionEls[0];
  const tocObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          // أول قسم مرئي = لسه في منطقة الـ TOC/hero
          document.querySelectorAll(".bubble-item").forEach((item, j) => {
            item.classList.toggle("active", j === 0);
          });
        }
      });
    },
    { rootMargin: "0px 0px -80% 0px", threshold: 0 },
  );
  if (firstSection) tocObserver.observe(heroEl || firstSection);

  document.addEventListener("keydown", (e) => {
    if (
      !isMobile() &&
      document.activeElement?.tagName !== "INPUT" &&
      document.activeElement?.tagName !== "TEXTAREA"
    ) {
      if (e.key === "ArrowDown" || e.key === "ArrowRight") {
        e.preventDefault();
        sectionEls[
          Math.min(activeIdx + 1, sectionEls.length - 1)
        ].scrollIntoView({ behavior: "smooth", block: "start" });
      }
      if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
        e.preventDefault();
        sectionEls[Math.max(activeIdx - 1, 0)].scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }
  });

  if (!document.getElementById("keyboardHint")) {
    const hint = document.createElement("div");
    hint.id = "keyboardHint";
    hint.innerHTML = `<kbd>↑</kbd><span style="color:rgba(255,255,255,0.3)">أو</span><kbd>↓</kbd><span>للتنقل بين الأقسام</span>`;
    document.body.appendChild(hint);
  }

  // Card glow
  const cm = {
    blue: "rgba(59,130,246,0.28)",
    cyan: "rgba(6,182,212,0.28)",
    green: "rgba(16,185,129,0.28)",
    amber: "rgba(245,158,11,0.28)",
    red: "rgba(244,63,94,0.28)",
    purple: "rgba(139,92,246,0.28)",
    pink: "rgba(236,72,153,0.28)",
    teal: "rgba(20,184,166,0.28)",
  };
  document.querySelectorAll(".card").forEach((card) => {
    const color = getSectionColor(card.closest(".section"));
    if (!cm[color]) return;
    card.addEventListener("mouseenter", () => {
      card.style.boxShadow = `inset 0 1px 0 rgba(255,255,255,0.07),0 16px 48px rgba(0,0,0,0.35),0 0 32px ${cm[color].replace("0.28", "0.07")}`;
    });
    card.addEventListener("mouseleave", () => {
      card.style.boxShadow = "";
    });
  });

  window.addEventListener("load", () => setActive(0));
}

function buildDesktopBubbles() {
  const nav = document.getElementById("bubbleNav");
  if (!nav) return;
  nav.innerHTML = "";

  // ── فقاعة الفهرس (أول فقاعة — تقود لأعلى الصفحة / TOC) ──
  const tocItem = document.createElement("div");
  tocItem.className = "bubble-item";
  tocItem.dataset.target = "toc";
  tocItem.dataset.color = "blue";
  tocItem.setAttribute("role", "button");
  tocItem.setAttribute("tabindex", "0");
  tocItem.setAttribute("aria-label", "فهرس المحتويات");
  tocItem.innerHTML = `<span class="bubble-label">فهرس المحتويات</span><span class="bubble-dot toc-dot"></span>`;
  tocItem.addEventListener("click", () => {
    const tocEl2 = document.querySelector(".toc");
    if (tocEl2) tocEl2.scrollIntoView({ behavior: "smooth", block: "start" });
    else window.scrollTo({ top: 0, behavior: "smooth" });
  });
  tocItem.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      const tocEl2 = document.querySelector(".toc");
      if (tocEl2) tocEl2.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
  nav.appendChild(tocItem);

  // ── separator صغير ──
  const sep = document.createElement("div");
  sep.style.cssText = "height:6px;width:100%;";
  nav.appendChild(sep);

  // ── فقاعات الأقسام ──
  sectionEls.forEach((sec) => {
    const title =
      sec.querySelector(".section-title")?.textContent?.trim() || "";
    const color = getSectionColor(sec);
    const item = document.createElement("div");
    item.className = "bubble-item";
    item.dataset.target = sec.id;
    item.dataset.color = color;
    item.setAttribute("role", "button");
    item.setAttribute("tabindex", "0");
    item.setAttribute("aria-label", title);
    item.innerHTML = `<span class="bubble-label">${title}</span><span class="bubble-dot"></span>`;
    item.addEventListener("click", () =>
      sec.scrollIntoView({ behavior: "smooth", block: "start" }),
    );
    item.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        sec.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
    nav.appendChild(item);
  });
}

/* ══════════════════════════════════════════════════════
   INIT — desktop فقط على كل الأجهزة
   ══════════════════════════════════════════════════════ */
setupDesktop();

let resizeTimer;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    initStars();
    buildDesktopBubbles();
  }, 200);
});
