// SCENIC Website JavaScript
document.addEventListener('DOMContentLoaded', function() {
    
    // Hamburger Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const navList = document.querySelector('.nav-list');

    // Function to close the mobile menu
    function closeMobileMenu() {
        if (navList && hamburger) {
            navList.classList.remove('nav-active');
            hamburger.classList.remove('hamburger-active');
            hamburger.setAttribute('aria-expanded', 'false');
        }
    }

    if (hamburger && navList) {
        // Flag to prevent double-firing on hybrid devices
        let isToggling = false;

        // Toggle menu function (supports both touch and click)
        const toggleMenu = function(e) {
            // Prevent default behavior and double-firing
            e.preventDefault();

            // Debounce to prevent double-toggle when both touch and click fire
            if (isToggling) return;
            isToggling = true;
            setTimeout(() => { isToggling = false; }, 300);

            const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';
            hamburger.setAttribute('aria-expanded', !isExpanded);
            navList.classList.toggle('nav-active');
            hamburger.classList.toggle('hamburger-active');
        };

        // Listen for both touch and click events (iOS Safari fix)
        hamburger.addEventListener('touchend', toggleMenu);
        hamburger.addEventListener('click', toggleMenu);

        // Close menu when clicking on a nav link (mobile)
        const navLinks = document.querySelectorAll('.nav-list a');
        navLinks.forEach(link => {
            link.addEventListener('click', closeMobileMenu);
        });
    }
    
    // CTA Button interaction
    const ctaButton = document.querySelector('.cta-button');
    if (ctaButton) {
        ctaButton.addEventListener('click', function() {
            // Smooth scroll to services section
            const servicesSection = document.querySelector('.services');
            if (servicesSection) {
                servicesSection.scrollIntoView({ 
                    behavior: 'smooth' 
                });
            }
        });
    }
    
    // Service card hover effects (enhanced for touch devices)
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-4px) scale(1.02)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Intersection Observer for Lazy Loading Images
    // Only load images when they're about to enter the viewport
    const lazyImages = document.querySelectorAll('img.lazy');

    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    // Swap data-src to src to trigger image load
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    img.classList.add('loaded');

                    // Add 'loaded' class to parent portfolio item for fade-in effect
                    const portfolioItem = img.closest('.portfolio-item');
                    if (portfolioItem) {
                        portfolioItem.classList.add('loaded');
                    }

                    // Stop observing this image
                    observer.unobserve(img);
                }
            });
        }, {
            // Start loading when image is 200px away from entering viewport
            rootMargin: '200px 0px',
            threshold: 0.01
        });

        // Observe all lazy images
        lazyImages.forEach(img => {
            imageObserver.observe(img);
        });
    } else {
        // Fallback for browsers without IntersectionObserver
        // Just load all images immediately
        lazyImages.forEach(img => {
            img.src = img.dataset.src;
            img.classList.remove('lazy');
            img.classList.add('loaded');

            // Add 'loaded' class to parent portfolio item
            const portfolioItem = img.closest('.portfolio-item');
            if (portfolioItem) {
                portfolioItem.classList.add('loaded');
            }
        });
    }

    // ========================================
    // EVENT SERVICES Dropdown Navigation
    // ========================================

    const dropdownParent = document.querySelector('.has-dropdown');
    const dropdownLink = dropdownParent ? dropdownParent.querySelector('a[aria-haspopup="true"]') : null;
    const dropdownMenu = dropdownParent ? dropdownParent.querySelector('.subnav-dropdown') : null;

    if (dropdownParent && dropdownLink && dropdownMenu) {
        // Desktop: Sync aria-expanded with hover state for accessibility
        dropdownParent.addEventListener('mouseenter', function() {
            if (dropdownLink && window.innerWidth > 768) {
                dropdownLink.setAttribute('aria-expanded', 'true');
            }
        });

        dropdownParent.addEventListener('mouseleave', function() {
            if (dropdownLink && window.innerWidth > 768) {
                dropdownLink.setAttribute('aria-expanded', 'false');
            }
        });

        // Focus management: Set aria-expanded when dropdown link is focused
        dropdownLink.addEventListener('focus', function() {
            if (window.innerWidth > 768) {
                this.setAttribute('aria-expanded', 'true');
            }
        });

        // Mobile: aria-expanded matches hamburger menu state
        // On mobile, dropdown is always visible when nav is open
        if (hamburger) {
            hamburger.addEventListener('click', function() {
                setTimeout(function() {
                    const isNavActive = navList && navList.classList.contains('nav-active');
                    if (dropdownLink) {
                        dropdownLink.setAttribute('aria-expanded', isNavActive ? 'true' : 'false');
                    }
                }, 50);
            });
        }

        // Keyboard: ESC key closes dropdown on desktop
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' || e.key === 'Esc') {
                if (window.innerWidth > 768 && dropdownLink.getAttribute('aria-expanded') === 'true') {
                    dropdownLink.setAttribute('aria-expanded', 'false');
                    dropdownLink.focus(); // Return focus to trigger
                }
            }
        });

        // Keyboard: Arrow key navigation within dropdown
        const subnavLinks = dropdownMenu.querySelectorAll('.subnav-link');

        subnavLinks.forEach((link, index) => {
            link.addEventListener('keydown', function(e) {
                let targetIndex = -1;

                if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    targetIndex = index < subnavLinks.length - 1 ? index + 1 : 0;
                } else if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    targetIndex = index > 0 ? index - 1 : subnavLinks.length - 1;
                } else if (e.key === 'Home') {
                    e.preventDefault();
                    targetIndex = 0;
                } else if (e.key === 'End') {
                    e.preventDefault();
                    targetIndex = subnavLinks.length - 1;
                }

                if (targetIndex !== -1) {
                    subnavLinks[targetIndex].focus();
                }
            });
        });

        // Close hamburger menu when clicking subnav link (mobile)
        subnavLinks.forEach(link => {
            link.addEventListener('click', function() {
                closeMobileMenu();
            });
        });
    }

    // ========================================
    // Smooth Scroll Navigation (Task 2.5)
    // ========================================

    // Get header height for offset calculation
    const header = document.querySelector('.header');
    const getHeaderHeight = () => header ? header.offsetHeight : 70;

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Smooth scroll for all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');

            // Skip if href is just "#"
            if (href === '#') return;

            e.preventDefault();

            const targetId = href.substring(1);
            const targetSection = document.getElementById(targetId);

            if (targetSection) {
                const headerOffset = getHeaderHeight();
                const elementPosition = targetSection.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                // Use instant scroll if user prefers reduced motion
                window.scrollTo({
                    top: offsetPosition,
                    behavior: prefersReducedMotion ? 'auto' : 'smooth'
                });
            }
        });
    });

    // ========================================
    // Scroll-Spy with IntersectionObserver
    // ========================================

    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-list a[href^="#"]');

    console.log('Scroll-spy initializing:', sections.length, 'sections,', navLinks.length, 'nav links');

    if (sections.length > 0 && navLinks.length > 0) {
        // Create a map of section IDs to nav links
        const navLinkMap = {};
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href && href !== '#') {
                const sectionId = href.substring(1);
                navLinkMap[sectionId] = link;
            }
        });

        // IntersectionObserver options
        const observerOptions = {
            root: null,
            rootMargin: `-${getHeaderHeight()}px 0px -66% 0px`,
            threshold: [0, 0.25, 0.5, 0.75, 1.0]
        };

        // Track which sections are currently intersecting
        const intersectingSections = new Set();

        const scrollSpyObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const sectionId = entry.target.id;

                if (entry.isIntersecting) {
                    intersectingSections.add(sectionId);
                } else {
                    intersectingSections.delete(sectionId);
                }
            });

            // Update active nav link
            // Remove active class from all links
            navLinks.forEach(link => link.classList.remove('active'));

            // Find the topmost intersecting section
            if (intersectingSections.size > 0) {
                // Get first section in DOM order that's intersecting
                for (let section of sections) {
                    if (intersectingSections.has(section.id)) {
                        const activeLink = navLinkMap[section.id];
                        if (activeLink) {
                            activeLink.classList.add('active');
                        }
                        break;
                    }
                }
            }
        }, observerOptions);

        // Observe all sections
        sections.forEach(section => {
            scrollSpyObserver.observe(section);
        });
    }

    // ========================================
    // Scroll Animations (Task 3.3)
    // ========================================

    // Only run if animations are enabled and user doesn't prefer reduced motion
    const animationsEnabled = document.body.classList.contains('enable-animations');
    const prefersReducedMotionAnim = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (animationsEnabled && !prefersReducedMotionAnim) {
        const animateElements = document.querySelectorAll('.animate-on-scroll');

        if (animateElements.length > 0) {
            const animationObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('in-view');
                        // Once animated, stop observing
                        animationObserver.unobserve(entry.target);
                    }
                });
            }, {
                root: null,
                rootMargin: '0px 0px -50px 0px', // Trigger slightly before fully in view
                threshold: 0.1
            });

            animateElements.forEach(el => animationObserver.observe(el));
        }
    }

    // ========================================
    // Lottie Service Icon Animations
    // ========================================

    // Initialize Lottie animations for service icons
    function initServiceLottieAnimations() {
        // Check if Lottie library is loaded
        if (typeof lottie === 'undefined') {
            console.warn('Lottie library not loaded - skipping animation initialization');
            return;
        }

        // Helper function to initialize a single hover-triggered Lottie animation
        function initHoverLottie(containerId, jsonPath, label) {
            const container = document.getElementById(containerId);
            if (!container) return;

            // Find and store reference to placeholder SVG
            const placeholder = container.querySelector('.lottie-placeholder-svg');
            let isPlaying = false;

            const anim = lottie.loadAnimation({
                container: container,
                renderer: 'svg',
                loop: false,
                autoplay: false,
                path: jsonPath
            });

            // Hide placeholder when Lottie animation is loaded
            anim.addEventListener('DOMLoaded', () => {
                if (placeholder) {
                    placeholder.style.display = 'none';
                }
            });

            // Go to first frame and stop
            anim.goToAndStop(0, true);

            // Track when animation completes
            anim.addEventListener('complete', () => {
                isPlaying = false;
            });

            // Desktop: mouse events
            container.addEventListener('mouseenter', () => {
                anim.goToAndPlay(0, true);
                isPlaying = true;
            });

            container.addEventListener('mouseleave', () => {
                anim.goToAndStop(0, true);
                isPlaying = false;
            });

            // Mobile: tap to play
            container.addEventListener('touchstart', (e) => {
                if (!isPlaying) {
                    anim.goToAndPlay(0, true);
                    isPlaying = true;
                }
            }, { passive: true });

            // Reset when tapping outside
            document.addEventListener('touchstart', (e) => {
                if (!container.contains(e.target)) {
                    anim.goToAndStop(0, true);
                    isPlaying = false;
                }
            }, { passive: true });

            console.log(`${label} Lottie animation initialized (hover/tap to play)`);
        }

        // Initialize all service icon animations
        initHoverLottie('lottie-ideate', 'lottie-blocks/JSON Files/Design_Ideation_Solo_opt_new.json', 'IDEATE/DESIGN');
        initHoverLottie('lottie-events', 'lottie-blocks/JSON Files/Design_Ideation_Solo_opt_new.json', 'EVENT SERVICES');
        initHoverLottie('lottie-build', 'lottie-blocks/JSON Files/Design_Ideation_Solo_opt_new.json', 'BUILD');
        initHoverLottie('lottie-logistics', 'lottie-blocks/JSON Files/Design_Ideation_Solo_opt_new.json', 'LOGISTICS');
        initHoverLottie('lottie-onsite', 'lottie-blocks/JSON Files/Design_Ideation_Solo_opt_new.json', 'ON-SITE');
    }

    // Initialize Lottie animations
    initServiceLottieAnimations();

    // ========================================
    // Lottie Pattern Block Background Animations
    // ========================================

    // Initialize pattern block background animations
    function initPatternBlockAnimations() {
        // Check if Lottie library is loaded
        if (typeof lottie === 'undefined') {
            console.warn('Lottie library not loaded - skipping pattern block animation initialization');
            return;
        }

        // Helper function to initialize a single pattern block animation
        function initPatternLottie(containerId, jsonPath) {
            const container = document.getElementById(containerId);
            if (!container) return;

            // Random speed between 0.8 and 1.2 (±20% variation)
            const speed = 0.8 + (Math.random() * 0.4);

            const animation = lottie.loadAnimation({
                container: container,
                renderer: 'svg',
                loop: false,  // We'll handle looping manually for ping-pong effect
                autoplay: true,
                path: jsonPath
            });

            // Set random speed for this animation
            animation.setSpeed(speed);

            // Ping-pong looping: play forward, then backward, continuously
            let direction = 1; // 1 = forward, -1 = backward
            animation.addEventListener('complete', function() {
                direction = direction * -1;
                animation.setDirection(direction);
                animation.play();
            });
        }

        // Initialize all pattern blocks
        let animationCount = 0;
        document.querySelectorAll('.lottie-pattern').forEach(element => {
            const pattern = element.getAttribute('data-pattern');
            if (pattern) {
                const jsonPath = `images/pattern-blocks/scenic-pattern-block-${pattern}.json`;
                initPatternLottie(element.id, jsonPath);
                animationCount++;
            }
        });

        console.log(`Initialized ${animationCount} pattern block Lottie animations (ping-pong loop, variable speeds)`);
    }

    // Initialize pattern block animations
    initPatternBlockAnimations();

    // ========================================
    // GA4 Event Tracking
    // ========================================

    // GA4 Event Tracking Helper
    function trackEvent(eventName, params = {}) {
        if (typeof gtag === 'function') {
            gtag('event', eventName, params);
        }
    }

    // Track CTA button clicks
    document.querySelectorAll('.cta-button, .send-button').forEach(btn => {
        btn.addEventListener('click', () => {
            trackEvent('cta_click', {
                button_text: btn.textContent.trim(),
                page_location: window.location.pathname
            });
        });
    });

    // Track navigation clicks
    document.querySelectorAll('.nav-list a').forEach(link => {
        link.addEventListener('click', () => {
            trackEvent('nav_click', {
                link_text: link.textContent.trim(),
                link_url: link.href
            });
        });
    });

    // Track contact form submission
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', () => {
            trackEvent('form_submit', { form_name: 'contact' });
        });
    }

    console.log('SCENIC website loaded successfully!');
});