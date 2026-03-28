window.addEventListener('DOMContentLoaded', () => {
  initFormulaBubbles();

  if (!window.tsParticles) {
    initMouseDroplets();
    return;
  }

  window.tsParticles.load({
    id: 'tsparticles',
    options: {
      fullScreen: { enable: false },
      fpsLimit: 60,
      background: {
        color: { value: 'transparent' }
      },
      particles: {
        number: {
          value: 40,
          density: { enable: true, area: 900 }
        },
        color: { value: ['#9b6bff', '#7b4dff', '#c4b5fd'] },
        opacity: { value: 0.45 },
        size: { value: { min: 2, max: 6 } },
        shape: { type: 'circle' },
        move: {
          enable: true,
          speed: 0.6,
          direction: 'top',
          outModes: { default: 'out' }
        }
      },
      interactivity: {
        events: {
          onHover: { enable: true, mode: 'trail' },
          resize: true
        },
        modes: {
          trail: {
            delay: 0.02,
            pauseOnStop: true,
            quantity: 2,
            particles: {
              color: { value: '#e9d5ff' },
              opacity: { value: 0.7 },
              size: { value: { min: 2, max: 5 } },
              move: { enable: true, speed: 1.2, outModes: { default: 'destroy' } }
            }
          }
        }
      },
      detectRetina: true
    }
  });

  initMouseDroplets();
});

function initFormulaBubbles() {
  const layer = document.getElementById('formulaBubbles');
  if (!layer) return;

  const formulas = [
    'E = mc²',
    'F = ma',
    'a² + b² = c²',
    'e^{iπ} + 1 = 0',
    '∫ f(x) dx',
    '∇·E = ρ/ε₀',
    '∇×B = μ₀J + μ₀ε₀∂E/∂t',
    'Δx · Δp ≥ ħ/2',
    'iħ∂ψ/∂t = Ĥψ',
    'PV = nRT',
    'sin²θ + cos²θ = 1',
    'limₙ→∞ (1 + 1/n)ⁿ = e',
    'O(n log n)',
    'for (i=0; i<n; i++)',
    'Σᵢ aᵢxᵢ',
    '∂²u/∂t² = c²∇²u'
  ];

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const count = Math.min(18, Math.max(10, Math.floor(window.innerWidth / 120)));

  layer.innerHTML = '';

  for (let i = 0; i < count; i++) {
    const bubble = document.createElement('span');
    bubble.className = 'formula-bubble';
    bubble.textContent = formulas[Math.floor(Math.random() * formulas.length)];

    const x = 4 + Math.random() * 92;
    const size = 0.72 + Math.random() * 0.44;
    const delay = -Math.random() * 24;
    const duration = 16 + Math.random() * 16;
    const sway = (Math.random() - 0.5) * 32;

    bubble.style.left = `${x}vw`;
    bubble.style.setProperty('--formula-size', `${size}rem`);
    bubble.style.setProperty('--formula-delay', `${delay}s`);
    bubble.style.setProperty('--formula-duration', `${duration}s`);
    bubble.style.setProperty('--sway', `${sway}px`);
    bubble.style.setProperty('--fx', `${(Math.random() - 0.5) * 20}px`);

    if (reducedMotion) {
      bubble.style.animation = 'none';
      bubble.style.opacity = '0.2';
      bubble.style.top = `${10 + Math.random() * 80}%`;
      bubble.style.transform = 'translate(-50%, -50%)';
    }

    layer.appendChild(bubble);
  }
}

function initMouseDroplets() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  let last = 0;
  const throttle = 26;

  window.addEventListener('pointermove', (event) => {
    const now = performance.now();
    if (now - last < throttle) return;
    last = now;

    const drop = document.createElement('span');
    drop.className = 'mouse-droplet';
    drop.style.left = `${event.clientX}px`;
    drop.style.top = `${event.clientY}px`;

    const driftX = (Math.random() - 0.5) * 18;
    const driftY = -12 - Math.random() * 28;
    const size = 8 + Math.random() * 8;
    drop.style.setProperty('--dx', `${driftX}px`);
    drop.style.setProperty('--dy', `${driftY}px`);
    drop.style.width = `${size}px`;
    drop.style.height = `${size}px`;

    document.body.appendChild(drop);
    drop.addEventListener('animationend', () => drop.remove(), { once: true });
  }, { passive: true });
}

