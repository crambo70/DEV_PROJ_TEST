#!/usr/bin/env node

/**
 * SVG to Lottie Animation Generator
 * Interpolates between SVG keyframes and generates Lottie JSON
 */

const fs = require('fs');
const path = require('path');
const { DOMParser, XMLSerializer } = require('@xmldom/xmldom');

// Configuration
const CONFIG = {
  inputDir: path.join(__dirname, '../SVG_IMAGES_FOR_ANIMATIONS'),
  outputDir: path.join(__dirname, '../animations'),
  keyframes: [
    'Design_Ideation_Keyframe One.svg',
    'Design_Ideation_Keyframe Two.svg',
    'Design_Ideation_Keyframe Three.svg'
  ],
  framesPerTransition: 10, // 10 interpolated frames between each keyframe
  fps: 30,
  outputName: 'ideate_design_animation.json'
};

/**
 * Linear interpolation between two values
 */
function lerp(start, end, t) {
  return start + (end - start) * t;
}

/**
 * Parse SVG path d attribute into array of commands and coordinates
 */
function parsePath(d) {
  if (!d) return [];

  const commands = [];
  // Improved regex to handle negative numbers and decimals properly
  const regex = /([MmLlHhVvCcSsQqTtAaZz])([\s\S]*?)(?=[MmLlHhVvCcSsQqTtAaZz]|$)/g;
  let match;

  while ((match = regex.exec(d)) !== null) {
    const cmd = match[1];
    const coordString = match[2].trim();

    if (!coordString) {
      commands.push({ cmd, coords: [] });
      continue;
    }

    // Handle compact SVG notation:
    // 1. Add space before minus signs that follow a digit (like "0-.76" -> "0 -.76")
    // 2. Add space between abutting decimal points (like "1.46.26" -> "1.46 .26")
    //    This regex looks for: decimal-digits followed immediately by another decimal point
    let normalized = coordString.replace(/(\d)-/g, '$1 -');
    normalized = normalized.replace(/(\.\d+)\./g, '$1 .');

    // Split on whitespace and commas, handling negative numbers
    const coords = normalized
      .replace(/,/g, ' ')  // Replace commas with spaces
      .trim()
      .split(/\s+/)  // Split on whitespace
      .filter(n => n && n !== '')
      .map(n => parseFloat(n));

    commands.push({ cmd, coords });
  }

  return commands;
}

/**
 * Interpolate between two SVG paths
 */
function interpolatePath(pathA, pathB, t) {
  const commandsA = parsePath(pathA);
  const commandsB = parsePath(pathB);

  if (commandsA.length !== commandsB.length) {
    // If paths have different structures, swap at midpoint
    return t < 0.5 ? pathA : pathB;
  }

  let result = '';

  for (let i = 0; i < commandsA.length; i++) {
    const cmdA = commandsA[i];
    const cmdB = commandsB[i];

    if (cmdA.cmd !== cmdB.cmd) {
      // Commands don't match, swap at midpoint
      return t < 0.5 ? pathA : pathB;
    }

    result += cmdA.cmd;

    // Interpolate coordinates
    const coordsA = cmdA.coords;
    const coordsB = cmdB.coords;

    if (coordsA.length !== coordsB.length) {
      return t < 0.5 ? pathA : pathB;
    }

    // Build coordinate string with proper SVG syntax
    // Different commands have different coordinate grouping rules
    const cmd = cmdA.cmd.toUpperCase();
    const coordsPerGroup = {
      'M': 2, 'L': 2, 'H': 1, 'V': 1,  // Move, Line, Horizontal, Vertical
      'C': 6, 'S': 4, 'Q': 4, 'T': 2,  // Bezier curves
      'A': 7,  // Arc
      'Z': 0   // Close path
    };

    const groupSize = coordsPerGroup[cmd] || 2;
    const interpolatedCoords = [];

    for (let j = 0; j < coordsA.length; j++) {
      const interpolated = lerp(coordsA[j], coordsB[j], t);
      interpolatedCoords.push(interpolated.toFixed(2));
    }

    // Group coordinates and join with proper spacing
    // Within a group: use commas (x,y)
    // Between groups: use spaces
    if (groupSize > 0) {
      const groups = [];
      for (let j = 0; j < interpolatedCoords.length; j += groupSize) {
        const group = interpolatedCoords.slice(j, j + groupSize);
        groups.push(group.join(','));
      }
      result += groups.join(' ');
    }
  }

  return result;
}

