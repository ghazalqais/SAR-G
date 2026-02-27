/* ─── CUSTOM CURSOR ─── */
const dot = document.getElementById('cursorDot');
const ring = document.getElementById('cursorRing');
let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX; mouseY = e.clientY;
  dot.style.left = mouseX + 'px';
  dot.style.top = mouseY + 'px';
});

(function animateRing() {
  ringX += (mouseX - ringX) * 0.15;
  ringY += (mouseY - ringY) * 0.15;
  ring.style.left = ringX + 'px';
  ring.style.top = ringY + 'px';
  requestAnimationFrame(animateRing);
})();

document.querySelectorAll('a, button, .stat-card, .step-card, .product-card, .market-card, .silo-btn').forEach(el => {
  el.addEventListener('mouseenter', () => ring.classList.add('hover'));
  el.addEventListener('mouseleave', () => ring.classList.remove('hover'));
});

if ('ontouchstart' in window) {
  dot.style.display = 'none';
  ring.style.display = 'none';
  document.body.style.cursor = 'auto';
}

/* ─── MOBILE NAV AND SCROLL ─── */
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
const nav = document.getElementById('nav');

navToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('mobile-open');
  navToggle.classList.toggle('open', isOpen);
  nav.classList.toggle('force-light', isOpen);
});

navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    navLinks.classList.remove('mobile-open');
    navToggle.classList.remove('open');
    nav.classList.remove('force-light');
  });
});

const heroEl = document.getElementById('hero');
const siloEl = document.getElementById('silo-section');
const marketEl = document.getElementById('market');
const ctaEl = document.getElementById('cta');

function updateNav() {
  const st = window.scrollY;
  nav.classList.toggle('scrolled', st > 80);

  const checkY = st + 60;
  const heroBottom = heroEl.offsetTop + heroEl.offsetHeight;
  const siloTop = siloEl.offsetTop;
  const siloBottom = siloTop + siloEl.offsetHeight;
  const marketTop = marketEl.offsetTop;
  const marketBottom = marketTop + marketEl.offsetHeight;
  const ctaTop = ctaEl.offsetTop;
  const ctaBottom = ctaTop + ctaEl.offsetHeight;

  const onDark = (checkY < heroBottom) ||
    (checkY >= siloTop && checkY < siloBottom) ||
    (checkY >= marketTop && checkY < marketBottom) ||
    (checkY >= ctaTop && checkY < ctaBottom);

  nav.classList.toggle('on-dark', onDark);

  if (st > 80 && onDark) {
    nav.style.background = 'rgba(15, 26, 18, 0.88)';
    nav.style.borderBottomColor = 'rgba(247,245,240,0.06)';
    nav.style.boxShadow = 'none';
  } else if (st > 80) {
    nav.style.background = '';
    nav.style.borderBottomColor = '';
    nav.style.boxShadow = '';
  } else {
    nav.style.background = '';
    nav.style.borderBottomColor = '';
    nav.style.boxShadow = '';
  }
}
window.addEventListener('scroll', updateNav);
updateNav();

/* ─── ACTIVE NAV LINK ─── */
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a');
const observerNav = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navAnchors.forEach(a => a.classList.remove('active'));
      const match = document.querySelector('.nav-links a[data-section="' + entry.target.id + '"]');
      if (match) match.classList.add('active');
    }
  });
}, { threshold: 0.3 });
sections.forEach(s => observerNav.observe(s));

/* ─── HERO PARTICLES — Floating grain seeds ─── */
(function () {
  const canvas = document.getElementById('heroParticles');
  const ctx = canvas.getContext('2d');
  let w, h;
  const particles = [];
  const PARTICLE_COUNT = 60;

  function resize() {
    w = canvas.width = canvas.offsetWidth * devicePixelRatio;
    h = canvas.height = canvas.offsetHeight * devicePixelRatio;
    ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
  }
  resize();
  window.addEventListener('resize', resize);

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push({
      x: Math.random() * (w / devicePixelRatio),
      y: Math.random() * (h / devicePixelRatio),
      size: 1.5 + Math.random() * 2.5,
      speedX: (Math.random() - 0.5) * 0.15,
      speedY: -0.1 - Math.random() * 0.25,
      opacity: 0.08 + Math.random() * 0.12,
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.005
    });
  }

  function draw() {
    const cw = w / devicePixelRatio;
    const ch = h / devicePixelRatio;
    ctx.clearRect(0, 0, cw, ch);

    particles.forEach(p => {
      p.x += p.speedX;
      p.y += p.speedY;
      p.rotation += p.rotSpeed;
      if (p.y < -10) { p.y = ch + 10; p.x = Math.random() * cw; }
      if (p.x < -10) p.x = cw + 10;
      if (p.x > cw + 10) p.x = -10;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.beginPath();
      ctx.ellipse(0, 0, p.size * 0.5, p.size * 1.2, 0, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(196, 146, 42, ' + p.opacity + ')';
      ctx.fill();
      ctx.restore();
    });

    requestAnimationFrame(draw);
  }
  draw();
})();

