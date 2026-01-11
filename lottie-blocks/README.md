# Scenic Lottie Animation Grid

Animated block grid system using Lottie animations for Scenic Inc branding.

## Overview

This project contains 6 animated Lottie blocks (A-F) that can be arranged in a grid with various rotations and flips to create a dynamic, seamless animated background.

## Files

### Lottie Animations (`JSON Files/`)

| File | Description |
|------|-------------|
| `Block A_opt.json` | Teal/blue concentric curved rings (arcs from bottom-left) |
| `Block B_opt.json` | Radial sunburst (yellow/red/blue rays from bottom-left) |
| `Block C_opt.json` | Mixed quadrants (blue top-left, black diagonal stripe top-right) |
| `Block D_opt.json` | Similar to C with different color arrangement |
| `Block E_opt.json` | Large teal arch with blue curves |
| `Block F_opt.json` | Complex geometric with red circles and mixed shapes |

**Animation Properties:**
- Dimensions: 288 x 288 pixels
- Frame Rate: 29 fps
- Duration: ~15.5 seconds (450 frames)

### HTML Test Pages

| File | Description |
|------|-------------|
| `test-grid.html` | **Main grid layout** - 8x3 grid with proper rotations/flips |
| `test-single.html` | Single animation tester with ping-pong mode toggle |
| `test-mouse.html` | Mouse-controlled animation scrubbing with flip options |
| `test-identify.html` | Shows all 6 blocks labeled for identification |
| `test.html` | Original test page with all animations |

## Grid Layout

The main grid (`test-grid.html`) is an 8-column by 3-row layout:

```
Row 1: A    B    C    D*   E*   F*   A    B
Row 2: D    E    F    A*   B*   C*   D    E
Row 3: A*   B*   C*   D    E    F    A*   B*

* = flipped vertically
```

### Grid Configuration

The grid is defined in JavaScript as an array of objects:

```javascript
{ block: 'A', rotate: 0, flipH: false, flipV: false }
```

- `block`: Letter A-F
- `rotate`: Degrees (0, 90, 180, 270)
- `flipH`: Horizontal flip (mirror on vertical axis)
- `flipV`: Vertical flip (mirror on horizontal axis)

## Lottie File Fixes Applied

### Issue: Black Frame Flash at Loop Point

The original Lottie files had a timing mismatch causing a black flash when looping:
- Main composition `op` (out point) was set to 453
- Layer content ended at frame 450
- This left 3 blank frames at the end

**Fix Applied:**
Changed `op` from 453 to 450 in the following files:
- Block A_opt.json
- Block B_opt.json
- Block C_opt.json
- Block D_opt.json
- Block E_opt.json
- Block F_opt.json

### Issue: Animation Snap on Loop

The animations contain rotating elements that don't return to their starting position, causing a visual "snap" when looping.

**Solution:**
Implemented ping-pong playback - animations play forward then reverse, creating seamless infinite loops without any visual discontinuity.

```javascript
let playingForward = true;
anim.addEventListener('complete', () => {
    playingForward = !playingForward;
    anim.setDirection(playingForward ? 1 : -1);
    anim.play();
});
```

## Usage

### Running Locally

Due to browser security restrictions on loading local JSON files, you need to run a local server:

```bash
cd /path/to/DEV_Lottie_Test
python3 -m http.server 8000
```

Then open: http://localhost:8000/test-grid.html

### Integrating into a Project

1. Include the Lottie library:
```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/lottie-web/5.12.2/lottie.min.js"></script>
```

2. Create a container and load the animation:
```javascript
const anim = lottie.loadAnimation({
    container: document.getElementById('my-container'),
    renderer: 'svg',
    loop: false,  // We handle looping manually for ping-pong
    autoplay: true,
    path: 'path/to/Block A_opt.json'
});

// Ping-pong playback
let playingForward = true;
anim.addEventListener('complete', () => {
    playingForward = !playingForward;
    anim.setDirection(playingForward ? 1 : -1);
    anim.play();
});
```

3. Apply transforms for rotation/flip via CSS:
```css
.block {
    transform: scaleX(-1) rotate(90deg);  /* flip horizontal + rotate 90° */
}
```

## Dependencies

- [Lottie Web](https://github.com/airbnb/lottie-web) v5.12.2+

## Notes

- The "Solo" animation files (Build_Solo_opt.json, etc.) are separate animations not part of the block grid system
- SVGs are scaled slightly (1.01) to prevent sub-pixel gaps between grid cells
- Toggle Labels button in test-grid.html shows block/transform info for debugging