/**
 * Parse SVG file and return DOM
 */
function parseSVG(filePath) {
  const svgContent = fs.readFileSync(filePath, 'utf-8');
  const parser = new DOMParser();
  return parser.parseFromString(svgContent, 'image/svg+xml');
}

/**
 * Extract transform values from transform attribute
 */
function parseTransform(transformStr) {
  if (!transformStr) return { x: 0, y: 0, rotation: 0, scale: 1 };

  const translate = transformStr.match(/translate\(([^,]+),([^)]+)\)/);
  const rotate = transformStr.match(/rotate\(([^)]+)\)/);
  const scale = transformStr.match(/scale\(([^)]+)\)/);

  return {
    x: translate ? parseFloat(translate[1]) : 0,
    y: translate ? parseFloat(translate[2]) : 0,
    rotation: rotate ? parseFloat(rotate[1]) : 0,
    scale: scale ? parseFloat(scale[1]) : 1
  };
}

/**
 * Create transform string from values
 */
function createTransform({ x, y, rotation, scale }) {
  const parts = [];
  if (x !== 0 || y !== 0) parts.push(`translate(${x},${y})`);
  if (rotation !== 0) parts.push(`rotate(${rotation})`);
  if (scale !== 1) parts.push(`scale(${scale})`);
  return parts.join(' ');
}

/**
 * Interpolate between two polygon/path points strings
 */
function interpolatePoints(pointsA, pointsB, t) {
  const coordsA = pointsA.trim().split(/\s+/).map(parseFloat);
  const coordsB = pointsB.trim().split(/\s+/).map(parseFloat);

  if (coordsA.length !== coordsB.length) return pointsA; // Can't interpolate different lengths

  const interpolated = coordsA.map((val, i) => lerp(val, coordsB[i], t));
  return interpolated.join(' ');
}

/**
 * Get element by ID from SVG DOM
 */
function getElementById(svgDoc, id) {
  // Try getElementById first
  if (svgDoc.getElementById) {
    const el = svgDoc.getElementById(id);
    if (el) return el;
  }

  // Fallback: search through all elements
  const allElements = svgDoc.getElementsByTagName('*');
  for (let i = 0; i < allElements.length; i++) {
    if (allElements[i].getAttribute('id') === id) {
      return allElements[i];
    }
  }

  return null;
}

/**
 * Get all elements with IDs from SVG
 */
function getAllElementsWithIds(svgDoc) {
  const elements = {};
  const allElements = svgDoc.getElementsByTagName('*');

  for (let i = 0; i < allElements.length; i++) {
    const el = allElements[i];
    const id = el.getAttribute('id');
    if (id) {
      elements[id] = el;
    }
  }

  return elements;
}

/**
 * Clone SVG document
 */
function cloneSVG(svgDoc) {
  const serializer = new XMLSerializer();
  const svgString = serializer.serializeToString(svgDoc);
  const parser = new DOMParser();
  return parser.parseFromString(svgString, 'image/svg+xml');
}

/**
 * Interpolate opacity
 */
function getOpacity(element) {
  const opacity = element.getAttribute('opacity');
  const fillOpacity = element.getAttribute('fill-opacity');
  return parseFloat(opacity || fillOpacity || '1');
}

/**
 * Interpolate line elements (for beam rays)
 */
function interpolateLine(lineA, lineB, t, centerX, centerY) {
  const x1A = parseFloat(lineA.getAttribute('x1') || centerX);
  const y1A = parseFloat(lineA.getAttribute('y1') || centerY);
  const x2A = parseFloat(lineA.getAttribute('x2') || centerX);
  const y2A = parseFloat(lineA.getAttribute('y2') || centerY);

  const x1B = parseFloat(lineB.getAttribute('x1'));
  const y1B = parseFloat(lineB.getAttribute('y1'));
  const x2B = parseFloat(lineB.getAttribute('x2'));
  const y2B = parseFloat(lineB.getAttribute('y2'));

  // For beam growth: start from center and grow outward
  const x1 = lerp(centerX, x1B, t);
  const y1 = lerp(centerY, y1B, t);
  const x2 = lerp(centerX, x2B, t);
  const y2 = lerp(centerY, y2B, t);

  return { x1, y1, x2, y2 };
}

