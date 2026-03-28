// 页面可交互后再初始化视觉层，避免首屏阻塞
window.addEventListener('DOMContentLoaded', () => {
  // 1) 背景公式泡泡：理科风点缀（数学/物理/代码符号）
  initFormulaBubbles();

  // 2) 如果粒子库不可用，保底启用鼠标水滴效果并退出
  if (!window.tsParticles) {
    initMouseDroplets();
    return;
  }

  // 3) 粒子背景：轻量上浮 + hover 时 trail 拖尾
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

  // 4) 鼠标跟随水滴（与粒子背景并行，不互斥）
  initMouseDroplets();
});

function initFormulaBubbles() {
  // 公式层容器不存在时直接跳过，避免脚本报错
  const layer = document.getElementById('formulaBubbles');
  if (!layer) return;

  // 著名公式与少量代码复杂度符号：只做背景点缀，不作为主体内容
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
  // 根据屏幕宽度控制密度，避免移动端太拥挤
  const count = Math.min(18, Math.max(10, Math.floor(window.innerWidth / 120)));

  // 先清空再重建，防止重复初始化叠加
  layer.innerHTML = '';

  for (let i = 0; i < count; i++) {
    const bubble = document.createElement('span');
    bubble.className = 'formula-bubble';
    bubble.textContent = formulas[Math.floor(Math.random() * formulas.length)];

    // 随机参数：横向位置、字号、时长、延迟、摆动幅度
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

    // 无障碍降级：用户偏好减少动态时，改为静态淡化分布
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
  // 无障碍：减少动态时不生成跟随粒子
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  let last = 0;
  // 简单节流，避免高频 pointermove 造成过多 DOM 节点
  const throttle = 26;

  window.addEventListener('pointermove', (event) => {
    const now = performance.now();
    if (now - last < throttle) return;
    last = now;

    const drop = document.createElement('span');
    drop.className = 'mouse-droplet';
    drop.style.left = `${event.clientX}px`;
    drop.style.top = `${event.clientY}px`;

    // 每个水滴随机漂移方向和尺寸，增强“液体”感
    const driftX = (Math.random() - 0.5) * 18;
    const driftY = -12 - Math.random() * 28;
    const size = 8 + Math.random() * 8;
    drop.style.setProperty('--dx', `${driftX}px`);
    drop.style.setProperty('--dy', `${driftY}px`);
    drop.style.width = `${size}px`;
    drop.style.height = `${size}px`;

    document.body.appendChild(drop);
    // 动画结束自动销毁节点，防止内存/DOM 堆积
    drop.addEventListener('animationend', () => drop.remove(), { once: true });
  }, { passive: true });
}

