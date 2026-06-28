/* ============================================================
   PRASANNA PORTFOLIO — script.js
   ============================================================ */

'use strict';

/* ── 1. Custom Cursor ──────────────────────────────────────── */
(function initCursor() {
  const cursor = document.querySelector('.cursor');
  if (!cursor) return;

  document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top  = e.clientY + 'px';
  });

  document.addEventListener('mousedown', () => cursor.style.transform = 'translate(-50%,-50%) scale(0.7)');
  document.addEventListener('mouseup',   () => cursor.style.transform = 'translate(-50%,-50%) scale(1)');
})();


/* ── 2. Header — shrink on scroll ─────────────────────────── */
(function initHeader() {
  const header = document.getElementById('header');
  if (!header) return;

  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 60);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
})();


/* ── 3. Hamburger / Mobile Navigation ─────────────────────── */
(function initNav() {
  const hamburger = document.getElementById('hamburger');
  const nav       = document.getElementById('nav');
  if (!hamburger || !nav) return;

  const toggle = (open) => {
    hamburger.classList.toggle('active', open);
    nav.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
  };

  hamburger.addEventListener('click', () => {
    const isOpen = nav.classList.contains('open');
    toggle(!isOpen);
  });

  // Close when a nav link is clicked
  nav.querySelectorAll('.nav-link').forEach((link) => {
    link.addEventListener('click', () => toggle(false));
  });

  // Close when clicking outside
  document.addEventListener('click', (e) => {
    if (nav.classList.contains('open') &&
        !nav.contains(e.target) &&
        !hamburger.contains(e.target)) {
      toggle(false);
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('open')) toggle(false);
  });
})();


/* ── 4. Typing / Role Rotator ──────────────────────────────── */
(function initTyping() {
  const el = document.getElementById('typed-role');
  if (!el) return;

  const roles = [
    'Creative Developer',
    'Full Stack Developer',
    'UI / UX Designer',
    'Problem Solver',
  ];

  let roleIdx  = 0;
  let charIdx  = 0;
  let deleting = false;
  let timer;

  const TYPING_SPEED  = 95;
  const DELETING_SPEED = 55;
  const PAUSE_AFTER   = 1800;

  function tick() {
    const current = roles[roleIdx];

    if (!deleting) {
      charIdx++;
      el.textContent = current.slice(0, charIdx);

      if (charIdx === current.length) {
        deleting = true;
        timer = setTimeout(tick, PAUSE_AFTER);
        return;
      }
    } else {
      charIdx--;
      el.textContent = current.slice(0, charIdx);

      if (charIdx === 0) {
        deleting = false;
        roleIdx  = (roleIdx + 1) % roles.length;
      }
    }

    timer = setTimeout(tick, deleting ? DELETING_SPEED : TYPING_SPEED);
  }

  tick();
})();


/* ── 5. Stat Card — 3-D Tilt ──────────────────────────────── */
(function initStatTilt() {
  const cards = document.querySelectorAll('.stat-card');
  const STRENGTH = 18;

  cards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const { left, top, width, height } = card.getBoundingClientRect();
      const x = (e.clientX - left) / width  - 0.5;
      const y = (e.clientY - top)  / height - 0.5;

      card.style.transform =
        `perspective(900px) rotateY(${x * STRENGTH}deg) rotateX(${-y * STRENGTH}deg) translateY(-8px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(900px) rotateX(0) rotateY(0)';
    });
  });
})();


/* ── 6. Service Card — 3-D Tilt ───────────────────────────── */
(function initServiceTilt() {
  const cards = document.querySelectorAll('.service-card');
  const STRENGTH = 16;

  cards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const { left, top, width, height } = card.getBoundingClientRect();
      const x = (e.clientX - left) / width  - 0.5;
      const y = (e.clientY - top)  / height - 0.5;

      card.style.transform =
        `perspective(900px) rotateY(${x * STRENGTH}deg) rotateX(${-y * STRENGTH}deg) translateY(-10px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(900px) rotateX(0) rotateY(0)';
    });
  });
})();


/* ── 7. Project Filter ─────────────────────────────────────── */
(function initFilter() {
  const buttons = document.querySelectorAll('.filter-btn');
  const cards   = document.querySelectorAll('.project-card');

  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      // Update active button
      buttons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      cards.forEach((card) => {
        const show = filter === 'all' || card.classList.contains(filter);
        card.classList.toggle('hidden', !show);
      });
    });
  });
})();