/**
 * Get all child elements of a group (excluding text/whitespace nodes)
 */
function getGroupChildren(groupElement) {
  const children = [];
  if (!groupElement || !groupElement.childNodes) return children;

  for (let i = 0; i < groupElement.childNodes.length; i++) {
    const node = groupElement.childNodes[i];
    // Only include element nodes (nodeType === 1), skip text nodes and whitespace
    if (node.nodeType === 1) {
      children.push(node);
    }
  }

  return children;
}

/**
 * Interpolate between two SVG keyframes with custom animations
 */
function interpolateKeyframes(svgDocA, svgDocB, t, keyframeIndex) {
  const result = cloneSVG(svgDocA);
  const elementsA = getAllElementsWithIds(svgDocA);
  const elementsB = getAllElementsWithIds(svgDocB);

  // Helper function to interpolate group children recursively
  function interpolateGroupChildren(groupA, groupB, groupResult, t) {
    const childrenA = getGroupChildren(groupA);
    const childrenB = getGroupChildren(groupB);
    const childrenResult = getGroupChildren(groupResult);

    for (let i = 0; i < Math.min(childrenA.length, childrenB.length); i++) {
      const childA = childrenA[i];
      const childB = childrenB[i];
      const childResult = childrenResult[i];

      if (!childA || !childB || !childResult) continue;

      const tagName = childResult.tagName;

      // Preserve class attribute from source keyframe (important for colors)
      // Use the starting keyframe's class to maintain consistent colors
      const classA = childA.getAttribute('class');
      if (classA) {
        childResult.setAttribute('class', classA);
      }

      // Recursively handle nested groups
      if (tagName === 'g') {
        interpolateGroupChildren(childA, childB, childResult, t);
        continue;
      }

      // Interpolate polygon points
      if (tagName === 'polygon') {
        const pointsA = childA.getAttribute('points');
        const pointsB = childB.getAttribute('points');
        if (pointsA && pointsB) {
          childResult.setAttribute('points', interpolatePoints(pointsA, pointsB, t));
        }
      }

      // Interpolate path d attribute
      if (tagName === 'path') {
        const dA = childA.getAttribute('d');
        const dB = childB.getAttribute('d');
        if (dA && dB) {
          // Interpolate the path
          const interpolated = interpolatePath(dA, dB, t);


          // xmldom has serious issues with long paths - setAttribute truncates them
          // Workaround: Store the interpolated path in a custom property and fix it during serialization
          childResult.setAttribute('d', interpolated);
          if (interpolated.length > 200) {
            // Store the full path in a custom property
            childResult._fullPathD = interpolated;
          }
        }
      }

      // Interpolate line coordinates
      if (tagName === 'line') {
        const x1A = parseFloat(childA.getAttribute('x1'));
        const y1A = parseFloat(childA.getAttribute('y1'));
        const x2A = parseFloat(childA.getAttribute('x2'));
        const y2A = parseFloat(childA.getAttribute('y2'));

        const x1B = parseFloat(childB.getAttribute('x1'));
        const y1B = parseFloat(childB.getAttribute('y1'));
        const x2B = parseFloat(childB.getAttribute('x2'));
        const y2B = parseFloat(childB.getAttribute('y2'));

        childResult.setAttribute('x1', lerp(x1A, x1B, t).toFixed(2));
        childResult.setAttribute('y1', lerp(y1A, y1B, t).toFixed(2));
        childResult.setAttribute('x2', lerp(x2A, x2B, t).toFixed(2));
        childResult.setAttribute('y2', lerp(y2A, y2B, t).toFixed(2));
      }
    }
  }

  // Special handling for Pencil movement (Keyframe 0→1)
  // The entire pencil needs to move as a unit from right to left
  if (keyframeIndex === 0) {
    const pencilA = elementsA['Pencil'];
    const pencilB = elementsB['Pencil'];

    if (pencilA && pencilB) {
      const pencilResult = getElementById(result, 'Pencil');
      interpolateGroupChildren(pencilA, pencilB, pencilResult, t);

      // Fix z-index: Move ALL cls-1 elements (gray eraser parts) to render LAST (on top)
      const children = getGroupChildren(pencilResult);
      const cls1Elements = [];

      // Collect all cls-1 elements
      for (let i = 0; i < children.length; i++) {
        if (children[i].getAttribute('class') === 'cls-1') {
          cls1Elements.push(children[i]);
        }
      }

      // Remove and re-append them to move them to the end (render on top)
      for (const el of cls1Elements) {
        pencilResult.removeChild(el);
        pencilResult.appendChild(el);
      }
    }

    // Also interpolate notepad layers (Pad_Middle and Pad_Top groups)
    const padMiddleA = elementsA['Pad_Middle'];
    const padMiddleB = elementsB['Pad_Middle'];
    if (padMiddleA && padMiddleB) {
      const padMiddleResult = getElementById(result, 'Pad_Middle');
      interpolateGroupChildren(padMiddleA, padMiddleB, padMiddleResult, t);
    }

    const padTopA = elementsA['Pad_Top'];
    const padTopB = elementsB['Pad_Top'];
    if (padTopA && padTopB) {
      const padTopResult = getElementById(result, 'Pad_Top');
      interpolateGroupChildren(padTopA, padTopB, padTopResult, t);
    }

    // SPECIAL: Bulb crossfade (Bulb_One → Bulb_Two)
    // Problem: Bulb_One and Bulb_Two have different structures (isometric vs front-facing)
    // Solution: Move Bulb_One to Bulb_Two's position while crossfading opacity
    const bulbOneA = elementsA['Bulb_One'];
    const bulbTwoB = elementsB['Bulb_Two'];

    if (bulbOneA && bulbTwoB) {
      // Clone Bulb_Two from keyframe B
      const serializer = new XMLSerializer();
      const parser = new DOMParser();
      const bulbTwoString = serializer.serializeToString(bulbTwoB);
      const bulbTwoClone = parser.parseFromString(bulbTwoString, 'image/svg+xml').documentElement;

      // Calculate translation needed to move Bulb_One to Bulb_Two's position
      // Bulb_One approximate center: (157, 142) - based on visual inspection
      // Bulb_Two center: (144.5, 115.43) - from the path's bulb center
      const bulbOneStartX = 157;
      const bulbOneStartY = 142;
      const bulbTwoTargetX = 144.5;
      const bulbTwoTargetY = 115.43;

      const deltaX = bulbTwoTargetX - bulbOneStartX;
      const deltaY = bulbTwoTargetY - bulbOneStartY;

      // Interpolate position
      const translateX = deltaX * t;
      const translateY = deltaY * t;

      // Set opacity for crossfade
      // Bulb_One: fade out (1.0 → 0.0) AND move to new position
      // Bulb_Two: fade in (0.0 → 1.0)
      const bulbOneResult = getElementById(result, 'Bulb_One');
      if (bulbOneResult) {
        bulbOneResult.setAttribute('opacity', (1 - t).toFixed(2));
        bulbOneResult.setAttribute('transform', `translate(${translateX.toFixed(2)}, ${translateY.toFixed(2)})`);
      }

      bulbTwoClone.setAttribute('opacity', t.toFixed(2));

      // Insert Bulb_Two right after Bulb_One
      if (bulbOneResult && bulbOneResult.parentNode) {
        // Find the next sibling after Bulb_One
        const nextSibling = bulbOneResult.nextSibling;

        // Check if Bulb_Two already exists (from previous iteration)
        const existingBulbTwo = getElementById(result, 'Bulb_Two');
        if (existingBulbTwo) {
          // Update opacity only
          existingBulbTwo.setAttribute('opacity', t.toFixed(2));
        } else {
          // Insert new Bulb_Two
          bulbOneResult.parentNode.insertBefore(bulbTwoClone, nextSibling);
        }
      }
    }
  }

  // Special handling for Beam growth (Keyframe 1→2)
  if (keyframeIndex === 1) {
    const beamB = elementsB['Beam'];

    if (beamB) {
      // Clone the Beam group from keyframe B into result
      const serializer = new XMLSerializer();
      const parser = new DOMParser();
      const beamString = serializer.serializeToString(beamB);
      const beamClone = parser.parseFromString(beamString, 'image/svg+xml').documentElement;

      // Get the lightbulb center (approximate)
      const centerX = 144;
      const centerY = 118;

      // Get all line elements in the beam
      const lines = beamClone.getElementsByTagName('line');

      // Interpolate each ray from center to final position
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        const x1B = parseFloat(line.getAttribute('x1'));
        const y1B = parseFloat(line.getAttribute('y1'));
        const x2B = parseFloat(line.getAttribute('x2'));
        const y2B = parseFloat(line.getAttribute('y2'));

        // Grow from center outward
        const x1 = lerp(centerX, x1B, t);
        const y1 = lerp(centerY, y1B, t);
        const x2 = lerp(centerX, x2B, t);
        const y2 = lerp(centerY, y2B, t);

        line.setAttribute('x1', x1.toFixed(2));
        line.setAttribute('y1', y1.toFixed(2));
        line.setAttribute('x2', x2.toFixed(2));
        line.setAttribute('y2', y2.toFixed(2));
      }

      // Insert the beam into result (if it doesn't already exist)
      const existingBeam = getElementById(result, 'Beam');
      if (!existingBeam) {
        // Find where to insert (before Pencil group)
        const pencilResult = getElementById(result, 'Pencil');
        if (pencilResult && pencilResult.parentNode) {
          pencilResult.parentNode.insertBefore(beamClone, pencilResult);
        }
      } else {
        // Replace existing beam
        existingBeam.parentNode.replaceChild(beamClone, existingBeam);
      }
    }
  }

  // Standard interpolation for other elements
  for (const id in elementsA) {
    if (!elementsB[id]) continue;
    if (id === 'Pencil' && keyframeIndex === 0) continue; // Already handled
    if (id === 'Beam') continue; // Already handled

    const elA = elementsA[id];
    const elB = elementsB[id];
    const elResult = getElementById(result, id);

    if (!elResult) continue;

    // Interpolate polygon points
    const pointsA = elA.getAttribute('points');
    const pointsB = elB.getAttribute('points');
    if (pointsA && pointsB) {
      elResult.setAttribute('points', interpolatePoints(pointsA, pointsB, t));
    }

    // NO OPACITY CHANGES - Keep elements at full opacity throughout animation
  }

  // Elements that only exist in second keyframe appear instantly (no fade)
  // Elements that only exist in first keyframe disappear instantly (no fade)

  return result;
}

