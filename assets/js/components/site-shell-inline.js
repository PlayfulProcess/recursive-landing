// Site Shell Components - Independent inline navigation
// Works with file:// protocol and keeps spiral pages separate

(() => {
  // Independent inline navigation - no external dependencies
  const HEADER_HTML = `
    <header class="sticky top-0 z-40 bg-white/90 backdrop-blur-sm border-b border-gray-200">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between items-center h-16">
                <div class="flex items-center space-x-8">
                    <div class="flex items-center space-x-2">
                        <a href="/index.html" class="flex items-center space-x-2" data-nav>
                            <div id="header-logo-container" class="h-20 w-20">
                                <!-- Animated spiral logo will be inserted here by JavaScript -->
                            </div>
                        </a>
                    </div>
                    
                    <nav class="hidden md:flex space-x-6 items-center">
                        <!-- Channels Dropdown -->
                        <div class="relative dropdown">
                            <button class="flex items-center gap-1 text-gray-600 hover:text-gray-900 font-medium transition-colors dropdown-trigger">
                                Channels
                                <svg class="h-4 w-4 transition-transform dropdown-arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                                </svg>
                            </button>
                            <div class="dropdown-menu absolute top-full mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 z-20 overflow-hidden opacity-0 invisible transition-all duration-200">
                                <a href="https://channels.recursive.eco/" class="block px-4 py-3 hover:bg-gray-50 transition-colors bg-blue-50 border-l-4 border-blue-500" data-nav>
                                    <div class="flex items-center justify-between">
                                        <div>
                                            <div class="font-medium text-gray-900">Wellness</div>
                                            <div class="text-xs text-gray-500">Mental health & wellness tools</div>
                                        </div>
                                    </div>
                                </a>
                                <div class="block px-4 py-3 opacity-60 cursor-not-allowed">
                                    <div class="flex items-center justify-between">
                                        <div>
                                            <div class="font-medium text-gray-900">Parents</div>
                                            <div class="text-xs text-gray-500">Parenting support & resources</div>
                                        </div>
                                        <span class="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded">Soon</span>
                                    </div>
                                </div>
                                <div class="block px-4 py-3 opacity-60 cursor-not-allowed">
                                    <div class="flex items-center justify-between">
                                        <div>
                                            <div class="font-medium text-gray-900">Developers</div>
                                            <div class="text-xs text-gray-500">Code with purpose</div>
                                        </div>
                                        <span class="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded">Soon</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <a href="/pages/courses/index.html" class="text-gray-600 hover:text-gray-900 font-medium" data-nav>Courses</a>

                        <a href="/pages/studies.html" class="text-gray-600 hover:text-gray-900 font-medium" data-nav>Studies</a>

                        <a href="/pages/about.html" class="text-gray-600 hover:text-gray-900 font-medium" data-nav>About</a>
                    </nav>
                </div>

                <div class="flex items-center space-x-4">
                    <a href="https://buy.stripe.com/fZu9AS2IZdeS58tfoa9ws00"
                       target="_blank"
                       rel="noopener noreferrer"
                       class="hidden sm:inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-4 py-2 rounded-full font-semibold text-sm shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200">
                        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        Donate
                    </a>

                    <!-- Mobile menu button -->
                    <button id="mobile-menu-button" class="md:hidden p-2 text-gray-600 hover:text-gray-900" aria-label="Open menu">
                        <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
                        </svg>
                    </button>
                </div>
            </div>

            <!-- Mobile menu panel -->
            <div id="mobile-menu" class="md:hidden hidden">
                <div class="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-gray-200">
                    <a href="https://channels.recursive.eco/" class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50" data-nav>
                        Wellness Channel
                    </a>
                    <a href="/pages/courses/index.html" class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50" data-nav>
                        Courses
                    </a>
                    <a href="/pages/studies.html" class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50" data-nav>
                        Studies
                    </a>
                    <a href="/pages/about.html" class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50" data-nav>
                        About
                    </a>
                    <a href="https://buy.stripe.com/fZu9AS2IZdeS58tfoa9ws00"
                       target="_blank"
                       rel="noopener noreferrer"
                       class="block px-3 py-2 rounded-md text-base font-medium bg-gradient-to-r from-pink-500 to-purple-600 text-white text-center">
                        ❤️ Donate
                    </a>
                </div>
            </div>
        </div>
    </header>
  `;

  // Independent footer HTML
  const FOOTER_HTML = `
    <footer class="bg-gray-900 text-white py-12">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center">
                <div class="flex items-center justify-center mb-4">
                    <div id="footer-logo-container" class="h-24 w-24">
                        <!-- Animated spiral logo will be inserted here by JavaScript -->
                    </div>
                </div>

                <div class="bg-amber-800 text-amber-200 p-4 rounded-lg mb-6 max-w-2xl mx-auto">
                    <div class="text-lg font-semibold mb-2">Beta Version | 🧪 Active experiment in recursive virtuous meaning-making</div>
                </div>

                <div class="flex flex-wrap justify-center items-center space-x-6">
                    <a href="https://lifeisprocess.substack.com/" target="_blank" rel="noopener noreferrer" class="text-gray-400 hover:text-white transition-colors">
                        Substack
                    </a>
                    <a href="https://github.com/PlayfulProcess" target="_blank" rel="noopener noreferrer" class="text-gray-400 hover:text-white transition-colors">
                        GitHub
                    </a>
                    <a href="https://channels.recursive.eco/contact" target="_blank" rel="noopener noreferrer" class="text-gray-400 hover:text-white transition-colors">
                        Contact Us
                    </a>
                </div>
            </div>

            <div class="mt-8 pt-8 border-t border-gray-800 text-gray-500 text-sm">
                <p class="mb-2 text-center">Platform under <a href="https://creativecommons.org/licenses/by-sa/4.0/deed.en" target="_blank" rel="noopener noreferrer" class="text-gray-400 hover:text-gray-300 underline">CC BY-SA 4.0</a> | User content remains with creators | © 2025 Recursive.eco by PlayfulProcess LLC</p>
            </div>
        </div>
    </footer>
  `;

  // Spiral Header HTML template
  const SPIRAL_HEADER_HTML = `
    <header class="bg-white border-b border-gray-200">
        <div class="container mx-auto px-6 py-4">
            <nav class="flex justify-between items-center">
                <!-- Back to Home -->
                <div>
                    <a href="/index.html" class="flex items-center space-x-2 text-gray-600 hover:text-purple-600 transition-colors" data-nav>
                        <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                        </svg>
                        <span class="font-medium">Back to Home</span>
                    </a>
                </div>
                
                <!-- Interactive Study Title -->
                <div>
                    <span class="text-gray-700 font-medium">Logo Generator - Interactive Study</span>
                </div>
            </nav>
        </div>
    </header>
  `;

  function injectHTML(el, html, type = 'header') {
    el.innerHTML = html;

    // Mark active navigation
    const here = new URL(window.location.href);
    el.querySelectorAll('[data-nav]').forEach(a => {
      const href = a.getAttribute('href');
      if (!href) return;
      try {
        const u = new URL(href, here.origin);
        const isCurrentPage = u.pathname === here.pathname || 
                             (u.pathname === '/index.html' && here.pathname === '/') ||
                             (u.pathname === '/' && here.pathname === '/index.html') ||
                             (href.includes('pages/') && here.pathname.includes(href.split('/').pop()));
        
        if (isCurrentPage) {
          a.setAttribute('aria-current', 'page');
          a.classList.add('is-active');
          
          // Special styling for spiral tools (purple background when active)
          if (a.hasAttribute('data-spiral-tool')) {
            a.classList.remove('text-gray-600', 'hover:text-purple-600', 'hover:bg-purple-50');
            a.classList.add('bg-purple-600', 'text-white', '!text-white');
            // Force white text with inline style for better specificity
            a.style.color = 'white';
          }
        }
      } catch (e) {
        console.log('URL parsing error for nav:', href, e);
      }
    });

    // Initialize spiral header if this is a header component
    if (type === 'header') {
      initializeSpiralHeader();
    }

    // Initialize dropdown functionality
    initializeDropdowns();

    // Initialize mobile menu
    initializeMobileMenu();
  }

  function initializeMobileMenu() {
    // Use setTimeout to ensure DOM is ready
    setTimeout(() => {
      const menuButton = document.getElementById('mobile-menu-button');
      const mobileMenu = document.getElementById('mobile-menu');

      if (menuButton && mobileMenu) {
        menuButton.addEventListener('click', (e) => {
          e.stopPropagation();
          mobileMenu.classList.toggle('hidden');
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
          if (!menuButton.contains(e.target) && !mobileMenu.contains(e.target)) {
            mobileMenu.classList.add('hidden');
          }
        });

        // Close menu when clicking a link
        mobileMenu.querySelectorAll('a').forEach(link => {
          link.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
          });
        });

        console.log('Mobile menu initialized');
      } else {
        console.log('Mobile menu elements not found:', { menuButton, mobileMenu });
      }
    }, 100);
  }

  function initializeSpiralHeader() {
    const init = () => {
      const container = document.getElementById('header-logo-container');
      if (window.createSpiral && container) {
        window.createSpiral(container, {
          size: 100, 
          turns: 6, 
          color: '#9333ea', 
          strokeWidth: 0.8, 
          opacity: 0.8,
          animated: true
        });
        console.log('Spiral header initialized via inline component system');
      } else if (container) {
        console.log('Spiral container found but createSpiral not available yet');
      }
    };

    if (window.createSpiral) {
      init();
    } else {
      // Wait for spiral.js to load
      let attempts = 0;
      const maxAttempts = 50;
      const checkSpiral = () => {
        attempts++;
        if (window.createSpiral) {
          init();
        } else if (attempts < maxAttempts) {
          setTimeout(checkSpiral, 100);
        } else {
          console.log('Spiral functions not found after waiting');
        }
      };
      setTimeout(checkSpiral, 100);
    }
  }

  function initializeDropdowns() {
    const dropdowns = document.querySelectorAll('.dropdown');
    
    dropdowns.forEach(dropdown => {
      const trigger = dropdown.querySelector('.dropdown-trigger');
      const menu = dropdown.querySelector('.dropdown-menu');
      const arrow = dropdown.querySelector('.dropdown-arrow');
      
      if (!trigger || !menu || !arrow) return;
      
      let isOpen = false;
      
      // Toggle dropdown
      trigger.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        // Close other dropdowns first
        dropdowns.forEach(otherDropdown => {
          if (otherDropdown !== dropdown) {
            const otherMenu = otherDropdown.querySelector('.dropdown-menu');
            const otherArrow = otherDropdown.querySelector('.dropdown-arrow');
            if (otherMenu && otherArrow) {
              otherMenu.classList.add('opacity-0', 'invisible');
              otherArrow.classList.remove('rotate-180');
            }
          }
        });
        
        // Toggle current dropdown
        isOpen = !isOpen;
        if (isOpen) {
          menu.classList.remove('opacity-0', 'invisible');
          arrow.classList.add('rotate-180');
        } else {
          menu.classList.add('opacity-0', 'invisible');
          arrow.classList.remove('rotate-180');
        }
      });
    });
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', function() {
      dropdowns.forEach(dropdown => {
        const menu = dropdown.querySelector('.dropdown-menu');
        const arrow = dropdown.querySelector('.dropdown-arrow');
        if (menu && arrow) {
          menu.classList.add('opacity-0', 'invisible');
          arrow.classList.remove('rotate-180');
        }
      });
    });
    
    // Close dropdowns on menu item click
    document.querySelectorAll('.dropdown-menu a').forEach(link => {
      link.addEventListener('click', function() {
        dropdowns.forEach(dropdown => {
          const menu = dropdown.querySelector('.dropdown-menu');
          const arrow = dropdown.querySelector('.dropdown-arrow');
          if (menu && arrow) {
            menu.classList.add('opacity-0', 'invisible');
            arrow.classList.remove('rotate-180');
          }
        });
      });
    });
  }

  // Site Header Component
  class SiteHeader extends HTMLElement {
    connectedCallback() {
      injectHTML(this, HEADER_HTML, 'header');
      console.log('Inline header component loaded successfully');
    }
  }

  // Site Footer Component  
  class SiteFooter extends HTMLElement {
    connectedCallback() {
      injectHTML(this, FOOTER_HTML, 'footer');
      console.log('Inline footer component loaded successfully');
      // Initialize footer spiral after injecting HTML
      this.initializeFooterSpiral();
    }
    
    initializeFooterSpiral() {
      const init = () => {
        const container = document.getElementById('footer-logo-container');
        if (window.createSpiral && container) {
          // Use the same animation settings as header but with white color for dark background
          window.createSpiral(container, {
            size: 100, 
            turns: 6, 
            color: '#ffffff', // White for dark footer background
            strokeWidth: 0.8, 
            opacity: 0.9,
            animated: true,
            rhythms: {
              breathe: { duration: 12000, timing: 'ease-in-out' },
              draw: { duration: 12000, timing: 'ease-in-out' }
            }
          });
          console.log('Spiral footer initialized via inline component system');
        } else if (container) {
          console.log('Footer spiral container found but createSpiral not available yet');
        }
      };

      if (window.createSpiral) {
        init();
      } else {
        // Wait for spiral.js to load
        let attempts = 0;
        const maxAttempts = 50;
        const checkSpiral = () => {
          attempts++;
          if (window.createSpiral) {
            init();
          } else if (attempts < maxAttempts) {
            setTimeout(checkSpiral, 100);
          } else {
            console.log('Footer spiral functions not found after waiting');
          }
        };
        setTimeout(checkSpiral, 100);
      }
    }
  }

  // Spiral Header Component (for spiral playground pages)
  class SpiralHeader extends HTMLElement {
    connectedCallback() {
      injectHTML(this, SPIRAL_HEADER_HTML, 'header');
      console.log('Inline spiral header component loaded successfully');
    }
  }

  // Register custom elements
  customElements.define('site-header', SiteHeader);
  customElements.define('site-footer', SiteFooter);
  customElements.define('spiral-header', SpiralHeader);

  console.log('Inline site shell components registered');
})();