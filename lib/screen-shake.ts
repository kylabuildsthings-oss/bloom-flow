/**
 * Screen shake utility for delightful feedback
 */

export function triggerScreenShake(intensity: 'light' | 'medium' | 'strong' = 'medium') {
  const intensities = {
    light: { duration: 300, strength: 3 },
    medium: { duration: 400, strength: 5 },
    strong: { duration: 500, strength: 8 },
  };

  const { duration, strength } = intensities[intensity];
  const root = document.documentElement;

  // Create shake animation
  const keyframes = `
    @keyframes screenShake {
      0%, 100% { transform: translate(0, 0); }
      10% { transform: translate(-${strength}px, ${strength}px); }
      20% { transform: translate(${strength}px, -${strength}px); }
      30% { transform: translate(-${strength}px, -${strength}px); }
      40% { transform: translate(${strength}px, ${strength}px); }
      50% { transform: translate(-${strength}px, ${strength}px); }
      60% { transform: translate(${strength}px, -${strength}px); }
      70% { transform: translate(-${strength}px, -${strength}px); }
      80% { transform: translate(${strength}px, ${strength}px); }
      90% { transform: translate(-${strength}px, ${strength}px); }
    }
  `;

  // Add animation if not exists
  if (!document.getElementById('screen-shake-style')) {
    const style = document.createElement('style');
    style.id = 'screen-shake-style';
    style.textContent = keyframes;
    document.head.appendChild(style);
  }

  // Apply shake
  root.style.animation = `screenShake ${duration}ms ease-in-out`;
  
  // Remove animation after completion
  setTimeout(() => {
    root.style.animation = '';
  }, duration);
}
