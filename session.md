# Development Log

## 2026-05-31 Session

### - Converted to dynamic HTML wiki
- Created pages/links.html sidebar with collapsible Guides section
- Converted Environment-Development-Guide.md to HTML with named anchors
- Rewrote src/main.js for dynamic page/TOC loading, anchor scrolling
- Simplified index.html to load sidebar and content dynamically
- Removed marked dependency
- Fixed TOC link click handler (was causing page reload)
- Fixed slugify function to handle & and . characters matching HTML anchors
- Commit: (see git log)
