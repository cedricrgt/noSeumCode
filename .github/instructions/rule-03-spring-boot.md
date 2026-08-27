---
trigger: model_decision
description:  Apply when working in backend Java/Spring Boot code:   controllers, services, repositories, JPA entities, Spring Security,   database configuration, transaction management.
---

# Rule 03 – Spring Boot Enterprise Development Standard

You are an expert in Spring Boot, Java enterprise ecosystems, and high-performance backend architecture. Every component generated or reviewed must strictly adhere to this comprehensive production specification.

## Key Principles

- **Convention over Configuration**: Rely on native Spring Boot autoconfigurations and starters. Avoid explicit XML or custom configuration beans unless required by infrastructural overrides.
- **Standalone, Production-Grade Applications**: Package services with optimized embedded servers (Tomcat/Undertow) tailored for containerized environments (Docker).
- **Opinionated Configuration**: Enforce type-safe properties management and profile-driven execution states.
- **Dependency Injection & Inversion of Control (IoC)**: Architect decoupled layers by leveraging core application contexts.
- **Aspect-Oriented Programming (AOP)**: Encapsulate cross-cutting concerns (logging, security auditing, transaction boundaries) away from core business domains.

## Core Annotations & Layering

### Bootstrap & Initialization

- `@SpringBootApplication`: Applied strictly on the root package bootstrap class alongside `SpringApplication.run(Class, args)`.
- Enables component scanning, auto-configuration, and property source loading automatically.

### Web Layer (Controllers)

- `@RestController`: Enforced at the boundary layer. Combines `@Controller` and `@ResponseBody`.
- Responsibilities: Request routing, content negotiation, HTTP response serialization.
- **Strictly zero business or data logic allowed.** Delegate to @Service layer.
- Example:

  ```java
  @RestController
  @RequestMapping("/api/users")
  @RequiredArgsConstructor
  public class UserController {
    private final UserService userService;

    @GetMapping("/{id}")
    public ResponseEntity<UserDto> getUser(@PathVariable UUID id) {
      return ResponseEntity.ok(userService.findById(id));
    }
  }
  ```

### Business Logic Layer (Services)

- `@Service`: Applied on business logic implementations.
- Responsibilities: Transactional orchestration, domain validations, workflow coordination.
- Use `@Transactional` to declare transaction boundaries.
- Example:

  ```java
  @Service
  @RequiredArgsConstructor
  public class UserService {
    private final UserRepository userRepository;
    private final EmailService emailService;

    @Transactional
    public User createUser(CreateUserRequest request) {
      // Validation
      if (userRepository.existsByEmail(request.getEmail())) {
        throw new UserAlreadyExistsException();
      }
      // Create and persist
      User user = new User(request.getEmail(), request.getName());
      User saved = userRepository.save(user);
      // Side effects
      emailService.sendWelcomeEmail(saved);
      return saved;
    }
  }
  ```

### Data Access Layer (Repositories)

- `@Repository`: Applied on persistence abstractions.
- Extend `JpaRepository<Entity, IdType>` or `PagingAndSortingRepository`.
- Inherit optimized database operations: save, delete, find, paging, sorting.
- Implement custom queries via `@Query` with named parameters.
- Example:

  ```java
  @Repository
  public interface UserRepository extends JpaRepository<User, UUID> {
    @Query("SELECT u FROM User u WHERE u.email = :email AND u.active = true")
    Optional<User> findActiveByEmail(@Param("email") String email);

    List<User> findByRoleOrderByCreatedAtDesc(Role role);
  }
  ```

### Infrastructure Components

- `@Component`: Reserved for infrastructure utilities, custom filters, event listeners.
- Example: Authentication filters, request interceptors, converter beans.

## Data Access & Persistence

### Entity Design

- Entities must map exactly to database schema (via Data Dictionary).
- Use `@Entity` on class, `@Table(name = "users")` to define table name (snake_case).
- Use `@Id` and `@GeneratedValue(strategy = GenerationType.UUID)` for primary keys.
- Mark optional fields with `@Nullable` or use Optional wrapper.
- Define relationships with explicit mapping annotations.

### Relationships

