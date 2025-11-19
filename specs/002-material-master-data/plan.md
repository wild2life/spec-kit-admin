# Implementation Plan: Material Master Data Page

**Branch**: `002-material-master-data` | **Date**: 2025-11-20 | **Spec**: [spec.md](./spec.md) | **Last Updated**: 2025-11-20
**Input**: Feature specification from `/specs/002-material-master-data/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Build a Material Master Data management page for viewing, searching, importing, exporting, and deleting material master data records. The implementation uses Vue 3 Composition API with Ant Design Vue components and `useVbenVxeGrid` for table functionality, following the existing monorepo structure with business logic in `apps/web-antd` and mock services in `apps/backend-mock`. The page includes UI optimizations: checkbox column as first column (no sequence column), search form width 100%, and search panel collapsed by default.

## Technical Context

**Language/Version**: TypeScript 5.x, Vue 3.5+, JavaScript (ES2020+)  
**Primary Dependencies**: 
- Frontend: Vue 3, Ant Design Vue, Vite, Vue Router, Pinia
- Table: VXE Table (via `useVbenVxeGrid` composable)
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
- Must use `useVbenVxeGrid` for table functionality (reference: `playground/src/views/examples/vxe-table/form.vue`)
- Must maintain consistency with existing codebase structure
- All user-facing text must support i18n (Chinese/English)
- Mock service response format: `{ code: 0, data: {}, message: '' }`
- List API response format: Use unified format from `apps/backend-mock/api/table/list.ts` (via `usePageResponseSuccess`)

**Scale/Scope**: 
- Single feature module: Material Master Data management
- One main page with search form and data table
- Four primary operations: Import, Export, Delete, Report
- Menu structure: "生产质量/生产质量数据/物料主数据"
- Router path: `manufacture/baseData/supplier_pro_material_data`
- 8 search form fields
- 26 table display columns

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
  - ✅ Uses `useVbenVxeGrid` for consistent table behavior
  - ✅ Responsive design via Ant Design Vue's built-in responsive components
  - ✅ Error messages and loading states consistent with existing patterns
  - ✅ UI optimizations (checkbox first, no sequence, 100% width, collapsed search) match BOM table pattern

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
  - ✅ Component structure follows existing patterns in codebase (using `useVbenVxeGrid`)
  - ✅ TypeScript types defined for all data models and API contracts
  - ✅ No circular dependencies introduced
  - ✅ All file paths follow monorepo conventions
  - ✅ Uses unified response format via `usePageResponseSuccess`

- **Testing Standards**: 
  - ✅ Test strategy defined: unit tests for utilities, E2E tests for user journeys
  - ✅ Test file locations identified in project structure
  - ✅ Mock data generation strategy defined for testing

- **UX Consistency**: 
  - ✅ All components use Ant Design Vue (consistent with existing design system)
  - ✅ i18n strategy defined for all user-facing text
  - ✅ Component patterns match existing table/form/dialog patterns
  - ✅ Uses `useVbenVxeGrid` for table functionality (consistent with BOM implementation)
  - ✅ UI optimizations implemented consistently (checkbox first, no sequence, 100% width, collapsed search)

- **Performance**: 
  - ✅ Pagination strategy defined to limit rendered rows
  - ✅ Debounced search to reduce API calls (via `useVbenVxeGrid`)
  - ✅ Lazy loading for route component
  - ✅ Export strategy handles large datasets
  - ✅ Fixed columns optimize horizontal scrolling

**Status**: ✅ All checks passed - Design is compliant with constitution

## Project Structure

### Documentation (this feature)

```text
specs/002-material-master-data/
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
│   └── manufacture.ts                    # Route definition for Material Master Data (already exists, add route)
├── views/manufacture/
│   └── baseData/
│       └── supplier-pro-material-data/
│           ├── index.vue                 # Main Material Master Data page component
│           └── components/
│               ├── ImportDialog.vue      # Import dialog component
│               └── ExportDialog.vue      # Custom export dialog component
├── api/manufacture/
│   └── material.ts                       # API functions for Material Master Data operations
├── locales/langs/
│   ├── zh-CN/
│   │   └── manufacture.json              # Chinese translations (already exists, add material section)
│   └── en-US/
│       └── manufacture.json              # English translations (already exists, add material section)
└── __tests__/
    └── manufacture/
        └── material.test.ts              # Unit tests for Material utilities

apps/backend-mock/
├── api/manufacture/
│   └── material/
│       ├── list.get.ts                   # GET /api/manufacture/material/list
│       ├── import.post.ts                # POST /api/manufacture/material/import
│       ├── export.post.ts                # POST /api/manufacture/material/export
│       ├── delete.post.ts                # POST /api/manufacture/material/delete
│       ├── report.post.ts                # POST /api/manufacture/material/report
│       └── template.get.ts               # GET /api/manufacture/material/template
└── utils/
    └── mock-material-data.ts             # Mock Material Master Data generator
```

**Structure Decision**: 
- Frontend code in `apps/web-antd/src/` following existing patterns:
  - Routes in `router/routes/modules/manufacture.ts` (add new route)
  - Views in `views/manufacture/baseData/supplier-pro-material-data/` matching route path
  - API functions in `api/manufacture/material.ts`
  - i18n translations in `locales/langs/*/manufacture.json` (add material section)
  - Tests in `__tests__/` directories
- Backend mock services in `apps/backend-mock/api/manufacture/material/` following existing patterns:
  - API endpoints as file-based routes (Nitro/H3 convention)
  - Mock data generators in `utils/`
  - Use unified response format via `usePageResponseSuccess` utility

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

无需填写 - 所有 Constitution 检查已通过。

