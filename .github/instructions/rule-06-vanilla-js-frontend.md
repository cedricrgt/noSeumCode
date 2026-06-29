---
trigger: glob
description: Apply when building frontend with vanilla HTML/CSS/JavaScript:   DOM manipulation, event handling, modules, HTTP communication,   state management, form handling.
globs: {frontend/**/*.js,backend/**/*{Dto,DTO}.java}
---

# Rule 06 – Vanilla JS Frontend Architecture

You are an expert in vanilla JavaScript frontend development, DOM manipulation, and modern web APIs. Build interactive, performant, accessible interfaces without frameworks.

## Key Principles

- **No Framework Dependencies**: Pure vanilla JS, HTML, CSS. No build tools required (unless desired).
- **Progressive Enhancement**: Core functionality works without JavaScript. Enhanced interactivity layers on top.
- **Performance First**: Minimal DOM operations, efficient event delegation, lazy loading assets.
- **Maintainability**: Modular structure, clear separation of concerns, reusable components.
- **Standards Compliance**: Use Web APIs (Fetch, Storage, History, Custom Elements when appropriate).
  Environment-Aware Routing: In development mode, the API address must be read from a global or relative configuration (e.g., /api/...).

DTO Structural Alignment: Any structural or field change to a Java DTO (Rule 03) must be immediately reflected and validated in the corresponding JavaScript object.

## DOM Manipulation & Event Handling

### Safe DOM Updates

- Use `textContent` for user-generated content (XSS prevention).
- Use `innerHTML` only for trusted, static HTML.
- Example:

  ```javascript
  // Safe
  element.textContent = userInput;

  // Unsafe
  element.innerHTML = userInput; // Vulnerable to XSS
  ```

### Event Delegation

- Attach listeners to parent elements instead of individual elements (reduces memory footprint, handles dynamic elements).
- Example:
  ```javascript
  document.addEventListener("click", (event) => {
    if (event.target.closest(".delete-btn")) {
      handleDelete(event.target.dataset.id);
    }
  });
  ```

### Custom Data Attributes

- Use `data-*` attributes to store element-specific data.
- Access via `element.dataset.propertyName`.
- Example:
  ```html
  <button class="delete-btn" data-id="123">Delete</button>
  ```
  ```javascript
  const id = event.target.dataset.id;
  ```

## Module Organization

### Module Pattern (ES6)

- Export functions and constants for reuse.
- Import only what's needed.
- Example:

  ```javascript
  // utils.js
  export function formatDate(date) {
    return date.toLocaleDateString();
  }

  export const API_BASE = "https://api.example.com";

  // main.js
  import { formatDate, API_BASE } from "./utils.js";
  console.log(formatDate(new Date()));
  ```

### Directory Structure

```
src/
├── js/
│   ├── utils/
│   │   ├── dom.js (DOM helpers)
│   │   ├── http.js (Fetch wrapper)
│   │   ├── storage.js (LocalStorage wrapper)
│   │   └── validation.js (Form validation)
│   ├── components/
│   │   ├── navbar.js
│   │   ├── modal.js
│   │   ├── form-handler.js
│   │   └── table-renderer.js
│   ├── constants.js (API endpoints, config)
│   └── main.js (Bootstrap)
├── css/
│   ├── base.css (Reset, typography)
│   ├── layout.css (Grid, flexbox)
│   ├── components.css (Buttons, cards, etc.)
│   └── utilities.css (Spacing, colors)
└── index.html
```

## HTTP Communication

### Fetch API Wrapper

```javascript
// utils/http.js
export class HttpClient {
  constructor(baseURL) {
    this.baseURL = baseURL;
  }

  async get(endpoint) {
    const response = await fetch(`${this.baseURL}${endpoint}`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json();
  }

  async post(endpoint, data) {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json();
  }
}
```

### Usage

```javascript
const api = new HttpClient("https://api.example.com");
try {
  const user = await api.get("/users/123");
  console.log(user);
} catch (error) {
  console.error("Failed to fetch user:", error);
  // Display user-friendly error message
}
```

## State Management

### Simple State Object (non-reactive)

```javascript
// state.js
export const state = {
  users: [],
  selectedUser: null,
  isLoading: false,
};

export function setState(updates) {
  Object.assign(state, updates);
  // Trigger UI update
  render();
}
```

### Observer Pattern (for reactive updates)

```javascript
// state.js
class State {
  constructor() {
    this.data = {};
    this.listeners = new Set();
  }

  subscribe(fn) {
    this.listeners.add(fn);
  }

  setState(updates) {
    this.data = { ...this.data, ...updates };
    this.listeners.forEach((fn) => fn(this.data));
  }
}

export const appState = new State();
```

## Form Handling & Validation

### Form Submission

```javascript
const form = document.querySelector("#signup-form");
form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const formData = new FormData(form);
  const data = Object.fromEntries(formData);

  try {
    const result = await api.post("/users/signup", data);
    console.log("Success:", result);
  } catch (error) {
    console.error("Signup failed:", error);
  }
});
```

### Input Validation

```javascript
function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validateForm(data) {
  const errors = {};
  if (!data.email) errors.email = "Email required";
  if (!validateEmail(data.email)) errors.email = "Invalid email format";
  if (data.password.length < 8) errors.password = "Min 8 characters";
  return errors;
}
```

## Performance Optimization

### Code Splitting & Lazy Loading

- Use dynamic imports for conditional, heavier modules.
- Example:
  ```javascript
  // Load chart library only when needed
  async function renderChart() {
    const { Chart } = await import("chart.js");
    new Chart(ctx, config);
  }
  ```

### Image Optimization

- Use `loading="lazy"` for off-screen images.
- Use `srcset` for responsive images.
- Example:
  ```html
  <img
    src="image-small.webp"
    srcset="image-small.webp 400w, image-large.webp 1200w"
    sizes="(max-width: 640px) 400px, 1200px"
    loading="lazy"
    alt="Descriptive text"
  />
  ```

### Asset Minimization

- Minify and bundle CSS/JS for production.
- Use HTTP/2 multiplexing to parallelize requests.
- Cache static assets with long expiration headers.

## Vanilla JS Frontend Checklist

- [ ] No framework dependencies (pure JS, HTML, CSS).
- [ ] XSS prevention: `textContent` for user data, sanitization for HTML.
- [ ] Event delegation for dynamic elements.
- [ ] Custom data attributes for element-specific data.
- [ ] ES6 modules with clear import/export structure.
- [ ] Organized directory structure (utils, components, constants).
- [ ] HttpClient wrapper for API communication.
- [ ] Error handling in async functions (try/catch).
- [ ] State management (simple object or observer pattern).
- [ ] Form validation client-side and server-side.
- [ ] Images use `loading="lazy"` for performance.
- [ ] Responsive images with `srcset`.
- [ ] Dynamic imports for heavy modules.
- [ ] CSRF token included in POST/PUT/DELETE requests.
- [ ] Semantic HTML structure.
- [ ] Keyboard navigation support.
- [ ] ARIA attributes for accessibility.
- [ ] No console errors or warnings.
- [ ] Performance optimized (minimal DOM operations, event delegation).