/* ── 8. Scroll Reveal ──────────────────────────────────────── */
(function initScrollReveal() {
  // Add .reveal to all key elements
  const targets = document.querySelectorAll(
    '.stat-card, .service-card, .project-card, .belief, .info-card, ' +
    '.about-right, .hero-content, .section-header'
  );

  targets.forEach((el) => el.classList.add('reveal'));

  if (!('IntersectionObserver' in window)) {
    // Fallback: show everything immediately
    targets.forEach((el) => el.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  targets.forEach((el) => observer.observe(el));
})();


/* ── 9. Contact Form — basic client-side validation ──────── */
(function initForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    const inputs = form.querySelectorAll('input[required], textarea[required]');
    let valid = true;

    inputs.forEach((input) => {
      input.style.borderColor = '';
      if (!input.value.trim()) {
        input.style.borderColor = 'rgba(255,80,80,0.7)';
        valid = false;
      }
    });

    if (!valid) {
      e.preventDefault();
      const first = form.querySelector('[style*="borderColor"]');
      if (first) first.focus();
    }
  });
})();


/* ── 10. Auto-update copyright year ───────────────────────── */
(function initYear() {
  const el = document.getElementById('year');
  if (el) el.textContent = new Date().getFullYear();
})();


/* ── 11. Active nav link on scroll ────────────────────────── */
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach((link) => {
            const href = link.getAttribute('href').replace('#', '');
            link.style.opacity = href === id ? '1' : '0.6';
          });
        }
      });
    },
    { rootMargin: '-40% 0px -55% 0px' }
  );

  sections.forEach((s) => observer.observe(s));
})();
/**
 * ================================================================
 *  PRASANNA PORTFOLIO — bg-script.js
 *  Animated floating-geometry background
 *
 *  Features
 *  ────────
 *  • Canvas 2D, fully GPU-composited via will-change on the element
 *  • requestAnimationFrame loop with delta-time so speed is
 *    frame-rate independent (looks identical at 30, 60 or 120 fps)
 *  • Pauses automatically when the tab is hidden (Page Visibility API)
 *  • Respects prefers-reduced-motion: stops animating, shows static scene
 *  • ResizeObserver → redraws on any viewport change (responsive)
 *  • Reads shape colours from CSS custom properties so dark/light
 *    theme switching just works
 *  • pointer-events: none → never blocks clicks, touch or scroll
 *
 *  HOW TO INTEGRATE
 *  ────────────────
 *  Drop <script src="bg-script.js"></script> before </body> in your
 *  index.html. The canvas element (#bg-canvas) must already exist in
 *  the DOM (see bg-index.html for placement).
 * ================================================================
 */

'use strict';

/* ── Utilities ─────────────────────────────────────────────────── */

/** Return a random float in [min, max) */
const rand = (min, max) => Math.random() * (max - min) + min;

/** Return a random integer in [min, max] */
const randInt = (min, max) => Math.floor(rand(min, max + 1));

/** Linear interpolation */
const lerp = (a, b, t) => a + (b - a) * t;

/** Clamp value between lo and hi */
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

/**
 * Read a CSS custom-property as an "r, g, b" triplet string and
 * return [r, g, b] as numbers. Falls back to [255,255,255] if missing.
 */
function readRGBProp(el, prop) {
  const raw = getComputedStyle(el).getPropertyValue(prop).trim();
  if (!raw) return [255, 255, 255];
  return raw.split(',').map(Number);
}

/* ── Shape Definitions ─────────────────────────────────────────── */

/**
 * All shape types the system can draw.
 * Adding a new type = add a key here and a draw_* function below.
 */
const SHAPE_TYPES = ['triangle', 'square', 'pentagon', 'hexagon', 'circle', 'ring', 'cross'];

/**
 * Draw a regular polygon centred at (0,0) with `sides` sides,
 * circumradius `r`, rotated by `rot` radians.
 * Assumes the canvas context is already translated to centre.
 */
function drawPolygon(ctx, sides, r, rot) {
  ctx.beginPath();
  for (let i = 0; i < sides; i++) {
    const angle = rot + (i / sides) * Math.PI * 2;
    const x = Math.cos(angle) * r;
    const y = Math.sin(angle) * r;
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  }
  ctx.closePath();
}

