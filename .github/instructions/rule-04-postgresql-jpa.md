---
trigger: model_decision
description: Apply when designing database schemas, writing JPA entities,   or implementing database migrations (Flyway/Liquibase).
---

# Rule 04 – PostgreSQL & Spring Data JPA Governance

You are a data integrity and performance expert. Database schemas, migrations, and JPA mappings must align precisely with design artifacts and adhere to strict operational standards.

## Key Principles

- **Schema Authority**: Never assume database state. Query live schema before generating code.
- **Type Safety**: Exact matching between database types and JPA annotations.
- **Naming Conventions**: Strict `snake_case` for database, `camelCase` for Java entities.
- **Migration Discipline**: Every schema change via versioned migration scripts.
- **Performance Awareness**: Indexes, lazy loading, N+1 prevention.

## Schema Verification

### Live Schema Inspection

- Connect to `Cloud SQL for PostgreSQL` or local Postgres via MCP filesystem server.
- Fetch existing table schemas using `\d table_name` or information_schema queries.
- Before generating JPA entities, verify:
  - Table exists (or will be created by migration).
  - Column names, types, constraints match Data Dictionary.
  - Primary keys, foreign keys, unique constraints are defined.
  - Indexes exist on frequently queried columns (especially foreign keys).

### Type Mapping (Database ↔ JPA)

| PostgreSQL Type            | JPA Annotation                                           | Java Type                              |
| -------------------------- | -------------------------------------------------------- | -------------------------------------- |
| `UUID`                     | `@Column(columnDefinition = "UUID")`                     | `UUID`                                 |
| `TEXT`                     | `@Column(columnDefinition = "TEXT")`                     | `String`                               |
| `VARCHAR(255)`             | `@Column(length = 255)`                                  | `String`                               |
| `BIGINT`                   | `@Column`                                                | `Long`                                 |
| `BOOLEAN`                  | `@Column`                                                | `Boolean`                              |
| `TIMESTAMP WITH TIME ZONE` | `@Column(columnDefinition = "TIMESTAMP WITH TIME ZONE")` | `OffsetDateTime` or `ZonedDateTime`    |
| `DATE`                     | `@Column`                                                | `LocalDate`                            |
| `JSON`                     | `@Column(columnDefinition = "JSONB")`                    | `String` or custom type via `@TypeDef` |

### Naming Conventions

- Database tables: `snake_case` (e.g., `user_accounts`, `user_roles`).
- Database columns: `snake_case` (e.g., `created_at`, `email_address`).
- Java entity classes: `PascalCase` (e.g., `UserAccount`, `UserRole`).
- Java fields: `camelCase` (e.g., `createdAt`, `emailAddress`).
- Mapping via `@Column(name = "...")` to bridge naming styles.

## JPA Entity Definitions

### Basic Entity Structure

```java
@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {
  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  private UUID id;

  @Column(nullable = false, unique = true, length = 255)
  private String email;

  @Column(nullable = false, length = 255)
  private String name;

  @Column(name = "created_at", columnDefinition = "TIMESTAMP WITH TIME ZONE", nullable = false, updatable = false)
  private OffsetDateTime createdAt;

  @Column(name = "updated_at", columnDefinition = "TIMESTAMP WITH TIME ZONE", nullable = false)
  private OffsetDateTime updatedAt;

  @PrePersist
  protected void onCreateAudit() {
    createdAt = OffsetDateTime.now();
    updatedAt = OffsetDateTime.now();
  }

  @PreUpdate
  protected void onUpdateAudit() {
    updatedAt = OffsetDateTime.now();
  }
}
```

### Relationships & Cascading

- `@OneToMany`: Parent owns many children. Use `mappedBy` on parent side.
  ```java
  @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
  private List<UserRole> roles = new ArrayList<>();
  ```
- `@ManyToOne`: Child references single parent. Define foreign key via `@JoinColumn`.
  ```java
  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "user_id", nullable = false)
  private User user;
  ```
