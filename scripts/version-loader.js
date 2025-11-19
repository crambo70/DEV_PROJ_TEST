/**
 * Version Loader
 * Loads version information from version.json and displays it on the page
 * Usage: Include this script in the <head> of your HTML pages
 */

(function() {
    // Load version data and update the page
    fetch('/version.json')
        .then(response => response.json())
        .then(data => {
            // Update version indicator if it exists
            const versionNumber = document.querySelector('.version-number');
            const versionIndicator = document.querySelector('.version-indicator');

            if (versionNumber) {
                versionNumber.textContent = data.version;
            }

            if (versionIndicator) {
                versionIndicator.setAttribute('aria-label', `Site version ${data.version}`);
            }

            // Store version data globally for potential use by other scripts
            window.SCENIC_VERSION = {
                version: data.version,
                lastUpdated: data.lastUpdated
            };
        })
        .catch(error => {
            console.error('Failed to load version information:', error);
            // Fallback: keep the hardcoded version if fetch fails
        });
})();
