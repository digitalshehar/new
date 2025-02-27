// motion.ts - Animation utilities for the dashboard
// Using modern web animation techniques that work with Astro's SSR

// Stagger animation delay calculator
export function getStaggerDelay(index: number, baseDelay: number = 150): number {
  return index * baseDelay;
}

// Generate CSS keyframes dynamically
export function generateKeyframes(name: string, keyframes: string): string {
  return `@keyframes ${name} { ${keyframes} }`;
}

// Animation presets for common use cases
export const animations = {
  fadeIn: "animate-fadeIn",
  slideUp: "animate-slideUp",
  slideRight: "animate-slideRight",
  pulse: "animate-pulse",
  bounce: "animate-bounce",
  spin: "animate-spin",
  float: "animate-float",
  shimmer: "animate-shimmer",
  staggerFadeIn: "stagger-fadeIn"
};

// CSS classes for animation triggers
export const motionClasses = {
  container: "motion-container",
  item: "motion-item",
  delayedItem: "motion-delayed-item",
  hover: "motion-hover",
  active: "motion-active",
  intersect: "motion-intersect"
};

// Data attributes for animations
export const motionAttributes = {
  delay: "data-motion-delay",
  duration: "data-motion-duration",
  stagger: "data-motion-stagger",
  once: "data-motion-once",
  repeat: "data-motion-repeat",
  direction: "data-motion-direction"
};

// Helper for IntersectionObserver animations
export const intersectionObserverScript = `
  // IntersectionObserver to trigger animations when elements are in view
  function setupIntersectionObserver() {
    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.15
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          
          // Check if animation should only play once
          if (entry.target.getAttribute('${motionAttributes.once}') === 'true') {
            observer.unobserve(entry.target);
          }
        } else {
          // Remove animation class if it's not meant to play only once
          if (entry.target.getAttribute('${motionAttributes.once}') !== 'true') {
            entry.target.classList.remove('in-view');
          }
        }
      });
    }, observerOptions);
    
    // Observe all elements with the intersection animation class
    document.querySelectorAll('.${motionClasses.intersect}').forEach(el => {
      observer.observe(el);
    });
  }
  
  // Set up staggered animations
  function setupStaggeredAnimations() {
    document.querySelectorAll('[${motionAttributes.stagger}]').forEach(container => {
      const items = Array.from(container.querySelectorAll('.${motionClasses.item}'));
      const baseDelay = parseInt(container.getAttribute('${motionAttributes.delay}') || '50');
      
      items.forEach((item, index) => {
        const delay = index * baseDelay;
        item.style.animationDelay = \`\${delay}ms\`;
        item.style.transitionDelay = \`\${delay}ms\`;
      });
    });
  }
  
  // Initialize animations when DOM is loaded
  document.addEventListener('DOMContentLoaded', () => {
    setupIntersectionObserver();
    setupStaggeredAnimations();
  });
`;

// 3D transform utility
export function get3DTransform(x: number, y: number, z: number, rotate?: string): string {
  return `transform: translate3d(${x}px, ${y}px, ${z}px) ${rotate || ''}`;
}
