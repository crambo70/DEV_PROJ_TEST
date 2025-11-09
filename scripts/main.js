// SCENIC Website JavaScript
document.addEventListener('DOMContentLoaded', function() {
    
    // Hamburger Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const navList = document.querySelector('.nav-list');
    
    if (hamburger && navList) {
        hamburger.addEventListener('click', function() {
            navList.classList.toggle('nav-active');
            hamburger.classList.toggle('hamburger-active');
        });
        
        // Close menu when clicking on a nav link (mobile)
        const navLinks = document.querySelectorAll('.nav-list a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navList.classList.remove('nav-active');
                hamburger.classList.remove('hamburger-active');
            });
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
    
    // Service Card Hover - Viewport Adjustment for Mobile
    const serviceCardsViewport = document.querySelectorAll('.service-card');
    
    serviceCardsViewport.forEach(card => {
        card.addEventListener('mouseenter', function() {
            // Only apply on mobile/tablet screens
            if (window.innerWidth <= 1024) {
                // Add smooth scroll behavior
                const cardRect = card.getBoundingClientRect();
                const viewportHeight = window.innerHeight;
                const cardBottom = cardRect.bottom;
                
                // If card + callout would extend beyond viewport, scroll to show it
                if (cardBottom + 200 > viewportHeight) { // 200px estimated callout height
                    card.scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'center',
                        inline: 'nearest'
                    });
                }
            }
        });
    });
    
    console.log('SCENIC website loaded successfully!');
});