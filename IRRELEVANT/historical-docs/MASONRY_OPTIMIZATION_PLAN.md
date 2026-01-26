# Masonry Gallery Progressive Loading Optimization Plan

> **Project:** SCENIC Website - HOME & WORK Page Gallery Optimization
> **Goal:** Implement Pinterest-style progressive image loading with viewport prioritization
> **Priority:** HIGH - User experience critical for slow connections
> **Created:** December 5, 2025

---

## 📊 Current State Analysis

### Issues Identified

1. **HOME Page Portfolio (index.html:260-298)**
   - 9 images load simultaneously on page load
   - No progressive loading strategy
   - Images are local files (not using lazy loading)
   - Standard grid layout (not using Masonry.js)
   - **Impact:** All images compete for bandwidth simultaneously

2. **WORK Page Gallery (work.html:55-112)**
   - 16 external images (Lorem Picsum placeholders)
   - Uses Masonry.js with imagesLoaded
   - Has `loading="lazy"` attribute on images
   - **Problem:** imagesLoaded waits for ALL images before initializing Masonry
   - **Impact:** Long delay before any layout appears on slow connections

3. **Existing Lazy Loading (main.js:53-87)**
   - IntersectionObserver implemented for `.lazy` class images
   - Uses `data-src` pattern
   - 200px rootMargin (good!)
   - **Problem:** Only works with images marked with `.lazy` class
   - **Not applied to:** Portfolio images on either page

### Current Technology Stack

- ✅ **Masonry.js 4.x** - Already loaded on WORK page
- ✅ **imagesLoaded** - Already loaded on WORK page
- ✅ **IntersectionObserver** - Already implemented in main.js
- ❌ **No placeholder strategy** - No LQIP, BlurHash, or skeleton loaders
- ❌ **No image dimension data** - Missing width/height for CLS prevention
- ❌ **No responsive images** - No srcset/sizes for different viewports

---

## 🎯 Optimization Strategy

### Phase 1: Quick Wins (Immediate Impact)

**Goal:** Implement basic viewport-prioritized loading with minimal code changes

#### 1.1 Apply Lazy Loading to Portfolio Images

**Files to modify:**
- `index.html` - HOME page portfolio grid
- `work.html` - WORK page Masonry gallery

**Changes:**
```html
<!-- BEFORE -->
<img src="images/portfolio/red-tunnel-installation.jpg" alt="...">

<!-- AFTER -->
<img data-src="images/portfolio/red-tunnel-installation.jpg"
     src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3C/svg%3E"
     alt="..."
     class="lazy portfolio-lazy"
     width="400"
     height="300">
```

**Benefits:**
- Images load only when entering viewport
- Existing IntersectionObserver in main.js handles loading
- Zero additional JavaScript needed

**Implementation Time:** 30 minutes

---

#### 1.2 Fix WORK Page Masonry Initialization

**Current Problem:**
```javascript
// work.html:209 - Waits for ALL images before showing anything
imagesLoaded(grid, function() {
    msnry = new Masonry(grid, { ... });
});
```

**Optimized Solution:**
```javascript
// Initialize Masonry immediately with progressive layout updates
var msnry = new Masonry(grid, {
    itemSelector: '.portfolio-item',
    gutter: 16,
    transitionDuration: 0 // No animation during loading
});

// Progressive layout as each image loads
imagesLoaded(grid).on('progress', function(instance, image) {
    // Recalculate layout after each image
    msnry.layout();

    // Add 'loaded' class for fade-in effect
    image.img.closest('.portfolio-item').classList.add('loaded');
});

// Enable transitions after all loaded
imagesLoaded(grid).on('done', function() {
    msnry.options.transitionDuration = '0.3s';
});
```

