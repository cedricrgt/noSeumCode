# Rule 00 – Pre-Task Validation & Engineering Standards

You are a rigorous quality gate. Before implementing any feature, fix, or refactoring, validate architectural alignment and enforce production-grade engineering discipline.

## Key Principles

- **Architecture-First**: Code must map 1:1 with documented design artifacts.
- **Production-Grade Only**: No temporary code, dead branches, or commented-out logic.
- **Zero Assumptions**: Never invent tables, endpoints, or domain rules. Use available context.
- **Explicit Error Handling**: Every failure scenario must be anticipated and handled.

## Pre-Implementation Validation

### Architecture Alignment

- Read `@docs/architecture/dataDictionary.md` to understand entity definitions, attributes, and constraints.
- Parse `@docs/architecture/erd.puml` to verify database relationships and cardinalities.
- Cross-reference `@docs/architecture/usecase.puml` to ensure feature maps to documented actors and flows.
- Reject any task that deviates from these artifacts without explicit user confirmation.

### Code Quality Gate

**Apply Clean Code Principles:**
- Single responsibility: one reason to change per class.
- Small functions: maximum 20 lines per function.
- Meaningful names: descriptive variables, methods, classes.

**Enforce SOLID Principles:**
- **S**ingle Responsibility: One reason to change per class.
- **O**pen/Closed: Extend behavior, don't modify existing code.
- **L**iskov Substitution: Subtypes must substitute parent types safely.
- **I**nterface Segregation: Clients depend on minimal interfaces.
- **D**ependency Inversion: Depend on abstractions, not concretions.

**Apply DRY (Don't Repeat Yourself):**
- Extract common patterns into reusable components.
- Identify and refactor duplicate logic.

**Apply KISS (Keep It Simple, Stupid):**
- Avoid premature complexity.
- Solve the problem at hand, not hypothetical future problems.

**Apply YAGNI (You Aren't Gonna Need It):**
- Build only what's required.
- Don't implement speculative features.

### Artifact Cleanliness

- **No dead code**: Remove unused imports, methods, fields, branches.
- **No temporary comments**: All `TODO`, `FIXME`, `HACK` must be resolved or tracked in issues.
- **No commented-out code**: Delete it; version control has history.
- **Production-grade only**: Every line serves a purpose.

### Context Bounds

- Query available MCP servers (filesystem, version control, IDE context) before making assumptions.
- If context is incomplete, ask the user for clarification rather than inventing requirements.
- Never invent database tables, API endpoints, or business rules not documented in architecture.

## Implementation Checklist

- [ ] Architecture documents (dataDictionary, ERD, use cases) reviewed and understood.
- [ ] Feature scope matches documented requirements exactly.
- [ ] No new entities, endpoints, or workflows invented outside documentation.
- [ ] Code applies SOLID principles and clean code practices.
- [ ] Dead code, temporary comments, unused imports removed.
- [ ] Error handling explicit for all failure scenarios.
- [ ] Dependencies follow dependency inversion (abstractions, not concretions).
- [ ] Code ready for production (no debugging artifacts, temporary flags, or hacks).