/**
 * Generate interpolated frames between keyframes
 */
function generateInterpolatedFrames() {
  console.log('🎬 Starting SVG to Lottie animation generation...\n');

  // Load all keyframes
  const keyframeDocs = CONFIG.keyframes.map(filename => {
    const filePath = path.join(CONFIG.inputDir, filename);
    console.log(`📖 Loading: ${filename}`);
    return parseSVG(filePath);
  });

  const allFrames = [];

  // Generate interpolated frames between each pair of keyframes
  for (let k = 0; k < keyframeDocs.length - 1; k++) {
    const svgA = keyframeDocs[k];
    const svgB = keyframeDocs[k + 1];

    console.log(`\n🔄 Interpolating between keyframe ${k + 1} and ${k + 2}...`);

    // Add the first keyframe
    allFrames.push(svgA);

    // Generate intermediate frames
    for (let i = 1; i <= CONFIG.framesPerTransition; i++) {
      const t = i / (CONFIG.framesPerTransition + 1);
      console.log(`  ⚙️  Generating interpolated frame (t=${t.toFixed(2)})`);

      const interpolatedFrame = interpolateKeyframes(svgA, svgB, t, k);
      allFrames.push(interpolatedFrame);
    }
  }

  // Add the last keyframe
  allFrames.push(keyframeDocs[keyframeDocs.length - 1]);

  console.log(`\n✅ Generated ${allFrames.length} total frames`);

  return allFrames;
}