/* ─── FADE UP ON SCROLL ─── */
const fadeEls = document.querySelectorAll('.fade-up');
const observerFade = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 60);
      observerFade.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });
fadeEls.forEach(el => observerFade.observe(el));

/* ─── ANIMATED COUNTERS ─── */
const counters = document.querySelectorAll('.counter');
const observerCount = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const target = parseFloat(el.dataset.target);
      const suffix = el.dataset.suffix || '';
      const decimals = parseInt(el.dataset.decimals) || 0;
      const duration = 2000;
      const start = performance.now();
      function update(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 3);
        el.textContent = (target * ease).toFixed(decimals) + suffix;
        if (progress < 1) requestAnimationFrame(update);
      }
      requestAnimationFrame(update);
      observerCount.unobserve(el);
    }
  });
}, { threshold: 0.5 });
counters.forEach(c => observerCount.observe(c));

/* ─── SILO VIEW BUTTONS ─── */
document.querySelectorAll('.silo-btn').forEach(btn => {
  btn.addEventListener('click', function () {
    document.querySelectorAll('.silo-btn').forEach(b => b.classList.remove('active'));
    this.classList.add('active');
    if (window.setSiloView) window.setSiloView(this.dataset.view);
  });
});

/* ═══════════════════════════════════════════
   THREE.JS — 3D SILO HEATMAP
   Uses single THREE.Points for grain cloud (perf)
   ═══════════════════════════════════════════ */