- `@ManyToMany`: Join table for M:N relationships.
  ```java
  @ManyToMany
  @JoinTable(
    name = "user_permissions",
    joinColumns = @JoinColumn(name = "user_id"),
    inverseJoinColumns = @JoinColumn(name = "permission_id")
  )
  private Set<Permission> permissions = new HashSet<>();
  ```

### Lazy vs. Eager Loading

- Default: `FetchType.LAZY` (load related data only when accessed).
- Use `EAGER` only for small, always-needed datasets (risks N+1 queries and memory bloat).
- Prevent N+1 via explicit `@Query` with `JOIN FETCH`:
  ```java
  @Query("SELECT u FROM User u JOIN FETCH u.roles WHERE u.id = :userId")
  Optional<User> findByIdWithRoles(@Param("userId") UUID userId);
  ```

## Database Migrations

### Migration Structure

- Flyway migrations in `src/main/resources/db/migration/`.
- Naming: `V<version>__<description>.sql` (e.g., `V001__initial_schema.sql`, `V002__add_user_roles.sql`).
- Versions are sequential and immutable (V001, V002, V003, not random identifiers).

### Migration Best Practices

- Each migration is idempotent: runs safely multiple times without failure.
- Use `IF NOT EXISTS` and `IF EXISTS` to prevent errors on re-runs.
- Example:

  ```sql
  -- V001__initial_schema.sql
  CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

  CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
  ```

- Never modify previous migrations. Create new migration for corrections.
- Direct schema modifications via JPA auto-update (`spring.jpa.hibernate.ddl-auto=update`) are strictly banned in production.

### Configuration

```yaml
spring:
  flyway:
    enabled: true
    locations: classpath:db/migration
    baseline-on-migrate: true # Allow migration on existing database
    out-of-order: false # Enforce sequential migration order
```

## Query Optimization

### N+1 Prevention

- Anti-pattern: Loop queries inside domain logic.
  ```java
  // WRONG: N+1 query problem
  List<User> users = userRepository.findAll();
  for (User user : users) {
    log.info("Roles: {}", user.getRoles()); // Triggers query per user
  }
  ```
- Solution: Fetch all related data in single query.
  ```java
  // CORRECT: Single query with join
  @Query("SELECT u FROM User u JOIN FETCH u.roles")
  List<User> findAllWithRoles();
  ```

### Indexing Strategy

- Index on foreign keys (automatic for relationships, explicit for custom queries).
- Index on frequently queried columns (email, username, status).
- Index on sort columns (created_at, updated_at).
- Avoid over-indexing; each index slows writes.
- Example:
  ```sql
  CREATE INDEX idx_users_email ON users(email);
  CREATE INDEX idx_users_created_at ON users(created_at DESC);
  ```

### Read-Only Queries

- Mark read-only methods with `@Transactional(readOnly = true)` to optimize resource allocation.
- Instructs Hibernate to skip dirty checking and write operations.

## PostgreSQL & JPA Checklist

- [ ] Schema verified against Data Dictionary.
- [ ] Table and column names use `snake_case`.
- [ ] Java entity and field names use `PascalCase` and `camelCase`.
- [ ] Primary keys are UUIDs with `@GeneratedValue(strategy = GenerationType.UUID)`.
- [ ] Data types match exactly: PostgreSQL type → JPA annotation → Java type.
- [ ] All nullable fields marked `nullable = false` or use Optional.
- [ ] Relationships properly defined (@OneToMany, @ManyToOne, @ManyToMany).
- [ ] Fetch strategy set explicitly (default LAZY).
- [ ] N+1 queries prevented with `JOIN FETCH`.
- [ ] Database migrations versioned and idempotent.
- [ ] Indexes on foreign keys and frequently queried columns.
- [ ] Read-only queries marked `@Transactional(readOnly = true)`.
- [ ] No JPA auto-update in production (`spring.jpa.hibernate.ddl-auto=validate`).
- [ ] Audit fields (created_at, updated_at) managed via `@PrePersist` and `@PreUpdate`.
