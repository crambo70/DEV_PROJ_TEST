// SCENIC Website JavaScript
document.addEventListener('DOMContentLoaded', function() {
    
    // Hamburger Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const navList = document.querySelector('.nav-list');
    const mobileOverlay = document.querySelector('.mobile-menu-overlay');

    // Function to close the mobile menu
    function closeMobileMenu() {
        if (navList && hamburger && mobileOverlay) {
            navList.classList.remove('nav-active');
            hamburger.classList.remove('hamburger-active');
            hamburger.setAttribute('aria-expanded', 'false');
            mobileOverlay.classList.remove('overlay-active');
            mobileOverlay.setAttribute('aria-hidden', 'true');
        }
    }

    if (hamburger && navList && mobileOverlay) {
        // Toggle menu on hamburger click
        hamburger.addEventListener('click', function() {
            const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';
            hamburger.setAttribute('aria-expanded', !isExpanded);
            navList.classList.toggle('nav-active');
            hamburger.classList.toggle('hamburger-active');
            mobileOverlay.classList.toggle('overlay-active');
            mobileOverlay.setAttribute('aria-hidden', isExpanded);
        });

        // Close menu when clicking overlay
        mobileOverlay.addEventListener('click', closeMobileMenu);

        // Close menu when clicking on a nav link (mobile)
        const navLinks = document.querySelectorAll('.nav-list a');
        navLinks.forEach(link => {
            link.addEventListener('click', closeMobileMenu);
        });

        // Close menu when pressing Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && navList.classList.contains('nav-active')) {
                closeMobileMenu();
            }
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

    console.log('SCENIC website loaded successfully!');
});