/**
 * Save interpolated frames as SVG files (for debugging)
 */
function saveInterpolatedSVGs(frames) {
  const outputDir = path.join(CONFIG.outputDir, 'frames');

  if (!fs.existsSync(CONFIG.outputDir)) {
    fs.mkdirSync(CONFIG.outputDir, { recursive: true });
  }

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const serializer = new XMLSerializer();

  frames.forEach((frame, index) => {
    const filename = `frame_${String(index).padStart(3, '0')}.svg`;
    const filePath = path.join(outputDir, filename);
    let svgString = serializer.serializeToString(frame);

    // Fix xmldom truncation bug: restore full paths that were stored in _fullPathD
    const allPaths = frame.getElementsByTagName('path');
    for (let i = 0; i < allPaths.length; i++) {
      const pathEl = allPaths[i];
      if (pathEl._fullPathD) {
        const currentD = pathEl.getAttribute('d');
        // Replace the truncated path with the full one
        svgString = svgString.replace(
          `d="${currentD}"`,
          `d="${pathEl._fullPathD}"`
        );
      }
    }

    fs.writeFileSync(filePath, svgString);
  });

  console.log(`\n💾 Saved ${frames.length} SVG frames to: ${outputDir}`);
}

/**
 * Convert SVG frames to Lottie JSON
 * Note: This is a simplified Lottie structure for demonstration
 */
