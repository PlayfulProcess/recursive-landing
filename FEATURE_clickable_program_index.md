BEfore changing anything, create new dev branches called feature/program-and-report in both creator and landing projects

# Feature: Clickable Program Index (Page 0)

**Created:** 2025-12-06
**Launch Target:** Before Friday Dec 5
**Priority:** CRITICAL for launch
**Status:** Planning

  ✅ Creator:
  - Playlist import fetches all metadata automatically
  - Thumbnails appear in sidebar
  - Titles are human-readable (not video IDs)

  ✅ Viewer:
  - Duration displays for every video (MM:SS format)
  - Seek input jumps to exact timestamps
  - Controls show/hide based on content type
  - Visual feedback when seeking ("✓ Jumped!")

---

## ✅ COMPLETED: Report/Unpublish Button

**Status:** COMPLETED - Deployed to production

**Implemented Features:**
1. ✅ **Report Button** visible in viewer (always accessible)
2. ✅ **Popup Modal** with two options:
   - Option A: "Send email to admins" (email optional, no auth required)
   - Option B: "Unpublish immediately" (requires authentication via inline OTP)
3. ✅ **Email Notification** to pp@playfulprocess.com via Resend API
4. ✅ **Immediate Unpublishing** with inline OTP authentication
5. ✅ **CORS configured** for cross-domain email notifications

**Implementation Details:**
- Location: `recursive-landing/view.html`
- API endpoint: `recursive-creator/app/api/notify-report/route.ts`
- Anonymous reporting supported (email optional)
- Inline OTP authentication integrated into modal
- Clean, production-ready code

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

### ✅ COMPLETED: Report/Unpublish Feature (recursive-landing)

**Task 0: Report Button & Unpublish** - ✅ DONE
- Status: Completed and deployed to production
- Files modified:
  - `recursive-landing/view.html` (modal with inline OTP)
  - `recursive-creator/app/api/notify-report/route.ts` (CORS + email)
- Completed steps:
  1. ✅ Add "⚠️ Report" button to viewer controls (always visible)
  2. ✅ Create report modal with two options + inline OTP authentication
  3. ✅ Optional email for anonymous reports, auth required for unpublish
  4. ✅ Call Supabase to update `is_public = false` and `reported = true`
  5. ✅ Send email via Resend API to pp@playfulprocess.com
  6. ✅ Show success message to user
- **COMPLETED** - Ready to move on to YouTube API work

---

### ⚠️ ISSUE IDENTIFIED: Current YouTube Title Fetching NOT Working

**Problem:** Titles showing as "YT: GFSsRYmSlZ0" (video ID) instead of actual title
**Root Cause:** Task 2.7 implementation incomplete or broken
**Fix Required:** Implement proper 2-step YouTube API pattern (see below)

### ✅ Already Complete (from Task 2.7)
- ❌ YouTube API returns titles (BROKEN - only returns IDs)
- ❌ Titles saved to Supabase (NOT WORKING)
- ✅ CSV export infrastructure (works if data exists)

### 🔄 IN PROGRESS: Duration + Seek Feature (Quick Win - 2 hours)

**NEW Priority: Implement Duration Display + Seek Before Full Program**

**Why this approach:**
- ✅ Faster (2 hours vs 8-10 hours for full program)
- ✅ Immediately useful (users can jump to specific timestamps)
- ✅ Fetch ALL YouTube metadata now (duration, creator, thumbnails)
- ✅ Save everything to DB even if not displayed yet
- ✅ No API rework needed later for Program Index

**Implementation Plan:**

**Phase 0.5: Enhanced YouTube API + Duration/Seek** (2 hours)
1. Update YouTube API to fetch ALL metadata (30 min)
   - Duration (contentDetails.duration)
   - Channel name (snippet.channelTitle)
   - Better thumbnails (snippet.thumbnails.medium)
   - Save all fields to items array
2. Display duration in viewer (20 min)
3. Add seek input field (30 min)
4. Implement seek functionality (30 min)
5. Test and polish (10 min)

**Then Later: Full Program Index** (when ready)
- All metadata already available in DB
- Just build the UI

---

### 🔲 TODO: recursive-creator

**Task A: Enhance YouTube API - Fetch Full Metadata**
- Time: 30 minutes (just add more fields to existing API)
- File: `/api/extract-playlist/route.ts`
- **Current state:** Fetches titles successfully ✅
- **Enhancement:** Add duration, creator, better thumbnails

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

**UPDATED with new Duration + Seek approach:**

- ✅ **Task 0: Report/Unpublish (recursive-landing):** COMPLETE
- 🔄 **Phase 0.5: Duration + Seek (NEW - Quick Win):** 2 hours **← DOING NOW**
  - Enhance YouTube API with full metadata (30 min)
  - Display duration in viewer (20 min)
  - Add seek input field (30 min)
  - Implement seek functionality (30 min)
  - Test and polish (10 min)
