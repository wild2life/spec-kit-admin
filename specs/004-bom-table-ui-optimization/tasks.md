# Tasks: BOM 表格 UI 优化

**Input**: Design documents from `/specs/004-bom-table-ui-optimization/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md

**Tests**: Tests are OPTIONAL - not explicitly requested in the feature specification, so test tasks are not included.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Monorepo structure**: `apps/web-antd/`
- All paths are relative to repository root

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Verify prerequisites and prepare for implementation

- [x] T001 Review current BOM table implementation in apps/web-antd/src/views/manufacture/baseData/sqe-supplier-bom/index.vue
- [x] T002 [P] Verify VXE Table column configuration options in apps/web-antd/src/adapter/vxe-table.ts
- [x] T003 [P] Verify VbenFormProps configuration options in apps/web-antd/src/adapter/form.ts
- [x] T004 [P] Verify w-full class is available in project (check Tailwind CSS configuration)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before user story implementation

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T005 Verify current table column configuration structure in apps/web-antd/src/views/manufacture/baseData/sqe-supplier-bom/index.vue
- [x] T006 Verify current formOptions configuration structure in apps/web-antd/src/views/manufacture/baseData/sqe-supplier-bom/index.vue
- [x] T007 Document current column order and form configuration for reference

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - 优化表格布局和搜索面板 (Priority: P1) 🎯 MVP

**Goal**: 优化 BOM 主数据表格的 UI 布局和搜索面板配置。移除表格序号列，将 checkbox 列移到第一列，设置搜索表单宽度为100%（w-full class），并将搜索面板默认设置为折叠状态。

**Independent Test**: 可以独立测试通过验证表格列顺序（checkbox 在第一列，无序号列），搜索表单宽度为100%，以及搜索面板默认状态为折叠。

### Implementation for User Story 1

#### Table Column Configuration

- [x] T008 [US1] Remove sequence column (type: 'seq') from gridOptions.columns array in apps/web-antd/src/views/manufacture/baseData/sqe-supplier-bom/index.vue
- [x] T009 [US1] Move checkbox column to first position in gridOptions.columns array in apps/web-antd/src/views/manufacture/baseData/sqe-supplier-bom/index.vue
- [x] T010 [US1] Ensure checkbox column has fixed: 'left' property in apps/web-antd/src/views/manufacture/baseData/sqe-supplier-bom/index.vue
- [x] T011 [US1] Verify other columns maintain their original order and configuration in apps/web-antd/src/views/manufacture/baseData/sqe-supplier-bom/index.vue

#### Search Form Configuration

- [x] T012 [US1] Set collapsed: true in formOptions configuration in apps/web-antd/src/views/manufacture/baseData/sqe-supplier-bom/index.vue
- [x] T013 [US1] Add wrapperClass: 'w-full' to formOptions configuration in apps/web-antd/src/views/manufacture/baseData/sqe-supplier-bom/index.vue
- [x] T014 [US1] Verify showCollapseButton remains true in formOptions configuration in apps/web-antd/src/views/manufacture/baseData/sqe-supplier-bom/index.vue

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently. Table checkbox column is in first position, sequence column is removed, search form width is 100%, and search panel is collapsed by default.

---

## Phase 4: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect the entire feature

- [x] T015 [P] Run TypeScript type checking: `pnpm check:type` to verify all type definitions are correct
- [x] T016 [P] Run ESLint and Prettier checks: `pnpm lint` to ensure code quality
- [x] T017 [P] Verify table checkbox column is displayed in first position
- [x] T018 [P] Verify table sequence column is not displayed
- [x] T019 [P] Verify search form width is 100% (w-full class applied)
- [x] T020 [P] Verify search panel is collapsed by default on page load
- [x] T021 [P] Test search panel expand/collapse functionality
- [x] T022 [P] Verify all table functions (selection, sorting, pagination) work correctly after layout changes
- [x] T023 [P] Test table functionality with empty data list
- [x] T024 [P] Test search form width responsiveness on different screen sizes
- [x] T025 [P] Verify search panel state resets to collapsed on page refresh
- [x] T026 [P] Code review: Verify compliance with constitution principles
- [x] T027 Run quickstart.md validation checklist

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Story 1 (Phase 3)**: Depends on Foundational phase completion
- **Polish (Phase 4)**: Depends on User Story 1 completion

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories

### Within User Story 1

- Table column configuration tasks (T008-T011) can be done together as they modify the same array
- Search form configuration tasks (T012-T014) can be done together as they modify the same object
- Column configuration and form configuration are independent and can be done in parallel

### Parallel Opportunities

- **Phase 1**: T002, T003, T004 can run in parallel
- **Phase 2**: T005, T006, T007 can run in parallel
- **Phase 3**: 
  - Table column configuration (T008-T011) can be done together
  - Search form configuration (T012-T014) can be done together
  - Column and form configurations are independent
- **Phase 4**: All tasks marked [P] can run in parallel

---

## Parallel Example: User Story 1

```bash
# Table column configuration can be done together:
Task: "Remove sequence column (type: 'seq') from gridOptions.columns array in apps/web-antd/src/views/manufacture/baseData/sqe-supplier-bom/index.vue"
Task: "Move checkbox column to first position in gridOptions.columns array in apps/web-antd/src/views/manufacture/baseData/sqe-supplier-bom/index.vue"
Task: "Ensure checkbox column has fixed: 'left' property in apps/web-antd/src/views/manufacture/baseData/sqe-supplier-bom/index.vue"

# Search form configuration can be done together:
Task: "Set collapsed: true in formOptions configuration in apps/web-antd/src/views/manufacture/baseData/sqe-supplier-bom/index.vue"
Task: "Add wrapperClass: 'w-full' to formOptions configuration in apps/web-antd/src/views/manufacture/baseData/sqe-supplier-bom/index.vue"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup - Review current implementation
2. Complete Phase 2: Foundational - Verify configuration structure
3. Complete Phase 3: User Story 1
   - Adjust table column configuration
   - Adjust search form configuration
4. **STOP and VALIDATE**: Test User Story 1 independently
   - Verify table column order
   - Verify search form width
   - Verify search panel default state
5. Complete Phase 4: Polish - Code quality and validation
6. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add Table column configuration → Test table layout
3. Add Search form configuration → Test form width and collapse state
4. Add Polish → Final validation and deployment

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: Table column configuration (T008-T011)
   - Developer B: Search form configuration (T012-T014)
3. Both complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [US1] label maps task to User Story 1 for traceability
- User Story 1 should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- All modifications are in a single file, so tasks modifying the same section must be done sequentially
- Avoid: vague tasks, breaking existing functionality

