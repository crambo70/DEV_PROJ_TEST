# DEV_PROJ_TEST Style Guide

*Last Updated: November 8, 2025*

## Color Palette

### Primary Colors
| Color Name | Hex Code | Usage |
|------------|----------|-------|
| **White** | `#FFFFFF` | Header background, text overlays, clean sections |
| **Red** | `#EE3D33` | Accent color, call-to-action elements |
| **Navy Blue** | `#00300C` | Primary brand color, geometric background |
| **Light Blue** | `#12AEE7` | Secondary accent, geometric background |
| **Black** | `#000000` | Primary text, high contrast elements |
| **Teal/Mint** | `#34CBC2` | Accent color, geometric background |

### Secondary Colors
| Color Name | Hex Code | Usage |
|------------|----------|-------|
| **Yellow/Gold** | `#FAC813` | Highlight color, geometric background |
| **Purple/Maroon** | `#600040` | Accent color, geometric background |
| **Light Gray** | `#C7C9D4` | Subtle backgrounds, borders |
| **Medium Gray** | `#84858D` | Secondary text, inactive states |
| **Dark Gray** | `#9EA0A8` | Tertiary text, subtle elements |
| **Off-White** | `#F1F1F4` | Background variations, cards |

### Neutral
| Color Name | Hex Code | Usage |
|------------|----------|-------|
| **Light Beige** | `#F2F3F5` | Soft background alternative |

## Design Elements

### Layout Structure (Based on Reference Image)

**HTML Structure Implemented:**

```html
<header class="header">
  <!-- SCENIC logo + navigation menu -->
</header>

<section class="hero">
  <!-- Geometric background + "IMAGINE WHAT WE CAN CREATE" CTA -->
</section>

<section class="services">
  <!-- 5 service cards with icons -->
</section>
```

**Key Components:**
- **Header Section**: Clean navigation with SCENIC logo and menu items
  - **Logo**: PNG image implementation with responsive scaling
    - Desktop: 32px height, auto width with 200px max-width
    - Tablet: 28px height, 175px max-width  
    - Mobile: 24px height, 150px max-width
    - Perfect aspect ratio maintenance with object-fit: contain
    - Future-ready for SVG upgrade for optimal scaling
  - Desktop: Horizontal menu (WORK, GET IN TOUCH, EVENT SERVICES)
  - Mobile: Hamburger menu with slide-down panel
- **Hero Section**: Geometric background with centered call-to-action
  - Floating white rounded button with navy text
  - Temporary gradient background (to be replaced with CSS geometric art)
- **Services Section**: Five service cards with placeholder icons
  1. IDEATE/DESIGN
  2. EVENT SERVICES  
  3. BUILD
  4. LOGISTICS
  5. ON-SITE

**CSS Framework:**
- Mobile-first responsive design
- CSS Grid for service cards layout
- Flexbox for navigation and content alignment
- CSS transitions for interactive elements

### Typography

**Primary Font**: DIN 2014 Regular

#### Font Sizes
| Size | Usage | CSS |
|------|-------|-----|
| **Large** | `48px` | Main headlines, hero text | `font-size: 48px;` |
| **Medium** | `24px` | Section headers, subheadings | `font-size: 24px;` |
| **Small** | `18px` | Body text, minimum readable size | `font-size: 18px;` |
| **Extra Small** | `9px` | Navigation menu items | `font-size: 9px;` |

#### Implementation Notes
- DIN 2014 Regular will need to be imported via web fonts or fallback to system fonts
- Fallback fonts: `'DIN 2014', 'Helvetica Neue', Arial, sans-serif`
- All text should meet accessibility contrast requirements against chosen background colors

### Spacing & Layout

**Design Philosophy**: Mobile-first responsive design

#### Breakpoints
| Device | Screen Size | CSS Media Query |
|--------|-------------|-----------------|
| **Mobile** | 320px - 768px | `@media (max-width: 768px)` |
| **Tablet** | 769px - 1024px | `@media (min-width: 769px) and (max-width: 1024px)` |
| **Desktop** | 1025px+ | `@media (min-width: 1025px)` |

#### Responsive Behavior

**Navigation**
- **Desktop**: Horizontal menu items (WORK, GET IN TOUCH, EVENT SERVICES) on right
- **Mobile/Tablet**: Collapse to hamburger menu at appropriate breakpoint

