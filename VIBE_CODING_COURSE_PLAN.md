# Vibe Coding Course Implementation Plan

## Overview
Create a new "Courses" section within Studies on recursive-landing to host interactive coding courses, starting with the Vibe Coding Course.

## Project Structure

```
recursive-landing/
├── pages/
│   └── studies/
│       └── courses/
│           ├── index.html              # Course catalog/landing page
│           ├── course-viewer.html      # Reusable course viewer template
│           ├── courses/
│           │   └── vibe-coding-101.mdx # Single MDX file per course
│           └── images/
│               ├── vibe-coding-101/
│               │   ├── customize-button.png
│               │   ├── share-example.png
│               │   ├── version-control.png
│               │   ├── artifacts-section.png
│               │   ├── publish-button.png
│               │   └── projects.png
│               └── [future-course-id]/
│                   └── ...
```

**Simplified Structure:**
- One MDX file per course (easier to manage for brief courses)
- Shared `course-viewer.html` template for all courses
- Images organized by course ID
- React components parse MDX and generate navigation from headers

## Course Page Features

### 1. Fixed Table of Contents (Sidebar)
- Sticky navigation on left side (desktop) or collapsible menu (mobile)
- Auto-highlights current section as user scrolls
- Jump links to each section:
  - Introduction
  - Prerequisites (5m)
  - Section 1: Adapting a Tool (20m)
  - Section 2: Create from Scratch (15m)
  - Section 3: Your Personalized Tool (20m)

### 2. Main Content Area
- Hero section with course title and overview
- Time estimate badges
- Progress indicators
- Rendered MDX content with:
  - Syntax highlighting for code
  - Embedded images
  - Step-by-step instructions
  - Collapsible tips/pro-tips
  - Action buttons (e.g., "Try this tool")

### 3. Progress Tracking (Optional Future Enhancement)
- LocalStorage to track completion
- Checkboxes for each step
- "Mark as complete" buttons

## Course Content Structure

### Vibe Coding 101 Course Outline

**Course ID:** `vibe-coding-101`

**Sections:**

1. **Introduction** (`introduction.mdx`)
   - What is Vibe Coding
   - What you'll build
   - Expected outcomes
   - Share your work CTA

2. **Prerequisites** (`prerequisites.mdx`)
   - Sign up for Claude
   - Time: 5 minutes

3. **Section 1: Adapting a Tool** (`section-1-adapting.mdx`)
   - Step 1: Interact with tool (5m)
   - Step 2: Try customizations (10m)
     - Example prompts
     - Share chat example
   - Step 3: Your own ideas (4m)
     - Prompt engineering tips
     - Version control tips
   - Step 4: Publish (1m)
   - Images: customize-button, share-example, version-control, artifacts-section, publish-button

4. **Section 2: Create from Scratch** (`section-2-from-scratch.mdx`)
   - Step 1: Reference (2m)
   - Step 2: Prompt (3m)
     - Example prompts
     - IP & attribution requirements
   - Step 3: Optimize (10m)
   - Share chat example

5. **Section 3: Your Personalized Tool** (`section-3-personalized.mdx`)
   - Step 0: Create Project (optional, 5m)
     - Projects feature explanation
     - System prompt examples
   - Step 1: Create prompt (10m)
     - Prompt engineering with Claude
   - Step 2: Build & customize (2m)
   - Step 3: Share your work (3m)
   - Images: projects screenshot

## Technical Implementation

### MDX File Structure
Each course is a single MDX file with special markers for sections:

```mdx
---
id: vibe-coding-101
title: "Vibe Coding with Claude: Building 3 Journaling AI Tools in 1 hour"
description: "A personalized interactive tool where users can write and get AI feedback on any topic"
duration: 60
author: PlayfulProcess
date: 2025-08-25
---

# {title}

## Introduction {#introduction}
⏰ Total time: 60 minutes
📱 Works on desktop (recommended) or mobile
💾 No coding required

Content here...

## Prerequisites {#prerequisites data-duration="5"}
Content here...

## Section 1: Adapting a Tool {#section-1 data-duration="20"}
Content here...

### Step 1: Interact with the tool {#section-1-step-1 data-duration="5"}
Content here...

![Screenshot](../images/vibe-coding-101/customize-button.png)
```

**How it works:**
- Frontmatter (YAML) contains course metadata
- Headers (`##`, `###`) become navigation items
- `{#id}` syntax creates anchor IDs for jump links
- `data-duration` attributes for time estimates
- React/JS parses the MDX and auto-generates the nav tree

### MDX Processing Options

**Option A: Client-Side (Simpler, No Build Step)**
- Use `marked.js` or `markdown-it` for parsing
- Custom JS to extract headers and build navigation
- Works with static file hosting

**Option B: Pre-rendered (Better Performance)**
- Use `@mdx-js/mdx` to compile at build time
- Generate static HTML
- Requires build step but faster for users

### Navigation Component
```html
<nav class="course-nav">
  <ul>
    <li><a href="#introduction">Introduction</a></li>
    <li><a href="#prerequisites">Prerequisites (5m)</a></li>
    <li>
      <a href="#section-1">Section 1: Adapting (20m)</a>
      <ul>
        <li><a href="#section-1-step-1">Step 1: Interact</a></li>
        <li><a href="#section-1-step-2">Step 2: Customize</a></li>
        <li><a href="#section-1-step-3">Step 3: Your Ideas</a></li>
        <li><a href="#section-1-step-4">Step 4: Publish</a></li>
      </ul>
    </li>
    <!-- ... more sections -->
  </ul>
</nav>
```

### Scroll Spy JavaScript
```javascript
// Highlight current section in nav based on scroll position
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.course-nav a');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    if (scrollY >= sectionTop - 100) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
});
```

## Styling Considerations

### Design System
- Use existing recursive-landing Tailwind classes
- Course-specific styles:
  - Step numbers with colored circles
  - Time badges (e.g., `⏰ 5m`)
  - Completion checkboxes
  - Code blocks with syntax highlighting
  - Tip/warning/pro-tip callout boxes
  - Image captions

### Responsive Design
- Desktop: Sidebar nav (25% width) + Content (75% width)
- Tablet: Collapsible sticky header nav
- Mobile: Hamburger menu for nav

## Content Migration Steps

1. Create folder structure
2. Extract content from blog post into MDX files
3. Download/create course images
4. Build course page template (HTML + CSS)
5. Add scroll spy navigation
6. Test all links and images
7. Add to Studies page as "Vibe Coding Course"

## Future Enhancements

### Multi-Course Support
- Course catalog page (`courses/index.html`)
- Course card components
- Filter by topic/duration
- Search functionality

### Interactive Features
- Embedded Claude artifacts
- Live code editors
- Video tutorials
- Community submissions gallery
- Certificate of completion

### Analytics (Optional)
- Track which steps users complete
- Time spent on each section
- Completion rates

## Integration with Studies Page

Update `pages/studies.html` to include:

```html
<div class="study-card">
  <h3>🎓 Courses</h3>
  <div class="course-list">
    <a href="/pages/studies/courses/vibe-coding-101/" class="course-link">
      <h4>Vibe Coding 101</h4>
      <p>Build 3 AI tools in 1 hour using Claude</p>
      <span class="duration">⏰ 60 minutes</span>
    </a>
  </div>
</div>
```

## Timeline Estimate

- **Structure Setup:** 30 minutes
- **Content Migration:** 1-2 hours
- **Styling & Layout:** 2-3 hours
- **Navigation & Scroll Spy:** 1 hour
- **Testing & Polish:** 1 hour
- **Total:** 5-7 hours

## Next Steps

1. Create dev branch: `dev-vibe-coding-course`
2. Create folder structure
3. Extract and organize content into MDX files
4. Build course page template
5. Test and refine
6. Merge to main

---

## Notes

- Keep it simple initially - can enhance later
- Focus on clear navigation and readable content
- Ensure mobile-friendly from the start
- Consider using static HTML + Markdown instead of MDX for simplicity
- All external links should open in new tabs
- Include clear CTAs to share work in comments