- ⏳ **Full Program Index (Later):** 6-8 hours (optional, when needed)
  - Task D-E: Program Index UI (3-4 hours)
  - Task F: CSV updates (30 min)

**Current path:**
1. ✅ Report/Unpublish (safety first!) - COMPLETE
2. 🔄 Duration + Seek (immediate value) - 2 hrs **← NOW**
3. ⏳ Program index (nice-to-have) - Later

---

## 🐛 BUGS FOUND - Need to Fix

### Bug #1: 401 Error When Loading Existing Projects
- **Issue:** Can't edit existing sequences - Supabase returns 401 Unauthorized
- **Error:** `Failed to load resource: the server responded with a status of 401`
- **URL:** `/rest/v1/user_documents?select=*&id=eq.{ID}&user_id=eq.{USER_ID}`
- **Impact:** Users can't edit previously created sequences
- **Likely Cause:** RLS policy issue or auth token not being passed correctly
- **File:** `app/dashboard/sequences/new/page.tsx` (edit mode fetch logic)

### Bug #2: "Update Sidebar" Button Disabled After Changing Links
- **Issue:** After editing URLs in bulk textarea, "Update Sidebar →" button stays disabled
- **Impact:** Can't update/refresh the sidebar with new links
- **Likely Cause:** State management issue - button enable/disable logic
- **File:** `app/dashboard/sequences/new/page.tsx` (button disabled condition)

### ✅ SOLUTION DECIDED: Clickable Progress Bar (YouTube-style)

**NEW APPROACH - Implementing Now:**
- **What:** Standard red/purple progress bar (like YouTube)
- **Features:**
  - Visual progress indicator (bar fills as video plays)
  - Click anywhere on bar to seek to that position
  - Shows current time / total duration (e.g., "2:35 / 16:20")
  - Mobile-friendly (tap anywhere on bar)
  - Universal UX pattern everyone understands
- **Why Better Than Timestamp Input:**
  - ✅ More intuitive - see progress visually
  - ✅ Easier to use - click to jump (no typing)
  - ✅ Mobile-friendly - touch anywhere
  - ✅ Standard pattern - familiar to all users
- **Implementation:** 30-45 minutes (YouTube Player API makes this easy)
- **Files:** `view.html` (viewer) + `SequenceViewer.tsx` (creator)

### ❌ DEPRECATED APPROACH: Timestamp Input Field
- **What was planned:** Text input for MM:SS format (e.g., "2:35")
- **Why deprecated:**
  - Less intuitive than progress bar
  - Mobile keyboard issues
  - Not standard UX pattern
  - More complex for users
- **Status:** Not pursuing this approach

### ✅ GOOD NEWS:
- **Metadata saving correctly!** All fields present in DB:
  - ✅ `duration_seconds`
  - ✅ `creator`
  - ✅ `thumbnail`
  - ✅ `title`
- **Viewer is working!**

### Creator UX Issue #1: Need Manual Sync Between Links and Sidebar
- **Current:** Automatic bidirectional sync (confusing)
- **Requested:** Manual sync via buttons
  - "Update Sidebar" button: Links → Sidebar (already exists but disabled?)
  - **NEW:** "Update Links" button: Sidebar → Links box
  - **What gets saved:** The links in the text box
- **Reasoning:** More control, less confusion about which is source of truth
- **File:** `app/dashboard/sequences/new/page.tsx`

### Creator UX Issue #2: Position Input Changes Immediately
- **Current:** When typing position number, item moves on each keystroke
- **Problem:** Can't delete number and type new one (e.g., change 1 → 10 moves through 0, invalid states)
- **Requested:** Position only changes on Enter key
  - User can delete current number
  - Type new number
  - Press Enter to move
- **Future enhancement:** Drag-and-drop reordering (mobile-friendly)
- **File:** `app/dashboard/sequences/new/page.tsx` (position input onChange handler)

### TODO - Current Work:
- [ ] **🔄 IMPLEMENTING NOW: Clickable progress bar (YouTube-style)**
  - [ ] viewer (recursive-landing/view.html)
  - [ ] creator preview (recursive-creator/SequenceViewer.tsx)
  - Visual progress, click to seek, current/total time display
- [ ] Fix 401 error when loading existing projects for editing
- [ ] Fix "Update Sidebar" button staying disabled after text changes
- [ ] **Add "Update Links" button (sidebar → links box)**
- [ ] **Fix position input to only change on Enter (not every keystroke)**
- [ ] Test edit flow: load existing → modify → save → verify

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
