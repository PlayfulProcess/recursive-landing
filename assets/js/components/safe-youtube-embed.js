/**
 * SafeYouTubeEmbed - Sandboxed YouTube iframe component for kiosk mode
 *
 * Security features:
 * - Uses sandbox attribute to prevent navigation to YouTube
 * - Blocks popups and top navigation
 * - Prevents users from clicking through to YouTube.com
 * - Works with YouTube's privacy-enhanced mode (youtube-nocookie.com)
 *
 * Usage:
 *   <safe-youtube-embed video-id="dQw4w9WgXcQ" title="Video Title"></safe-youtube-embed>
 *
 * Or via JavaScript:
 *   SafeYouTubeEmbed.create(container, 'videoId', { title: 'Title', autoplay: false });
 */

class SafeYouTubeEmbed extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    static get observedAttributes() {
        return ['video-id', 'title', 'autoplay', 'start', 'end'];
    }

    connectedCallback() {
        this.render();
    }

    attributeChangedCallback() {
        this.render();
    }

    render() {
        const videoId = this.getAttribute('video-id');
        const title = this.getAttribute('title') || 'YouTube Video';
        const autoplay = this.getAttribute('autoplay') === 'true' ? 1 : 0;
        const start = this.getAttribute('start') || '';
        const end = this.getAttribute('end') || '';

        if (!videoId) {
            this.shadowRoot.innerHTML = `
                <style>
                    .error {
                        padding: 2rem;
                        text-align: center;
                        color: #666;
                        background: #f0f0f0;
                        border-radius: 8px;
                    }
                </style>
                <div class="error">No video ID provided</div>
            `;
            return;
        }

        // Build embed URL with privacy-enhanced mode
        const params = new URLSearchParams({
            rel: '0',                    // Don't show related videos from other channels
            modestbranding: '1',         // Minimal YouTube branding
            controls: '1',               // Show player controls (needed for UX)
            fs: '0',                      // Disable YouTube's fullscreen (we handle it)
            iv_load_policy: '3',         // Hide video annotations
            disablekb: '0',              // Allow keyboard (for accessibility)
            playsinline: '1',            // Play inline on mobile
            enablejsapi: '0',            // Disable JS API (more secure)
            origin: window.location.origin
        });

        if (autoplay) params.set('autoplay', '1');
        if (start) params.set('start', start);
        if (end) params.set('end', end);

        // Use youtube-nocookie.com for enhanced privacy
        const embedUrl = `https://www.youtube-nocookie.com/embed/${videoId}?${params.toString()}`;

        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    width: 100%;
                }
                .container {
                    position: relative;
                    width: 100%;
                    aspect-ratio: 16 / 9;
                    background: #000;
                    border-radius: 8px;
                    overflow: hidden;
                }
                iframe {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    border: none;
                }
                /* Block overlay to prevent right-click context menu and some interactions */
                .interaction-blocker {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 60px; /* Leave room for controls */
                    z-index: 5;
                    /* Transparent but captures pointer events */
                    pointer-events: none;
                }
                .title {
                    margin-top: 0.5rem;
                    text-align: center;
                    font-size: 1rem;
                    color: #374151;
                    font-weight: 500;
                }
            </style>
            <div class="container">
                <iframe
                    src="${embedUrl}"
                    title="${title}"
                    sandbox="allow-scripts allow-same-origin"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowfullscreen
                    loading="lazy"
                    referrerpolicy="strict-origin-when-cross-origin"
                ></iframe>
            </div>
            ${title !== 'YouTube Video' ? `<div class="title">${title}</div>` : ''}
        `;
    }

    /**
     * Static factory method for programmatic creation
     */
    static create(container, videoId, options = {}) {
        const embed = document.createElement('safe-youtube-embed');
        embed.setAttribute('video-id', videoId);
        if (options.title) embed.setAttribute('title', options.title);
        if (options.autoplay) embed.setAttribute('autoplay', 'true');
        if (options.start) embed.setAttribute('start', options.start);
        if (options.end) embed.setAttribute('end', options.end);

        if (typeof container === 'string') {
            container = document.querySelector(container);
        }

        if (container) {
            container.appendChild(embed);
        }

        return embed;
    }

    /**
     * Extract video ID from various YouTube URL formats
     */
    static extractVideoId(url) {
        if (!url) return null;

        // Direct video ID
        if (/^[a-zA-Z0-9_-]{11}$/.test(url)) {
            return url;
        }

        try {
            const urlObj = new URL(url);
            const hostname = urlObj.hostname;

            // youtube.com/watch?v=VIDEO_ID
            if (hostname.includes('youtube.com') && urlObj.searchParams.has('v')) {
                return urlObj.searchParams.get('v');
            }

            // youtu.be/VIDEO_ID
            if (hostname === 'youtu.be') {
                return urlObj.pathname.slice(1);
            }

            // youtube.com/embed/VIDEO_ID
            if (urlObj.pathname.startsWith('/embed/')) {
                return urlObj.pathname.split('/')[2];
            }

            // youtube.com/v/VIDEO_ID
            if (urlObj.pathname.startsWith('/v/')) {
                return urlObj.pathname.split('/')[2];
            }
        } catch (e) {
            console.warn('Failed to parse YouTube URL:', url);
        }

        return null;
    }
}

// Register the custom element
customElements.define('safe-youtube-embed', SafeYouTubeEmbed);

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SafeYouTubeEmbed;
}
