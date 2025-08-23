// Hero Spiral Component with Text Paths
// Extends the existing spiral.js with conceptual text following invisible spiral paths
// Based on Greg McKeown's Essential/Effortless + Recursive framework

// Enhanced Spiral Path Generator with Radius Multiplier
function generateSpiralPath(size = 100, turns = 8, outwardSpiral = true, radiusMultiplier = 1.0) {
    const centerX = size / 2;
    const centerY = size / 2;
    const maxRadius = size * 0.45 * radiusMultiplier; // Apply multiplier to max radius
    const points = [];
    
    // Golden ratio growth for aesthetic appeal - the mathematical beauty of recursion
    const goldenRatio = (1 + Math.sqrt(5)) / 2;
    const growthRate = outwardSpiral ? Math.log(goldenRatio) / (Math.PI / 2) : -Math.log(goldenRatio) / (Math.PI / 2);
    
    // Start from center (very small radius) and grow outward
    const minRadius = 0.5 * radiusMultiplier;
    const totalPoints = turns * 300; // More points for smoother curves
    
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

// Create Hero Spiral with Text Paths
function createHeroSpiral(className = '', color = 'currentColor') {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 100 100');
    svg.setAttribute('class', `hero-spiral ${className}`);
    svg.setAttribute('aria-label', 'Recursive.eco Philosophy Visualization - Essential, Effortless, Recursive');
    
    // Create main spiral path (unchanged from original)
    const mainPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    mainPath.setAttribute('d', generateSpiralPath(100, 6, true, 1.0));
    mainPath.setAttribute('class', 'spiral-path main-spiral');
    mainPath.style.stroke = color;
    mainPath.style.strokeWidth = '0.8';
    mainPath.style.fill = 'none';
    mainPath.style.opacity = '0.9';
    
    // Create invisible paths for text
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    
    // Inner path (60% radius) - for "Essential"
    const innerPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    innerPath.setAttribute('id', 'inner-text-path');
    innerPath.setAttribute('d', generateSpiralPath(100, 6, true, 0.6));
    defs.appendChild(innerPath);
    
    // Middle path (100% radius) - for "Effortless"  
    const middlePath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    middlePath.setAttribute('id', 'middle-text-path');
    middlePath.setAttribute('d', generateSpiralPath(100, 6, true, 1.0));
    defs.appendChild(middlePath);
    
    // Outer path (140% radius) - for "Recursive"
    const outerPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    outerPath.setAttribute('id', 'outer-text-path');
    outerPath.setAttribute('d', generateSpiralPath(100, 6, true, 1.4));
    defs.appendChild(outerPath);
    
    // Create text elements following the spiral paths
    const innerText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    innerText.setAttribute('class', 'spiral-text inner-text');
    const innerTextPath = document.createElementNS('http://www.w3.org/2000/svg', 'textPath');
    innerTextPath.setAttribute('href', '#inner-text-path');
    innerTextPath.setAttribute('startOffset', '20%');
    innerTextPath.textContent = 'Essential - What actually matters for human flourishing?';
    innerText.appendChild(innerTextPath);
    
    const middleText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    middleText.setAttribute('class', 'spiral-text middle-text');
    const middleTextPath = document.createElementNS('http://www.w3.org/2000/svg', 'textPath');
    middleTextPath.setAttribute('href', '#middle-text-path');
    middleTextPath.setAttribute('startOffset', '10%');
    middleTextPath.textContent = 'Effortless - Systems that make kindness the easy choice';
    middleText.appendChild(middleTextPath);
    
    const outerText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    outerText.setAttribute('class', 'spiral-text outer-text');
    const outerTextPath = document.createElementNS('http://www.w3.org/2000/svg', 'textPath');
    outerTextPath.setAttribute('href', '#outer-text-path');
    outerTextPath.setAttribute('startOffset', '5%');
    outerTextPath.textContent = 'Recursive - When kindness strengthens itself through use';
    outerText.appendChild(outerTextPath);
    
    // Append all elements to SVG
    svg.appendChild(defs);
    svg.appendChild(mainPath);
    svg.appendChild(innerText);
    svg.appendChild(middleText);
    svg.appendChild(outerText);
    
    return svg;
}

// Initialize hero spirals when page loads
function initializeHeroSpirals() {
    // Look for placeholder elements with class 'hero-spiral-placeholder'
    const placeholders = document.querySelectorAll('.hero-spiral-placeholder');
    
    placeholders.forEach(placeholder => {
        // Get color from data attribute or use default
        const color = placeholder.dataset.color || 'currentColor';
        const className = placeholder.className.replace('hero-spiral-placeholder', '').trim();
        
        const heroSpiral = createHeroSpiral(className, color);
        
        // Replace placeholder with hero spiral
        placeholder.parentNode.replaceChild(heroSpiral, placeholder);
    });
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeHeroSpirals);
} else {
    initializeHeroSpirals();
}