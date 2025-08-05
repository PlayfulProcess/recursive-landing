# Testing Instructions for Jongu Landing Page

## Quick Local Testing

### Method 1: Direct File Opening (Simplest)
```bash
# Navigate to the landing page folder
cd jongu-landing

# Open the HTML file directly in your browser (Windows)
start index.html

# Or double-click on index.html in File Explorer
```

### Method 2: Local Web Server (Recommended)
```bash
# From the jongu-landing folder
cd jongu-landing

# Option A: Python server
python -m http.server 8000
# Then open http://localhost:8000 in your browser

# Option B: Node.js server (if you have http-server installed)
npx http-server
# Then open the URL shown in terminal
```

## What to Test

### 1. **Layout & Responsiveness**
- [ ] Resize browser window to test mobile/tablet views
- [ ] Use browser dev tools (F12) to test different screen sizes
- [ ] Check that all sections display properly on different devices

### 2. **Logo & Header**
- [ ] Verify logo displays correctly at larger size
- [ ] Check that "JONGU" text is removed (only logo + EXPERIMENT tag)
- [ ] Test header buttons: Donate and Discord links

### 3. **Navigation & Links**
- [ ] Hero button: "Explore Our Channels" → should link to wellness.jongu.org
- [ ] Best Possible Self Tool section: Try button → should link to wellness-tool.jongu.org
- [ ] Learn About Experiment button → should scroll to experiment section
- [ ] Wellness Tools section: Try button → should link to wellness.jongu.org
- [ ] All donation links → should link to Stripe
- [ ] Discord links → should open Discord invite
- [ ] PlayfulProcess.com link → should open in new tab

### 4. **Content Structure**
- [ ] Hero section: Simple with one main CTA
- [ ] Best Possible Self section: Formatted like wellness tools section
- [ ] PlayfulProcess section: Moved to bottom before "Join the experiment"
- [ ] All sections flow logically

### 5. **Styling & Animations**
- [ ] Logo animations (floating animation in hero)
- [ ] Button hover effects
- [ ] Card hover effects
- [ ] Gradient backgrounds and text
- [ ] Color consistency throughout

## Deploy for Live Testing

### Option 1: Vercel (Easiest)
```bash
# From jongu-landing folder
cd jongu-landing
vercel
# Follow prompts to deploy
```

### Option 2: Netlify
1. Go to [netlify.com](https://netlify.com)
2. Drag and drop the `jongu-landing` folder
3. Get instant live URL

## Troubleshooting

### Logo Not Showing
- Check that `Jongulogo.png` exists in the jongu-landing folder
- Verify image path in HTML is correct

### Discord Link Not Working
- The link structure now matches jongu-wellness with `target="_blank" rel="noopener noreferrer"`
- Should open Discord invite in new tab

### Links Not Working
- If testing with file:// protocol, some links might behave differently
- Use local server method for more accurate testing

## Browser Compatibility
Test in multiple browsers:
- [ ] Chrome
- [ ] Firefox  
- [ ] Safari (if on Mac)
- [ ] Edge

## Performance Check
- [ ] Page loads quickly
- [ ] Images display properly
- [ ] No console errors (check browser dev tools)
- [ ] Smooth scrolling between sections