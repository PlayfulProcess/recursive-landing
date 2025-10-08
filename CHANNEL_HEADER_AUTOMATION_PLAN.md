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