(function () {
  const container = document.getElementById('silo-canvas-container');
  if (!container) return;

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x0F1A12, 0.04);

  const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 100);
  camera.position.set(8, 6, 8);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);
  container.appendChild(renderer.domElement);

  const controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.enablePan = false;
  controls.minDistance = 5;
  controls.maxDistance = 18;
  controls.autoRotate = true;
  controls.autoRotateSpeed = 0.5;
  controls.target.set(0, 2, 0);

  /* Silo wireframe */
  const siloRadius = 3, siloHeight = 8, siloSegments = 32;
  const siloGeo = new THREE.CylinderGeometry(siloRadius, siloRadius, siloHeight, siloSegments, 8, true);
  const siloMat = new THREE.MeshBasicMaterial({ color: 0x2A5C3F, wireframe: true, transparent: true, opacity: 0.15 });
  const siloMesh = new THREE.Mesh(siloGeo, siloMat);
  siloMesh.position.y = siloHeight / 2;
  scene.add(siloMesh);

  const circleGeo = new THREE.RingGeometry(0, siloRadius, siloSegments);
  const circleMat = new THREE.MeshBasicMaterial({ color: 0x2A5C3F, wireframe: true, transparent: true, opacity: 0.08, side: THREE.DoubleSide });
  const topCircle = new THREE.Mesh(circleGeo, circleMat);
  topCircle.rotation.x = -Math.PI / 2;
  topCircle.position.y = siloHeight;
  scene.add(topCircle);
  const bottomCircle = topCircle.clone();
  bottomCircle.position.y = 0;
  scene.add(bottomCircle);

  /* Grain fill line */
  const grainLevel = 6.5;
  const grainLineGeo = new THREE.RingGeometry(siloRadius - 0.02, siloRadius + 0.02, siloSegments);
  const grainLineMat = new THREE.MeshBasicMaterial({ color: 0x8A8A85, transparent: true, opacity: 0.2, side: THREE.DoubleSide });
  const grainLine = new THREE.Mesh(grainLineGeo, grainLineMat);
  grainLine.rotation.x = -Math.PI / 2;
  grainLine.position.y = grainLevel;
  scene.add(grainLine);

  /* Danger zone */
  const dangerCenter = new THREE.Vector3(1.2, 3, 0.8);
  const dangerRadius = 1.8;
  const _tmpVec = new THREE.Vector3();

  function getCO2Level(pos) {
    const dist = pos.distanceTo(dangerCenter);
    if (dist < dangerRadius * 0.5) return 2000 + Math.random() * 3000;
    if (dist < dangerRadius) return 800 + Math.random() * 1200;
    return 400 + Math.random() * 400;
  }

  function co2ToColor(co2) {
    if (co2 < 800) {
      const t = (co2 - 400) / 400;
      return new THREE.Color().setHSL(0.33 - t * 0.05, 0.9, 0.5 + t * 0.1);
    }
    if (co2 < 2000) {
      const t = (co2 - 800) / 1200;
      return new THREE.Color().setHSL(0.33 - t * 0.2, 0.9, 0.5 + t * 0.1);
    }
    const t = Math.min((co2 - 2000) / 3000, 1);
    return new THREE.Color().setHSL(0.08 - t * 0.08, 0.95, 0.5 + t * 0.05);
  }

  /* ── SINGLE Points geometry for grain cloud ── */
  const POINT_COUNT = 350;
  const grainPositions = new Float32Array(POINT_COUNT * 3);
  const grainColors = new Float32Array(POINT_COUNT * 3);
  const grainCO2 = new Float32Array(POINT_COUNT);
  const grainOrigColors = new Float32Array(POINT_COUNT * 3);

  for (let i = 0; i < POINT_COUNT; i++) {
    const angle = Math.random() * Math.PI * 2;
    const r = Math.sqrt(Math.random()) * (siloRadius - 0.4);
    const y = Math.random() * (grainLevel - 0.5) + 0.3;
    const x = Math.cos(angle) * r;
    const z = Math.sin(angle) * r;

    grainPositions[i * 3] = x;
    grainPositions[i * 3 + 1] = y;
    grainPositions[i * 3 + 2] = z;

    _tmpVec.set(x, y, z);
    const co2 = getCO2Level(_tmpVec);
    grainCO2[i] = co2;

    const col = co2ToColor(co2);
    grainColors[i * 3] = col.r;
    grainColors[i * 3 + 1] = col.g;
    grainColors[i * 3 + 2] = col.b;
    grainOrigColors[i * 3] = col.r;
    grainOrigColors[i * 3 + 1] = col.g;
    grainOrigColors[i * 3 + 2] = col.b;
  }

  const grainGeo = new THREE.BufferGeometry();
  grainGeo.setAttribute('position', new THREE.BufferAttribute(grainPositions, 3));
  grainGeo.setAttribute('color', new THREE.BufferAttribute(grainColors, 3));

  const grainMat = new THREE.PointsMaterial({
    size: 0.12,
    vertexColors: true,
    transparent: true,
    opacity: 0.75,
    sizeAttenuation: true,
    depthWrite: false
  });
  const grainCloud = new THREE.Points(grainGeo, grainMat);
  scene.add(grainCloud);

  /* ── PROBE — single small sphere ── */
  const probeGeo = new THREE.SphereGeometry(0.18, 12, 12);
  const probeMat = new THREE.MeshBasicMaterial({ color: 0x3AC8FF });
  const probe = new THREE.Mesh(probeGeo, probeMat);
  scene.add(probe);

  const glowGeo = new THREE.SphereGeometry(0.32, 12, 12);
  const glowMat = new THREE.MeshBasicMaterial({ color: 0x3AC8FF, transparent: true, opacity: 0.12 });
  const probeGlow = new THREE.Mesh(glowGeo, glowMat);
  probe.add(probeGlow);

  /* Probe path (Catmull-Rom) */
  const probePath = [
    new THREE.Vector3(0, 6, 0),
    new THREE.Vector3(0.5, 5, 0.5),
    new THREE.Vector3(-1, 4, 1),
    new THREE.Vector3(-0.5, 3.5, -0.5),
    new THREE.Vector3(0, 3, 0),
    new THREE.Vector3(0.8, 2.5, 0.5),
    new THREE.Vector3(1.0, 3.0, 0.8),
    new THREE.Vector3(1.2, 3.0, 0.8),
    new THREE.Vector3(1.3, 2.8, 0.9),
    new THREE.Vector3(1.0, 2.5, 0.6),
    new THREE.Vector3(0.5, 2, -0.5),
    new THREE.Vector3(-0.8, 1.5, 0.3),
    new THREE.Vector3(-1.5, 1, -1),
    new THREE.Vector3(0, 0.8, 0.5),
    new THREE.Vector3(0.5, 1.5, -1),
    new THREE.Vector3(0, 3, 0),
    new THREE.Vector3(0, 5, 0),
    new THREE.Vector3(0, 6, 0),
  ];

  /* Trail line */
  const maxTrailPoints = 80;
  const trailPositions = new Float32Array(maxTrailPoints * 3);
  const trailGeo = new THREE.BufferGeometry();
  trailGeo.setAttribute('position', new THREE.BufferAttribute(trailPositions, 3));
  const trailMat = new THREE.LineBasicMaterial({ color: 0x3AC8FF, transparent: true, opacity: 0.25 });
  const trailLine = new THREE.Line(trailGeo, trailMat);
  scene.add(trailLine);
  let trailIndex = 0;

  /* Path preview line */
  const pathLineGeo = new THREE.BufferGeometry().setFromPoints(probePath);
  const pathLineMat = new THREE.LineBasicMaterial({ color: 0x3AC8FF, transparent: true, opacity: 0.0 });
  const pathLine = new THREE.Line(pathLineGeo, pathLineMat);
  scene.add(pathLine);

  /* ── SPRAY — single Points geometry, pooled ── */
  const MAX_SPRAY = 200;
  const sprayPos = new Float32Array(MAX_SPRAY * 3);
  const sprayVel = new Float32Array(MAX_SPRAY * 3);
  const sprayLife = new Float32Array(MAX_SPRAY);
  const sprayDecay = new Float32Array(MAX_SPRAY);
  let sprayCount = 0;

  const sprayGeo = new THREE.BufferGeometry();
  sprayGeo.setAttribute('position', new THREE.BufferAttribute(sprayPos, 3));
  sprayGeo.setDrawRange(0, 0);
  const sprayMat = new THREE.PointsMaterial({
    color: 0x3AC8FF, size: 0.06, transparent: true, opacity: 0.7, sizeAttenuation: true, depthWrite: false
  });
  const sprayCloud = new THREE.Points(sprayGeo, sprayMat);
  scene.add(sprayCloud);

  function triggerSpray(origin) {
    const burst = 30;
    for (let i = 0; i < burst && sprayCount < MAX_SPRAY; i++) {
      const idx = sprayCount;
      sprayPos[idx * 3] = origin.x;
      sprayPos[idx * 3 + 1] = origin.y;
      sprayPos[idx * 3 + 2] = origin.z;
      sprayVel[idx * 3] = (Math.random() - 0.5) * 0.07;
      sprayVel[idx * 3 + 1] = (Math.random() - 0.5) * 0.07;
      sprayVel[idx * 3 + 2] = (Math.random() - 0.5) * 0.07;
      sprayLife[idx] = 1.0;
      sprayDecay[idx] = 0.006 + Math.random() * 0.012;
      sprayCount++;
    }
    sprayGeo.setDrawRange(0, sprayCount);
  }

  /* Ambient dust */
  const ambientCount = 80;
  const ambientGeo = new THREE.BufferGeometry();
  const ambientPos = new Float32Array(ambientCount * 3);
  for (let i = 0; i < ambientCount; i++) {
    ambientPos[i * 3] = (Math.random() - 0.5) * 12;
    ambientPos[i * 3 + 1] = Math.random() * 10;
    ambientPos[i * 3 + 2] = (Math.random() - 0.5) * 12;
  }
  ambientGeo.setAttribute('position', new THREE.BufferAttribute(ambientPos, 3));
  const ambientMat = new THREE.PointsMaterial({ color: 0x2A5C3F, size: 0.025, transparent: true, opacity: 0.3 });
  const ambientParticles = new THREE.Points(ambientGeo, ambientMat);
  scene.add(ambientParticles);

  /* ── VIEW MODES ── */
  let currentView = 'heatmap';
  const greyColor = new THREE.Color(0x8A8A85);

  window.setSiloView = function (view) {
    currentView = view;
    pathLineMat.opacity = view === 'probe' ? 0.25 : 0.0;
    siloMat.opacity = view === 'probe' ? 0.06 : 0.15;

    const colAttr = grainGeo.attributes.color;
    for (let i = 0; i < POINT_COUNT; i++) {
      if (view === 'normal') {
        colAttr.array[i * 3] = greyColor.r;
        colAttr.array[i * 3 + 1] = greyColor.g;
        colAttr.array[i * 3 + 2] = greyColor.b;
      } else {
        colAttr.array[i * 3] = grainOrigColors[i * 3];
        colAttr.array[i * 3 + 1] = grainOrigColors[i * 3 + 1];
        colAttr.array[i * 3 + 2] = grainOrigColors[i * 3 + 2];
      }
    }
    colAttr.needsUpdate = true;
    grainMat.opacity = view === 'normal' ? 0.25 : view === 'probe' ? 0.4 : 0.75;
  };

  /* ── PANEL UPDATES ── */
  const co2El = document.getElementById('co2Value');
  const rhEl = document.getElementById('rhValue');
  const tempEl = document.getElementById('tempValue');
  const depthEl = document.getElementById('depthValue');
  const co2BarEl = document.getElementById('co2Bar');
  const rhBarEl = document.getElementById('rhBar');
  const tempBarEl = document.getElementById('tempBar');
  const depthBarEl = document.getElementById('depthBar');
  const probeStatusEl = document.getElementById('probeStatus');

  function updatePanel(probePos) {
    const co2 = getCO2Level(probePos);
    const rh = 12 + Math.random() * 8 + (co2 > 1500 ? 20 : 0) + (co2 > 3000 ? 15 : 0);
    const temp = 24 + Math.random() * 4 + (co2 > 1500 ? 6 : 0) + (co2 > 3000 ? 8 : 0);
    const depth = (grainLevel - probePos.y).toFixed(1);

    co2El.textContent = Math.round(co2) + ' ppm';
    rhEl.textContent = rh.toFixed(1) + '%';
    tempEl.textContent = temp.toFixed(1) + '\u00B0C';
    depthEl.textContent = depth + 'm';

    co2BarEl.style.width = Math.min(co2 / 5000 * 100, 100) + '%';
    rhBarEl.style.width = Math.min(rh / 80 * 100, 100) + '%';
    tempBarEl.style.width = Math.min(temp / 60 * 100, 100) + '%';
    depthBarEl.style.width = Math.min(Math.abs(depth) / grainLevel * 100, 100) + '%';

    if (co2 < 800) {
      co2El.className = 'reading-value safe';
      co2BarEl.style.background = 'var(--safe-green)';
    } else if (co2 < 2000) {
      co2El.className = 'reading-value warning';
      co2BarEl.style.background = 'var(--warning-yellow)';
    } else {
      co2El.className = 'reading-value danger';
      co2BarEl.style.background = 'var(--danger-red)';
    }

    if (rh > 30) { rhEl.className = 'reading-value danger'; rhBarEl.style.background = 'var(--danger-red)'; }
    else if (rh > 20) { rhEl.className = 'reading-value warning'; rhBarEl.style.background = 'var(--warning-yellow)'; }
    else { rhEl.className = 'reading-value safe'; rhBarEl.style.background = 'var(--safe-green)'; }

    if (temp > 35) { tempEl.className = 'reading-value danger'; tempBarEl.style.background = 'var(--danger-red)'; }
    else if (temp > 30) { tempEl.className = 'reading-value warning'; tempBarEl.style.background = 'var(--warning-yellow)'; }
    else { tempEl.className = 'reading-value safe'; tempBarEl.style.background = 'var(--safe-green)'; }

    if (co2 > 2000) {
      probeStatusEl.textContent = '\u26A0 Danger zone \u2014 Fumigating';
      probeStatusEl.style.color = '#E84545';
    } else if (co2 > 800) {
      probeStatusEl.textContent = 'Warning zone \u2014 Monitoring';
      probeStatusEl.style.color = '#FFD93A';
    } else {
      probeStatusEl.textContent = 'Navigating \u2014 Safe zone';
      probeStatusEl.style.color = '#3AFF7A';
    }
  }

  /* ── ANIMATE ── */
  let probeT = 0;
  const probeSpeed = 0.0008;
  let lastSpray = 0;
  const clock = new THREE.Clock();

  function getProbePosition(t) {
    const totalSegments = probePath.length - 1;
    const globalT = (t % 1) * totalSegments;
    const idx = Math.floor(globalT);
    const localT = globalT - idx;
    const i0 = Math.max(0, idx - 1), i1 = idx;
    const i2 = Math.min(totalSegments, idx + 1), i3 = Math.min(totalSegments, idx + 2);
    const p0 = probePath[i0], p1 = probePath[i1], p2 = probePath[i2], p3 = probePath[i3];
    const tt = localT, tt2 = tt * tt, tt3 = tt2 * tt;
    return new THREE.Vector3(
      0.5 * (2 * p1.x + (-p0.x + p2.x) * tt + (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * tt2 + (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * tt3),
      0.5 * (2 * p1.y + (-p0.y + p2.y) * tt + (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * tt2 + (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * tt3),
      0.5 * (2 * p1.z + (-p0.z + p2.z) * tt + (2 * p0.z - 5 * p1.z + 4 * p2.z - p3.z) * tt2 + (-p0.z + 3 * p1.z - 3 * p2.z + p3.z) * tt3)
    );
  }

  function animate() {
    requestAnimationFrame(animate);
    const time = clock.getElapsedTime();
    controls.update();

    /* Probe */
    probeT += probeSpeed;
    if (probeT > 1) probeT = 0;
    const probePos = getProbePosition(probeT);
    probe.position.copy(probePos);

    /* Glow pulse */
    const pulse = 1 + Math.sin(time * 4) * 0.15;
    probeGlow.scale.setScalar(pulse);
    glowMat.opacity = 0.08 + Math.sin(time * 3) * 0.04;

    /* Trail */
    const tPos = trailLine.geometry.attributes.position;
    if (trailIndex < maxTrailPoints) {
      tPos.array[trailIndex * 3] = probePos.x;
      tPos.array[trailIndex * 3 + 1] = probePos.y;
      tPos.array[trailIndex * 3 + 2] = probePos.z;
      trailIndex++;
      trailGeo.setDrawRange(0, trailIndex);
    } else {
      for (let i = 0; i < (maxTrailPoints - 1) * 3; i++) tPos.array[i] = tPos.array[i + 3];
      tPos.array[(maxTrailPoints - 1) * 3] = probePos.x;
      tPos.array[(maxTrailPoints - 1) * 3 + 1] = probePos.y;
      tPos.array[(maxTrailPoints - 1) * 3 + 2] = probePos.z;
    }
    tPos.needsUpdate = true;

    /* Spray trigger */
    const co2AtProbe = getCO2Level(probePos);
    if (co2AtProbe > 2000 && time - lastSpray > 0.6) {
      triggerSpray(probePos);
      lastSpray = time;
    }

    /* Animate spray particles */
    let alive = 0;
    for (let i = 0; i < sprayCount; i++) {
      if (sprayLife[i] > 0) {
        sprayPos[i * 3] += sprayVel[i * 3];
        sprayPos[i * 3 + 1] += sprayVel[i * 3 + 1];
        sprayPos[i * 3 + 2] += sprayVel[i * 3 + 2];
        sprayLife[i] -= sprayDecay[i];
        if (sprayLife[i] > 0) {
          if (alive !== i) {
            sprayPos[alive * 3] = sprayPos[i * 3];
            sprayPos[alive * 3 + 1] = sprayPos[i * 3 + 1];
            sprayPos[alive * 3 + 2] = sprayPos[i * 3 + 2];
            sprayVel[alive * 3] = sprayVel[i * 3];
            sprayVel[alive * 3 + 1] = sprayVel[i * 3 + 1];
            sprayVel[alive * 3 + 2] = sprayVel[i * 3 + 2];
            sprayLife[alive] = sprayLife[i];
            sprayDecay[alive] = sprayDecay[i];
          }
          alive++;
        }
      }
    }
    sprayCount = alive;
    sprayGeo.attributes.position.needsUpdate = true;
    sprayGeo.setDrawRange(0, sprayCount);

    /* Ambient drift */
    const aPos = ambientParticles.geometry.attributes.position;
    for (let i = 0; i < ambientCount; i++) {
      aPos.array[i * 3 + 1] += 0.002;
      if (aPos.array[i * 3 + 1] > 10) aPos.array[i * 3 + 1] = 0;
    }
    aPos.needsUpdate = true;

    updatePanel(probePos);
    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener('resize', () => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  });
})();