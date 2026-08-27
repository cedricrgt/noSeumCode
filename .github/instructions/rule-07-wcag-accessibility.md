---
trigger: model_decision
description: Apply when building HTML/UI components to ensure accessibility:   semantic HTML, forms, ARIA attributes, keyboard navigation, color contrast.
---

# Rule 07 – WCAG 2.2 AA Accessibility

You are an accessibility expert. All user interface elements must conform to WCAG 2.2 AA standards, ensuring usability for people with disabilities.

## Key Principles

- **Perceivable**: Users can see, hear, or perceive content (no invisible-to-all content).
- **Operable**: All functionality available via keyboard and assistive devices.
- **Understandable**: Content and interactions are clear and predictable.
- **Robust**: Compatible with assistive technologies and browsers.

## Semantic HTML Structure

### Proper Heading Hierarchy

- Single `<h1>` per page (page title/main heading).
- Subsequent headings follow sequence: `<h2>`, `<h3>`, `<h4>` (no skipping levels).
- Example:
  ```html
  <h1>User Dashboard</h1>
  <h2>Profile Settings</h2>
  <h3>Personal Information</h3>
  <h2>Notification Preferences</h2>
  ```

### Semantic HTML5 Elements

- Use `<header>`, `<nav>`, `<main>`, `<article>`, `<section>`, `<aside>`, `<footer>` for page structure.
- Use `<button>` for actions, `<a>` for navigation (not vice versa).
- Use `<form>`, `<input>`, `<select>`, `<textarea>` for data collection.
- Use `<table>` only for tabular data (with `<thead>`, `<tbody>`, `<th>`).
- Use `<figure>` and `<figcaption>` for images with context.
- Example:
  ```html
  <main>
    <article>
      <h1>Article Title</h1>
      <p>Content...</p>
    </article>
  </main>
  <aside>
    <h2>Related Links</h2>
    <ul>
      ...
    </ul>
  </aside>
  ```

## Forms & Input Labels

### Label Association

- Every interactive form element must have an associated `<label>`.
- Use `<label for="input-id">` paired with `<input id="input-id">`.
- Example:
  ```html
  <label for="email">Email Address:</label>
  <input type="email" id="email" name="email" required />
  ```

### Input Types & Validation

- Use semantic input types: `email`, `tel`, `date`, `number`, `password`.
- Provide clear error messages inline.
- Example:
  ```html
  <input
    type="email"
    id="email"
    aria-invalid="true"
    aria-describedby="email-error"
  />
  <span id="email-error" role="alert">Invalid email format</span>
  ```

### Fieldsets & Legends

- Group related inputs with `<fieldset>` and `<legend>`.
- Example:
  ```html
  <fieldset>
    <legend>Contact Method</legend>
    <label><input type="radio" name="contact" /> Email</label>
    <label><input type="radio" name="contact" /> Phone</label>
  </fieldset>
  ```

## ARIA (Accessible Rich Internet Applications)

### ARIA Landmarks

- Use `role` to define regions: `banner`, `navigation`, `main`, `complementary`, `contentinfo`.
- Example:
  ```html
  <div role="navigation">
    <a href="/">Home</a>
    <a href="/about">About</a>
  </div>
  ```

### ARIA Attributes

- `aria-label`: Provide label for elements without visible text.
  ```html
  <button aria-label="Close dialog">×</button>
  ```
- `aria-describedby`: Link element to description.
  ```html
  <input aria-describedby="password-hint" />
  <span id="password-hint">Min 8 characters, uppercase required</span>
  ```
- `aria-live`: Announce dynamic content changes.
  ```html
  <div aria-live="polite" aria-atomic="true">
    <!-- Screen reader announces updates -->
  </div>
  ```
- `aria-expanded`: Indicate collapsible state.
  ```html
  <button aria-expanded="false" aria-controls="menu">Menu</button>
  <menu id="menu" hidden>...</menu>
  ```

### ARIA Don'ts

