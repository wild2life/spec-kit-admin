# Tasks: Export Dialog UI Optimization

**Input**: Design documents from `/specs/005-export-dialog-ui/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Tests are OPTIONAL - not explicitly requested in the feature specification, so test tasks are not included.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Frontend**: `apps/web-antd/src/`
- Paths follow monorepo structure as defined in plan.md

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Verify prerequisites and prepare for implementation

- [x] T001 Review current BOM Export Dialog implementation in apps/web-antd/src/views/manufacture/baseData/sqe-supplier-bom/components/ExportDialog.vue
- [x] T002 [P] Review current Material Export Dialog implementation in apps/web-antd/src/views/manufacture/baseData/supplier-pro-material-data/components/ExportDialog.vue
- [x] T003 [P] Verify Ant Design Vue Table scroll and pagination props documentation
- [x] T004 [P] Verify Ant Design Vue Space component is available and imported

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T005 Document current table pagination configuration in both Export Dialog components
- [x] T006 Document current form field layout structure in both Export Dialog components
- [x] T007 Document current checkbox column definition in columnTableColumns for both components

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Optimize Export Dialog Table Display (Priority: P1) 🎯 MVP

**Goal**: Users can view all export column options in the Export Dialog without pagination, using scrollable table display instead.

**Independent Test**: Can be fully tested by opening any Export Dialog (BOM or Material Master Data), verifying that the column selection table displays all columns without pagination controls, and confirming that a scrollbar appears when the table content exceeds the visible area. This delivers improved usability for column selection.

### Implementation for User Story 1

#### BOM Export Dialog

- [x] T008 [P] [US1] Remove `:pagination="{ pageSize: 10 }"` from Table component in apps/web-antd/src/views/manufacture/baseData/sqe-supplier-bom/components/ExportDialog.vue
- [x] T009 [US1] Add `:pagination="false"` to Table component in apps/web-antd/src/views/manufacture/baseData/sqe-supplier-bom/components/ExportDialog.vue
- [x] T010 [US1] Add `:scroll="{ y: 400 }"` to Table component to enable vertical scrolling in apps/web-antd/src/views/manufacture/baseData/sqe-supplier-bom/components/ExportDialog.vue

#### Material Export Dialog

- [x] T011 [P] [US1] Remove `:pagination="{ pageSize: 10 }"` from Table component in apps/web-antd/src/views/manufacture/baseData/supplier-pro-material-data/components/ExportDialog.vue
- [x] T012 [US1] Add `:pagination="false"` to Table component in apps/web-antd/src/views/manufacture/baseData/supplier-pro-material-data/components/ExportDialog.vue
- [x] T013 [US1] Add `:scroll="{ y: 400 }"` to Table component to enable vertical scrolling in apps/web-antd/src/views/manufacture/baseData/supplier-pro-material-data/components/ExportDialog.vue

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently. Both Export Dialog tables display all columns without pagination, with scrollbars when content exceeds visible area.

---

## Phase 4: User Story 2 - Optimize Export Dialog Form Layout (Priority: P1)

**Goal**: Users can view and configure file name, export mode, page size, and page number in a single horizontal row layout for better space utilization and visual organization.

**Independent Test**: Can be fully tested by opening any Export Dialog, verifying that file name input, export mode selection, page size input, and page number input are displayed in a single horizontal row in the specified order (file name, export mode, page size, page number). This delivers improved form layout and space efficiency.

### Implementation for User Story 2

#### BOM Export Dialog

- [x] T014 [P] [US2] Import Space component from ant-design-vue in apps/web-antd/src/views/manufacture/baseData/sqe-supplier-bom/components/ExportDialog.vue
- [x] T015 [US2] Wrap file name, export mode, page size, and page number fields in Space component with wrap property in apps/web-antd/src/views/manufacture/baseData/sqe-supplier-bom/components/ExportDialog.vue
- [x] T016 [US2] Reorder fields to: file name → export mode → page size → page number in apps/web-antd/src/views/manufacture/baseData/sqe-supplier-bom/components/ExportDialog.vue
- [x] T017 [US2] Set Space component props: `:size="16"`, `align="center"`, `wrap`, `class="w-full"` in apps/web-antd/src/views/manufacture/baseData/sqe-supplier-bom/components/ExportDialog.vue
- [x] T018 [US2] Use conditional rendering (v-if) for page size and page number fields based on export mode in apps/web-antd/src/views/manufacture/baseData/sqe-supplier-bom/components/ExportDialog.vue
- [x] T019 [US2] Remove separate div containers and h4 headings for form fields in apps/web-antd/src/views/manufacture/baseData/sqe-supplier-bom/components/ExportDialog.vue

#### Material Export Dialog

- [x] T020 [P] [US2] Import Space component from ant-design-vue in apps/web-antd/src/views/manufacture/baseData/supplier-pro-material-data/components/ExportDialog.vue
- [x] T021 [US2] Wrap file name, export mode, page size, and page number fields in Space component with wrap property in apps/web-antd/src/views/manufacture/baseData/supplier-pro-material-data/components/ExportDialog.vue
- [x] T022 [US2] Reorder fields to: file name → export mode → page size → page number in apps/web-antd/src/views/manufacture/baseData/supplier-pro-material-data/components/ExportDialog.vue
- [x] T023 [US2] Set Space component props: `:size="16"`, `align="center"`, `wrap`, `class="w-full"` in apps/web-antd/src/views/manufacture/baseData/supplier-pro-material-data/components/ExportDialog.vue
- [x] T024 [US2] Use conditional rendering (v-if) for page size and page number fields based on export mode in apps/web-antd/src/views/manufacture/baseData/supplier-pro-material-data/components/ExportDialog.vue
- [x] T025 [US2] Remove separate div containers and h4 headings for form fields in apps/web-antd/src/views/manufacture/baseData/supplier-pro-material-data/components/ExportDialog.vue

**Checkpoint**: At this point, User Story 2 should be fully functional and testable independently. Both Export Dialogs display form fields in a single horizontal row with correct order and conditional visibility.

---

## Phase 5: User Story 3 - Remove Redundant Checkbox Column Definition (Priority: P2)

**Goal**: The Export Dialog column selection table must not define a separate checkbox column in columnTableColumns when row-selection is already configured, eliminating redundant column definitions.

**Independent Test**: Can be fully tested by opening any Export Dialog, verifying that the column selection table displays checkboxes correctly via row-selection, and confirming that no separate checkbox column is defined in the columnTableColumns configuration. This delivers cleaner code and prevents potential UI conflicts.

### Implementation for User Story 3

#### BOM Export Dialog

- [x] T026 [P] [US3] Remove checkbox column definition from columnTableColumns computed property in apps/web-antd/src/views/manufacture/baseData/sqe-supplier-bom/components/ExportDialog.vue
- [x] T027 [US3] Remove manual checkbox rendering in template #bodyCell slot (if exists) in apps/web-antd/src/views/manufacture/baseData/sqe-supplier-bom/components/ExportDialog.vue
- [x] T028 [US3] Verify row-selection checkboxes work correctly after removing manual checkbox column in apps/web-antd/src/views/manufacture/baseData/sqe-supplier-bom/components/ExportDialog.vue

#### Material Export Dialog

- [x] T029 [P] [US3] Remove checkbox column definition from columnTableColumns computed property in apps/web-antd/src/views/manufacture/baseData/supplier-pro-material-data/components/ExportDialog.vue
- [x] T030 [US3] Remove manual checkbox rendering in template #bodyCell slot (if exists) in apps/web-antd/src/views/manufacture/baseData/supplier-pro-material-data/components/ExportDialog.vue
- [x] T031 [US3] Verify row-selection checkboxes work correctly after removing manual checkbox column in apps/web-antd/src/views/manufacture/baseData/supplier-pro-material-data/components/ExportDialog.vue

**Checkpoint**: At this point, User Story 3 should be fully functional and testable independently. Both Export Dialogs use only row-selection for checkboxes, with no redundant checkbox column definitions.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T032 [P] Run TypeScript type checking: `pnpm check:type` to verify all type definitions are correct
- [x] T033 [P] Run ESLint and Prettier checks: `pnpm lint` to ensure code quality
- [x] T034 [P] Verify table pagination is disabled in both Export Dialog components
- [x] T035 [P] Verify table scrollbar appears when content exceeds visible area in both Export Dialog components
- [x] T036 [P] Verify form fields are displayed in horizontal row in both Export Dialog components
- [x] T037 [P] Verify field order is correct (fileName → exportMode → pageSize → pageNumber) in both Export Dialog components
- [x] T038 [P] Verify conditional fields (pageSize, pageNumber) respect export mode in both Export Dialog components
- [x] T039 [P] Verify checkbox column is removed from columnTableColumns in both Export Dialog components
- [x] T040 [P] Verify row-selection checkboxes work correctly in both Export Dialog components
- [x] T041 [P] Test responsive layout on small screens (fields should wrap if needed) in both Export Dialog components
- [x] T042 [P] Test export functionality still works correctly after UI changes in both Export Dialog components
- [x] T043 [P] Verify all existing export functionality (import, export, delete) continues to work
- [x] T044 [P] Code review: Verify compliance with constitution principles
- [x] T045 Run quickstart.md validation checklist

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Story 1 (Phase 3)**: Depends on Foundational phase completion
- **User Story 2 (Phase 4)**: Depends on Foundational phase completion (can run in parallel with US1)
- **User Story 3 (Phase 5)**: Depends on Foundational phase completion (can run in parallel with US1 and US2)
- **Polish (Phase 6)**: Depends on User Stories 1, 2, and 3 completion

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories (can run in parallel with US1)
- **User Story 3 (P2)**: Can start after Foundational (Phase 2) - No dependencies on other stories (can run in parallel with US1 and US2)

### Within Each User Story

- BOM and Material Export Dialog modifications can be done in parallel (different files)
- Table configuration changes before form layout changes (logical grouping)
- Checkbox column removal can be done independently

### Parallel Opportunities

- **Phase 1**: T002, T003, T004 can run in parallel
- **Phase 2**: All tasks can run in parallel (documentation)
- **Phase 3**: 
  - BOM Export Dialog (T008-T010) and Material Export Dialog (T011-T013) can run in parallel
- **Phase 4**:
  - BOM Export Dialog (T014-T019) and Material Export Dialog (T020-T025) can run in parallel
  - Within each component, import (T014/T020) can be done first, then layout changes
- **Phase 5**:
  - BOM Export Dialog (T026-T028) and Material Export Dialog (T029-T031) can run in parallel
- **Phase 6**: All tasks marked [P] can run in parallel

---

## Parallel Example: User Story 1

```bash
# BOM and Material Export Dialog modifications can be done in parallel:
Task: "Remove pagination from Table component in apps/web-antd/src/views/manufacture/baseData/sqe-supplier-bom/components/ExportDialog.vue"
Task: "Remove pagination from Table component in apps/web-antd/src/views/manufacture/baseData/supplier-pro-material-data/components/ExportDialog.vue"
```

---

## Parallel Example: User Story 2

```bash
# BOM and Material Export Dialog modifications can be done in parallel:
Task: "Import Space component in apps/web-antd/src/views/manufacture/baseData/sqe-supplier-bom/components/ExportDialog.vue"
Task: "Import Space component in apps/web-antd/src/views/manufacture/baseData/supplier-pro-material-data/components/ExportDialog.vue"

# Form layout changes can be done in parallel:
Task: "Wrap form fields in Space component in apps/web-antd/src/views/manufacture/baseData/sqe-supplier-bom/components/ExportDialog.vue"
Task: "Wrap form fields in Space component in apps/web-antd/src/views/manufacture/baseData/supplier-pro-material-data/components/ExportDialog.vue"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup - Review current implementations
2. Complete Phase 2: Foundational - Document current state
3. Complete Phase 3: User Story 1 - Remove pagination and enable scrolling
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Add User Story 3 → Test independently → Deploy/Demo
5. Add Polish → Final validation and deployment

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 (BOM Export Dialog)
   - Developer B: User Story 1 (Material Export Dialog)
   - Developer C: User Story 2 (both dialogs)
3. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [US1], [US2], [US3] labels map tasks to specific user stories for traceability
- Each user story should be independently completable and testable
- BOM and Material Export Dialog modifications can be done in parallel (different files)
- Verify all existing export functionality continues to work after UI changes
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: breaking existing functionality, introducing visual regressions, creating inconsistent UI between BOM and Material dialogs

