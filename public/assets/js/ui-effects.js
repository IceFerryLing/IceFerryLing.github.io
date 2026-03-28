window.addEventListener('DOMContentLoaded', () => {
  if (!window.tsParticles) {
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
});
