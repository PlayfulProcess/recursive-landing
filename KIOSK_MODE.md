# Kiosk Mode Setup Guide for Recursive.eco

This guide explains how to set up Recursive.eco as a locked-down PWA (Progressive Web App) for Android tablets, ideal for creating a safe browsing environment for children.

## Table of Contents
1. [Overview](#overview)
2. [PWA Installation](#pwa-installation)
3. [Android Kiosk Mode Setup](#android-kiosk-mode-setup)
4. [Security Features](#security-features)
5. [Allowed Domains](#allowed-domains)
6. [YouTube Embedding Security](#youtube-embedding-security)
7. [Supabase Integration](#supabase-integration)
8. [Limitations & Alternatives](#limitations--alternatives)
9. [Troubleshooting](#troubleshooting)

---

## Overview

Recursive.eco can be configured as a **standalone PWA** that runs in kiosk mode on Android tablets. This setup:
- Removes browser UI (address bar, back button)
- Restricts navigation to only allowed domains
- Prevents users from accessing external websites
- Allows YouTube video playback without access to YouTube.com

### Security Layers
1. **PWA Standalone Mode** - No browser chrome visible
2. **Service Worker** - Intercepts and blocks unauthorized requests
3. **Content Security Policy (CSP)** - Server-side request restrictions
4. **Sandboxed Iframes** - YouTube embeds cannot navigate away
5. **Android Screen Pinning** - Device-level app locking

---

## PWA Installation

### On Android (Chrome)

1. **Open Chrome** on the Android tablet
2. **Navigate** to `https://recursive.eco` (or your Vercel preview URL)
3. **Wait** for the "Add to Home Screen" prompt, or:
   - Tap the **three-dot menu** (⋮)
   - Select **"Add to Home screen"** or **"Install app"**
4. **Confirm** the installation
5. The app icon will appear on your home screen

### On iOS (Safari)

1. **Open Safari** and go to `https://recursive.eco`
2. Tap the **Share** button (square with arrow)
3. Select **"Add to Home Screen"**
4. Tap **"Add"** to confirm

**Note:** iOS has more limited PWA support. The app runs in standalone mode but some features may behave differently.

---

## Android Kiosk Mode Setup

### Method 1: Screen Pinning (Simple)

Screen pinning locks the device to a single app. Users cannot switch apps without a PIN.

#### Enable Screen Pinning
1. Go to **Settings > Security > Screen Pinning** (or **Settings > Security & location > Advanced > Screen pinning**)
2. Toggle **Screen pinning** to **ON**
3. Enable **"Ask for PIN before unpinning"** for security

#### Pin the PWA
1. Open the **Recursive.eco PWA** from your home screen
2. Tap the **Overview button** (square or recent apps)
3. Tap the **app icon** at the top of the Recursive.eco card
4. Select **"Pin"** or **"Pin this app"**

#### Unpin (Parent Only)
- Hold the **Back** and **Overview** buttons simultaneously
- Enter your **PIN/pattern** when prompted

### Method 2: Device Owner Mode (Enterprise)

For more robust locking, use Android's Device Owner mode with an MDM (Mobile Device Management) solution:

1. **Samsung Knox** - For Samsung tablets
2. **Google Work Profile** - Enterprise managed devices
3. **Third-party MDM** - Scalefusion, Hexnode, ManageEngine

These solutions can:
- Completely lock down the device to a single app
- Disable hardware buttons
- Prevent access to settings
- Auto-launch the PWA on boot

### Method 3: Dedicated Kiosk Browser Apps

If you need more control than screen pinning:

1. **Fully Kiosk Browser** (Android) - $6.90/device
   - Single website lockdown
   - Password protection
   - Device management features

2. **Kiosk Browser Lockdown** (Free with limitations)
   - Basic kiosk functionality
   - URL whitelisting

3. **SureLock / SureFox** (Enterprise)
   - Comprehensive kiosk solution

---

## Security Features

### Service Worker (sw.js)

The service worker provides:
- **Domain whitelisting** - Only allows requests to approved domains
- **Navigation blocking** - Prevents external website navigation
- **Offline support** - Caches static assets for offline use
- **Request interception** - Logs and blocks unauthorized requests

### Content Security Policy (CSP)

Server-side CSP headers in `vercel.json` restrict:
```
default-src 'self';
script-src 'self' [trusted CDNs];
frame-src [YouTube domains only];
connect-src [Supabase domains];
frame-ancestors 'none';
```

### Sandboxed YouTube Iframes

YouTube embeds use the `sandbox` attribute:
```html
<iframe
  src="https://www.youtube-nocookie.com/embed/VIDEO_ID"
  sandbox="allow-scripts allow-same-origin"
  allow="autoplay; encrypted-media; picture-in-picture"
>
```

The `sandbox` attribute WITHOUT `allow-top-navigation` or `allow-popups` means:
- ✅ Video playback works
- ✅ Fullscreen works
- ❌ Cannot navigate to YouTube.com
- ❌ Cannot open popups or new windows
- ❌ Cannot click links to leave the embed

---

## Allowed Domains

For the app to function properly, these domains must be accessible:

### Core Domains
| Domain | Purpose |
|--------|---------|
| `recursive.eco` | Main app domain |
| `*.recursive.eco` | Subdomains (channels, etc.) |
| `*.vercel.app` | Vercel preview deployments |

### Supabase (Database)
| Domain | Purpose |
|--------|---------|
| `*.supabase.co` | Supabase API |
| `*.supabase.in` | Supabase storage |

### YouTube (Video Embeds Only)
| Domain | Purpose |
|--------|---------|
| `www.youtube.com` | YouTube embed API |
| `www.youtube-nocookie.com` | Privacy-enhanced embeds |
| `i.ytimg.com` | Video thumbnails |
| `*.googlevideo.com` | Video streaming |
| `*.ggpht.com` | User avatars/images |

### CDN Resources
| Domain | Purpose |
|--------|---------|
| `cdn.tailwindcss.com` | Tailwind CSS framework |
| `cdn.jsdelivr.net` | Supabase JS client |
| `fonts.googleapis.com` | Google Fonts CSS |
| `fonts.gstatic.com` | Google Fonts files |

---

## YouTube Embedding Security

### How It Works

1. **No Direct YouTube Access** - Users cannot type youtube.com or click through to it
2. **Embed-Only Playback** - Videos play within a sandboxed iframe
3. **Privacy Mode** - Uses `youtube-nocookie.com` to reduce tracking
4. **End Screen Blocking** - Custom overlay prevents clicking suggested videos

### Safe YouTube Embed Component

Use the `<safe-youtube-embed>` web component for maximum security:

```html
<!-- Include the component -->
<script src="/assets/js/components/safe-youtube-embed.js"></script>

<!-- Use it -->
<safe-youtube-embed
  video-id="dQw4w9WgXcQ"
  title="My Video Title"
></safe-youtube-embed>
```

### Parameters
| Attribute | Description | Default |
|-----------|-------------|---------|
| `video-id` | YouTube video ID (required) | - |
| `title` | Accessible title | "YouTube Video" |
| `autoplay` | Auto-start video | `false` |
| `start` | Start time in seconds | - |
| `end` | End time in seconds | - |

---

## Supabase Integration

### Configuration

Environment variables (set in Vercel):
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### Usage Example

```javascript
// Supabase is loaded from CDN
const supabase = window.supabase.createClient(
  window.ENV.SUPABASE_URL,
  window.ENV.SUPABASE_ANON_KEY
);

// Fetch content (read-only)
const { data, error } = await supabase
  .from('content')
  .select('*')
  .order('created_at', { ascending: false });
```

### Row-Level Security (RLS)

Ensure your Supabase tables have RLS policies that:
- Allow anonymous `SELECT` (read) access
- Block anonymous `INSERT`, `UPDATE`, `DELETE`

Example policy:
```sql
CREATE POLICY "Allow anonymous reads"
ON public.content
FOR SELECT
TO anon
USING (true);
```

---

## Limitations & Alternatives

### Current Limitations

| Limitation | Explanation |
|------------|-------------|
| **Screen pinning bypass** | User can unpin if they know the PIN |
| **Power button** | User can restart device |
| **Volume buttons** | May access system UI |
| **Notification shade** | May be accessible on swipe down |
| **Google Assistant** | May be triggered by voice/button |

### More Robust Alternatives

#### 1. Trusted Web Activity (TWA)
Convert the PWA to a native Android app using Bubblewrap:
```bash
npx @aspect-build/aspect-cli bubblewrap init --manifest https://recursive.eco/manifest.json
npx @aspect-build/aspect-cli bubblewrap build
```
This creates an APK that can be installed and managed like a native app.

#### 2. Enterprise MDM Solutions
- **Google Work Profile** - Managed device profiles
- **Samsung Knox** - Enterprise device management
- **Microsoft Intune** - Cross-platform MDM

#### 3. Dedicated Kiosk Hardware
- **Amazon Fire Tablet** - FreeTime parental controls
- **Kids tablets** - Built-in restrictions
- **Commercial kiosk tablets** - Hardware lockdown features

---

## Troubleshooting

### PWA Not Installing

1. Check that you're using HTTPS
2. Ensure `manifest.json` is properly served
3. Verify service worker is registered (check DevTools > Application)
4. Try clearing browser cache and cookies

### YouTube Videos Not Playing

1. Check CSP headers allow YouTube domains
2. Verify internet connection
3. Check if the video is age-restricted (may not embed)
4. Try using `youtube-nocookie.com` instead

### Service Worker Issues

1. Unregister the old service worker:
   - DevTools > Application > Service Workers > Unregister
2. Clear site data:
   - DevTools > Application > Storage > Clear site data
3. Hard refresh: `Ctrl+Shift+R` or `Cmd+Shift+R`

### Screen Pinning Not Working

1. Enable it in Settings > Security
2. Make sure "Ask for PIN" is enabled
3. Try restarting the device
4. Check if your device supports screen pinning

### Child Escaping Kiosk Mode

If a child keeps escaping the kiosk:
1. Use a stronger PIN (not easily guessable)
2. Consider a dedicated kiosk browser app
3. Use enterprise MDM for complete lockdown
4. Physical cases can cover power/volume buttons

---

## File Structure

```
recursive-landing/
├── manifest.json          # PWA manifest
├── sw.js                   # Service worker
├── offline.html            # Offline fallback page
├── vercel.json             # Deployment config with CSP
├── index.html              # Main page (PWA meta tags)
├── view.html               # Content viewer (PWA meta tags)
└── assets/
    └── js/
        └── components/
            └── safe-youtube-embed.js  # Sandboxed YouTube component
```

---

## Support

For issues specific to this kiosk setup:
- Check the [GitHub Issues](https://github.com/PlayfulProcess/recursive-landing/issues)
- Review browser console for error messages
- Test in Chrome DevTools device emulation first

For general PWA questions:
- [MDN PWA Documentation](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)
- [web.dev PWA Guide](https://web.dev/progressive-web-apps/)
