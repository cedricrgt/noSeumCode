---
trigger: model_decision
description: Apply when implementing authentication, data validation, input sanitization, API security, or handling sensitive data (passwords, tokens, PII)
---

# Rule 01 – OWASP Enterprise Security Standard

You are a security-first engineer. Every implementation must prevent, detect, and mitigate vulnerabilities per OWASP Top 10 and ASVS standards.

## Key Principles

- **Assume Breach Mentality**: Defense in depth. Multiple layers protect against single-point failures.
- **Input Validation**: Never trust user input. Validate structure, size, and content.
- **Output Encoding**: Escape all dynamic data before rendering to prevent injection attacks.
- **Least Privilege**: Actors (users, services, processes) execute with minimum required permissions.
- **Secure by Default**: Deny access unless explicitly granted. Require authentication/authorization.

## Backend Security (Java/Spring Boot)

### SQL Injection Prevention

- Use Spring Data JPA declarative queries exclusively: `@Query` with named parameters.
- Example (safe): `@Query("SELECT u FROM User u WHERE u.email = :email")`
- Example (unsafe): `"SELECT * FROM users WHERE email = '" + email + "'"`
- For raw SQL: Always use `PreparedStatement` with parameterized placeholders.
- Never concatenate or interpolate user input into SQL strings.

### Password Management

- Never store plain-text passwords. Use `BCryptPasswordEncoder` with configurable strength (min. 12 rounds).
- Enforce minimum password policies: 12+ characters, uppercase, lowercase, numbers, symbols.
- Implement account lockout after 5 failed login attempts (15-minute cooldown).
- Never log passwords in any form (debug, error, audit).

### Authentication & JWT Tokens

- Implement stateless token-based auth (JWT or OAuth2/OIDC).
- Access token expiry: 1 hour maximum.
- Refresh token expiry: 7 days maximum.
- Validate token signature and expiry on every protected request.
- Store sensitive claims (roles, permissions) server-side in a session cache, not in JWT.
- Include `jti` (JWT ID) claim and maintain a blacklist for revocation.

### Authorization & Access Control

- Enforce method-level security with `@PreAuthorize("hasRole('ROLE_ADMIN')")`.
- Implement role-based access control (RBAC): Admin, User, Guest.
- Verify resource ownership before granting access (prevent horizontal escalation).
- Example: User A cannot view/modify User B's data.

### API Security

- Implement CORS whitelist: Define explicitly allowed origins. Reject `Origin: *`.
- Protect non-idempotent endpoints (POST, PUT, DELETE) with CSRF tokens.
- Enforce HTTPS-only. Redirect HTTP to HTTPS with `Strict-Transport-Security` header.
- Rate-limit endpoints to prevent brute-force and DoS attacks (e.g., 10 requests per minute).

### Input Validation

- Validate ALL inbound parameters at controller boundary using `@Valid` + JSR-380 annotations.
- Example: `@NotNull`, `@Size(min=1, max=255)`, `@Email`, `@Pattern(regexp="...")`.
- Reject oversized payloads (max 10MB for file uploads, max 1MB for JSON).
- Implement whitelist validation for enums, not blacklist.

### Error Handling & Logging

- Never expose internal stack traces to clients. Return generic HTTP 500 with correlation ID.
- Log security events (failed auth, unauthorized access, rate limit) with context: who, what, when, source IP.
- Use structured JSON logging for aggregation. Include: timestamp, severity, actor, action, resource, result.
- Never log sensitive data: passwords, API keys, PII, payment info.

### Secrets Management

- Store all secrets (database passwords, API keys, JWT secret) in environment variables.
- Never commit secrets to version control.
- Rotate secrets regularly (quarterly minimum).
- Use different secrets per environment (dev, test, prod).

## Frontend Security (Vanilla JS / HTML)

### XSS (Cross-Site Scripting) Prevention

- Never use `innerHTML` for user-generated content. Use `textContent` for plain text.
- Example (unsafe): `element.innerHTML = userInput;`
- Example (safe): `element.textContent = userInput;`
- If HTML rendering is required, use a sanitization library (DOMPurify).
- Escape special characters: `<`, `>`, `&`, `"`, `'` → `&lt;`, `&gt;`, `&amp;`, `&quot;`, `&#x27;`.

### CSRF (Cross-Site Request Forgery) Protection

- Include CSRF token in all state-changing requests (POST, PUT, DELETE).
- Verify token on backend before executing action.
- Store token in session, not in cookie (or if in cookie, use SameSite=Strict).

### Content Security Policy (CSP)

- Implement CSP header to whitelist script sources, style sources, image sources.
- Example: `Content-Security-Policy: script-src 'self'; style-src 'self' https://fonts.googleapis.com`
- Prevent inline scripts; move all JS to external files.

### Data Validation (Client-side)

- Validate form inputs before submission (email format, field length, required fields).
- Provide clear, user-friendly error messages.
- Never rely on client-side validation alone; always validate on backend.

## Security Checklist

- [ ] All inputs validated and sanitized at boundary (controller/API).
- [ ] No SQL injection vectors (using parameterized queries, JPA).
- [ ] Passwords hashed with BCrypt (min. 12 rounds).
- [ ] Authentication: JWT tokens with 1h expiry, refresh tokens with 7d expiry.
- [ ] Authorization: Method-level security, resource ownership verification.
- [ ] CORS whitelist defined (no `Origin: *`).
- [ ] CSRF tokens on state-changing endpoints.
- [ ] HTTPS enforced with HSTS header.
- [ ] XSS prevention: `textContent` for user data, sanitization for HTML.
- [ ] Secrets in environment variables, never in code.
- [ ] Error messages generic (no stack traces to clients).
- [ ] Security events logged with context.
- [ ] Rate limiting implemented on sensitive endpoints.
- [ ] No sensitive data in logs (passwords, API keys, PII).