function draw_triangle(ctx, s) { drawPolygon(ctx, 3, s.size, s.rot); }
function draw_square   (ctx, s) { drawPolygon(ctx, 4, s.size, s.rot); }
function draw_pentagon (ctx, s) { drawPolygon(ctx, 5, s.size, s.rot); }
function draw_hexagon  (ctx, s) { drawPolygon(ctx, 6, s.size, s.rot); }

function draw_circle(ctx, s) {
  ctx.beginPath();
  ctx.arc(0, 0, s.size, 0, Math.PI * 2);
  ctx.closePath();
}

function draw_ring(ctx, s) {
  /* Filled outer ring via arc + reverse inner arc */
  ctx.beginPath();
  ctx.arc(0, 0, s.size,          0, Math.PI * 2, false);
  ctx.arc(0, 0, s.size * 0.55,   0, Math.PI * 2, true);
  ctx.closePath();
}

function draw_cross(ctx, s) {
  const arm = s.size;
  const w   = arm * 0.3;
  ctx.beginPath();
  ctx.save();
  ctx.rotate(s.rot);
  /* Horizontal bar */
  ctx.rect(-arm, -w / 2, arm * 2, w);
  /* Vertical bar (fill rule handles overlap correctly) */
  ctx.rect(-w / 2, -arm, w, arm * 2);
  ctx.restore();
  /* Cross already has its own rotation via ctx.rotate above,
     so we skip the global rot in the main draw call for this type. */
}

const DRAW_FN = {
  triangle : draw_triangle,
  square   : draw_square,
  pentagon : draw_pentagon,
  hexagon  : draw_hexagon,
  circle   : draw_circle,
  ring     : draw_ring,
  cross    : draw_cross,
};

/* ── Shape Factory ─────────────────────────────────────────────── */

/**
 * Create a single shape descriptor.
 * @param {number} W  - canvas width
 * @param {number} H  - canvas height
 * @param {Array}  palette - array of [r,g,b] triplets
 */
function createShape(W, H, palette) {
  const [r, g, b] = palette[randInt(0, palette.length - 1)];

  /* Shapes can spawn anywhere on screen or just off the edges */
  const margin = 80;
  return {
    type    : SHAPE_TYPES[randInt(0, SHAPE_TYPES.length - 1)],

    /* Position */
    x       : rand(-margin, W + margin),
    y       : rand(-margin, H + margin),

    /* Size: responsive — scales with viewport diagonal */
    size    : rand(8, 34) * (Math.hypot(W, H) / 1800),

    /* Velocity (pixels per second) */
    vx      : rand(-18, 18),
    vy      : rand(-18, 18),

    /* Rotation (radians) */
    rot     : rand(0, Math.PI * 2),
    /* Rotation speed (radians per second) */
    rotSpd  : rand(-0.4, 0.4),

    /* Fill vs stroke — 40 % filled, 60 % outlined */
    filled  : Math.random() < 0.40,

    /* Opacity range for the breathing pulse */
    opBase  : rand(0.04, 0.18),
    opAmp   : rand(0.02, 0.08),   /* pulse amplitude */
    opSpd   : rand(0.3, 1.2),     /* pulse speed (Hz) */
    opPhase : rand(0, Math.PI * 2),

    /* Colour */
    r, g, b,

    /* Stroke width */
    lineW   : rand(0.6, 1.8),
  };
}

/* ── Main Animation Controller ─────────────────────────────────── */

