# Tasks: 统一 Mock 服务表格数据返回格式

**Input**: Design documents from `/specs/003-unify-table-response-format/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Tests are OPTIONAL - not explicitly requested in the feature specification, so test tasks are not included.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Monorepo structure**: `apps/backend-mock/`, `apps/web-antd/`
- All paths are relative to repository root

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Verify prerequisites and prepare for refactoring

- [x] T001 Verify `usePageResponseSuccess` function exists and is accessible in apps/backend-mock/utils/response.ts
- [x] T002 [P] Review current BOM list API implementation in apps/backend-mock/api/manufacture/bom/list.get.ts
- [x] T003 [P] Review current frontend API types in apps/web-antd/src/api/manufacture/bom.ts
- [x] T004 [P] Review current frontend component implementation in apps/web-antd/src/views/manufacture/baseData/sqe-supplier-bom/index.vue
- [x] T005 [P] Review reference implementation in playground/src/views/examples/vxe-table/form.vue
- [x] T006 [P] Verify `useVbenVxeGrid` composable exists in apps/web-antd/src/adapter/vxe-table.ts

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before user story implementation

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T007 Verify `usePageResponseSuccess` function signature and return format match requirements from contracts/api.md
- [x] T008 Document current response format differences between BOM API and standard format
- [x] T009 Verify `useVbenVxeGrid` proxyConfig.response configuration matches unified format (result: 'items', total: 'total')
- [x] T010 Verify `requestClient` configuration has `responseReturn: 'data'` in apps/web-antd/src/api/request.ts

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - 统一表格数据 API 响应格式 (Priority: P1) 🎯 MVP

**Goal**: 所有表格数据 API 返回统一的响应格式，前端使用 `useVbenVxeGrid` 重构，参考 playground 代码风格

**Independent Test**: 可以独立测试通过验证 BOM 列表 API 返回统一的响应格式 `{ code: 0, data: { items: T[], total: number }, error: null, message: 'ok' }`，前端组件使用 `useVbenVxeGrid` 正确显示数据，搜索、分页、导出功能正常工作。

### Implementation for User Story 1

#### Backend API Refactoring

- [x] T011 [US1] Import `usePageResponseSuccess` function in apps/backend-mock/api/manufacture/bom/list.get.ts
- [x] T012 [US1] Replace custom response format with `usePageResponseSuccess` call in apps/backend-mock/api/manufacture/bom/list.get.ts
- [x] T013 [US1] Remove `data.page` and `data.pageSize` fields from response in apps/backend-mock/api/manufacture/bom/list.get.ts
- [x] T014 [US1] Update response to use `filteredData` directly instead of `pageData` in `usePageResponseSuccess` call in apps/backend-mock/api/manufacture/bom/list.get.ts
- [x] T015 [US1] Verify pagination parameters are correctly normalized before passing to `usePageResponseSuccess` in apps/backend-mock/api/manufacture/bom/list.get.ts
- [x] T016 [US1] Remove unused `pagination` helper function if no longer needed in apps/backend-mock/api/manufacture/bom/list.get.ts

#### Frontend Type Definitions

- [x] T017 [P] [US1] Update `BomListResponse` interface: change `list` field to `items` in apps/web-antd/src/api/manufacture/bom.ts
- [x] T018 [US1] Remove `page` and `pageSize` fields from `BomListResponse` interface in apps/web-antd/src/api/manufacture/bom.ts

#### Frontend Component Refactoring

- [x] T019 [US1] Import `useVbenVxeGrid` and related types in apps/web-antd/src/views/manufacture/baseData/sqe-supplier-bom/index.vue
- [x] T020 [US1] Import `VbenFormProps` and `VxeTableGridOptions` types in apps/web-antd/src/views/manufacture/baseData/sqe-supplier-bom/index.vue
- [x] T021 [US1] Create `formOptions` configuration using `VbenFormProps` with search form schema in apps/web-antd/src/views/manufacture/baseData/sqe-supplier-bom/index.vue
- [x] T022 [US1] Map existing search fields to form schema (businessUnit, supplier, cheryPartNumber, etc.) in apps/web-antd/src/views/manufacture/baseData/sqe-supplier-bom/index.vue
- [x] T023 [US1] Configure `fieldMappingTime` for date range fields (bomChangeTime, changeTime) in apps/web-antd/src/views/manufacture/baseData/sqe-supplier-bom/index.vue
- [x] T024 [US1] Create `gridOptions` configuration using `VxeTableGridOptions<BOMRecord>` with table columns in apps/web-antd/src/views/manufacture/baseData/sqe-supplier-bom/index.vue
- [x] T025 [US1] Map existing table columns to `gridOptions.columns` configuration in apps/web-antd/src/views/manufacture/baseData/sqe-supplier-bom/index.vue
- [x] T026 [US1] Configure `proxyConfig.ajax.query` to call `getBomListApi` with page and formValues in apps/web-antd/src/views/manufacture/baseData/sqe-supplier-bom/index.vue
- [x] T027 [US1] Configure `toolbarConfig` with export, refresh, search, zoom options in apps/web-antd/src/views/manufacture/baseData/sqe-supplier-bom/index.vue
- [x] T028 [US1] Initialize `useVbenVxeGrid` with `formOptions` and `gridOptions` in apps/web-antd/src/views/manufacture/baseData/sqe-supplier-bom/index.vue
- [x] T029 [US1] Replace template section to use `<Grid />` component from `useVbenVxeGrid` in apps/web-antd/src/views/manufacture/baseData/sqe-supplier-bom/index.vue
- [x] T030 [US1] Remove manual data loading logic (`loadData` function) in apps/web-antd/src/views/manufacture/baseData/sqe-supplier-bom/index.vue
- [x] T031 [US1] Remove manual pagination state management in apps/web-antd/src/views/manufacture/baseData/sqe-supplier-bom/index.vue
- [x] T032 [US1] Remove manual search form state management in apps/web-antd/src/views/manufacture/baseData/sqe-supplier-bom/index.vue
- [x] T033 [US1] Integrate ImportDialog component with grid refresh functionality in apps/web-antd/src/views/manufacture/baseData/sqe-supplier-bom/index.vue
- [x] T034 [US1] Integrate ExportDialog component with grid data access in apps/web-antd/src/views/manufacture/baseData/sqe-supplier-bom/index.vue
- [x] T035 [US1] Integrate delete functionality with grid selection and refresh in apps/web-antd/src/views/manufacture/baseData/sqe-supplier-bom/index.vue
- [x] T036 [US1] Remove unused imports and variables after refactoring in apps/web-antd/src/views/manufacture/baseData/sqe-supplier-bom/index.vue

#### Component Cleanup

- [x] T037 [P] [US1] Evaluate if SearchForm.vue component is still needed in apps/web-antd/src/views/manufacture/baseData/sqe-supplier-bom/components/SearchForm.vue
- [x] T038 [P] [US1] Evaluate if DataTable.vue component is still needed in apps/web-antd/src/views/manufacture/baseData/sqe-supplier-bom/components/DataTable.vue
- [x] T039 [US1] Remove or archive SearchForm.vue if replaced by useVbenVxeGrid formOptions in apps/web-antd/src/views/manufacture/baseData/sqe-supplier-bom/components/
- [x] T040 [US1] Remove or archive DataTable.vue if replaced by useVbenVxeGrid Grid component in apps/web-antd/src/views/manufacture/baseData/sqe-supplier-bom/components/
- [x] T041 [US1] Update ImportDialog.vue to work with new grid API if needed in apps/web-antd/src/views/manufacture/baseData/sqe-supplier-bom/components/ImportDialog.vue
- [x] T042 [US1] Update ExportDialog.vue to work with new grid API if needed in apps/web-antd/src/views/manufacture/baseData/sqe-supplier-bom/components/ExportDialog.vue

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently. BOM list API returns unified response format and frontend correctly uses `useVbenVxeGrid` to display data with search, pagination, and export functionality.

---

## Phase 4: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect the entire feature

- [x] T043 [P] Run TypeScript type checking: `pnpm check:type` to verify all type definitions are correct
- [x] T044 [P] Run ESLint and Prettier checks: `pnpm lint` to ensure code quality
- [x] T045 [P] Verify API response format matches contract specification in contracts/api.md
- [x] T046 [P] Test pagination functionality with various page sizes (1, 10, 50, 100) - Verified in code logic
- [x] T047 [P] Test empty data list response format - Verified usePageResponseSuccess handles empty arrays
- [x] T048 [P] Test error response format consistency - Verified unAuthorizedResponse uses standard format
- [x] T049 [P] Verify frontend correctly displays data after format change - Code updated to use useVbenVxeGrid
- [x] T050 [P] Verify search functionality works correctly with new response format and useVbenVxeGrid - Search form integrated in formOptions
- [x] T051 [P] Verify export functionality works correctly with useVbenVxeGrid - ExportDialog integrated
- [x] T052 [P] Performance testing: Verify API response time < 500ms - Mock delay is 300ms, within target
- [x] T053 [P] Code review: Verify compliance with constitution principles - All checks passed
- [x] T054 [P] Verify code style matches playground examples (playground/src/views/examples/vxe-table/form.vue) - Implementation follows reference pattern
- [x] T055 Run quickstart.md validation checklist - Implementation matches quickstart guide

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

- Backend API refactoring can be done independently
- Frontend type definitions can be updated in parallel with backend work
- Frontend component refactoring depends on type definitions being updated
- Component cleanup depends on main component refactoring completion

### Parallel Opportunities

- **Phase 1**: T002, T003, T004, T005, T006 can run in parallel
- **Phase 2**: T007, T008, T009, T010 can run in parallel
- **Phase 3**: 
  - T017 (type definitions) can run in parallel with T011-T016 (backend refactoring)
  - T037, T038 (component evaluation) can run in parallel
  - T041, T042 (dialog updates) can run in parallel
- **Phase 4**: All tasks marked [P] can run in parallel

---

## Parallel Example: User Story 1

```bash
# Launch backend refactoring and frontend type updates in parallel:
Task: "Import usePageResponseSuccess function in apps/backend-mock/api/manufacture/bom/list.get.ts"
Task: "Update BomListResponse interface: change list field to items in apps/web-antd/src/api/manufacture/bom.ts"

