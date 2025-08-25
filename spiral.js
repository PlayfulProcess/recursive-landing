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

// Initialize spiral logos when page loads
function initializeSpiralLogos() {
    // Create header logo
    const headerContainer = document.getElementById('header-logo-container');
    if (headerContainer) {
        const headerSpiral = createSpiralLogo('size-header', '#9333ea'); // Purple color for header
        headerSpiral.style.width = '80px';
        headerSpiral.style.height = '80px';
        
        // Add drawing animation to header logo
        const path = headerSpiral.querySelector('path');
        const pathLength = path.getTotalLength();
        path.style.strokeDasharray = pathLength;
        path.style.animation = 'drawSpiral 3s ease-in-out infinite';
        
        // Add animation keyframes
        const style = document.createElement('style');
        style.textContent = `
            @keyframes drawSpiral {
                0% { 
                    stroke-dashoffset: ${pathLength}; 
                    opacity: 0.3;
                }
                50% { 
                    stroke-dashoffset: 0; 
                    opacity: 1;
                }
                100% { 
                    stroke-dashoffset: -${pathLength}; 
                    opacity: 0.3;
                }
            }
            .spiral-logo path {
                stroke-width: 0.8;
            }
        `;
        document.head.appendChild(style);
        
        headerContainer.appendChild(headerSpiral);
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