**Benefits:**
- Instant grid layout (doesn't wait for images)
- Progressive reveal as each image loads
- Smooth layout adjustments
- Better perceived performance

**Implementation Time:** 15 minutes

---

#### 1.3 Add Placeholder Backgrounds (CSS-Only LQIP)

**Add to `styles/style.css`:**
```css
/* Portfolio image placeholders */
.portfolio-item {
    background: linear-gradient(135deg,
        rgba(238, 61, 51, 0.1) 0%,
        rgba(0, 48, 140, 0.1) 100%);
    opacity: 0;
    transform: translateY(20px);
    transition: opacity 0.4s ease, transform 0.4s ease;
}

.portfolio-item.loaded {
    opacity: 1;
    transform: translateY(0);
}

.portfolio-item img {
    opacity: 0;
    transition: opacity 0.3s ease;
}

.portfolio-item img.loaded {
    opacity: 1;
}
```

**Benefits:**
- Branded color gradient as placeholder
- Smooth fade-in animation
- No JavaScript changes needed
- Prevents "popcorn" effect

**Implementation Time:** 10 minutes

---

### Phase 2: Enhanced Progressive Loading (High Impact)

**Goal:** Implement sophisticated viewport prioritization and placeholder strategy

#### 2.1 Multi-Tier Lazy Loading System

**Create new file:** `scripts/progressive-masonry.js`

```javascript
/**
 * Progressive Masonry Gallery Loader
 * Loads images in priority tiers based on viewport distance
 */

class ProgressiveMasonryLoader {
    constructor(gridSelector, options = {}) {
        this.grid = document.querySelector(gridSelector);
        this.msnry = null;
        this.loadedCount = 0;

        // Configuration
        this.config = {
            itemSelector: options.itemSelector || '.portfolio-item',
            gutter: options.gutter || 16,
            // Loading tiers (distance from viewport)
            tiers: [
                { distance: '0px', priority: 1 },      // In viewport
                { distance: '200px', priority: 2 },    // Just below fold
                { distance: '600px', priority: 3 },    // Two screens down
                { distance: '1200px', priority: 4 }    // Background loading
            ],
            ...options
        };

        this.init();
    }

    init() {
        if (!this.grid) return;

        // Initialize Masonry immediately (empty grid)
        this.msnry = new Masonry(this.grid, {
            itemSelector: this.config.itemSelector,
            gutter: this.config.gutter,
            percentPosition: true,
            transitionDuration: 0
        });

        // Set up tiered observers
        this.setupTieredObservers();

        // Add resize handler
        this.setupResizeHandler();
    }

    setupTieredObservers() {
        const items = this.grid.querySelectorAll(this.config.itemSelector);

        // Create observer for each tier
        this.config.tiers.forEach(tier => {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.loadImage(entry.target, tier.priority);
                        observer.unobserve(entry.target);
                    }
                });
            }, {
                rootMargin: tier.distance,
                threshold: 0.01
            });

            // Observe all items
            items.forEach(item => observer.observe(item));
        });
    }

    loadImage(item, priority) {
        const img = item.querySelector('img[data-src]');
        if (!img || img.dataset.loading === 'true') return;

        img.dataset.loading = 'true';
        img.dataset.priority = priority;

        // Create temporary image to preload
        const tempImg = new Image();

        tempImg.onload = () => {
            // Swap to real image
            img.src = img.dataset.src;
            img.classList.add('loaded');
            item.classList.add('loaded');

            // Update Masonry layout
            if (this.msnry) {
                this.msnry.layout();
            }

            this.loadedCount++;

            // Enable transitions after first batch loads
            if (this.loadedCount === 5 && this.msnry) {
                this.msnry.options.transitionDuration = '0.3s';
            }
        };

        tempImg.onerror = () => {
            console.warn('Failed to load image:', img.dataset.src);
            item.classList.add('error');
        };

        // Start loading
        tempImg.src = img.dataset.src;
    }

    setupResizeHandler() {
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                if (this.msnry) this.msnry.layout();
            }, 250);
        });
    }

    // Public API
    layout() {
        if (this.msnry) this.msnry.layout();
    }

    destroy() {
        if (this.msnry) this.msnry.destroy();
    }
}

// Auto-initialize if grid exists
document.addEventListener('DOMContentLoaded', () => {
    const workGrid = document.querySelector('.portfolio-grid');
    if (workGrid && workGrid.closest('.work-page')) {
        window.masonryLoader = new ProgressiveMasonryLoader('.portfolio-grid');
    }
});
```

**Load in `work.html` (replace existing Masonry script):**
```html
<!-- Load libraries first -->
<script src="https://unpkg.com/masonry-layout@4/dist/masonry.pkgd.min.js"></script>

<!-- Load progressive loader -->
<script src="scripts/progressive-masonry.js"></script>
```

**Benefits:**
- Prioritizes above-the-fold images
- Smooth progressive loading
- Intelligent viewport detection
- Better perceived performance on slow connections

**Implementation Time:** 2 hours

---

#### 2.2 Add Image Dimensions for CLS Prevention

**Current Problem:** Images don't have width/height, causing layout shift

**Solution:** Add aspect ratio containers

**Update HTML pattern:**
```html
<div class="portfolio-item" style="--aspect-ratio: 1.33;">
    <div class="image-wrapper">
        <img data-src="images/portfolio/project.jpg"
             alt="Project description"
             class="lazy portfolio-lazy"
             width="800"
             height="600">
    </div>
</div>
```

**Add CSS:**
```css
.portfolio-item {
    aspect-ratio: var(--aspect-ratio, 1);
    width: 100%;
}

.image-wrapper {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
    background: linear-gradient(135deg,
        rgba(238, 61, 51, 0.1) 0%,
        rgba(0, 48, 140, 0.1) 100%);
}

.image-wrapper img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
}
```

**Benefits:**
- Zero layout shift (perfect CLS score)
- Masonry can calculate positions before images load
- Modern CSS with good browser support

**Implementation Time:** 1 hour

---

#### 2.3 Implement Skeleton Loaders

**Add animated placeholder:**
```css
.portfolio-item.loading .image-wrapper::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
        90deg,
        rgba(238, 61, 51, 0.05) 0%,
        rgba(238, 61, 51, 0.15) 50%,
        rgba(238, 61, 51, 0.05) 100%
    );
    background-size: 200% 100%;
    animation: shimmer 2s infinite;
    z-index: 1;
}

@keyframes shimmer {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
}

.portfolio-item.loaded .image-wrapper::before {
    animation: none;
    opacity: 0;
}
```

**Benefits:**
- Visual feedback that content is loading
- Matches SCENIC brand colors
- Modern, professional appearance

**Implementation Time:** 30 minutes

---

### Phase 3: Advanced Optimizations (Future Enhancement)

#### 3.1 BlurHash Placeholders

**Technology:** Generate 20-30 character hash representing blurred image

**Implementation:**
1. Generate BlurHash for each portfolio image (server-side)
2. Store hashes in JSON data file
3. Render BlurHash canvas as placeholder
4. Swap to full image when loaded

**Benefits:**
- Branded, attractive placeholders
- Tiny data footprint (~30 bytes per image)
- Industry-standard approach (Pinterest, Canva, Medium)

**Estimated Time:** 4-6 hours
**Defer to:** After Phase 2 complete

---

#### 3.2 Network-Aware Loading

**Use Network Information API to adjust loading strategy:**

```javascript
function getLoadingStrategy() {
    const connection = navigator.connection ||
                      navigator.mozConnection ||
                      navigator.webkitConnection;

    if (!connection) return 'standard';

    switch(connection.effectiveType) {
        case 'slow-2g':
        case '2g':
            return 'minimal'; // Load only in-viewport
        case '3g':
            return 'standard'; // Tiered loading
        case '4g':
        default:
            return 'aggressive'; // Load more aggressively
    }
}
```

**Benefits:**
- Adapts to user's connection speed
- Respects data constraints on mobile
- Better experience across all connections

**Estimated Time:** 2 hours
**Defer to:** After Phase 2 complete

---

#### 3.3 Responsive Image srcset

**Generate multiple image sizes:**
```bash
# Create 3 sizes per image
convert original.jpg -resize 400x image-400w.jpg
convert original.jpg -resize 800x image-800w.jpg
convert original.jpg -resize 1200x image-1200w.jpg
```

**Use in HTML:**
```html
<img data-srcset="
    images/portfolio/project-400w.jpg 400w,
    images/portfolio/project-800w.jpg 800w,
    images/portfolio/project-1200w.jpg 1200w"
     data-src="images/portfolio/project-800w.jpg"
     sizes="(max-width: 768px) 100vw,
            (max-width: 1024px) 50vw,
            33vw"
     alt="Project">
```

**Benefits:**
- Mobile users download smaller images
- Huge bandwidth savings on slow connections
- Better performance metrics

**Estimated Time:** 3 hours + image processing
**Defer to:** After real portfolio images added

---

## 📋 Implementation Roadmap

### Week 1: Phase 1 - Quick Wins

| Task | File(s) | Time | Priority |
|------|---------|------|----------|
| 1.1 Apply lazy loading class to HOME portfolio | `index.html` | 30 min | 🔴 CRITICAL |
| 1.2 Fix WORK page Masonry init | `work.html` | 15 min | 🔴 CRITICAL |
| 1.3 Add placeholder CSS | `styles/style.css` | 10 min | 🟡 HIGH |
| **Testing** | Both pages | 30 min | 🔴 CRITICAL |
| **Total Week 1** | | **~1.5 hours** | |

**Expected Results:**
- Images load progressively instead of all at once
- Visible layout appears immediately on WORK page
- Smooth fade-in animations
- Better perceived performance

---

### Week 2: Phase 2 - Enhanced Loading

| Task | File(s) | Time | Priority |
|------|---------|------|----------|
| 2.1 Create ProgressiveMasonryLoader | `scripts/progressive-masonry.js` | 2 hrs | 🟡 HIGH |
| 2.2 Add aspect ratio containers | `index.html`, `work.html`, `style.css` | 1 hr | 🟡 HIGH |
| 2.3 Implement skeleton loaders | `styles/style.css` | 30 min | 🟢 MEDIUM |
| 2.4 Update HOME page to use new loader | `index.html`, `scripts/` | 1 hr | 🟡 HIGH |
| **Testing & refinement** | All files | 1.5 hrs | 🔴 CRITICAL |
| **Total Week 2** | | **~6 hours** | |

**Expected Results:**
- Tiered loading based on viewport distance
- Zero layout shift (CLS = 0)
- Professional loading animations
- Significant improvement on slow connections

---

### Future: Phase 3 - Advanced Features

| Task | Time | Priority | Notes |
|------|------|----------|-------|
| 3.1 BlurHash placeholders | 4-6 hrs | 🟢 NICE-TO-HAVE | After real images |
| 3.2 Network-aware loading | 2 hrs | 🟢 NICE-TO-HAVE | Low priority |
| 3.3 Responsive srcset | 3 hrs | 🟡 MEDIUM | With real images |

---

## 🧪 Testing Checklist

### Performance Testing

**Chrome DevTools Network Throttling:**
- [ ] Test on **Slow 3G** (400ms RTT, 400kbps down)
- [ ] Test on **Fast 3G** (150ms RTT, 1.6Mbps down)
- [ ] Test on **4G** (20ms RTT, 4Mbps down)

**Metrics to Track:**
- [ ] **First Contentful Paint (FCP)** - Target: < 2s on Slow 3G
- [ ] **Largest Contentful Paint (LCP)** - Target: < 2.5s on Slow 3G
- [ ] **Cumulative Layout Shift (CLS)** - Target: < 0.1
- [ ] **Time to Interactive (TTI)** - Target: < 3.5s on Slow 3G

### Visual Testing

- [ ] Images load in viewport first
- [ ] Smooth progressive reveal (no "popcorn" effect)
- [ ] Placeholders visible before images load
- [ ] No layout shift during loading
- [ ] Fade-in animations smooth
- [ ] Masonry layout correct on all breakpoints

### Browser Testing

- [ ] Chrome (desktop & mobile)
- [ ] Safari (desktop & iOS)
- [ ] Firefox
- [ ] Edge

### Connection Testing

- [ ] Slow 3G - Verify tiered loading works
- [ ] Offline - Verify graceful degradation
- [ ] Flaky connection - Verify retry logic

---

## 📊 Success Metrics

### Before Optimization (Baseline)

**WORK Page - Slow 3G:**
- FCP: ~5-7 seconds (waiting for all 16 images)
- LCP: ~12-15 seconds
- CLS: 0.25+ (high layout shift)
- User sees: Blank page for 5+ seconds

**HOME Page - Slow 3G:**
- FCP: ~3-4 seconds
- LCP: ~8-10 seconds
- CLS: 0.15+ (moderate shift)

### After Phase 1 (Target)

**WORK Page:**
- FCP: < 2 seconds (instant grid layout)
- LCP: < 5 seconds (first image visible)
- CLS: < 0.1
- User sees: Layout + placeholders immediately

**HOME Page:**
- FCP: < 1.5 seconds
- LCP: < 4 seconds
- CLS: < 0.05

### After Phase 2 (Target)

**WORK Page:**
- FCP: < 1.5 seconds
- LCP: < 3 seconds
- CLS: 0 (perfect score)
- User sees: Instant layout, progressive image reveal

**HOME Page:**
- FCP: < 1 second
- LCP: < 2.5 seconds
- CLS: 0

---

## 🚀 Quick Start Guide

### Step 1: Backup Current Files

```bash
cd /Users/cmoredock/DEV/DEV_PROJ_TEST
cp index.html index.html.backup
cp work.html work.html.backup
cp styles/style.css styles/style.css.backup
cp scripts/main.js scripts/main.js.backup
```

### Step 2: Implement Phase 1 Changes

**File 1: `index.html`** (Lines 264-296)

Change all portfolio images from:
```html
<img src="images/portfolio/red-tunnel-installation.jpg" alt="...">
```

To:
```html
<img data-src="images/portfolio/red-tunnel-installation.jpg"
     src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 4 3'%3E%3C/svg%3E"
     alt="..."
     class="lazy portfolio-lazy"
     width="800"
     height="600">
```

**File 2: `work.html`** (Lines 204-230)

Replace entire Masonry initialization script with:
```javascript
<script>
    var grid = document.querySelector('.portfolio-grid');

    // Initialize Masonry immediately
    var msnry = new Masonry(grid, {
        itemSelector: '.portfolio-item',
        percentPosition: false,
        gutter: 16,
        resize: true,
        transitionDuration: 0
    });

    // Progressive layout as images load
    imagesLoaded(grid).on('progress', function(instance, image) {
        msnry.layout();
        image.img.closest('.portfolio-item').classList.add('loaded');
    });

    // Enable transitions after all loaded
    imagesLoaded(grid).on('done', function() {
        msnry.options.transitionDuration = '0.3s';
    });

    // Resize handler
    var resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            if (msnry) msnry.layout();
        }, 250);
    });
</script>
```

**File 3: `styles/style.css`** (Add at end of Portfolio section ~line 720)

```css
/* Progressive Loading Enhancements */
.portfolio-item {
    background: linear-gradient(135deg,
        rgba(238, 61, 51, 0.1) 0%,
        rgba(0, 48, 140, 0.1) 100%);
    opacity: 0;
    transform: translateY(20px);
    transition: opacity 0.4s ease, transform 0.4s ease;
}

.portfolio-item.loaded {
    opacity: 1;
    transform: translateY(0);
}

.portfolio-item img {
    opacity: 0;
    transition: opacity 0.3s ease;
}

.portfolio-item img.loaded {
    opacity: 1;
}

.portfolio-item.error {
    background: rgba(238, 61, 51, 0.2);
    opacity: 0.5;
}
```

### Step 3: Test

```bash
# Open both pages in browser
open index.html
open work.html

# Throttle network in Chrome DevTools:
# DevTools → Network → Throttling → Slow 3G
```

**Expected behavior:**
- WORK page: Grid appears instantly, images fade in progressively
- HOME page: Images below fold load only when scrolling
- Smooth animations throughout

---

## 🔧 Troubleshooting

### Issue: Images not loading

**Check:**
1. Console for JavaScript errors
2. `data-src` attribute is correct
3. `.lazy` class is applied
4. IntersectionObserver is running (check main.js line 55)

**Fix:**
```javascript
// Add debug logging to main.js observer
console.log('Lazy loading image:', img.dataset.src);
```

### Issue: Masonry layout broken

**Check:**
1. Masonry.js loaded before initialization script
2. Grid selector `.portfolio-grid` is correct
3. Item selector `.portfolio-item` matches HTML

**Fix:**
```javascript
// Add error handling
if (!grid) {
    console.error('Grid not found!');
    return;
}
```

### Issue: Layout shift still occurring

**Check:**
1. Width/height attributes on images
2. Aspect ratio CSS applied
3. Container has defined dimensions

**Fix:**
```css
.portfolio-item {
    min-height: 200px; /* Temporary while testing */
}
```

---

## 📚 Resources & References

### Documentation
- [Masonry.js Layout Methods](https://masonry.desandro.com/methods.html)
- [imagesLoaded Events](https://imagesloaded.desandro.com/#events)
- [IntersectionObserver API (MDN)](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)

### Inspiration
- [Pinterest - Driving User Growth with Performance](https://medium.com/pinterest-engineering/driving-user-growth-with-performance-improvements-cfc50dafadd7)
- [CSS-Only LQIP Technique](https://leanrada.com/notes/css-only-lqip/)
- [Optimize CLS (web.dev)](https://web.dev/articles/optimize-cls)

---

## 📝 Version History

| Date | Version | Changes |
|------|---------|---------|
| 2025-12-05 | 1.0.0 | Initial optimization plan created |

---

**Next Steps:** Review plan → Approve Phase 1 → Begin implementation