**Hero Section**
- **"Imagine What We Can Create" callout**: Maintains float positioning over colorful background
- Remains visually separated from background elements across all screen sizes
- Scales appropriately while maintaining readability

**Service Cards (5 cards)**
- **Desktop**: Horizontal row layout
- **Tablet**: May wrap to 2-3 cards per row
- **Mobile**: Stack vertically with thoughtful spacing
- Cards shrink proportionally while maintaining visual hierarchy
- Consistent spacing and alignment when stacked

#### Layout Principles
- Mobile-first CSS approach (base styles for mobile, progressively enhanced)
- Flexible grid system for service cards
- Maintain visual separation of floating elements
- Elegant collapse patterns that feel intentional, not accidental

### Background & Visual Elements

#### Logo Implementation
**SCENIC INC Logo**: PNG image with responsive scaling

**Image Specifications**:
- **Format**: PNG (placeholder for future SVG upgrade)
- **Location**: `/images/scenic-logo.png`
- **Scaling**: Responsive height-based sizing with auto width
- **Aspect Ratio**: Maintained with `object-fit: contain`

**Responsive Sizing**:
- **Desktop (1025px+)**: 32px height, 200px max-width
- **Tablet (769-1024px)**: 28px height, 175px max-width  
- **Mobile (≤768px)**: 24px height, 150px max-width

**Implementation Benefits**:
- **Perfect quality**: No CSS typography limitations
- **True scaling**: Maintains design integrity across devices
- **Future-ready**: Easy SVG replacement for infinite scalability
- **Performance**: Single image request vs complex CSS shapes

**CSS Properties**:
- `height`: Fixed height for consistent sizing
- `width: auto`: Maintains aspect ratio
- `max-width`: Prevents oversizing on large screens
- `object-fit: contain`: Ensures proper scaling without distortion

**CSS Techniques**:
- `::before` pseudo-element for top bar
- `::after` pseudo-element for bottom bar WITH text content
- `clip-path` for angled geometric shapes with proper proportions
- CSS borders for arrow triangles (closer spacing)
- White text on blue background for INC
- Responsive scaling across breakpoints

#### Geometric Hero Background
**Implementation**: Pure CSS geometric artwork (no images)

**Grid System**:
- Base grid: ~12-16 columns × 4-6 rows
- CSS Grid layout for structure
- Individual cells contain geometric shapes

**Shape Types**:
- Solid color rectangles
- Circular segments (quarter/half circles using border-radius)
- Diagonal splits using clip-path or transforms
- Layered elements with z-index stacking

**CSS Techniques**:
- `display: grid` for base structure
- `clip-path` for complex geometric shapes
- `::before` and `::after` pseudo-elements for layering
- `transform: rotate()` for angled elements
- `border-radius` for circular segments
- Absolute positioning for overlapping effects

**Color Distribution**:
- Primary: Navy Blue (#00300C), Light Blue (#12AEE7)
- Accents: Red (#EE3D33), Yellow (#FAC813), Teal (#34CBC2)
- Supporting: Purple (#600040), Black (#000000)

**Responsive Behavior**:
- Grid scales proportionally on smaller screens
- Maintains geometric relationships across breakpoints
- Background remains visually cohesive when compressed

### Interactive Elements
*To be defined*

---

## Change Log
- **Nov 8, 2025**: Initial color palette documentation from provided style guide
- **Nov 8, 2025**: Layout structure notes from reference image analysis
- **Nov 8, 2025**: Typography system defined - DIN 2014 Regular with 18px/24px/48px sizing
- **Nov 8, 2025**: Responsive design strategy - Mobile-first approach with elegant stacking/collapsing
- **Nov 8, 2025**: Geometric background approach - Pure CSS grid-based geometric artwork implementation
- **Nov 8, 2025**: HTML structure implemented - Complete semantic layout with header, hero, and services sections
- **Nov 8, 2025**: CSS logo implementation - Pure CSS SCENIC INC logo with geometric shapes and responsive scaling
- **Nov 8, 2025**: CSS logo refinement - Fixed proportions, spacing, and integrated INC text within bottom bar
- **Nov 8, 2025**: CSS logo precision update - Corrected color (#00308C), delicate typography, overlapping geometric elements
- **Nov 8, 2025**: Logo implementation change - Switched from CSS to PNG image with responsive scaling for better quality
- **Nov 8, 2025**: Navigation typography adjustment - Reduced menu text size by 50% (from 18px to 9px) for better proportion balance