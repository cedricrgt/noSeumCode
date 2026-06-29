---
trigger: model_decision
description: Apply before implementing entities, APIs, or workflows.   Validate against architecture diagrams in docs/architecture/.
---

# Rule 09 – PlantUML Specification Validation

You are a specification parser and validator. Every implementation must strictly align with visual architecture diagrams expressed in PlantUML syntax.

## Key Principles

- **Specification Authority**: PlantUML diagrams are the source of truth for architectural requirements.
- **Syntax Precision**: Parse raw PlantUML syntax correctly to extract entities, relationships, actors, flows.
- **Consistency Verification**: Ensure generated code mirrors diagram requirements exactly.

## ERD (Entity-Relationship Diagram) Parsing

### Entity Extraction

- Identify all `entity` blocks in `@docs/architecture/erd.puml`.
- Extract entity name, attributes, and types.
- Example PlantUML:
  ```plantuml
  entity User {
    id : UUID [PK]
    email : VARCHAR(255) [UNIQUE]
    name : VARCHAR(255)
    created_at : TIMESTAMP WITH TIME ZONE
  }
  ```
- Generated JPA Entity must match attribute names and types exactly.

### Relationship Extraction

- Identify relationship lines and cardinality notation.
- Notation: `<entity1>` -- `<cardinality>` -- `<entity2>`.
- Cardinality examples:
  - `||` = exactly one.
  - `}o` = zero or one.
  - `|{` = one or many.
  - `}|` = zero or many.
- Example:

  ```plantuml
  User ||--o{ Post : writes
  User }o--|| Profile : has
  ```

  - User → Post: One user writes many posts (`@OneToMany`).
  - User → Profile: One user has one profile (`@OneToOne`).

### Implementation Mapping

- Each relationship in diagram maps to JPA annotation:
  - `||--o{` → `@OneToMany` or `@ManyToOne`.
  - `}o--|` → `@OneToOne` or `@ManyToOne`.
  - `}o--o{` → `@ManyToMany`.

## Use Case Diagram Parsing

### Actor & Use Case Extraction

- Identify all `actor` elements and `usecase` blocks.
- Identify associations between actors and use cases.
- Example PlantUML:

  ```plantuml
  actor User
  actor Admin

  usecase CreatePost as "Create Blog Post"
  usecase DeleteUser as "Delete User Account"
  usecase ManageSecurity as "Manage Security Settings"

  User --> CreatePost
  Admin --> DeleteUser
  Admin --> ManageSecurity
  ```

### Flow & Sequence Mapping

- Each use case represents a business flow.
- Verify your API endpoints and service methods handle documented flows.
- Example: `CreatePost` use case should result in POST `/api/posts` endpoint + `PostService.createPost()` method.

### Preconditions & Postconditions

- Check use case notes for conditions.
- Example note:
  ```
  CreatePost : precondition: User must be authenticated
  CreatePost : postcondition: Post is published and visible
  ```
- Implement validation and state transitions accordingly.

## Validation Checklist

### Pre-Code Validation

- [ ] All entities in ERD have corresponding JPA `@Entity` classes.
- [ ] All relationships in ERD have corresponding JPA annotations (`@OneToMany`, `@ManyToOne`, etc.).
- [ ] All use cases in diagram have corresponding API endpoints or service methods.
- [ ] Attribute types in JPA match ERD exactly (UUID → UUID, VARCHAR(255) → String, etc.).
- [ ] No entities in code exist outside ERD definition.
- [ ] No API endpoints in code exist outside use case definition.

### During Development

- If requirements deviate from diagram, request explicit diagram update before implementation.
- Never invent new entities, relationships, or actors not documented in diagrams.

### Post-Implementation Validation

- [ ] All JPA entities map to ERD entities 1:1.
- [ ] All relationships cardinality matches ERD.
- [ ] All API endpoints implement documented use cases.
- [ ] All actor permissions align with documented roles.
- [ ] Error cases and alternative flows are implemented.
- [ ] No undocumented entities, relationships, or endpoints in code.
- [ ] Database schema aligns with ERD attributes.

## PlantUML Syntax Quick Reference

### ERD Entities

```plantuml
entity EntityName {
  id : UUID [PK]
  name : VARCHAR(255)
  created_at : TIMESTAMP
  is_active : BOOLEAN
}
```

### ERD Relationships

```plantuml
Entity1 ||--o{ Entity2 : "one-to-many"
Entity1 }o--|| Entity2 : "many-to-one"
Entity1 ||--|| Entity2 : "one-to-one"
Entity1 }o--o{ Entity2 : "many-to-many"
```

### Use Cases

```plantuml
actor User
actor Admin

usecase (Create Post) as UC1
usecase (Delete User) as UC2

User --> UC1
Admin --> UC2
```

### Notes

```plantuml
note right of UC1 : Precondition: User authenticated
                   Postcondition: Post created
```

## PlantUML Specification Checklist

- [ ] ERD file (`erd.puml`) parsed and all entities identified.
- [ ] All entity attributes and types extracted.
- [ ] All relationships and cardinalities extracted.
- [ ] Use case file (`usecase.puml`) parsed and all actors identified.
- [ ] All use cases extracted.
- [ ] All actor-to-use case associations mapped.
- [ ] Preconditions and postconditions noted.
- [ ] JPA entities generated for all ERD entities.
- [ ] JPA relationships match ERD cardinality.
- [ ] API endpoints created for all use cases.
- [ ] Role-based access control aligns with actor permissions.
- [ ] No invented entities outside ERD.
- [ ] No invented endpoints outside use cases.
- [ ] Database schema matches ERD attributes exactly.
- [ ] All requirements from diagrams implemented.
