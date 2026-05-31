# Development Log

## 2026-05-31 Session

### - Converted to dynamic HTML wiki
- Created pages/links.html sidebar with collapsible Guides section
- Converted Environment-Development-Guide.md to HTML with named anchors
- Rewrote src/main.js for dynamic page/TOC loading, anchor scrolling
- Simplified index.html to load sidebar and content dynamically
- Removed marked dependency

### - Converted Entity Architecture Guide to HTML
- Converted Entity-Architecture-Guide.md to HTML following the same
  pattern as Environment-Development-Guide.html
- Removed the Table of Contents section
- Created slugified anchor names for all 25 h2 sections and sub-headings
- Color-coded code blocks: green for good patterns, red for bad patterns
- Commit: 9cc96ed (feat: convert Entity Architecture Guide markdown to HTML)
- Fixed TOC link click handler (was causing page reload)
- Fixed slugify function to handle & and . characters matching HTML anchors
- Commit: (see git log)

### - Added Entity Architecture Guide to sidebar, refactored accordion
- Added entity-architecture-guide entry to guides object in main.js
- Refactored sidebar accordion: each guide toggles its own TOC independently
- Removed auto-collapse behavior on outside click
- Multiple guides can be open simultaneously
- Fixed anchor names in Entity-Architecture-Guide.html (removed number prefixes)
- Commit: (see git log)
