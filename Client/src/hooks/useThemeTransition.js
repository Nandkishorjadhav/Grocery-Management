import { useEffect, useRef } from 'react';

export const useThemeTransition = () => {
  const animationRef = useRef(null);

  const animateThemeTransition = (event, callback) => {
    // Check if browser supports View Transitions API
    if (!document.startViewTransition) {
      // Fallback for browsers that don't support it
      callback();
      return;
    }

    // Get click position
    const x = event.clientX;
    const y = event.clientY;

    // Calculate the radius needed to cover the screen
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    // Create transition
    const transition = document.startViewTransition(() => {
      callback();
    });

    // Animate with custom animation
    transition.ready.then(() => {
      const clipPath = [
        `circle(0px at ${x}px ${y}px)`,
        `circle(${endRadius}px at ${x}px ${y}px)`
      ];

      document.documentElement.animate(
        {
          clipPath: clipPath
        },
        {
          duration: 500,
          easing: 'ease-in-out',
          pseudoElement: '::view-transition-new(root)'
        }
      );
    });
  };

  return { animateThemeTransition };
};
