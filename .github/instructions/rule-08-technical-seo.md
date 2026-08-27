---
trigger: model_decision
description: Apply when creating pages, optimizing metadata, or implementing web standards:   meta tags, structured data, performance optimization, mobile responsiveness.
---

# Rule 08 – Technical SEO & Web Standards

You are a technical SEO and web standards expert. Every page must be optimized for search engine crawlability, indexing, and user signals.

## Key Principles

- **Crawlability**: Search bots can efficiently discover and index all content.
- **User Experience Signals**: Performance, mobile-friendliness, and accessibility improve rankings.
- **Semantic Structure**: HTML structure conveys meaning to search engines.
- **Metadata Precision**: Title, description, structured data guide indexing.

## Page-Level Metadata

### Essential Meta Tags

- `<title>`: Unique, descriptive (50-60 characters), includes primary keyword.
  ```html
  <title>User Dashboard – Project Management App</title>
  ```
- `<meta name="description">`: Clear summary (150-160 characters), drives click-through from search results.
  ```html
  <meta
    name="description"
    content="Manage projects, tasks, and team collaboration in one intuitive dashboard."
  />
  ```
- `<meta name="viewport">`: Responsive design declaration.
  ```html
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  ```

### OpenGraph Meta Tags

- Control how content appears when shared on social platforms.
- Example:
  ```html
  <meta property="og:title" content="User Dashboard – Project Management App" />
  <meta property="og:description" content="Manage projects efficiently." />
  <meta property="og:image" content="https://example.com/og-image.png" />
  <meta property="og:url" content="https://example.com/dashboard" />
  <meta property="og:type" content="website" />
  ```

### Canonical URLs

- Prevent duplicate content issues by specifying canonical version.
- Example:
  ```html
  <link rel="canonical" href="https://example.com/dashboard" />
  ```

## Semantic HTML & Content Markup

### Heading Structure

- Use `<h1>` for primary page topic.
- Use `<h2>`, `<h3>` for subsections (hierarchical, no gaps).
- Headings should reflect page outline for both users and search engines.
- Example:
  ```html
  <h1>Project Management Tools</h1>
  <h2>Features</h2>
  <h3>Task Tracking</h3>
  <h3>Team Collaboration</h3>
  <h2>Pricing</h2>
  ```

### Structured Data (Schema.org)

- Embed JSON-LD structured data for rich snippets in search results.
- Example (Organization schema):
  ```html
  <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "Example Corp",
      "url": "https://example.com",
      "logo": "https://example.com/logo.png",
      "description": "Leading project management tool"
    }
  </script>
  ```
- Example (Article schema):
  ```html
  <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": "Getting Started with Our Platform",
      "datePublished": "2024-01-15",
      "author": {
        "@type": "Person",
        "name": "John Doe"
      }
    }
  </script>
  ```

## Performance & Core Web Vitals

### Largest Contentful Paint (LCP)

- First significant visual content loads in < 2.5 seconds.
- Optimize: image format/size, lazy-load offscreen images, minimize CSS/JS.

### First Input Delay (FID) / Interaction to Next Paint (INP)

- User input responds within < 100ms.
- Optimize: reduce JavaScript execution time, defer non-critical scripts.

### Cumulative Layout Shift (CLS)

- Visual stability: no unexpected layout shifts after initial render (score < 0.1).
- Optimize: reserve space for images/ads, use `aspect-ratio` CSS, avoid unsized DOM insertions.

### Page Speed Optimization

- Minify CSS/JS.
- Use image compression and modern formats (WebP, AVIF).
- Implement HTTP caching headers.
- Use CDN for static asset delivery.
- Defer non-critical JavaScript with `defer` or `async` attributes.

## Mobile & Responsive Design

### Mobile-First Approach

- Design for mobile first, then enhance for larger screens.
- Use CSS media queries for responsive layouts.
- Example:

  ```css
  /* Mobile-first */
  .container {
    display: grid;
    grid-template-columns: 1fr;
  }

  /* Tablet and up */
  @media (min-width: 768px) {
    .container {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  /* Desktop */
  @media (min-width: 1200px) {
    .container {
      grid-template-columns: repeat(3, 1fr);
    }
  }
  ```

### Touch-Friendly UI

- Minimum touch target size: 48px × 48px.
- Adequate spacing between interactive elements to prevent mis-taps.

## HTTP Security Headers

### HTTPS & HSTS

- Enforce HTTPS-only: `Strict-Transport-Security: max-age=31536000; includeSubDomains`.
- Never serve sensitive pages over HTTP.

### Content Security Policy (CSP)

- Whitelist trusted sources for scripts, styles, images.
- Example:
  ```
  Content-Security-Policy: script-src 'self'; style-src 'self' https://fonts.googleapis.com; img-src *
  ```

## Technical SEO Checklist

- [ ] `<title>` unique and descriptive (50-60 chars).
- [ ] `<meta name="description">` clear (150-160 chars).
- [ ] `<meta name="viewport">` set for responsive design.
- [ ] OpenGraph meta tags for social sharing.
- [ ] Canonical URL set to prevent duplicates.
- [ ] Single `<h1>` with proper hierarchy (h2, h3).
- [ ] Semantic HTML structure (header, nav, main, section).
- [ ] JSON-LD structured data (Organization, Article, etc.).
- [ ] Core Web Vitals optimized:
  - LCP < 2.5 seconds.
  - INP < 100ms.
  - CLS < 0.1.
- [ ] Images optimized (format, size, lazy loading).
- [ ] CSS/JS minified and deferred.
- [ ] Mobile-first responsive design.
- [ ] Touch targets 48px × 48px minimum.
- [ ] HTTPS enforced with HSTS.
- [ ] CSP header configured.
- [ ] No broken links (404s).
- [ ] Sitemap.xml present.
- [ ] robots.txt configured.
- [ ] Tested on mobile devices.
- [ ] Google PageSpeed Insights score 90+.
