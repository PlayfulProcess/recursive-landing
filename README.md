# Recursive Landing

The plain vanilla JavaScript landing page and anonymous-access side of the [Recursive.eco](https://recursive.eco) ecosystem.

## What is Recursive.eco?

Open source tools and curated content for meaning-making recursively — building rituals, stories, and understanding through make-belief, art, and contemplative practice.

This landing page provides:
- Public-facing content and tool discovery
- Curated playlists (art, wellness, creative rituals)
- Anonymous access to view content (no login required)
- Email collection for community interest

**For authenticated features** (creating, publishing, account management), users move to the creator hub at [creator.recursive.eco](https://creator.recursive.eco). FOr submitting for discovery, users go to channels.recursive.eco and for journaling with AI, to journal.recursive.eco. 

## Local preview (Windows PowerShell)

Open the folder in VS Code and use the Live Server extension, or start a lightweight HTTP server of your choice. Files:
- `index.html`
- `style.css`
- `script.js`

## Deploy

Host on Vercel (static) or any static host. The included `vercel.json` config works out of the box.

## Design Philosophy: Intentional Safety Design for Family Content

### Why we disable "click-through" to YouTube in the content viewer

**This platform is designed for parents who want to curate calm, focused viewing experiences.**

We do not allow direct click-through to YouTube from inside the viewer. Instead, we show the original source link visibly, but it cannot be tapped accidentally.

**⚠️ Important: This is not a substitute for parental supervision.** This platform is designed for parents to use WITH their families, not as unsupervised content for children. We are not COPPA-compliant and require active parent involvement.

#### Here's why:

**1️⃣ The open web is unpredictable — even when content is safe**

While researching children's art videos, I discovered that even carefully curated content can become unsafe over time. For example, the YouTube channel [@ArtwithMatiDada](https://www.youtube.com/@ArtwithMatiDada) — a wonderful kids' art series — had a link in their channel description to what is now a Chinese website (`matidada.com`) filled with:

- graphic adult romance
- explicit sexual categories
- unmoderated spam
- pirated fiction
- ads and content unsuitable for children

**This site had nothing to do with the original kids' creators.** It's simply an example of how domains can be:

- hijacked
- expired and re-sold
- redirected
- scraped, or
- polluted with spam

Even careful parents following what seems like a legitimate link can end up somewhere unsafe.

**2️⃣ Children explore by clicking**

A single mis-tap can take them from a calm art video to:

- thumbnails designed to maximize clicks
- unrelated adult content
- comment sections
- recommended videos
- autoplay rabbit holes that develop unhealthy dopamine patterns

**3️⃣ This platform is intentionally designed for calm and safety**

Because of this, our viewer:

- removes clickable areas
- blocks autoplay and thumbnails
- keeps children inside a single calm video
- shows the original link for transparency
- but does not make that link tappable

**This protects children while respecting content creators** by crediting and linking properly.

**4️⃣ Parents stay in control**

If a parent wants to open the YouTube page:

- the link is clearly displayed
- they can export a full CSV with all titles and links ("See the Program" button)
- they can copy the link manually if needed
- but it cannot be opened by accident

This keeps the child's experience serene, predictable, and ad-free, while maintaining transparency and source integrity.

### Attribution & Creator Respect

We provide multiple ways to ensure proper attribution:

1. **Visual display** - Each video shows its YouTube source link
2. **CSV export** - "See the Program" button downloads complete list of titles and links
3. **No content claiming** - All content is clearly attributed to original creators
4. **Educational/personal use** - Small community (max ~1000 families) for curated viewing

This approach balances:
- ✅ Child safety (no accidental clicks into unmoderated content)
- ✅ Creator attribution (full transparency and credit)
- ✅ Parent control (easy access to sources when needed)
- ✅ Calm experience (no algorithmic rabbit holes)

---

## Visual Design Principles

The visual design of Recursive.eco follows these core principles, guided by artist Fernando Carnauba:

### Clean, Minimal Aesthetic

**No boxes or cards**
- Avoid visual containers that create artificial boundaries
- Let content breathe with natural whitespace
- Remove background colors, borders, and shadow effects

**No icons or emojis**
- Rely on typography and layout hierarchy
- Use font weight, size, and color for emphasis
- Keep the visual language clean and timeless

**Consistent Pattern Throughout**
- Match the hero section aesthetic across all pages
- Use the same spacing, typography, and layout principles
- Create visual flow through repetition and rhythm

### Typography & Hierarchy

- **Headings**: Bold, clear, generous spacing
- **Body text**: Comfortable line-height, easy readability
- **Emphasis**: Font weight and color (not boxes or backgrounds)
- **Quotes**: Subtle left border accent (purple), italic text

### Whitespace as a Design Element

- Generous margins and padding
- Section spacing that creates natural reading rhythm
- Allow content to have room to breathe
- Resist the urge to fill empty space

### Color & Accents

- **Primary accent**: Purple (`#9b59b6`, `#7c3aed`)
- **Text**: Gray scale for hierarchy (`gray-900`, `gray-700`, `gray-600`)
- **Minimal use**: Color draws attention, use sparingly
- **Borders**: Thin, subtle, only when serving clear purpose

### Content-First Philosophy

- Design serves the content, not the other way around
- Remove any element that doesn't serve the reader
- Clarity over decoration
- Elegance through simplicity

These principles create a calm, focused reading experience that respects the user's attention and the content's importance.

---

## License

Creative Commons Attribution-ShareAlike 4.0. See `LICENSE`.
