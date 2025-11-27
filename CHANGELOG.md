# Changelog

All notable changes to the SCENIC project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]
<!-- Future changes go here -->

## [2.1.7] - 2025-11-27
### Removed
- Removed Lottie animation task planning (Task 2.3 from IMPLEMENTATION_PLAN.md)
- Cleaned @xmldom/xmldom dependency reference from package.json
- Removed 5 animation placeholder comments from index.html

## [2.1.6] - 2025-11-27
### Added
- Favicon support with SVG primary and PNG fallbacks
- Apple touch icon for iOS home screen bookmarks
- Schema.org JSON-LD structured data (Organization, WebSite, ProfessionalService)
- Playwright E2E test suite with 48 tests across Desktop, Tablet, and Mobile viewports
- playwright.config.js with auto-starting web server configuration
- Homepage tests: title, logo, version, hero, CTA, services, team, footer, navigation
- Work page tests: portfolio grid, Masonry layout initialization, image alt text

### Changed
- Updated package.json with @playwright/test dependency
- Added npm test script for running E2E tests

## [2.1.5] - 2025-11-27
### Added
- CSS custom properties (:root design tokens) for colors, fonts, spacing, transitions, z-index scale
- Standalone CHANGELOG.md with complete version history (49 versions documented)
- Clear section headers for media query organization

### Changed
- Replaced 69 hardcoded color values with CSS custom properties
- Replaced 18 font-family declarations with var(--font-family-primary)
- Consolidated redundant responsive CSS rules
- Improved media query organization with breakpoint section headers

### Removed
- Duplicate .logo class definition
- Duplicate .geometric-background class definition
- ~40 lines of redundant CSS code

## [2.1.4] - 2025-11-27
### Added
- SEO meta description and keywords tags to index.html and work.html
- Open Graph meta tags for improved social media sharing
- Twitter Card meta tags for Twitter/X sharing previews

### Changed
- Extracted Masonry.js initialization to external script (scripts/masonry-init.js)
- Updated 19 portfolio image alt attributes with descriptive accessibility text
- Fixed README.md version reference to point to version.json

## [2.1.3] - 2025-11-27
### Added
- Created specialized Claude Code agents (CSS, Docs, JS/Masonry)
- Added cache-busting to CSS links

### Changed
- Updated portfolio with 19 placeholder images

### Fixed
- Fixed homepage CSS Grid layout (grid-auto-rows: auto, justify-self: stretch)
- Cleaned up obsolete animation files

## [2.1.2] - 2025-11-19
### Added
- Implemented centralized version management system with version.json
- Created auto-loader script for version consistency across all pages

## [2.1.1] - 2025-11-17
### Changed
- Desktop logo size increased 33% (70px to 93px height) for better prominence and balance with navigation

## [2.1.0] - 2025-11-17
### Added
- New SCENIC blue logo implemented with responsive srcset
- Created 3 optimized logo versions: desktop (4.7K), tablet (5.0K), mobile (3.6K)

### Changed
- 85% size reduction from 32K source logo file

## [2.0.0] - 2025-11-17
### Changed
- **MAJOR REDESIGN:** Service card tooltips completely redesigned
  - Removed chevron indicators
  - Changed from inline navy overlays to minimal gray tooltips positioned below cards
  - Added upward-pointing arrows to tooltips
  - Short text only (removed "Learn More")
  - Working on all viewports
- Service icons significantly enlarged:
  - Desktop: 161px to 240px (+49%)
  - Tablet: 138px to 220px (+59%)
  - Mobile: 113px to 200px (+77%)
  - Reduced padding to minimize whitespace

### Added
- Portfolio grid fully populated with 9 placeholder images
- 4-column masonry layout with variable heights (large/medium/small items)
- Responsive grid (4/3/2 columns)

## [1.7.0] - 2025-11-17
### Changed
- Replaced all PNG pattern blocks with SVG files
- Using 4 base SVGs (A, C, D, E) with CSS transforms (rotate, flip) for all 6 pattern variations

### Removed
- PNG pattern block files