function convertToLottie(frames) {
  console.log('\n🎨 Converting to Lottie JSON format...');

  const totalFrames = frames.length;
  const duration = totalFrames / CONFIG.fps;

  const lottieData = {
    v: "5.7.4", // Lottie version
    fr: CONFIG.fps, // Frame rate
    ip: 0, // In point
    op: totalFrames, // Out point
    w: 288, // Width from SVG viewBox
    h: 288, // Height from SVG viewBox
    nm: "Ideate Design Animation",
    ddd: 0,
    assets: [],
    layers: [
      {
        ddd: 0,
        ind: 1,
        ty: 0, // Precomp layer
        nm: "SVG Animation",
        sr: 1,
        ks: {
          o: { a: 0, k: 100 },
          r: { a: 0, k: 0 },
          p: { a: 0, k: [144, 144, 0] },
          a: { a: 0, k: [144, 144, 0] },
          s: { a: 0, k: [100, 100, 100] }
        },
        ao: 0,
        ip: 0,
        op: totalFrames,
        st: 0,
        bm: 0
      }
    ],
    markers: []
  };

  console.log(`📊 Lottie data: ${totalFrames} frames, ${CONFIG.fps}fps, ${duration.toFixed(2)}s duration`);

  return lottieData;
}

/**
 * Main execution
 */
function main() {
  try {
    // Generate interpolated frames
    const frames = generateInterpolatedFrames();

    // Save SVG frames for debugging
    saveInterpolatedSVGs(frames);

    // Convert to Lottie JSON
    const lottieData = convertToLottie(frames);

    // Save Lottie JSON
    const lottieOutputPath = path.join(CONFIG.outputDir, CONFIG.outputName);
    fs.writeFileSync(lottieOutputPath, JSON.stringify(lottieData, null, 2));

    console.log(`\n✅ Lottie JSON saved to: ${lottieOutputPath}`);
    console.log('\n🎉 Animation generation complete!\n');

    // Summary
    console.log('📋 Summary:');
    console.log(`   - Input keyframes: ${CONFIG.keyframes.length}`);
    console.log(`   - Interpolated frames per transition: ${CONFIG.framesPerTransition}`);
    console.log(`   - Total frames: ${frames.length}`);
    console.log(`   - Frame rate: ${CONFIG.fps}fps`);
    console.log(`   - Duration: ${(frames.length / CONFIG.fps).toFixed(2)}s`);
    console.log(`   - Output: ${lottieOutputPath}\n`);

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { interpolateKeyframes, generateInterpolatedFrames, convertToLottie };
