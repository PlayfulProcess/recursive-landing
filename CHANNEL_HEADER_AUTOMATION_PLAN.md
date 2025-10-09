# Channel Header Automation Plan

## Current State
The recursive-landing header has hardcoded channel links in `assets/js/components/site-shell-inline.js`. Currently shows:
- **Wellness** (active) - links to https://channels.recursive.eco/
- **Parents** (coming soon)
- **Developers** (coming soon)

## Goal
Automatically sync the header dropdown with the actual channels from the recursive-channels-fresh app, including:
- Channel names (e.g., "Wellness", "Community Kids Stories", "Resources for Parents")
- Channel descriptions
- Active/inactive status
- Star counts for ordering

## Challenges

### Different Tech Stacks
- **recursive-landing**: Static HTML + vanilla JS + Tailwind CDN
- **recursive-channels-fresh**: Next.js 15 with server components, MDX, Supabase

### Deployment Separation
- Landing page and channels app are deployed separately
- No shared runtime or build process
- Can't directly import Next.js code into static HTML

## Proposed Solutions

### Option 1: Shared JSON API (Recommended)
**Pros**: Simple, works across different tech stacks, cacheable
**Cons**: Requires API endpoint

**Implementation**:
1. Create API endpoint in recursive-channels-fresh: `/api/channels/list`
   - Returns array of channels with: `{ slug, name, description, url, isActive, starCount }`
   - Uses existing `getAllChannels()` function
   - Public endpoint, no auth needed

2. Update recursive-landing header JS to fetch from API:
   ```javascript
   async function loadChannels() {
     const response = await fetch('https://channels.recursive.eco/api/channels/list');
     const channels = await response.json();
     renderChannelDropdown(channels);
   }
   ```

3. Add caching and fallback:
   - Cache API response in localStorage (5-minute TTL)
   - If fetch fails, fall back to hardcoded defaults
   - Prevents flash of empty content

**Estimated effort**: 1-2 hours

### Option 2: Build-time Generation
**Pros**: No runtime API calls, fastest loading
**Cons**: Requires coordinated builds, more complex setup

**Implementation**:
1. Add npm script in recursive-channels-fresh to export channel data:
   ```bash
   npm run export:channels
   ```
   - Generates `public/channels.json`

2. Recursive-landing fetches this during its build:
   - Download latest channels.json
   - Generate header HTML at build time
   - Commit to repo or store in CDN

**Estimated effort**: 3-4 hours

### Option 3: Shared Component Library
**Pros**: Full code reuse, type safety
**Cons**: High complexity, requires build tooling in landing page

**Implementation**:
1. Create `recursive-shared` package with:
   - Channel type definitions
   - Header component
   - Shared utilities

2. Both apps import from shared package
3. Landing page needs bundler (Vite/webpack)

**Estimated effort**: 6-8 hours + ongoing maintenance

## Recommended Approach

**Option 1 (Shared JSON API)** is the best balance of simplicity and maintainability:

### Phase 1: Create API (in recursive-channels-fresh)
```typescript
// src/app/api/channels/list/route.ts
export async function GET() {
  const channels = await getAllChannels();

  return NextResponse.json(
    channels.map(channel => ({
      slug: channel.slug,
      name: channel.name,
      description: getChannelDescription(channel.slug), // Add to MDX
      url: channel.slug === 'wellness'
        ? 'https://channels.recursive.eco/'
        : `https://channels.recursive.eco/channels/${channel.slug}`,
      isActive: true,
      starCount: channel.totalStars || 0
    }))
  );
}
```

### Phase 2: Update Landing Header (in recursive-landing)
```javascript
// In site-shell-inline.js
const CHANNELS_API = 'https://channels.recursive.eco/api/channels/list';
const CACHE_KEY = 'recursive_channels';
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

async function loadChannels() {
  // Check cache first
  const cached = localStorage.getItem(CACHE_KEY);
  if (cached) {
    const { data, timestamp } = JSON.parse(cached);
    if (Date.now() - timestamp < CACHE_TTL) {
      return data;
    }
  }

  try {
    const response = await fetch(CHANNELS_API);
    const channels = await response.json();

    // Cache the result
    localStorage.setItem(CACHE_KEY, JSON.stringify({
      data: channels,
      timestamp: Date.now()
    }));

    return channels;
  } catch (error) {
    console.error('Failed to load channels:', error);
    return getDefaultChannels(); // Hardcoded fallback
  }
}