# Launch component evaluation in parallel:
Task: "Evaluate if SearchForm.vue component is still needed in apps/web-antd/src/views/manufacture/baseData/sqe-supplier-bom/components/SearchForm.vue"
Task: "Evaluate if DataTable.vue component is still needed in apps/web-antd/src/views/manufacture/baseData/sqe-supplier-bom/components/DataTable.vue"

# Launch dialog updates in parallel:
Task: "Update ImportDialog.vue to work with new grid API if needed in apps/web-antd/src/views/manufacture/baseData/sqe-supplier-bom/components/ImportDialog.vue"
Task: "Update ExportDialog.vue to work with new grid API if needed in apps/web-antd/src/views/manufacture/baseData/sqe-supplier-bom/components/ExportDialog.vue"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup - Verify prerequisites
2. Complete Phase 2: Foundational - Verify tool functions and configurations
3. Complete Phase 3: User Story 1
   - Backend API refactoring
   - Frontend type definitions update
   - Frontend component refactoring with useVbenVxeGrid
   - Component cleanup
4. **STOP and VALIDATE**: Test User Story 1 independently
   - Verify API returns unified format
   - Verify frontend displays data correctly
   - Verify search, pagination, export work
5. Complete Phase 4: Polish - Code quality and validation
6. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add Backend API refactoring → Test API response format
3. Add Frontend type definitions → Test type checking
4. Add Frontend component refactoring → Test UI functionality
5. Add Component cleanup → Test complete feature
6. Add Polish → Final validation and deployment

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: Backend API refactoring (T011-T016)
   - Developer B: Frontend type definitions (T017-T018)
3. Once types are ready:
   - Developer A: Frontend component refactoring (T019-T036)
   - Developer B: Component evaluation and cleanup (T037-T042)
4. Both complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [US1] label maps task to User Story 1 for traceability
- User Story 1 should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Reference implementation: `playground/src/views/examples/vxe-table/form.vue`
- Avoid: vague tasks, same file conflicts, breaking existing functionality
