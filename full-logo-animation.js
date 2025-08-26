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

// Create Spiral with Drawing Animation
function createDrawingSpiral(options = {}) {
    const {
        size = 100,
        turns = 6,
        color = '#9333ea',
        strokeWidth = '0.8',
        className = '',
        animationType = 'draw', // 'draw', 'breathe', 'both', 'none'
        drawDuration = 45000,
        pulseDuration = 20000,
        breatheDuration = 12000
    } = options;

    const container = document.createElement('div');
    container.className = `spiral-container ${className}`;
    container.style.position = 'relative';
    container.style.width = '100%';
    container.style.height = '100%';

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', `0 0 ${size} ${size}`);
    svg.style.width = '100%';
    svg.style.height = '100%';

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', generateSpiralPath(size, turns, true));
    path.style.stroke = color;
    path.style.strokeWidth = strokeWidth;
    path.style.fill = 'none';
    path.style.strokeLinecap = 'round';

    // Apply animations based on type
    let animations = [];
    
    if (animationType === 'draw' || animationType === 'both') {
        animations.push(`spiral-draw-direction ${drawDuration / 1000}s linear infinite`);
        animations.push(`spiral-weight-pulse ${pulseDuration / 1000}s ease-in-out infinite`);
        path.style.strokeDasharray = '0 3000';
    }

    if (animationType === 'breathe' || animationType === 'both') {
        container.style.animation = `breathe ${breatheDuration / 1000}s ease-in-out infinite`;
    }

    if (animations.length > 0) {
        path.style.animation = animations.join(', ');
    }

    svg.appendChild(path);
    container.appendChild(svg);
    
    return container;
}

// Initialize spiral logos when page loads
function initializeSpiralLogos() {
    // Create header logo with same design as hero spiral
    const headerContainer = document.getElementById('header-logo-container');
    if (headerContainer) {
        // Create container for spiral and text
        const container = document.createElement('div');
        container.style.position = 'relative';
        container.style.width = '80px';
        container.style.height = '80px';
        
        // Create SVG spiral
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('viewBox', '0 0 100 100');
        svg.setAttribute('class', 'hero-spiral');
        svg.style.width = '100%';
        svg.style.height = '100%';
        
        // Create spiral path
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', generateSpiralPath(100, 6, true));
        path.style.stroke = '#9333ea';
        path.style.strokeWidth = '0.8';
        path.style.fill = 'none';
        path.style.opacity = '0.8';
        
        svg.appendChild(path);
        
        // Add only the SVG to container (no text overlay)
        container.appendChild(svg);
        
        // Add subtle breathing animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes breathe {
                0%, 100% { 
                    transform: scale(1);
                    opacity: 0.8;
                }
                50% { 
                    transform: scale(1.05);
                    opacity: 1;
                }
            }
            
            /* Spiral drawing/undrawing animation */
            @keyframes spiral-draw-direction {
                0% { stroke-dasharray: 0 3000; }     /* Start from center */
                22% { stroke-dasharray: 2800 200; }  /* Drawing outward */
                28% { stroke-dasharray: 3000 0; }    /* Fully drawn outward */
                35% { stroke-dasharray: 3000 0; }    /* Hold */
                50% { stroke-dasharray: 2800 200; }  /* Start reversing */
                72% { stroke-dasharray: 0 3000; }    /* Drawing inward */
                78% { stroke-dasharray: 0 3000; }    /* Fully drawn inward */
                85% { stroke-dasharray: 0 3000; }    /* Hold */
                100% { stroke-dasharray: 0 3000; }   /* Reset */
            }
            
            /* Weight and opacity pulse */
            @keyframes spiral-weight-pulse {
                0%, 100% { 
                    stroke-opacity: 0.4; 
                    stroke-width: 1.5; 
                }
                25% { 
                    stroke-opacity: 0.7; 
                    stroke-width: 2.5; 
                }
                50% { 
                    stroke-opacity: 1; 
                    stroke-width: 3.5; 
                }
                75% { 
                    stroke-opacity: 0.7; 
                    stroke-width: 2.5; 
                }
            }
            
            #header-logo-container > div {
                animation: breathe 12s ease-in-out infinite;
            }
        `;
        document.head.appendChild(style);
        
        headerContainer.appendChild(container);
    }
    
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