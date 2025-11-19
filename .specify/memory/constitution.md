<!--
Sync Impact Report:
Version: 0.0.0 → 1.0.0 (Initial version - MINOR bump for new constitution)
Modified Principles: None (initial creation)
Added Sections:
  - Core Principles (4 principles: Code Quality, Testing Standards, UX Consistency, Performance)
  - Quality Standards
  - Development Workflow
  - Governance
Removed Sections: None (initial creation)
Templates requiring updates:
  ✅ plan-template.md - Constitution Check section references constitution file
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
- Circular dependencies MUST be detected and resolved via automated checks
- Spell checking (CSpell) MUST pass for all code and documentation

**Rationale**: High code quality ensures maintainability, reduces technical debt, enables safe refactoring, and improves developer experience. Automated enforcement prevents quality degradation over time.

### II. Testing Standards (NON-NEGOTIABLE)

Comprehensive testing is mandatory for all features and changes. Tests provide confidence in code correctness and enable safe refactoring.

**Requirements:**
- Unit tests MUST be written for all core utilities, composables, and business logic using Vitest
- Test files MUST follow naming convention: `*.test.ts` or `*.spec.ts`, or be placed in `__tests__` directories
- Unit test coverage MUST be maintained and improved over time; new features MUST include corresponding tests
- E2E tests MUST be written for critical user journeys using Playwright
- Tests MUST be independent, deterministic, and runnable in CI/CD pipelines
- All tests MUST pass before code can be merged
- Test code quality MUST match production code quality standards

**Rationale**: Testing ensures reliability, catches regressions early, documents expected behavior, and enables confident deployment. Test-first development reduces bugs and improves design quality.

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

**Rationale**: Consistent UX reduces cognitive load, improves usability, builds user trust, and ensures the admin template serves as a reliable foundation for projects. Accessibility ensures inclusive design.

### IV. Performance Requirements

Applications MUST meet performance benchmarks to ensure responsive user experiences and efficient resource utilization.

**Requirements:**
- Initial page load time MUST be optimized; bundle size MUST be monitored and minimized
- Runtime performance MUST be measured; components MUST avoid unnecessary re-renders
- Lazy loading MUST be implemented for routes and heavy components
- Build performance MUST be optimized; build times MUST be monitored
- Memory leaks MUST be prevented; proper cleanup MUST be implemented in components and composables
- Performance regressions MUST be detected and addressed before merge
- Bundle analysis MUST be performed regularly to identify optimization opportunities

**Rationale**: Performance directly impacts user satisfaction and productivity. Fast, responsive applications improve user experience and reduce infrastructure costs. Performance is a feature, not an afterthought.

## Quality Standards

### Code Review Requirements

- All pull requests MUST be reviewed by at least one maintainer
- Code reviews MUST verify compliance with all constitution principles
- Automated checks (linting, type checking, tests) MUST pass before review approval
- Reviewers MUST check for test coverage, documentation, and performance implications

### Continuous Integration

- All commits MUST pass CI pipeline checks before merge
- CI MUST run: type checking, linting, unit tests, E2E tests (where applicable), and build verification
- Failed CI checks MUST be resolved before merging
- CI configuration MUST be kept up-to-date with project dependencies

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
- Lock files MUST be committed to version control

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

**Version**: 1.0.0 | **Ratified**: 2025-11-19 | **Last Amended**: 2025-11-19
