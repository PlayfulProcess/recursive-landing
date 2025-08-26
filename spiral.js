// Recursive Spiral Logo Generator
// Mathematical implementation of logarithmic spiral for Recursive.eco

// Generate Recursive Spiral Path - From Center Outward
function generateSpiralPath(size = 100, turns = 8, outwardSpiral = true) {
    const centerX = size / 2;
    const centerY = size / 2;
    const maxRadius = size * 0.45; // Slightly larger for more dramatic effect
    const points = [];
    
    // Golden ratio growth for aesthetic appeal - the mathematical beauty of recursion
    const goldenRatio = (1 + Math.sqrt(5)) / 2;
    const growthRate = outwardSpiral ? Math.log(goldenRatio) / (Math.PI / 2) : -Math.log(goldenRatio) / (Math.PI / 2);
    
    // Start from center (very small radius) and grow outward
    const minRadius = 0.5;
    const totalPoints = turns * 300; // More points for smoother animation
    
    for (let i = 0; i <= totalPoints; i++) {
        const t = (i / 300) * 2 * Math.PI; // Parameter for angle
        let r = minRadius * Math.exp(growthRate * t);
        
        // Limit maximum radius
        if (r > maxRadius) r = maxRadius;
        
        const x = centerX + r * Math.cos(t);
        const y = centerY + r * Math.sin(t);
        
        points.push(`${i === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`);
    }
    
    return points.join(' ');
}

// Create Spiral SVG Element
function createSpiralLogo(className = '', color = 'currentColor') {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 100 100');
    svg.setAttribute('class', `spiral-logo ${className}`);
    svg.setAttribute('aria-label', 'Recursive.eco Logo - Infinite Growing Spiral');
    
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', generateSpiralPath(100, 6, true)); // Outward spiral, more turns
    path.setAttribute('class', 'spiral-path');
    path.style.stroke = color;
    
    svg.appendChild(path);
    return svg;
}

// Inject the CSS needed for the spiral animation (only once)
function ensureSpiralStyle() {
  if (document.getElementById('spiral-style')) return;
  const style = document.createElement('style');
  style.id = 'spiral-style';
  style.textContent = `
    @keyframes spiral-breathe {
      0%, 100% { transform: scale(1); opacity: .9; }
      50% { transform: scale(1.05); opacity: 1; }
    }
    @keyframes spiral-draw {
      0%   { stroke-dashoffset: var(--spiral-length, 1200); }
      50%  { stroke-dashoffset: 0; }
      100% { stroke-dashoffset: var(--spiral-length, 1200); }
    }
    .spiral-animated { animation: spiral-breathe 12s ease-in-out infinite; will-change: transform, opacity; }
    .spiral-path.animated { animation: spiral-draw 12s ease-in-out infinite; }
  `;
  document.head.appendChild(style);
}

// Create the exact hero spiral (no text) into any target
function createSpiral(target, options = {}) {
  const {
    size = 100,
    turns = 6,
    color = '#9333ea',
    strokeWidth = '0.8',
    opacity = '0.8',
    className = '',
    animated = true,
    width = '100%',
    height = '100%',
  } = options;

  const host = typeof target === 'string' ? document.getElementById(target) : target;
  if (!host) {
    console.warn('Spiral: target not found', target);
    return () => {};
  }

  if (animated) ensureSpiralStyle();
  host.innerHTML = '';

  // Container (to apply the breathe animation)
  const container = document.createElement('div');
  if (animated) container.classList.add('spiral-animated');

  // SVG
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', `0 0 ${size} ${size}`);
  svg.setAttribute('class', `spiral-logo ${className}`.trim());
  svg.style.width = width;
  svg.style.height = height;

  // Path (uses your existing generator)
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  try {
    path.setAttribute('d', generateSpiralPath(size, turns, true));
  } catch (e) {
    console.error('Spiral: generateSpiralPath missing/failed', e);
    path.setAttribute('d', 'M50 50');
  }
  path.setAttribute('class', 'spiral-path');
  path.style.stroke = color;
  path.style.strokeWidth = String(strokeWidth);
  path.style.fill = 'none';
  path.style.opacity = String(opacity);
  path.style.strokeLinecap = 'round';

  if (animated) {
    svg.appendChild(path);
    container.appendChild(svg);
    host.appendChild(container);
    
    try {
      const len = path.getTotalLength();
      path.style.setProperty('--spiral-length', String(Math.ceil(len)));
      path.style.strokeDasharray = String(Math.ceil(len));
      path.style.strokeDashoffset = String(Math.ceil(len));
      path.classList.add('animated');
    } catch {}
  } else {
    svg.appendChild(path);
    container.appendChild(svg);
    host.appendChild(container);
  }

  return () => {
    try { host.removeChild(container); } catch {}
  };
}

// Static Spiral Creator - No animation
function createStaticSpiral(target, options = {}) {
    return createSpiral(target, { ...options, animated: false });
}

// Animated Spiral Creator - With drawing animation
function createAnimatedSpiral(target, options = {}) {
    return createSpiral(target, { ...options, animated: true });
}

// Keep header behavior
function initializeSpiralHeader() {
  const header = document.getElementById('header-logo-container');
  if (header) {
    createSpiral(header, { size: 100, turns: 6, color: '#9333ea', strokeWidth: 0.8, opacity: 0.8 });
  }
}

// Auto-start for header
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeSpiralHeader, { once: true });
} else {
  initializeSpiralHeader();
}

// Expose globals for embeds/playgrounds
window.createSpiral = window.createSpiral || createSpiral;
window.createAnimatedSpiral = window.createAnimatedSpiral || createSpiral; // alias
window.startSpiral = window.startSpiral || ((target, opts) => createSpiral(target, opts));

// Legacy function for image replacement
function initializeSpiralLogos() {
    // Replace all tree/logo images with spiral logos
    const images = document.querySelectorAll('img[alt="Recursive.eco"]');
    
    images.forEach(img => {
        let sizeClass = 'size-md';
        
        // Determine size based on current image classes or dimensions
        if (img.classList.contains('h-48')) {
            sizeClass = 'size-xl';
        } else if (img.classList.contains('h-24')) {
            sizeClass = 'size-md';  // Footer size remains unchanged
        } else if (img.classList.contains('h-20')) {
            // Check if it's in header - make it smaller
            const isInHeader = img.closest('header') !== null;
            sizeClass = isInHeader ? 'size-sm' : 'size-md';
        }
        
        // Get color context (white for footer/dark backgrounds)
        const isInFooter = img.closest('footer') !== null;
        const isDarkBackground = img.closest('[class*="bg-gray-9"], [class*="bg-black"]') !== null;
        const color = (isInFooter || isDarkBackground) ? '#ffffff' : 'currentColor';
        
        const spiral = createSpiralLogo(sizeClass, color);
        
        // Copy relevant classes from image to spiral
        if (img.classList.contains('mx-auto')) spiral.classList.add('mx-auto');
        if (img.classList.contains('mb-6')) spiral.classList.add('mb-6');
        if (img.classList.contains('shadow-lg')) spiral.classList.add('shadow-lg');
        
        // Replace the image with the spiral
        img.parentNode.replaceChild(spiral, img);
    });
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeSpiralLogos);
} else {
    initializeSpiralLogos();
}