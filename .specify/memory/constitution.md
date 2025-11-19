<!--
Sync Impact Report:
Version: 1.0.0 → 1.1.0 (MINOR bump - Expanded monorepo-specific guidance and tooling details)
Modified Principles: Enhanced all four principles with repository-specific requirements
Added Sections:
  - Monorepo Structure Requirements (new subsection under Code Quality)
  - Pre-commit Hooks and Automation (new subsection under Quality Standards)
  - Multi-Application Consistency (enhanced UX Consistency principle)
Removed Sections: None
Templates requiring updates:
  ✅ plan-template.md - Constitution Check section updated with monorepo-specific checks
  ✅ spec-template.md - No direct references, but principles guide requirements
  ✅ tasks-template.md - No direct references, but principles guide task organization
Follow-up TODOs: None
-->

# Vue Vben Admin Constitution

## Core Principles

### I. Code Quality (NON-NEGOTIABLE)

All code MUST adhere to strict quality standards enforced through automated tooling and code review processes. Code quality is not negotiable and takes precedence over feature delivery speed.

**Requirements:**
- All code MUST pass ESLint, Prettier, and Stylelint checks before merge
- TypeScript strict mode MUST be enabled; all code MUST be fully typed
- Code MUST follow Vue 3 Composition API best practices and project conventions
- All public APIs, components, and utilities MUST have clear JSDoc/TSDoc documentation
- Code complexity MUST be justified; refactoring is required when complexity exceeds maintainability thresholds
- Circular dependencies MUST be detected and resolved via automated checks (`pnpm check:circular`)
- Spell checking (CSpell) MUST pass for all code and documentation (`pnpm check:cspell`)
- Pre-commit hooks (Lefthook) MUST pass before commits are accepted
- All staged files MUST be automatically formatted and linted via pre-commit hooks

**Monorepo Structure Requirements:**
- Code MUST be organized according to monorepo conventions: `apps/` for applications, `packages/` for shared packages, `internal/` for internal tooling
- Shared code MUST be placed in appropriate packages under `packages/` to enable reuse across applications
- Package dependencies MUST use workspace protocol (`workspace:*`) for internal packages
- Package exports and imports MUST follow established patterns and subpath imports where configured
- New packages MUST be justified and follow existing package structure conventions
- Cross-package dependencies MUST be declared explicitly and avoid circular references

**Rationale**: High code quality ensures maintainability, reduces technical debt, enables safe refactoring, and improves developer experience. Automated enforcement prevents quality degradation over time. Monorepo structure enables code reuse, consistent tooling, and efficient development across multiple applications.

### II. Testing Standards (NON-NEGOTIABLE)

Comprehensive testing is mandatory for all features and changes. Tests provide confidence in code correctness and enable safe refactoring.

**Requirements:**
- Unit tests MUST be written for all core utilities, composables, and business logic using Vitest
- Test files MUST follow naming convention: `*.test.ts` or `*.spec.ts`, or be placed in `__tests__` directories
- Unit test coverage MUST be maintained and improved over time; new features MUST include corresponding tests
- E2E tests MUST be written for critical user journeys using Playwright (`pnpm test:e2e`)
- Tests MUST be independent, deterministic, and runnable in CI/CD pipelines
- All tests MUST pass before code can be merged (`pnpm test:unit` and `pnpm test:e2e`)
- Test code quality MUST match production code quality standards
- Tests MUST be runnable via Turbo in the monorepo context
- Test configuration MUST be consistent across packages and applications

**Rationale**: Testing ensures reliability, catches regressions early, documents expected behavior, and enables confident deployment. Test-first development reduces bugs and improves design quality. Consistent testing across the monorepo ensures all applications maintain quality standards.

### III. User Experience Consistency

User interfaces MUST provide consistent, intuitive, and accessible experiences across all applications and components in the monorepo.

**Requirements:**
- All UI components MUST follow established design system patterns and conventions
- Component APIs MUST be consistent across similar functionality
- Internationalization (i18n) MUST be implemented for all user-facing text
- Accessibility standards (WCAG) MUST be considered in component design
- Responsive design MUST be implemented for all interactive components
- Error messages and loading states MUST be consistent and user-friendly
- Theme support MUST be maintained consistently across all applications

**Multi-Application Consistency:**
- All applications in `apps/` (web-antd, web-ele, web-naive, web-tdesign) MUST maintain consistent UX patterns despite using different UI frameworks
- Shared UI components in `packages/@core/ui-kit` MUST provide consistent APIs across framework implementations
- User-facing features MUST work consistently across all supported UI framework variants
- Design tokens and styling conventions MUST be shared via `packages/@core/base` and `packages/styles`
- Component behavior and interaction patterns MUST be identical regardless of underlying UI framework
- Navigation, routing, and layout patterns MUST be consistent across all applications

**Rationale**: Consistent UX reduces cognitive load, improves usability, builds user trust, and ensures the admin template serves as a reliable foundation for projects. Accessibility ensures inclusive design. Multi-application consistency ensures users have a predictable experience regardless of which UI framework variant they choose, and developers can switch between variants without learning new patterns.

