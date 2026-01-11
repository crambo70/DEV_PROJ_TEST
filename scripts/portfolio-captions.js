/**
 * Portfolio Captions Loader
 * Fetches and populates overlay captions from captions.txt
 */

(function() {
    'use strict';

    /**
     * Parse the captions.txt file into a map
     * @param {string} text - Raw text content from captions.txt
     * @returns {Object} Map of filename -> {h1, h2}
     */
    function parseCaptions(text) {
        const captionsMap = {};
        const lines = text.trim().split('\n');

        lines.forEach(line => {
            const parts = line.split('|');
            if (parts.length === 3) {
                const filename = parts[0].trim();
                const h1 = parts[1].trim();
                const h2 = parts[2].trim();
                captionsMap[filename] = { h1, h2 };
            }
        });

        return captionsMap;
    }

    /**
     * Populate portfolio item overlays with caption data
     * @param {Object} captionsMap - Map of filename -> {h1, h2}
     */
    function populateOverlays(captionsMap) {
        const portfolioItems = document.querySelectorAll('.portfolio-item[data-image]');
        let populatedCount = 0;

        portfolioItems.forEach(item => {
            const imageFilename = item.getAttribute('data-image');
            const captionData = captionsMap[imageFilename];

            if (captionData) {
                const h1Element = item.querySelector('.portfolio-caption-h1');
                const h2Element = item.querySelector('.portfolio-caption-h2');

                if (h1Element && h2Element) {
                    h1Element.textContent = captionData.h1;
                    h2Element.textContent = captionData.h2;
                    populatedCount++;
                }
            }
        });

        console.log(`[Portfolio Captions] Populated ${populatedCount} of ${portfolioItems.length} items`);
    }

    /**
     * Load captions from captions.txt file
     */
    async function loadCaptions() {
        try {
            const response = await fetch('images/portfolio/portfolio-captions.txt');

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const text = await response.text();
            const captionsMap = parseCaptions(text);
            populateOverlays(captionsMap);

        } catch (error) {
            console.warn('[Portfolio Captions] Failed to load captions:', error.message);
            console.warn('[Portfolio Captions] Overlays will remain empty');
        }
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadCaptions);
    } else {
        // DOM already loaded
        loadCaptions();
    }

})();