- `@OneToOne`: Single entity references single related entity. Use `@JoinColumn(name = "...")`.
- `@OneToMany`: Single entity contains many related entities. Use `@OneToMany(mappedBy = "...")` on parent.
- `@ManyToMany`: Many entities relate to many others. Use join table via `@JoinTable`.
- Always specify `cascade` and `fetch` strategies consciously:
  - `fetch = FetchType.LAZY` (default): Load related data only when accessed (prevents N+1).
  - `fetch = FetchType.EAGER`: Load immediately (use sparingly, only for small datasets).
  - `cascade = CascadeType.PERSIST`: Persist related entities automatically.

### Transaction Management

- Decorate `@Service` methods with `@Transactional`.
- Set `readOnly = true` for query-only methods to optimize resource allocation.
- Example: `@Transactional(readOnly = true)`
- Propagation: Default `REQUIRED` is sufficient for most cases.
- Rollback on `@Transactional(rollbackFor = Exception.class)` to include checked exceptions.

### Database Migrations

- Every structural modification must be orchestrated via Flyway or Liquibase.
- Migration files in `src/main/resources/db/migration/` with naming: `V001__initial_schema.sql`, `V002__add_user_roles.sql`.
- Each migration is idempotent: can run multiple times safely.
- Direct schema modifications via JPA auto-update (`spring.jpa.hibernate.ddl-auto=update`) are strictly banned in production.

## Configuration & Environment Management

### Property Files

- Use unified `application.yml` structure (YAML over properties format).
- Organize hierarchically:
  ```yaml
  spring:
    datasource:
      url: jdbc:postgresql://localhost:5432/appdb
      username: postgres
      password: ${DB_PASSWORD}
  server:
    port: 8080
  app:
    security:
      jwt-secret: ${JWT_SECRET}
      jwt-expiry-hours: 1
  ```

### Profile Segregation

- Create `application-dev.yml`, `application-test.yml`, `application-prod.yml`.
- Activate via `spring.profiles.active=dev` (environment variable).
- Dev: lenient logging, local database, disabled security.
- Test: in-memory database, fast setup.
- Prod: minimal logging, external database, security enabled.

### Type-Safe Configuration

- Use `@ConfigurationProperties` paired with JSR-380 validation.
- Example:
  ```java
  @ConfigurationProperties(prefix = "app.security")
  @Validated
  public record SecurityProperties(
    @NotBlank String jwtSecret,
    @Positive int jwtExpiryHours,
    @NotEmpty List<String> allowedOrigins
  ) {}
  ```
- Inject via constructor or field injection: `private final SecurityProperties securityProps;`
- Avoid scattered `@Value` annotations; use configuration classes instead.

### Externalized Secrets

- Sensitive values (database passwords, API keys, JWT secret) must be injected via environment variables.
- Never commit credentials to source repositories.
- Use `.env` files locally (not in version control).
- In production, inject via container secrets or external vaults (AWS Secrets Manager, HashiCorp Vault).

## Security Architecture (Spring Security)

### Stateless Authentication

- Implement explicit token-based authentication (JWT or OAuth2/OIDC).
- Customize `SecurityFilterChain` via `@Bean`:
  ```java
  @Bean
  public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    http
      .csrf(csrf -> csrf.disable()) // Stateless, no CSRF needed
      .authorizeHttpRequests(authz -> authz
        .requestMatchers("/api/auth/**").permitAll()
        .requestMatchers("/api/admin/**").hasRole("ADMIN")
        .anyRequest().authenticated()
      )
      .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
      .addFilterBefore(jwtFilter(), UsernamePasswordAuthenticationFilter.class);
    return http.build();
  }
  ```

### Authorization & Method-Level Security

- Enable method-level security: `@EnableMethodSecurity`.
- Use `@PreAuthorize` and `@PostAuthorize` for fine-grained control:
  ```java
  @PreAuthorize("hasRole('ADMIN') or #userId == authentication.principal.id")
  public User updateUser(UUID userId, UpdateUserRequest request) { ... }
  ```

### CORS & CSRF Protection

- Explicitly define CORS rules:
  ```java
  @Bean
  public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration config = new CorsConfiguration();
    config.setAllowedOrigins(Arrays.asList("https://example.com"));
    config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE"));
    config.setAllowedHeaders(Arrays.asList("*"));
    config.setMaxAge(3600L);
    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", config);
    return source;
  }
  ```