## [1.6.1] - 2025-11-12
### Fixed
- Fixed Masonry.js layout issues
- Added imagesLoaded library
- Added resize handler
- Corrected CSS calc() widths

## [1.6.0] - 2025-11-11
### Added
- WORK page implementation with Masonry.js portfolio gallery
- 4 columns desktop, 3 tablet, 2 mobile responsive layout
- Shared header/footer/CTA sections from HOME page
- 16 placeholder images using Lorem Picsum for testing
- Linked from main navigation (index.html to work.html)

## [1.5.9] - 2025-11-11
### Changed
- Footer logo CSS updates: increased height (40px to 65px)
- Removed white filter for color logo

## [1.5.8] - 2025-11-11
### Changed
- Footer refinements: new logo image
- Spacing adjustment (5rem gap)
- Typography updates (1rem titles, normal weight)
- Gray text color (#C7C9D4)

## [1.5.7] - 2025-11-11
### Fixed
- Comprehensive footer layout fixes
- 40px logo height
- 5rem padding
- 2.5rem column gap
- Center alignment

## [1.5.6] - 2025-11-11
### Fixed
- Fixed responsive nav font sizes (desktop 11px, tablet 10px, mobile 9px)
- Added tablet header padding

## [1.5.5] - 2025-11-11
### Changed
- Header padding increased (2rem to 5rem)
- Nav font reduced (18px to 11px)

## [1.5.4] - 2025-11-11
### Changed
- SCENIC logo height reduced (74px to 70px desktop, proportional tablet/mobile)

## [1.5.3] - 2025-11-11
### Changed
- Manual CTA fine-tuning (35px title, 45px button, normal weight, uppercase)

## [1.5.2] - 2025-11-11
### Changed
- Reduced title and button by 45% per user request

## [1.5.1] - 2025-11-11
### Fixed
- CORRECTED CTA proportions (3.5rem padding, 1.5rem gap, 60px button) - more compact
- Reference matched

## [1.5.0] - 2025-11-11
### Changed
- Major CTA proportion adjustments (6rem padding, 1.5rem gap, 58px button)
- NOTE: Corrected in v1.5.1 - this was wrong direction

## [1.4.8] - 2025-11-11
### Fixed
- Fixed chevron centering (6px)
- Ensured responsive consistency across all viewports

## [1.4.7] - 2025-11-11
### Changed
- Fine-tuned yellow cap (58px) and chevron centering (padding-bottom: 6px)

## [1.4.6] - 2025-11-11
### Changed
- Refined CTA button proportions (70px height, bold text, 2.5rem arrow, proper semicircle)

## [1.4.5] - 2025-11-11
### Fixed
- Fixed CTA button with yellow semicircle right edge (white + yellow sections)

## [1.4.4] - 2025-11-11
### Changed
- Replaced SVG logo with PNG
- Updated address to 1001 Canal Blvd
- Refined footer text (0.75rem)

## [1.4.3] - 2025-11-11
### Changed
- Refined footer SVG logo proportions and positioning

## [1.4.2] - 2025-11-11
### Added
- Created inline SVG for footer SCENIC logo (white elements)

## [1.4.1] - 2025-11-11
### Fixed
- Fixed CTA button (REQUEST A QUOTE with yellow semicircle arrow)
- Completed footer contact info

## [1.4.0] - 2025-11-11
### Added
- Implemented footer geometric strip with 6-column grid using existing images
- Task 2.4 complete

## [1.3.2] - 2025-11-11
### Fixed
- Removed negative margin from .member-photo (-20px to 0)
- Fixed overlap, perfect alignment

## [1.3.1] - 2025-11-11
### Fixed
- Fixed arc-to-photo alignment by removing bottom padding from .member-arc (0.5rem to 0)
- Seamless arc/photo connection

## [1.3.0] - 2025-11-10
### Changed
- Updated IMPLEMENTATION_PLAN.md with all v1.2.0-1.2.9 work
- Marked Task 2.6 complete

## [1.2.9] - 2025-11-10
### Changed
- Removed gap: 1.5rem between cards
- Changed to gap: 0 on all breakpoints
- Cards sit directly adjacent

## [1.2.8] - 2025-11-10
### Fixed
- Changed arc from justify-content: center to flex-end - THE ROOT CAUSE FIX
- Pushed text to bottom, seamless connection

## [1.2.7] - 2025-11-10
### Fixed
- Added line-height: 1 to arc text
- Increased overlap to -20px
- Added overflow: hidden
- Fixed text spacing creating gap

## [1.2.6] - 2025-11-10
### Fixed
- Removed arc bottom padding for zero clearance
- Eliminated padding gap

## [1.2.5] - 2025-11-10
### Fixed
- Fixed gray color (#C7C9D4)
- Increased margin to -20px
- calc() for gradient positioning
- Correct gray, better overlap

## [1.2.4] - 2025-11-10
### Fixed
- Increased negative margin to -15px for zero clearance between arc and photo
- Reduced gap

## [1.2.3] - 2025-11-10
### Fixed
- Moved gray background (#C7C9D4) to start below arcs using linear gradient
- Arcs on white, photos on gray

## [1.2.2] - 2025-11-10
### Fixed
- Added missing random_headshot.png placeholder image to repository
- Fixed broken image icons

## [1.2.1] - 2025-11-10
### Fixed
- Fixed photo shape from oval to pill/capsule (border-radius: 0 0 110px 110px)
- Correct vertical pill shape

## [1.2.0] - 2025-11-10
### Changed
- **MAJOR:** Complete team section redesign
- CSS arcs, pill-shaped photos, color overlays
- Title below cards
- Matching Adobe XD design

## [1.1.2] - 2025-11-10
### Changed
- Header max-width adjustments

## [1.1.1] - 2025-11-10
### Changed
- Desktop styling unification

## [1.1.0] - 2025-11-10
### Changed
- Tablet centering improvements

## [1.0.9] - 2025-11-10
### Fixed
- z-index fixes for service cards

## [1.0.8] - 2025-11-10
### Changed
- Service card overlay spacing adjustments

## [1.0.7] - 2025-11-10
### Added
- **PHASE 1 COMPLETE** (100% of active tasks)
- Critical foundation established - ready for Phase 2

## [1.0.6] - 2025-11-10
### Added
- **Task 1.4 COMPLETE:** Mobile touch optimization
- All tap targets now 44×44px minimum
- Added :active states
- Prevented double-tap zoom
- Added haptic feedback
- Meets WCAG 2.5.5
- Native app-like touch experience

## [1.0.5] - 2025-11-10
### Added
- **Task 1.3 COMPLETE:** Full accessibility foundation
- Skip-to-content link
- ARIA labels for all interactive elements
- Enhanced focus states
- Verified alt text and color contrast
- WCAG AA compliant
- Keyboard/screen reader accessible

### Added
- **Task 1.5 COMPLETE:** Fixed service card mobile behavior
- Smooth animations with max-height transitions
- Touch-friendly expansion
- Chevron indicators
- Significantly improved mobile UX

### Added
- **Task 1.6 COMPLETE:** Removed dev-debug class from body tag
- Clean production-ready markup

### Added
- **Task 1.2 COMPLETE:** Lazy loading implementation
- Added lazy loading to 6 images (5 service icons + footer logo)
- Added font-display: swap for DIN 2014
- Improved initial page load performance

### Changed
- Task 1.1 skipped - images are placeholders for SVGs with animations
- Avoiding optimization of temporary assets

### Added
- Initial IMPLEMENTATION_PLAN.md created
- Established project roadmap

---

## Version History Format

### Version Numbering (Semantic Versioning)
- **MAJOR.MINOR.PATCH** (e.g., 2.1.4)
- **PATCH** (x.x.1): Bug fixes, minor tweaks, small adjustments
- **MINOR** (x.1.0): New features, enhancements, non-breaking changes
- **MAJOR** (2.0.0): Breaking changes, major redesigns, significant architectural changes

### Change Categories
- **Added**: New features
- **Changed**: Changes in existing functionality
- **Fixed**: Bug fixes
- **Removed**: Removed features
- **Security**: Security updates (if applicable)