(function AnimatedBackground() {

  /* ── DOM & context ── */
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) {
    console.warn('[bg-script] #bg-canvas not found — background disabled.');
    return;
  }
  const ctx = canvas.getContext('2d', { alpha: true });

  /* ── Reduced-motion check ── */
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── State ── */
  let W = 0, H = 0;
  let shapes  = [];
  let palette = [];
  let rafId   = null;
  let lastTs  = 0;
  let running = false;

  /* Number of shapes: cap at 80 on desktop, 40 on mobile */
  function shapeCount() {
    const area = W * H;
    const raw  = Math.floor(area / 14000);
    const max  = W < 600 ? 40 : 80;
    return clamp(raw, 12, max);
  }

  /* ── Read theme colours from CSS ── */
  function refreshPalette() {
    palette = [
      readRGBProp(document.documentElement, '--shape-color-1'),
      readRGBProp(document.documentElement, '--shape-color-2'),
      readRGBProp(document.documentElement, '--shape-color-3'),
    ];
  }

  /* ── Initialise / resize ── */
  function resize() {
    /* Use devicePixelRatio for crisp rendering on HiDPI screens */
    const dpr = Math.min(window.devicePixelRatio || 1, 2); /* cap at 2× */
    W = window.innerWidth;
    H = window.innerHeight;

    canvas.width  = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    canvas.style.width  = W + 'px';
    canvas.style.height = H + 'px';

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    refreshPalette();
    buildShapes();
  }

  function buildShapes() {
    const n = shapeCount();
    shapes = Array.from({ length: n }, () => createShape(W, H, palette));
  }

  /* ── Drawing ── */
  function draw(ts) {
    /* Delta time in seconds, capped at 100 ms to avoid jumps after tab switch */
    const dt = Math.min((ts - lastTs) / 1000, 0.1);
    lastTs = ts;

    /* Clear */
    ctx.clearRect(0, 0, W, H);

    const now = ts / 1000; /* seconds */

    for (let i = 0; i < shapes.length; i++) {
      const s = shapes[i];

      /* ── Move ── */
      s.x  += s.vx  * dt;
      s.y  += s.vy  * dt;
      s.rot += s.rotSpd * dt;

      /* Wrap around viewport edges (with margin so shapes don't pop in) */
      const m = s.size + 40;
      if (s.x < -m)  s.x = W + m;
      if (s.x > W+m) s.x = -m;
      if (s.y < -m)  s.y = H + m;
      if (s.y > H+m) s.y = -m;

      /* ── Opacity pulse (breathing) ── */
      const op = s.opBase + s.opAmp * Math.sin(now * s.opSpd * Math.PI * 2 + s.opPhase);

      /* ── Draw ── */
      ctx.save();

      /* Translate to shape centre */
      ctx.translate(s.x, s.y);

      /* Rotate (cross handles its own rotation internally) */
      if (s.type !== 'cross') ctx.rotate(s.rot);

      /* Build colour string */
      const color = `rgba(${s.r},${s.g},${s.b},${op.toFixed(3)})`;

      const drawFn = DRAW_FN[s.type];
      if (!drawFn) { ctx.restore(); continue; }

      drawFn(ctx, s);

      if (s.filled) {
        ctx.fillStyle = color;
        ctx.fill();
      } else {
        ctx.strokeStyle = color;
        ctx.lineWidth   = s.lineW;
        ctx.stroke();
      }

      ctx.restore();
    }
  }

  /* ── Animation loop ── */
  function loop(ts) {
    if (!running) return;
    draw(ts);
    rafId = requestAnimationFrame(loop);
  }

  function start() {
    if (running) return;
    running = true;
    lastTs  = performance.now();
    rafId   = requestAnimationFrame(loop);
  }

  function stop() {
    running = false;
    if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
  }

  /* ── Page Visibility API — pause when tab is hidden ── */
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      stop();
    } else {
      lastTs = performance.now(); /* reset dt so no jump */
      start();
    }
  });

  /* ── ResizeObserver — respond to any size change ── */
  const ro = new ResizeObserver(() => {
    /* Debounce — only act 80 ms after the last resize event */
    clearTimeout(ro._t);
    ro._t = setTimeout(resize, 80);
  });
  ro.observe(document.documentElement);

  /* ── Theme toggle ── */
  const themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const html = document.documentElement;
      const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      html.setAttribute('data-theme', next);
      /* Re-read colours from CSS after the attribute flips */
      refreshPalette();
      /* Recolour existing shapes so the transition is instant */
      shapes.forEach(s => {
        const [r, g, b] = palette[randInt(0, palette.length - 1)];
        s.r = r; s.g = g; s.b = b;
      });
    });
  }

  /* ── Reduced motion: draw once, don't animate ── */
  if (prefersReduced) {
    resize();
    /* Draw a single static frame */
    lastTs = performance.now();
    draw(lastTs);
    return; /* do not start the RAF loop */
  }

  /* ── Kick everything off ── */
  resize();
  start();

})();