// =====================
// PARTICLE SYSTEM
// =====================
(function initParticles() {
  const canvas = document.getElementById("particleCanvas");
  if (!canvas || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const ctx = canvas.getContext("2d");
  let particles = [];
  let raf;

  const CONFIG = {
    count: 55,
    maxDist: 130,
    speed: 0.45,
    colors: [
      "rgba(255,122,0,0.7)",
      "rgba(255,177,51,0.6)",
      "rgba(11,60,149,0.65)",
      "rgba(100,150,255,0.5)",
    ],
  };

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function mkParticle() {
    const angle = Math.random() * Math.PI * 2;
    const speed = CONFIG.speed * (0.4 + Math.random() * 0.6);
    return {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      r: 1 + Math.random() * 1.8,
      color: CONFIG.colors[Math.floor(Math.random() * CONFIG.colors.length)],
    };
  }

  function init() {
    resize();
    particles = Array.from({ length: CONFIG.count }, mkParticle);
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < CONFIG.maxDist) {
          const alpha = 0.12 * (1 - dist / CONFIG.maxDist);
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(255,122,0,${alpha})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }

    particles.forEach((p) => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.fill();
    });
  }

  function update() {
    particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
    });
  }

  function loop() {
    update();
    draw();
    raf = requestAnimationFrame(loop);
  }

  init();
  loop();

  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resize, 150);
  });
})();

// =====================
// TYPEWRITER EFFECT
// =====================
(function initTypewriter() {
  const el = document.getElementById("typedText");
  if (!el) return;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    el.textContent = "velocidade real";
    return;
  }

  const words = [
    "velocidade real",
    "streaming sem travar",
    "home office sem queda",
    "jogos sem lag",
    "tudo conectado",
  ];

  let wordIdx = 0;
  let charIdx = 0;
  let deleting = false;

  function tick() {
    const word = words[wordIdx];
    charIdx = deleting ? charIdx - 1 : charIdx + 1;
    el.textContent = word.substring(0, charIdx);

    let delay = deleting ? 55 : 100;

    if (!deleting && charIdx === word.length) {
      delay = 2400;
      deleting = true;
    } else if (deleting && charIdx === 0) {
      deleting = false;
      wordIdx = (wordIdx + 1) % words.length;
      delay = 420;
    }

    setTimeout(tick, delay);
  }

  tick();
})();

// =====================
// COUNTER ANIMATION
// =====================
(function initCounters() {
  const grid = document.querySelector(".counters-grid");
  if (!grid) return;

  function animateNum(el, target, duration) {
    const start = performance.now();
    function step(now) {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = Math.round(eased * target);
      if (t < 1) requestAnimationFrame(step);
      else el.textContent = target;
    }
    requestAnimationFrame(step);
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.querySelectorAll(".counter-num").forEach((num) => {
          const target = parseInt(num.dataset.target, 10);
          animateNum(num, target, 2000);
        });
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.3 }
  );

  observer.observe(grid);
})();

// =====================
// TOPBAR SCROLL
// =====================
const topbar = document.querySelector(".topbar");
window.addEventListener(
  "scroll",
  () => {
    if (topbar) topbar.classList.toggle("is-scrolled", window.scrollY > 40);
  },
  { passive: true }
);

// =====================
// MOBILE MENU
// =====================
const menuToggle = document.querySelector(".menu-toggle");
if (menuToggle && topbar) {
  menuToggle.addEventListener("click", () => {
    document.body.classList.toggle("menu-open");
    menuToggle.setAttribute(
      "aria-expanded",
      String(document.body.classList.contains("menu-open"))
    );
  });

  topbar.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      document.body.classList.remove("menu-open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });
}

// =====================
// REVEAL ON SCROLL
// =====================
const reveals = document.querySelectorAll(".reveal");
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: "0px 0px -36px 0px" }
);
reveals.forEach((el) => revealObserver.observe(el));

// =====================
// FAQ ACCORDION
// =====================
document.querySelectorAll(".faq-question").forEach((btn) => {
  btn.addEventListener("click", () => {
    const item = btn.closest(".faq-item");
    const answer = item?.querySelector(".faq-answer");
    if (!item || !answer) return;

    const isOpen = item.classList.contains("is-open");

    document.querySelectorAll(".faq-item").forEach((fi) => {
      fi.classList.remove("is-open");
      const fa = fi.querySelector(".faq-answer");
      if (fa) fa.style.maxHeight = "0px";
    });

    if (!isOpen) {
      item.classList.add("is-open");
      answer.style.maxHeight = `${answer.scrollHeight}px`;
    }
  });
});

// =====================
// TESTIMONIAL SLIDER
// =====================
(function initSlider() {
  const track = document.getElementById("testimonialTrack");
  const prevBtn = document.getElementById("prevTestimonial");
  const nextBtn = document.getElementById("nextTestimonial");
  if (!track || !prevBtn || !nextBtn) return;

  const cards = Array.from(track.children);
  let idx = 0;
  let autoTimer;

  function perView() {
    if (window.innerWidth <= 840) return 1;
    if (window.innerWidth <= 1100) return 2;
    return 3;
  }

  function update() {
    const pv = perView();
    const max = Math.max(0, cards.length - pv);
    idx = Math.min(idx, max);

    const card = cards[0];
    if (!card) return;

    const gap = 22;
    const offset = idx * (card.getBoundingClientRect().width + gap);
    track.style.transform = `translateX(-${offset}px)`;

    prevBtn.disabled = idx === 0;
    nextBtn.disabled = idx === max;
  }

  function goNext() {
    const max = Math.max(0, cards.length - perView());
    idx = idx < max ? idx + 1 : 0;
    update();
  }

  function startAuto() {
    autoTimer = setInterval(goNext, 4500);
  }

  function resetAuto() {
    clearInterval(autoTimer);
    startAuto();
  }

  prevBtn.addEventListener("click", () => {
    idx = Math.max(0, idx - 1);
    update();
    resetAuto();
  });

  nextBtn.addEventListener("click", () => {
    goNext();
    resetAuto();
  });

  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(update, 120);
  });

  update();
  startAuto();
})();

// =====================
// WHATSAPP WIDGET
// =====================
const whatsappWidget = document.getElementById("whatsappWidget");
const whatsappClose = document.getElementById("whatsappClose");
if (whatsappWidget && whatsappClose) {
  whatsappClose.addEventListener("click", () => {
    whatsappWidget.classList.add("is-hidden");
  });
}
