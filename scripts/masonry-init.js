/**
 * Masonry Grid Initialization
 * Initializes Masonry.js layout for portfolio grid after all images are loaded
 * @version 2.1.3
 */

(function() {
    'use strict';

    // Initialize Masonry after ALL images are loaded
    var grid = document.querySelector('.portfolio-grid');

    // Guard clause - exit if grid doesn't exist
    if (!grid) {
        console.warn('Masonry: .portfolio-grid element not found');
        return;
    }

    var msnry;

    imagesLoaded(grid, function() {
        msnry = new Masonry(grid, {
            itemSelector: '.portfolio-item',
            percentPosition: false,
            gutter: 16,
            resize: true,
            initLayout: true,
            transitionDuration: 0
        });

        console.log('Masonry: Grid initialized successfully');
    });

    // Debounced resize handler
    var resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(function() {
            if (msnry) {
                msnry.layout();
            }
        }, 150);
    });
})();