- Don't override native semantics: `<button role="link">` is wrong. Use `<a>` instead.
- Don't use ARIA for visual-only styling. Use CSS.
- Use ARIA only when native HTML can't express intent.

## Keyboard Navigation

### Keyboard Accessibility

- All interactive elements (buttons, links, form fields) must be keyboard operable.
- Tab order follows logical sequence (left-to-right, top-to-bottom).
- Provide visible focus indicators (outline, border, background change).
- Example CSS:
  ```css
  button:focus,
  a:focus,
  input:focus {
    outline: 2px solid #0066cc;
    outline-offset: 2px;
  }
  ```

### Skip Links

- Provide skip-to-main link for keyboard users to bypass repetitive navigation.
- Example:
  ```html
  <a href="#main" class="skip-link">Skip to main content</a>
  <nav>...</nav>
  <main id="main">...</main>
  ```

## Color & Contrast

### Color Contrast Ratios (WCAG AA)

- Normal text: 4.5:1 contrast ratio (black text on white = 21:1, ✓).
- Large text (18pt+): 3:1 contrast ratio.
- Use tools like WebAIM Contrast Checker to verify.
- Example:
  ```css
  body {
    color: #333333; /* Dark gray on white: 12.6:1 ✓ */
    background-color: #ffffff;
  }
  ```

### Color Independence

- Don't rely on color alone to convey information.
- Use color + pattern, icon, or text.
- Example:

  ```html
  <!-- Wrong: Color-only error indicator -->
  <input style="border-color: red;" />

  <!-- Correct: Color + icon + text -->
  <input style="border-color: red;" aria-invalid="true" />
  <span>✗ Email is invalid</span>
  ```

## Alternative Text

### Image Alt Text

- Provide `alt` for all images describing content or function.
- For decorative images, use empty `alt=""` or `role="presentation"`.
- Example:

  ```html
  <!-- Informative -->
  <img
    src="chart.png"
    alt="Q4 revenue by region: North 45%, South 30%, West 25%"
  />

  <!-- Decorative -->
  <img src="divider.svg" alt="" role="presentation" />
  ```

### Videos & Audio

- Provide captions for videos (sync text with audio).
- Provide transcripts for audio content.
- Example:
  ```html
  <video controls>
    <source src="video.mp4" />
    <track kind="captions" src="captions.vtt" />
  </video>
  ```

## Testing & Validation

### Automated Testing

- Use axe DevTools browser extension to scan for accessibility issues.
- Use WebAIM Contrast Checker for color verification.
- Use W3C HTML Validator to ensure semantic correctness.

### Manual Testing

- Navigate using keyboard only (no mouse).
- Test with screen readers (NVDA, JAWS, VoiceOver).
- Verify heading hierarchy is logical.
- Confirm focus indicators are visible.
- Test with browser zoom at 200%.

## WCAG 2.2 AA Accessibility Checklist

- [ ] Single `<h1>` per page with proper hierarchy.
- [ ] Semantic HTML structure (header, nav, main, article, section, aside, footer).
- [ ] All form inputs have associated labels.
- [ ] Form inputs use semantic types (email, tel, date, etc.).
- [ ] Error messages clear and specific.
- [ ] Fieldsets and legends group related inputs.
- [ ] ARIA landmarks used appropriately (role="navigation", etc.).
- [ ] ARIA attributes used only when necessary (aria-label, aria-describedby).
- [ ] No ARIA overriding native HTML semantics.
- [ ] All interactive elements keyboard accessible.
- [ ] Tab order logical (left-to-right, top-to-bottom).
- [ ] Focus indicators visible (outline, border, background).
- [ ] Skip links provided for keyboard users.
- [ ] Color contrast 4.5:1 for normal text (3:1 for large text).
- [ ] Color independence: information not conveyed by color alone.
- [ ] Alt text for all images (descriptive or empty for decorative).
- [ ] Captions for videos, transcripts for audio.
- [ ] Tested with keyboard navigation.
- [ ] Tested with screen reader.
- [ ] Tested at 200% browser zoom.
- [ ] W3C HTML validation passes.