### IV. Performance Requirements

Applications MUST meet performance benchmarks to ensure responsive user experiences and efficient resource utilization.

**Requirements:**
- Initial page load time MUST be optimized; bundle size MUST be monitored and minimized
- Runtime performance MUST be measured; components MUST avoid unnecessary re-renders
- Lazy loading MUST be implemented for routes and heavy components
- Build performance MUST be optimized; build times MUST be monitored via Turbo
- Memory leaks MUST be prevented; proper cleanup MUST be implemented in components and composables
- Performance regressions MUST be detected and addressed before merge
- Bundle analysis MUST be performed regularly using `pnpm build:analyze` to identify optimization opportunities
- Vite build optimizations MUST be leveraged (code splitting, tree shaking, minification)
- Turbo build caching MUST be utilized to minimize redundant build work across packages

**Monorepo Performance:**
- Shared packages MUST be built efficiently to avoid blocking dependent applications
- Build dependencies MUST be correctly declared in `turbo.json` to enable parallel builds
- Package exports MUST be optimized to avoid unnecessary bundle inclusion
- Code splitting MUST be implemented at both application and package levels

**Rationale**: Performance directly impacts user satisfaction and productivity. Fast, responsive applications improve user experience and reduce infrastructure costs. Performance is a feature, not an afterthought. Monorepo performance optimizations ensure efficient development workflows and build times.

## Quality Standards

### Pre-commit Hooks and Automation

- Lefthook pre-commit hooks MUST pass before commits are accepted
- Pre-commit hooks MUST automatically format and lint staged files (Vue, TypeScript, JavaScript, styles, Markdown, JSON)
- Commit messages MUST be validated via Commitlint using Conventional Commits specification
- Pre-commit hooks MUST run in parallel where possible to minimize latency
- All automated formatting and linting fixes MUST be applied before commit completion

### Code Review Requirements

- All pull requests MUST be reviewed by at least one maintainer
- Code reviews MUST verify compliance with all constitution principles
- Automated checks (linting, type checking, tests) MUST pass before review approval
- Reviewers MUST check for test coverage, documentation, and performance implications
- Reviewers MUST verify monorepo structure compliance (correct package placement, workspace dependencies)

### Continuous Integration

- All commits MUST pass CI pipeline checks before merge
- CI MUST run: type checking (`pnpm check:type`), linting (`pnpm lint`), circular dependency checks (`pnpm check:circular`), unit tests (`pnpm test:unit`), E2E tests (`pnpm test:e2e`), and build verification (`pnpm build`)
- Failed CI checks MUST be resolved before merging
- CI configuration MUST be kept up-to-date with project dependencies
- CI MUST leverage Turbo for efficient parallel execution of tasks across the monorepo

### Documentation Standards

- README files MUST be maintained for all packages and applications
- API documentation MUST be kept current with code changes
- Breaking changes MUST be documented in CHANGELOG
- User-facing features MUST include usage examples and documentation

## Development Workflow

### Branching and Commits

- Feature branches MUST follow naming convention: `feat/description`, `fix/description`, etc.
- Commit messages MUST follow Conventional Commits specification
- Commits MUST be atomic and focused on a single logical change
- Pull requests MUST include clear descriptions and link to related issues

### Dependency Management

- Dependencies MUST be kept up-to-date; security vulnerabilities MUST be addressed promptly
- New dependencies MUST be justified and reviewed
- Dependency updates MUST be tested before merging
- Lock files (`pnpm-lock.yaml`) MUST be committed to version control
- Internal package dependencies MUST use workspace protocol (`workspace:*`)
- Catalog dependencies (via `catalog:`) MUST be used for version consistency across the monorepo
- Dependency checks (`pnpm check:dep`) MUST pass before merge
- Publint checks (`pnpm publint`) MUST pass for all published packages

### Release Process

- Version numbers MUST follow semantic versioning (MAJOR.MINOR.PATCH)
- Releases MUST include CHANGELOG updates
- Breaking changes MUST increment MAJOR version
- Release candidates MUST be tested in staging environments

## Governance

This constitution supersedes all other development practices and guidelines. All contributors and maintainers MUST comply with these principles.

**Amendment Procedure:**
- Amendments require documentation of rationale and impact assessment
- Major principle changes require maintainer consensus
- Version MUST be incremented according to semantic versioning:
  - MAJOR: Backward incompatible principle removals or redefinitions
  - MINOR: New principles added or existing principles materially expanded
  - PATCH: Clarifications, wording improvements, typo fixes

**Compliance Review:**
- All pull requests MUST verify compliance with constitution principles
- Regular audits SHOULD be conducted to ensure ongoing adherence
- Violations MUST be addressed before code merge
- Complexity or principle violations MUST be explicitly justified in pull request descriptions

**Version**: 1.1.0 | **Ratified**: 2025-11-19 | **Last Amended**: 2025-11-19
