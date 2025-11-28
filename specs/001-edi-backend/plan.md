# Implementation Plan: EDI Backend Management Project

**Branch**: `001-edi-backend` | **Date**: 2025-11-20 | **Spec**: [spec.md](./spec.md) | **Last Updated**: 2025-11-20
**Input**: Feature specification from `/specs/001-edi-backend/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Build an EDI (Electronic Data Interchange) backend management system for managing BOM (Bill of Materials) master data. The system provides user authentication, data viewing with advanced search capabilities, and bulk operations (import, export, delete, report). The implementation uses Vue 3 Composition API with Ant Design Vue components, following the existing monorepo structure with business logic in `apps/web-antd` and mock services in `apps/backend-mock`.

## Technical Context

**Language/Version**: TypeScript 5.x, Vue 3.5+, JavaScript (ES2020+)  
**Primary Dependencies**: 
- Frontend: Vue 3, Ant Design Vue, Vite, Vue Router, Pinia
- Backend Mock: Nitro (H3), TypeScript
- Shared: @vben packages (utils, types, composables, ui-kit)

**Storage**: In-memory mock data (apps/backend-mock) - no persistent database required for initial implementation  
**Testing**: Vitest (unit tests), Playwright (E2E tests)  
**Target Platform**: Modern web browsers (Chrome 80+, Edge, Firefox, Safari)  
**Project Type**: Web application (monorepo structure)  
**Performance Goals**: 
- Page load time < 2 seconds
- Search operations < 1 second for datasets up to 10,000 records
- Export operations < 5 seconds for datasets up to 5,000 records
- Support 50 concurrent users without performance degradation

**Constraints**: 
- Code changes limited to `apps/` directory only
- Must follow existing Vue 3 Composition API patterns
- Must use Ant Design Vue components
- Must maintain consistency with existing codebase structure
- All user-facing text must support i18n (Chinese/English)

**Scale/Scope**: 
- Single feature module: BOM Master Data management
- One main page with search form and data table
- Four primary operations: Import, Export, Delete, Report
- Menu structure: "生产质量/生产质量数据/BOM主数据"

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Verify compliance with all constitution principles:

- **Code Quality**: 
  - ✅ No new dependencies required beyond existing Ant Design Vue and Vue 3 ecosystem
  - ✅ Code will pass ESLint, Prettier, and Stylelint (enforced via pre-commit hooks)
  - ✅ TypeScript strict mode enabled; all code will be fully typed
  - ✅ Follows Vue 3 Composition API best practices
  - ✅ Code organized in `apps/web-antd` (business logic) and `apps/backend-mock` (mock services)
  - ✅ Circular dependencies will be checked via `pnpm check:circular`
  - ✅ CSpell will validate all code and documentation

- **Testing Standards**: 
  - ✅ Unit tests required for: composables, utilities, business logic (Vitest)
  - ✅ E2E tests required for: user authentication flow, search operations, import/export/delete workflows (Playwright)
  - ✅ Test files will follow naming: `*.test.ts` or `*.spec.ts`
  - ✅ All tests must pass before merge

- **UX Consistency**: 
  - ✅ Uses Ant Design Vue components (consistent with existing design system)
  - ✅ All user-facing text will support i18n (Chinese/English)
  - ✅ Follows existing table, form, and dialog patterns
  - ✅ Responsive design via Ant Design Vue's built-in responsive components
  - ✅ Error messages and loading states consistent with existing patterns

- **Performance**: 
  - ✅ Lazy loading for route component (`() => import(...)`)
  - ✅ Table pagination to limit rendered rows
  - ✅ Debounced search to reduce API calls
  - ✅ Bundle size impact minimal (reusing existing components)
  - ✅ Memory cleanup in composables (onUnmounted hooks)

**Status**: ✅ All checks passed - No violations identified

### Post-Design Constitution Check (After Phase 1)

*Re-evaluated after completing data model, API contracts, and design decisions.*

- **Code Quality**: 
  - ✅ All design decisions align with Vue 3 Composition API best practices
  - ✅ Component structure follows existing patterns in codebase
  - ✅ TypeScript types defined for all data models and API contracts
  - ✅ No circular dependencies introduced
  - ✅ All file paths follow monorepo conventions

- **Testing Standards**: 
  - ✅ Test strategy defined: unit tests for utilities, E2E tests for user journeys
  - ✅ Test file locations identified in project structure
  - ✅ Mock data generation strategy defined for testing

- **UX Consistency**: 
  - ✅ All components use Ant Design Vue (consistent with existing design system)
  - ✅ i18n strategy defined for all user-facing text
  - ✅ Component patterns match existing table/form/dialog patterns
  - ✅ Date picker presets follow Ant Design Vue conventions

- **Performance**: 
  - ✅ Pagination strategy defined to limit rendered rows
  - ✅ Debounced search to reduce API calls
  - ✅ Lazy loading for route component
  - ✅ Export strategy handles large datasets

**Status**: ✅ All checks passed - Design is compliant with constitution

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
apps/web-antd/src/
├── router/routes/modules/
│   └── manufacture.ts                    # Route definition for BOM Master Data
├── views/manufacture/
│   └── baseData/
│       └── sqe-supplier-bom/
│           ├── index.vue                 # Main BOM Master Data page component
│           └── components/
│               ├── SearchForm.vue        # Search form component
│               ├── DataTable.vue         # Data table with fixed columns
│               ├── ImportDialog.vue      # Import dialog component
│               └── ExportDialog.vue      # Custom export dialog component
├── api/manufacture/
│   └── bom.ts                            # API functions for BOM operations
├── locales/langs/
│   ├── zh-CN/
│   │   └── manufacture.json              # Chinese translations
│   └── en-US/
│       └── manufacture.json              # English translations
└── __tests__/
    └── manufacture/
        └── bom.test.ts                   # Unit tests for BOM utilities

apps/backend-mock/
├── api/manufacture/
│   └── bom/
│       ├── list.get.ts                   # GET /api/manufacture/bom/list
│       ├── import.post.ts                # POST /api/manufacture/bom/import
│       ├── export.post.ts                # POST /api/manufacture/bom/export
│       ├── delete.post.ts                # POST /api/manufacture/bom/delete
│       └── report.post.ts                # POST /api/manufacture/bom/report
└── utils/
    └── mock-bom-data.ts                  # Mock BOM data generator
```

**Structure Decision**: 
- Frontend code in `apps/web-antd/src/` following existing patterns:
  - Routes in `router/routes/modules/` (similar to `dashboard.ts`, `demos.ts`)
  - Views in `views/` directory matching route path structure
  - API functions in `api/` directory
  - i18n translations in `locales/langs/`
  - Tests in `__tests__/` directories
- Backend mock services in `apps/backend-mock/api/` following existing patterns:
  - API endpoints as file-based routes (Nitro/H3 convention)
  - Mock data generators in `utils/`

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |
