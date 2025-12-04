BEfore changing anything, create new dev branches called feature/program-and-report in both creator and landing projects

# Feature: Clickable Program Index (Page 0)

**Created:** 2025-12-06
**Launch Target:** Before Friday Dec 5
**Priority:** CRITICAL for launch
**Status:** Planning

---

## 🚨 CRITICAL SAFETY FEATURE: Report/Unpublish Button

**HIGHEST PRIORITY** - Implement this FIRST before program index

**Concern:** Users can replace content in Drive links with inappropriate material later. Parents need immediate control.

**Feature Requirements:**
1. **Report Button** visible in viewer (always accessible)
2. **Popup Modal** with two options:
   - Option A: "Report Content" (just notify)
   - Option B: "Unpublish & Report" (requires 50+ char explanation)
3. **Email Notification** to pp@playfulprocess.com via Resend API
4. **Immediate Unpublishing** if user chooses Option B

**Implementation:**
- Time: 2-3 hours
- Location: `recursive-landing/view.html`
- Resend API key: Already in env variables in other projects
- Email template: Simple alert with doc ID, user concern, timestamp

**User Flow:**
```
1. Parent watching playlist with kids
2. Sees inappropriate content (Drive link replaced)
3. Clicks "⚠️ Report" button (always visible)
4. Modal opens:
   ┌────────────────────────────────────┐
   │  Report Content Issue              │
   │  ────────────────────────────────  │
   │                                    │
   │  Did you find inappropriate        │
   │  content in this playlist?         │
   │                                    │
   │  [ ] Just notify me (I'll check)  │
   │  [ ] Unpublish immediately         │
   │      (requires explanation)        │
   │                                    │
   │  [Textarea: 50+ chars required]    │
   │                                    │
   │  [Cancel]  [Submit Report]         │
   └────────────────────────────────────┘
5. If "Unpublish" checked:
   - Update DB: is_published = 'false'
   - Show message: "Content unpublished. Thank you."
6. Send email either way
```

**Email Content:**
```
Subject: [URGENT] Content Report - recursive.eco

Document ID: abc123
Report Type: [Unpublished / Notification Only]
Timestamp: 2025-12-06 14:32:15
Viewer URL: https://recursive.eco/view/abc123

User Explanation:
[Their 50+ char message]

Action Needed: Review content immediately
```

**Why This Is Critical:**
- User can hijack Drive links → fill with porn/violence
- Parents watching with kids need instant action
- Can't wait for manual review if content is already bad
- Trust & safety > everything else for launch

---

## 🎯 Vision

Every playlist starts with a beautiful "program" (like a theater program) showing:
- Thumbnail of each video
- Title (from YouTube API or user override)
- Duration
- Clickable to jump directly to that item

**Why this matters:**
- Parents can see what's in the playlist before showing kids
- Builds trust and transparency
- Honors creators with visible attribution
- Solves the "bug" mentioned in Substack post about not seeing titles

---


## 📐 User Experience

### Discovery Flow (Viewer)
1. User opens playlist URL: `https://recursive.eco/view/abc123`
2. **Page 0 loads** - The Program (text-based, like theater playbill):
   ```
   ┌─────────────────────────────────────────┐
   │  Degas & Monet: Ballet & Painting       │
   │  A calm playlist for family art time    │
   │                                          │
   │  Program:                                │
   │  ────────────────────────────────────   │
   │                                          │
   │  1. Mati & Dada: Introduction to Degas  │
   │     Mati & Dada • 7:32                  │
   │                                          │
   │  2. Water Lilies (Monet, 1919)          │
   │     Visual Pause                        │
   │                                          │
   │  3. Ballet Class: Warm-up & Stretching  │
   │     GVO Kids Ballet • 12:15             │
   │                                          │
   │  4. Painting Activity: Water Lilies     │
   │     Guided Activity                     │
   │                                          │
   │  [Download Program (.csv)]              │
   │  [▶ Start Watching]                     │
   └─────────────────────────────────────────┘
   ```

3. Click "Start Watching" → goes to item 1
4. OR click any numbered item → jumps directly to that item
5. "See Program" button visible in viewer controls → returns to Page 0

**Design Decision: Text-Only Program**
- No thumbnails in the index (cleaner, faster, more elegant)
- YouTube videos: Show title • creator • duration
- Drive images: Only show if user added a title in creator
  - If titled: "Water Lilies (Monet, 1919)" • Visual Pause
  - If untitled: Skip in program (it's a visual transition, not an "act")

### Creation Flow (Creator)

When importing YouTube playlist:
1. API returns: `{ title, thumbnail, duration, videoId }`
2. Creator sees table in sidebar:
   ```
   Title (editable)     | Duration | Thumbnail
   ──────────────────────────────────────────
   Mati & Dada: Degas  | 7:32     | [img]
   ```
3. User can override title
4. When publishing → all saved to Supabase

---

## 🏗️ Technical Architecture

### Phase 1: Backend (recursive-creator)

**Goal:** Save full YouTube metadata when importing

**Changes to `/api/extract-playlist/route.ts`:**
```typescript
// Already returns (from previous fix):
{
  video_id: string,
  title: string,
  url: string,
  thumbnail: string  // ← ALREADY HAVE THIS!
}

// ADD:
{
  duration: string,  // e.g., "PT7M32S" from YouTube API
  thumbnailUrl: string  // medium quality (320x180)
}
```

**Changes to `page.tsx` (recursive-creator):**
- Already saves `title` ✅ (from Task 2.7)
- Need to add: `thumbnail_url`, `duration_seconds`
- Add these fields to SequenceItem interface
- Display thumbnail preview in sidebar

**Supabase schema:**
```json
{
  "items": [
    {
      "position": 1,
      "type": "video",
      "video_id": "abc123",
      "url": "https://youtube.com/watch?v=abc123",
      "title": "Introduction to Degas",
      "creator": "Mati & Dada",  // ← Channel name from YouTube API
      "thumbnail_url": "https://i.ytimg.com/vi/abc123/mqdefault.jpg",
      "duration_seconds": 452  // 7:32 in seconds
    },
    {
      "position": 2,
      "type": "image",
      "image_url": "https://drive.google.com/...",
      "title": "Water Lilies (Monet, 1919)",  // ← User added in creator
      "narration": "A peaceful moment to reflect"
    },
    {
      "position": 3,
      "type": "image",
      "image_url": "https://drive.google.com/...",
      "narration": "Visual pause"  // ← No title = skip in program
    }
  ]
}
```

### Phase 2: Frontend (recursive-landing)

**Goal:** Generate and display Page 0 index

**New component: Program Index**
- Insert as `position: 0` (virtual item, not in DB)
- Auto-generated from `items[]` array
- Shows grid of thumbnails + titles + durations
- Click item → `displayItem(clickedIndex + 1)` (offset by 1 for Page 0)

**Changes to `view.html`:**
1. Add "See Program" button in controls
2. Generate index HTML from items array
3. Handle clicks on index items
4. Format duration (452 seconds → "7:32")

**Styling:**
- Use Tailwind grid: `grid grid-cols-1 md:grid-cols-2 gap-4`
- Thumbnail: 320x180 (YouTube medium quality)
- Hover effect on clickable items
- Mobile-friendly (stacks vertically)

---

## 📋 Implementation Plan

### 🚨 PRIORITY 0: Report/Unpublish Feature (recursive-landing)

**Task 0: Implement Report Button & Unpublish**
- Time: 2-3 hours
- File: `recursive-landing/view.html`
- Dependencies: Resend API (check env var location in other projects)
- Steps:
  1. Add "⚠️ Report" button to viewer controls (always visible)
  2. Create report modal with checkboxes + textarea
  3. Validate 50+ char explanation if unpublishing
  4. Call Supabase to update `is_published = 'false'`
  5. Send email via Resend API to pp@playfulprocess.com
  6. Show success message to user
- **DO THIS FIRST** before YouTube API work

---

### ⚠️ ISSUE IDENTIFIED: Current YouTube Title Fetching NOT Working

**Problem:** Titles showing as "YT: GFSsRYmSlZ0" (video ID) instead of actual title
**Root Cause:** Task 2.7 implementation incomplete or broken
**Fix Required:** Implement proper 2-step YouTube API pattern (see below)

### ✅ Already Complete (from Task 2.7)
- ❌ YouTube API returns titles (BROKEN - only returns IDs)
- ❌ Titles saved to Supabase (NOT WORKING)
- ✅ CSV export infrastructure (works if data exists)

### 🔲 TODO: recursive-creator

**Task A: FIX + Enhance YouTube API - Proper 2-Step Pattern**
- Time: 2-3 hours (complete rewrite needed)
- File: `/api/extract-playlist/route.ts`
- **Current issue:** Only fetches `playlistItems` (returns video IDs only)
- **Fix:** Implement 2-step pattern from YouTube API docs:

**Step 1: Get video IDs from playlist**
```javascript
// Current call (keep this)
GET /youtube/v3/playlistItems?part=snippet&playlistId={id}
// Returns: video IDs only
```

**Step 2: Batch fetch full video metadata** (NEW)
```javascript
// NEW call - fetch up to 50 videos at once
GET /youtube/v3/videos?part=snippet,contentDetails&id={id1,id2,id3...}
// Returns: title, channelTitle, thumbnails, duration for each video
```

**What to fetch from videos endpoint:**
- `snippet.title` - Video title (e.g., "Introduction to Degas")
- `snippet.channelTitle` - Creator (e.g., "Mati & Dada")
- `snippet.thumbnails.medium.url` - 320x180 thumbnail
- `contentDetails.duration` - ISO 8601 format (e.g., "PT7M32S")

**Duration parsing:**
```javascript
function parseDuration(isoDuration) {
  // PT7M32S → 452 seconds
  const regex = /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/;
  const matches = isoDuration.match(regex);
  const hours = parseInt(matches[1]) || 0;
  const minutes = parseInt(matches[2]) || 0;
  const seconds = parseInt(matches[3]) || 0;
  return hours * 3600 + minutes * 60 + seconds;
}
```

**Quota cost:**
- playlistItems: 1 unit
- videos (batch 50): 1 unit per batch
- Total for 50 videos: 2 units (very efficient!)

**Task B: Save thumbnail & duration to DB**
- Time: 1 hour
- File: `app/dashboard/sequences/new/page.tsx`
- Add fields to SequenceItem interface
- Store in videoMetadata Map
- Save to items array when parsing

**Task C: Display thumbnails in creator sidebar**
- Time: 1 hour
- Show small thumbnail next to each item
- Visual preview of playlist

### 🔲 TODO: recursive-landing

**Task D: Generate Program Index (Page 0)**
- Time: 2-3 hours
- Create index HTML from items array
- Grid layout with thumbnails
- Format durations (seconds → MM:SS)
- "Start Watching" and individual item clicks

**Task E: Navigation integration**
- Time: 1 hour
- Add "See Program" button in controls
- Handle index clicks (offset by 1)
- Update page counter (0 of 12, then 1 of 12, etc.)

**Task F: Update CSV export**
- Time: 30 min
- Include duration column
- Include thumbnail URLs (for reference)

---

## ⏱️ Total Time Estimate

**UPDATED with Report feature + YouTube API fix:**

- **Task 0: Report/Unpublish (recursive-landing):** 2-3 hours **← DO FIRST**
- **Task A: Fix YouTube API (recursive-creator):** 2-3 hours
- **Task B-C: Save to DB + Display in creator:** 2 hours
- **Task D-E: Program Index (recursive-landing):** 3-4 hours
- **Task F: CSV updates:** 30 min
- **Total:** 9.5-12.5 hours (about 2-3 work sessions)

**Launch-critical path:**
1. Report/Unpublish (safety first!) - 2-3 hrs
2. Fix YouTube API (titles broken!) - 2-3 hrs
3. Program index (trust & transparency) - 3-4 hrs

---

## 🎨 Design Notes

**Text-Only Program (No Thumbnails):**
- Cleaner, more elegant (like theater playbill)
- Faster to load
- Better for printing/accessibility
- YouTube thumbnails fetched for future features, but not shown in index

**For Drive images:**
- **If user added title in creator:** Show in program
  - Example: "Water Lilies (Monet, 1919) • Visual Pause"
- **If no title:** Skip in program (it's a visual pause/transition between "acts")
- **Narration:** Can show as subtitle if present

**For Drive videos:**
- Phase 2 (later) - Drive API has duration/metadata
- For now: Show as "Video • [Title from user]"

**Accessibility:**
- Alt text for all thumbnails
- Keyboard navigation through index
- Screen reader friendly

---

## 🚀 Launch Checklist

Before Friday Dec 13:
- [ ] YouTube thumbnails fetched and saved
- [ ] Duration converted and saved
- [ ] Program index renders at Page 0
- [ ] Index is clickable and navigates correctly
- [ ] "See Program" button works
- [ ] CSV export includes duration
- [ ] Mobile tested
- [ ] Existing playlists migrated (or gracefully handle missing data)

---

## 🤔 Open Questions

1. **Existing playlists without thumbnails/duration:**
   - Fetch on-demand when viewing?
   - Show placeholder?
   - Run migration script?

2. **Index position:**
   - Page 0 (before all content)?
   - Accessible via button only?
   - Both?

3. **User overrides:**
   - Can users upload custom thumbnail?
   - Or always use YouTube thumbnail?

4. **Auto-generated program image:**
   - Do we want to generate an actual image (PNG) of the program?
   - Or just HTML index?

---

## 💡 Future Enhancements (Post-Launch)

- **Print-friendly program** - CSS for printing
- **Share program** - Separate URL just for index
- **Embed thumbnails in .ics** - Calendar event with images
- **Drive video thumbnails** - Phase 2
- **Custom thumbnail upload** - For user-created images
- **Program as downloadable PDF** - Beautiful formatted program

---

**Ready to implement?** Let me know if you want to start with recursive-creator (backend) or recursive-landing (frontend) first!
