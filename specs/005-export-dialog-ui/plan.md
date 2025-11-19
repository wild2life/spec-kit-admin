# Implementation Plan: Export Dialog UI Optimization

**Branch**: `005-export-dialog-ui` | **Date**: 2025-01-27 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/005-export-dialog-ui/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Optimize the UI layout of all Export Dialog components in the system to improve usability and code quality. The implementation involves: (1) removing pagination from column selection tables and enabling scrollable display, (2) consolidating export configuration fields (file name, export mode, page size, page number) into a single horizontal row layout, and (3) removing redundant checkbox column definitions when row-selection is already configured. This affects both BOM and Material Master Data Export Dialog components.

## Technical Context

**Language/Version**: TypeScript 5.x, Vue 3.5+, JavaScript (ES2020+)  
**Primary Dependencies**: 
- Frontend: Vue 3, Ant Design Vue, Vite, Vue Router, Pinia
- Table: Ant Design Vue Table component
- Backend Mock: Nitro (H3), TypeScript
- Shared: @vben packages (utils, types, composables, ui-kit)

**Storage**: N/A (UI-only changes, no data persistence)  
**Testing**: Vitest (unit tests), Playwright (E2E tests)  
**Target Platform**: Modern web browsers (Chrome 80+, Edge, Firefox, Safari)  
**Project Type**: Web application (monorepo structure)  
**Performance Goals**: 
- No performance degradation from UI changes
- Smooth scrolling in column selection table
- Responsive layout adaptation on different screen sizes

**Constraints**: 
- Code changes limited to `apps/web-antd/src/views/manufacture/baseData/` directory
- Must maintain existing export functionality
- Must follow existing Vue 3 Composition API patterns
- Must use Ant Design Vue components consistently
- All user-facing text must support i18n (Chinese/English)
- Changes must be applied to both BOM and Material Export Dialog components

**Scale/Scope**: 
- Two Export Dialog components to modify:
  - `apps/web-antd/src/views/manufacture/baseData/sqe-supplier-bom/components/ExportDialog.vue`
  - `apps/web-antd/src/views/manufacture/baseData/supplier-pro-material-data/components/ExportDialog.vue`
- UI-only changes (no API modifications)
- Three main UI optimizations: table pagination removal, form layout consolidation, checkbox column cleanup

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Verify compliance with all constitution principles:

- **Code Quality**: 
  - ✅ No new dependencies required - using existing Ant Design Vue components
  - ✅ Code will pass ESLint, Prettier, and Stylelint (enforced via pre-commit hooks)
  - ✅ TypeScript strict mode enabled; all code will be fully typed
  - ✅ Follows Vue 3 Composition API best practices
  - ✅ Code organized in `apps/web-antd` following existing patterns
  - ✅ No circular dependencies introduced
  - ✅ CSpell will validate all code and documentation

- **Testing Standards**: 
  - ✅ Unit tests recommended for: form layout logic, table configuration validation
  - ✅ E2E tests recommended for: Export Dialog UI interactions, form field layout verification
  - ✅ Test files will follow naming: `*.test.ts` or `*.spec.ts`
  - ✅ All tests must pass before merge

- **UX Consistency**: 
  - ✅ Uses Ant Design Vue components (consistent with existing design system)
  - ✅ All user-facing text already supports i18n (no new translations needed)
  - ✅ Follows existing dialog and form patterns
  - ✅ Responsive design via Ant Design Vue's built-in responsive components
  - ✅ Error messages and loading states consistent with existing patterns
  - ✅ Changes maintain consistency across BOM and Material Export Dialogs

- **Performance**: 
  - ✅ No bundle size impact (UI-only changes, no new dependencies)
  - ✅ Scrollable table performance optimized by Ant Design Vue Table component
  - ✅ Horizontal row layout reduces vertical space usage
  - ✅ No memory leaks introduced (using existing component patterns)

**Status**: ✅ All checks passed - No violations identified

### Post-Design Constitution Check (After Phase 1)

*Re-evaluated after completing research and design decisions.*

- **Code Quality**: 
  - ✅ All design decisions align with Vue 3 Composition API best practices
  - ✅ Component structure follows existing patterns in codebase
  - ✅ TypeScript types defined for all configuration objects
  - ✅ No circular dependencies introduced
  - ✅ All file paths follow monorepo conventions

- **Testing Standards**: 
  - ✅ Test strategy defined: unit tests for configuration validation, E2E tests for UI interactions
  - ✅ Test file locations identified in project structure
  - ✅ Mock data strategy defined for testing

- **UX Consistency**: 
  - ✅ All components use Ant Design Vue (consistent with existing design system)
  - ✅ i18n strategy verified (existing translations sufficient)
  - ✅ Component patterns match existing dialog/form patterns
  - ✅ Responsive behavior defined for small screens
  - ✅ UI optimizations implemented consistently across both Export Dialogs

- **Performance**: 
  - ✅ Scrollable table strategy defined (using Ant Design Vue Table scroll prop)
  - ✅ Horizontal row layout strategy defined (using flexbox/grid)
  - ✅ No performance regressions expected
  - ✅ Responsive layout strategy defined

**Status**: ✅ All checks passed - Design is compliant with constitution

## Project Structure

### Documentation (this feature)

```text
specs/005-export-dialog-ui/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
apps/web-antd/src/
├── views/manufacture/
│   └── baseData/
│       ├── sqe-supplier-bom/
│       │   └── components/
│       │       └── ExportDialog.vue    # BOM Export Dialog (modify)
│       └── supplier-pro-material-data/
│           └── components/
│               └── ExportDialog.vue    # Material Export Dialog (modify)
```

**Structure Decision**: 
- Frontend code in `apps/web-antd/src/views/manufacture/baseData/` following existing patterns
- Two Export Dialog components to modify:
  - BOM Export Dialog: `sqe-supplier-bom/components/ExportDialog.vue`
  - Material Export Dialog: `supplier-pro-material-data/components/ExportDialog.vue`
- No new files required - only modifications to existing components
- No backend changes required - UI-only optimization

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

无需填写 - 所有 Constitution 检查已通过。
