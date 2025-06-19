// src/components/common/ParticlesBackground.tsx
import { useEffect } from 'react';
import { tsParticles } from 'tsparticles-engine';
import { loadSlim } from 'tsparticles-slim';
import { useTheme } from '@mui/material';

const ParticlesBackground = () => {
  const theme = useTheme();

  useEffect(() => {
    const initParticles = async () => {
      await loadSlim(tsParticles); // ✅ tsParticles is the actual instance
      await tsParticles.load('tsparticles', {
        fpsLimit: 60,
        interactivity: {
          events: {
            onClick: { enable: true, mode: 'push' },
            onHover: { enable: true, mode: 'repulse' },
          },
          modes: {
            push: { quantity: 4 },
            repulse: { distance: 100, duration: 0.4 },
          },
        },
        particles: {
          color: {
            value: theme.palette.mode === 'dark' ? '#ffffff' : '#1976d2',
          },
          links: {
            color: theme.palette.mode === 'dark' ? '#ffffff' : '#1976d2',
            distance: 150,
            enable: true,
            opacity: 0.4,
            width: 1,
          },
          move: {
            direction: 'none',
            enable: true,
            outModes: { default: 'bounce' },
            random: false,
            speed: 2,
            straight: false,
          },
          number: {
            density: { enable: true, area: 800 },
            value: 80,
          },
          opacity: {
            value: 0.5,
          },
          shape: {
            type: 'circle',
          },
          size: {
            value: { min: 1, max: 3 },
          },
        },
        detectRetina: true,
      });
    };

    initParticles();

    return () => {
      const particleInstance = tsParticles.domItem(0);
      if (particleInstance) {
        particleInstance.destroy();
      }
    };
  }, [theme.palette.mode]);

  return <div id="tsparticles" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }} />;
};

export default ParticlesBackground;
