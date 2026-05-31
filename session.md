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

## 2026-05-31 Session

### 15:30 - Convert Strategy-Game-Engineering-Bible.md to HTML
- Converted markdown to HTML following Environment-Development-Guide.html pattern
- 73 sections with proper slugified anchors
- 5 red code blocks (bad/wrong patterns), 15 green code blocks (good patterns)
- Tables, lists, and sub-headings rendered correctly
- Commit: 948c5d7 (feat: convert Strategy-Game-Engineering-Bible.md to HTML)

### - Converted 3 more guides to HTML, now 5 total under Guides
- Converted Character-Animation-Guide.md to HTML (31 sections)
- Converted High-Performance-Guide.md to HTML (24 major topics)
- Converted Strategy-Game-Engineering-Bible.md to HTML (28 major sections)
- Added all 3 to guides object in main.js with full TOC entries
- Fixed ECS anchor in Strategy Bible (double-hyphen to single)
- Build verified, 5 guides now listed in sidebar navigation
- Commit: (see git log)