- Protect non-idempotent endpoints with CSRF tokens (enabled by default for stateful apps).

## Observability & Monitoring

### Actuator & Metrics

- Include `spring-boot-starter-actuator` dependency.
- Expose health and metrics endpoints:
  ```yaml
  management:
    endpoints:
      web:
        exposure:
          include: health,metrics,prometheus
    endpoint:
      health:
        show-details: when-authorized
  ```
- `/actuator/health`: Returns UP/DOWN status. Monitored by orchestrators (Kubernetes).
- `/actuator/metrics`: Exposes JVM, HTTP, database metrics for aggregation (Prometheus, Datadog).

### Structured Logging

- Implement standardized logging via Logback (default) or Log4j2.
- Use SLF4J abstractions with Lombok `@Slf4j`:
  ```java
  @Slf4j
  @Service
  public class UserService {
    public void createUser(CreateUserRequest request) {
      log.info("Creating user with email: {}", request.getEmail());
    }
  }
  ```
- Output JSON format for production (Logback JSON encoder):
  ```json
  {
    "@timestamp": "2024-01-15T10:30:00Z",
    "level": "INFO",
    "logger": "UserService",
    "message": "Creating user",
    "email": "user@example.com"
  }
  ```
- Log levels: TRACE (detailed), DEBUG (development), INFO (events), WARN (recoverable), ERROR (failures).

## Best Practices & Production Constraints

### Dependency Injection

- Always enforce constructor-based dependency injection. Banned: Field injection using `@Autowired`.
- Use Lombok `@RequiredArgsConstructor` to generate boilerplate cleanly:
  ```java
  @Service
  @RequiredArgsConstructor
  public class UserService {
    private final UserRepository userRepository;
    private final EmailService emailService;
    // Constructor auto-generated
  }
  ```

### Exception Handling

- Isolate errors at boundary via centralized `@ControllerAdvice`:

  ```java
  @ControllerAdvice
  public class GlobalExceptionHandler {
    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleNotFound(UserNotFoundException ex) {
      return ResponseEntity.status(404).body(new ErrorResponse("User not found", "NOT_FOUND"));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGeneric(Exception ex) {
      log.error("Unexpected error", ex);
      return ResponseEntity.status(500).body(new ErrorResponse("Internal server error", "INTERNAL_ERROR"));
    }
  }
  ```

- Return structured error responses with correlation IDs for debugging.

### Validation

- Enforce inbound parameter constraints at controller layer using `@Valid`:
  ```java
  @PostMapping
  public ResponseEntity<UserDto> createUser(@Valid @RequestBody CreateUserRequest request) { ... }
  ```
- Use JSR-380 annotations: `@NotNull`, `@NotBlank`, `@Size`, `@Email`, `@Pattern`.
- Define custom validators for domain-specific rules.

### Testing

- Unit tests: Mock dependencies using Mockito. Test business logic in isolation.
- Integration tests: Use `@SpringBootTest` to load application context. Test controller-to-repository flows.
- Example:

  ```java
  @SpringBootTest
  class UserServiceTest {
    @MockBean private UserRepository userRepository;
    @Autowired private UserService userService;

    @Test
    void testCreateUser() {
      when(userRepository.save(any())).thenReturn(new User(...));
      User result = userService.createUser(...);
      assertNotNull(result.getId());
    }
  }
  ```

## Spring Boot Development Checklist

- [ ] Layered architecture: Controller → Service → Repository.
- [ ] Constructor injection with `@RequiredArgsConstructor` (no field injection).
- [ ] Entity relationships map to database schema exactly.
- [ ] Lazy loading on relationships (except small datasets).
- [ ] Transaction boundaries on service methods.
- [ ] Database migrations via Flyway (no JPA auto-update).
- [ ] Type-safe configuration via `@ConfigurationProperties`.
- [ ] Secrets in environment variables, never in code.
- [ ] JWT tokens: 1h expiry, refresh tokens 7d.
- [ ] CORS whitelist defined, CSRF protected.
- [ ] Global exception handler via `@ControllerAdvice`.
- [ ] Input validation with JSR-380 annotations.
- [ ] Structured JSON logging with SLF4J.
- [ ] Actuator endpoints exposed for monitoring.
- [ ] Unit tests for business logic (Mockito).
- [ ] Integration tests for API endpoints.
