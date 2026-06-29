---
trigger: model_decision
description: Apply before generating entities, endpoints, or workflows. Cross-validate against erd.puml, usecase.puml, dataDictionary.md.
---

# Rule 02 – Architecture Documentation Validation

You are a specification enforcer. Every implementation must align with the documented architecture. Leverage multimodal vision and text parsing to validate design artifacts.

## Key Principles

- **Single Source of Truth**: Architecture artifacts (`dataDictionary.md`, `erd.puml`, `usecase.puml`, `mcd.webp`) define requirements.
- **Visual Parsing**: Use multimodal capabilities to extract entities, relationships, actors from diagrams.
- **Consistency Verification**: Ensure code-level decisions match diagram-level design.

## Pre-Implementation Checklist

### Data Dictionary Alignment

- Open `@docs/architecture/dataDictionary.md`.
- For each entity you'll work with, verify:
  - Attribute names match database column names (camelCase in Java, snake_case in DB).
  - Data types match JPA annotations (e.g., `UUID` → `@Column(columnDefinition = "UUID")`, `TIMESTAMP` → `@Column(columnDefinition = "TIMESTAMP WITH TIME ZONE")`).
  - Mandatory vs. optional fields: `@NotNull` annotations align with schema constraints.
  - Relationships (1:1, 1:N, M:N) are documented with cardinality.

### ERD Validation (PlantUML)

- Parse `@docs/architecture/erd.puml`.
- Extract all entities and relationships.
- Verify your implementation:
  - Uses only defined entities (no invented tables).
  - Relationship mappings match diagram cardinality (@OneToOne, @OneToMany, @ManyToMany).
  - Foreign keys align with relationship definitions.
  - Self-referencing relationships (if any) are intentional and documented.

### Use Case Validation (PlantUML)

- Parse `@docs/architecture/usecase.puml`.
- Identify which use case(s) your implementation addresses.
- Verify:
  - API endpoints align with documented flows.
  - Actor permissions match implementation access controls.
  - Preconditions and postconditions are handled.
  - Alternative flows (error cases) are implemented.

### MCD Visual Parsing (WebP)

- Open `@docs/architecture/mcd.webp` (Merise Conceptual Data Model).
- Extract visual structure:
  - Entities (rectangles), attributes (ovals), relationships (diamonds).
  - Cardinalities and participation rules.
- Cross-validate with ERD and Data Dictionary for consistency.

### Boundary Enforcement

- Domain boundaries must not be violated. Services own their entities.
- If your task requires cross-domain access, implement via service-to-service calls, not direct database queries.
- Reject requests to create new entities or endpoints not documented in architecture.

## Architecture Alignment Verification

- [ ] Data Dictionary reviewed: entities, attributes, types confirmed.
- [ ] ERD parsed: all relationships and cardinalities extracted.
- [ ] Use cases parsed: flows, actors, preconditions identified.
- [ ] MCD visual structure understood and validated.
- [ ] No new entities invented outside documentation.
- [ ] No new API endpoints created outside use cases.
- [ ] No cross-domain boundary violations.
- [ ] Relationship types (1:1, 1:N, M:N) match diagram exactly.
- [ ] All actor permissions align with documented roles.
- [ ] Error cases and alternative flows documented in code.
