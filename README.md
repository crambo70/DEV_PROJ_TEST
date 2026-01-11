# SCENIC - Event Services Website

A modern, responsive website for SCENIC Inc., an event services company specializing in event design, production, fabrication, logistics, and on-site management. Built with mobile-first design principles and modern web standards.

**Current Version:** See [version.json](version.json) for the authoritative version number.

---

## Quick Start

### Prerequisites
- Python 3 (for local development server)
- Modern web browser (Chrome, Firefox, Safari, or Edge)

### Running Locally
1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd DEV_PROJ_TEST
   ```

2. Start the local development server:
   ```bash
   python3 -m http.server 9999
   ```

3. Open your browser and navigate to:
   ```
   http://localhost:9999
   ```

---

## Project Structure

```
├── index.html              # Home page
├── work.html               # Portfolio page with Masonry grid
├── contact.html            # Contact page with form
├── styles/
│   └── style.css           # Single stylesheet with CSS custom properties
├── scripts/
│   ├── main.js             # Core functionality, navigation, animations
│   ├── masonry-init.js     # Portfolio grid initialization
│   └── version-loader.js   # Centralized version display
├── images/                 # SVG patterns, logos, placeholder images
├── tests/
│   └── e2e/                # Playwright end-to-end test suite
├── version.json            # Single source of truth for version number
└── *.md                    # Documentation files (see below)
```

---

## Technologies

- **HTML5** - Semantic markup with ARIA accessibility attributes
- **CSS3** - Modern layout techniques (Grid, Flexbox) with CSS Custom Properties for design tokens
- **JavaScript (ES6+)** - Vanilla JavaScript with modular architecture
- **Masonry.js** - Portfolio grid layout (loaded via CDN)
- **imagesLoaded** - Image loading detection for Masonry (loaded via CDN)
- **Playwright** - End-to-end testing framework

---

## Development Workflow

Before making code changes, please review the following documentation to understand the project's version control and development processes:

- **[VERSION_CONTROL.md](VERSION_CONTROL.md)** - Explains the semantic versioning workflow, when to increment versions, and how to update version numbers across the project.
- **[IMPLEMENTATION_PLAN.md](IMPLEMENTATION_PLAN.md)** - Contains the project roadmap, task tracking, progress metrics, and changelog with version history.

These documents ensure consistency across the codebase and help maintain accurate documentation.

---

## Documentation

| File | Purpose |
|------|---------|
| [VERSION_CONTROL.md](VERSION_CONTROL.md) | Semantic versioning workflow and guidelines |
| [IMPLEMENTATION_PLAN.md](IMPLEMENTATION_PLAN.md) | Project roadmap, progress tracker, and changelog |
| [CHANGELOG.md](CHANGELOG.md) | Release history following Keep a Changelog format |
| [StyleGuide.md](StyleGuide.md) | Design system, colors, typography, and CSS architecture |

---

## Testing

The project uses Playwright for end-to-end testing across multiple viewports and browsers.

### Running Tests
```bash
npm test
```

Tests verify:
- Page load and navigation functionality
- Responsive layout at Desktop (1920px), Tablet (768px), and Mobile (375px) breakpoints
- Interactive elements (buttons, forms, menus)
- CSS animations and transitions

---

## Contributing

We welcome contributions! To contribute:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Follow the version control workflow outlined in [VERSION_CONTROL.md](VERSION_CONTROL.md)
4. Submit a pull request with a clear description of your changes

---

## License

This project is open source and available under the [MIT License](LICENSE).