function renderChannelDropdown(channels) {
  const dropdown = document.querySelector('.channels-dropdown');
  dropdown.innerHTML = channels
    .sort((a, b) => b.starCount - a.starCount)
    .map(channel => `
      <a href="${channel.url}" class="block px-4 py-3 hover:bg-gray-50">
        <div class="font-medium">${channel.name}</div>
        <div class="text-xs text-gray-500">${channel.description}</div>
      </a>
    `).join('');
}
```

### Phase 3: Graceful Degradation
Keep hardcoded defaults in case API is down:
```javascript
function getDefaultChannels() {
  return [
    {
      slug: 'wellness',
      name: 'Wellness',
      description: 'Mental health & wellness tools',
      url: 'https://channels.recursive.eco/',
      isActive: true,
      starCount: 24
    },
    // ... others
  ];
}
```

## Animated Logo in Next.js Header

### Current State
- **recursive-landing** has animated spiral logo in header (works with vanilla JS)
- **recursive-channels-fresh** has static text/no logo in header
- Logo animation uses custom JavaScript and SVG

### Challenge
Next.js app uses React components, but landing page uses vanilla JS for animations. Need to port the animation logic.

### Options for Animated Logo in Next.js

#### Option 1: Convert to React Component (Recommended)
**Pros**: Clean React integration, TypeScript support, maintainable
**Cons**: Requires porting vanilla JS animation logic to React

**Implementation**:
1. Create `src/components/AnimatedSpiral.tsx`:
   ```tsx
   'use client';

   import { useEffect, useRef } from 'react';

   export function AnimatedSpiral({ size = 48, color = 'rgb(147, 51, 234)' }) {
     const canvasRef = useRef<HTMLCanvasElement>(null);

     useEffect(() => {
       const canvas = canvasRef.current;
       if (!canvas) return;

       const ctx = canvas.getContext('2d');
       if (!ctx) return;

       // Port animation logic from landing page
       let animationId: number;
       let angle = 0;

       function animate() {
         ctx.clearRect(0, 0, canvas.width, canvas.height);

         // Draw spiral (port from landing page spiral logic)
         ctx.strokeStyle = color;
         ctx.lineWidth = 2;
         ctx.beginPath();

         for (let i = 0; i < 200; i++) {
           const radius = i * 0.15;
           const x = canvas.width / 2 + Math.cos(i * 0.1 + angle) * radius;
           const y = canvas.height / 2 + Math.sin(i * 0.1 + angle) * radius;

           if (i === 0) ctx.moveTo(x, y);
           else ctx.lineTo(x, y);
         }

         ctx.stroke();
         angle += 0.02;
         animationId = requestAnimationFrame(animate);
       }

       animate();

       return () => cancelAnimationFrame(animationId);
     }, [color]);

     return (
       <canvas
         ref={canvasRef}
         width={size}
         height={size}
         className="inline-block"
       />
     );
   }
   ```

2. Update Header component:
   ```tsx
   import { AnimatedSpiral } from '@/components/AnimatedSpiral';

   export function Header() {
     return (
       <header>
         <Link href="/">
           <AnimatedSpiral size={48} color="rgb(147, 51, 234)" />
         </Link>
       </header>
     );
   }
   ```

**Estimated effort**: 2-3 hours

#### Option 2: Use SVG Animation Libraries
**Pros**: No canvas needed, declarative, accessibility-friendly
**Cons**: Different visual result, may need tweaking

**Implementation**:
1. Install framer-motion or react-spring:
   ```bash
   npm install framer-motion
   ```

2. Create SVG spiral with animation:
   ```tsx
   'use client';

   import { motion } from 'framer-motion';

   export function AnimatedSpiralSVG() {
     return (
       <svg width="48" height="48" viewBox="0 0 48 48">
         <motion.path
           d="M24,24 Q24,12 36,12" // Simplified spiral path
           stroke="rgb(147, 51, 234)"
           strokeWidth="2"
           fill="none"
           animate={{ rotate: 360 }}
           transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
         />
       </svg>
     );
   }
   ```

**Estimated effort**: 1-2 hours

#### Option 3: Embed Vanilla JS via Script Tag
**Pros**: Reuse exact same code from landing page, zero refactoring
**Cons**: Not idiomatic React, harder to maintain, hydration issues

**Implementation**:
1. Copy spiral animation JS to `public/spiral-animation.js`
2. Load in Next.js using Script component:
   ```tsx
   import Script from 'next/script';

   export function Header() {
     return (
       <>
         <Script src="/spiral-animation.js" strategy="afterInteractive" />
         <header>
           <div id="header-spiral-container" className="h-12 w-12" />
         </header>
       </>
     );
   }
   ```

**Estimated effort**: 30 minutes
**Warning**: Not recommended - causes React hydration mismatches

#### Option 4: Shared Animation Component Package
**Pros**: Single source of truth, works in both vanilla JS and React
**Cons**: High complexity, requires build tooling

**Implementation**:
1. Create `recursive-shared/components/AnimatedSpiral`
2. Export both React component and vanilla JS version
3. Both apps import from shared package

**Estimated effort**: 4-6 hours

### Recommended Approach

**Option 1 (React Component)** for best long-term maintainability:

1. Extract spiral animation logic from landing page
2. Port to React with useEffect + canvas
3. Make configurable (size, color, speed)
4. Add to Next.js header

### Quick Win Alternative

If you want it working immediately, create a **static SVG logo** first:
```tsx
export function SpiralLogo() {
  return (
    <svg width="48" height="48" viewBox="0 0 100 100">
      <path
        d="M50,50 Q50,20 80,20 T80,80 T20,80 T20,20"
        stroke="rgb(147, 51, 234)"
        strokeWidth="3"
        fill="none"
      />
    </svg>
  );
}
```

Then animate it later when you have time.

## Future Enhancements

1. **Channel metadata in MDX frontmatter**:
   ```yaml
   ---
   name: Resources for Parents
   description: Curated content for parenting
   gradient: from-green-50 to-teal-100
   ---
   ```

2. **Real-time updates**: WebSocket or Server-Sent Events for instant header updates

3. **Analytics**: Track which channels users click from landing page

4. **A/B testing**: Different channel descriptions or ordering

## Migration Path

1. **Today**: Hardcode the 3 current channels in landing header
2. **Week 1**: Build API endpoint in channels app
3. **Week 2**: Update landing to fetch from API with fallback
4. **Week 3**: Add caching and monitoring
5. **Future**: Consider build-time generation if API becomes bottleneck
