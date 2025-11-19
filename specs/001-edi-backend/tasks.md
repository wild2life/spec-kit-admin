# Tasks: EDI Backend Management - BOM Master Data

**Input**: Design documents from `/specs/001-edi-backend/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Tests are included based on constitution requirements (unit tests for utilities, E2E tests for user journeys). Test tasks are marked as optional but recommended.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Frontend**: `apps/web-antd/src/`
- **Backend Mock**: `apps/backend-mock/`
- Paths follow monorepo structure as defined in plan.md

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Create directory structure for BOM Master Data feature in apps/web-antd/src/views/manufacture/baseData/sqe-supplier-bom/
- [x] T002 [P] Create directory structure for BOM API endpoints in apps/backend-mock/api/manufacture/bom/
- [x] T003 [P] Create i18n locale files structure in apps/web-antd/src/locales/langs/zh-CN/ and en-US/ for manufacture namespace

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T004 Create TypeScript type definitions for BOMRecord interface in apps/web-antd/src/api/manufacture/bom.ts
- [x] T005 [P] Create mock data generator utility in apps/backend-mock/utils/mock-bom-data.ts with 100-1000 sample BOM records
- [x] T006 [P] Create i18n translation files: apps/web-antd/src/locales/langs/zh-CN/manufacture.json and apps/web-antd/src/locales/langs/en-US/manufacture.json with base structure
- [x] T007 Create route module file in apps/web-antd/src/router/routes/modules/manufacture.ts with route structure for /manufacture/baseData/sqe_supplier_bom
- [x] T008 Update menu API mock data in apps/backend-mock/api/menu/all.ts to include "生产质量/生产质量数据/BOM主数据" menu item

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - User Authentication and Homepage Access (Priority: P1) 🎯 MVP

**Goal**: Users can authenticate and access the EDI backend management system homepage after successful login.

**Independent Test**: Can be fully tested by verifying that users can log in with valid credentials and are redirected to the homepage, where they can see the main navigation and dashboard elements.

**Note**: Authentication and homepage functionality already exists in the system. This phase verifies the existing implementation works correctly and that the BOM menu item is accessible after login.

### Tests for User Story 1 (OPTIONAL - Recommended) ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T009 [P] [US1] E2E test: User login flow and homepage access in playground/__tests__/e2e/bom-authentication.spec.ts
- [ ] T010 [P] [US1] E2E test: Menu navigation to BOM Master Data page in playground/__tests__/e2e/bom-navigation.spec.ts

### Implementation for User Story 1

- [x] T011 [US1] Verify existing authentication system works and redirects to homepage after login
- [x] T012 [US1] Verify menu item "生产质量/生产质量数据/BOM主数据" appears in navigation after login
- [x] T013 [US1] Test route protection: unauthenticated users are redirected to login page when accessing BOM route

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently. Users can log in and see the BOM menu item.

---

## Phase 4: User Story 2 - BOM Master Data Viewing and Searching (Priority: P2)

**Goal**: Users can view BOM master data in a table format and search for specific records using multiple search criteria.

**Independent Test**: Can be fully tested by navigating to the BOM Master Data page, viewing the data table, and using the search form with various criteria to filter results.

### Tests for User Story 2 (OPTIONAL - Recommended) ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T014 [P] [US2] Unit test: BOM API functions in apps/web-antd/src/__tests__/manufacture/bom.test.ts
- [ ] T015 [P] [US2] E2E test: Search form functionality and table display in playground/__tests__/e2e/bom-search.spec.ts

### Implementation for User Story 2

#### Backend Mock API

- [x] T016 [P] [US2] Create GET endpoint for BOM list in apps/backend-mock/api/manufacture/bom/list.get.ts with pagination and search filtering
- [x] T017 [US2] Implement search filtering logic in list.get.ts to filter mock data by all search criteria (text fields, date ranges, select fields)

#### Frontend API Layer

- [x] T018 [P] [US2] Create API function getBomListApi in apps/web-antd/src/api/manufacture/bom.ts with TypeScript types
- [x] T019 [US2] Add TypeScript interfaces for BomListParams and BomListResponse in apps/web-antd/src/api/manufacture/bom.ts

#### i18n Translations

- [x] T020 [P] [US2] Add search form field labels to apps/web-antd/src/locales/langs/zh-CN/manufacture.json
- [x] T021 [P] [US2] Add search form field labels to apps/web-antd/src/locales/langs/en-US/manufacture.json
- [x] T022 [P] [US2] Add table column headers to i18n files (zh-CN and en-US)
- [x] T023 [P] [US2] Add date picker preset labels to i18n files (zh-CN and en-US)

#### Search Form Component

- [x] T024 [US2] Create SearchForm component in apps/web-antd/src/views/manufacture/baseData/sqe-supplier-bom/components/SearchForm.vue
- [x] T025 [US2] Implement a-form with all search fields in SearchForm.vue (select components for 事业部 and 供应商, input fields for text, date range pickers)
- [x] T026 [US2] Implement date range picker presets (今天, 近三天, 近一周, 近30天, 近90天) in SearchForm.vue
- [x] T027 [US2] Implement debounced search functionality (300-500ms) in SearchForm.vue using useDebounceFn
- [x] T028 [US2] Add search and reset buttons to SearchForm.vue

#### Data Table Component

- [x] T029 [US2] Create DataTable component in apps/web-antd/src/views/manufacture/baseData/sqe-supplier-bom/components/DataTable.vue
- [x] T030 [US2] Implement a-table with all required columns in DataTable.vue
- [x] T031 [US2] Configure first column (checkbox) and second column (事业部编号) as fixed columns in DataTable.vue
- [x] T032 [US2] Implement row selection with checkboxes in DataTable.vue using row-selection prop
- [x] T033 [US2] Implement pagination in DataTable.vue
- [x] T034 [US2] Add loading state handling in DataTable.vue
- [x] T035 [US2] Implement empty state message when no data in DataTable.vue

#### Main Page Component

- [x] T036 [US2] Create main page component in apps/web-antd/src/views/manufacture/baseData/sqe-supplier-bom/index.vue
- [x] T037 [US2] Integrate SearchForm and DataTable components in index.vue
- [x] T038 [US2] Implement data fetching logic in index.vue using getBomListApi
- [x] T039 [US2] Implement search form submission and table data refresh in index.vue
- [x] T040 [US2] Add Import, Export, Delete, Report buttons above table in index.vue (buttons disabled for now, will be enabled in US3)
- [x] T041 [US2] Add error handling and user-friendly error messages in index.vue

**Checkpoint**: At this point, User Story 2 should be fully functional and testable independently. Users can view BOM data, search, and filter results.

---

## Phase 5: User Story 3 - BOM Master Data Import, Export, Delete, and Report (Priority: P3)

**Goal**: Users can import BOM master data from external files, export BOM master data to files with customizable options, delete selected records, and report data to external systems.

**Independent Test**: Can be fully tested by selecting records via checkboxes, exporting data with custom column selection, importing a file, deleting selected records, and reporting data, verifying that all operations complete successfully and data is correctly processed.

### Tests for User Story 3 (OPTIONAL - Recommended) ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T042 [P] [US3] E2E test: Import functionality workflow in playground/__tests__/e2e/bom-import.spec.ts
- [ ] T043 [P] [US3] E2E test: Export functionality workflow in playground/__tests__/e2e/bom-export.spec.ts
- [ ] T044 [P] [US3] E2E test: Delete functionality workflow in playground/__tests__/e2e/bom-delete.spec.ts
- [ ] T044a [P] [US3] E2E test: Report functionality workflow in playground/__tests__/e2e/bom-report.spec.ts

### Implementation for User Story 3

#### Backend Mock API - Import

- [x] T045 [P] [US3] Create GET endpoint for template download in apps/backend-mock/api/manufacture/bom/template.get.ts
- [x] T046 [P] [US3] Create POST endpoint for import in apps/backend-mock/api/manufacture/bom/import.post.ts
- [x] T047 [US3] Implement file parsing and validation logic in import.post.ts
- [x] T048 [US3] Implement duplicate detection and handling logic in import.post.ts (update existing records)
- [x] T049 [US3] Implement import result response with success/error counts in import.post.ts

#### Backend Mock API - Export

- [x] T050 [P] [US3] Create POST endpoint for export in apps/backend-mock/api/manufacture/bom/export.post.ts
- [x] T051 [US3] Implement column filtering logic in export.post.ts based on selectedColumns
- [x] T052 [US3] Implement paginated export mode logic in export.post.ts
- [x] T053 [US3] Implement Excel file generation in export.post.ts (using xlsx library or similar)

#### Backend Mock API - Delete

- [x] T054 [P] [US3] Create POST endpoint for delete in apps/backend-mock/api/manufacture/bom/delete.post.ts
- [x] T055 [US3] Implement delete logic for selected record IDs in delete.post.ts

#### Backend Mock API - Report

- [x] T055a [P] [US3] Create POST endpoint for report in apps/backend-mock/api/manufacture/bom/report.post.ts
- [x] T055b [US3] Implement report logic to submit data to external system in report.post.ts
- [x] T055c [US3] Implement report response with success status and reported count in report.post.ts

#### Frontend API Layer

- [x] T056 [P] [US3] Add downloadTemplateApi function in apps/web-antd/src/api/manufacture/bom.ts
- [x] T057 [P] [US3] Add importBomApi function in apps/web-antd/src/api/manufacture/bom.ts
- [x] T058 [P] [US3] Add exportBomApi function in apps/web-antd/src/api/manufacture/bom.ts
- [x] T059 [P] [US3] Add deleteBomApi function in apps/web-antd/src/api/manufacture/bom.ts
- [x] T059a [P] [US3] Add reportBomApi function in apps/web-antd/src/api/manufacture/bom.ts
- [x] T060 [US3] Add TypeScript interfaces for ImportResult, ExportConfig, DeleteParams in apps/web-antd/src/api/manufacture/bom.ts
- [x] T060a [US3] Add TypeScript interfaces for ReportParams and ReportResponse in apps/web-antd/src/api/manufacture/bom.ts

#### i18n Translations

- [x] T061 [P] [US3] Add import dialog labels to apps/web-antd/src/locales/langs/zh-CN/manufacture.json
- [x] T062 [P] [US3] Add import dialog labels to apps/web-antd/src/locales/langs/en-US/manufacture.json
- [x] T063 [P] [US3] Add export dialog labels to i18n files (zh-CN and en-US)
- [x] T064 [P] [US3] Add delete confirmation messages to i18n files (zh-CN and en-US)
- [x] T065 [P] [US3] Add success/error messages to i18n files (zh-CN and en-US)
- [x] T065a [P] [US3] Add report button label and confirmation dialog messages to i18n files (zh-CN and en-US)
- [x] T065b [P] [US3] Add report success/error messages to i18n files (zh-CN and en-US)

#### Import Dialog Component

- [x] T066 [US3] Create ImportDialog component in apps/web-antd/src/views/manufacture/baseData/sqe-supplier-bom/components/ImportDialog.vue
- [x] T067 [US3] Implement a-modal dialog in ImportDialog.vue
- [x] T068 [US3] Implement a-upload component for file selection in ImportDialog.vue
- [x] T069 [US3] Implement file validation (type, size) in ImportDialog.vue
- [x] T070 [US3] Add "Download Template" button/link in ImportDialog.vue
- [x] T071 [US3] Implement template download functionality in ImportDialog.vue
- [x] T072 [US3] Implement file upload and import progress in ImportDialog.vue
- [x] T073 [US3] Display import results (success count, error count, error details) in ImportDialog.vue

#### Export Dialog Component

- [x] T074 [US3] Create ExportDialog component in apps/web-antd/src/views/manufacture/baseData/sqe-supplier-bom/components/ExportDialog.vue
- [x] T075 [US3] Implement a-modal dialog titled "自定义导出" in ExportDialog.vue
- [x] T076 [US3] Implement column selection table with checkboxes in ExportDialog.vue (three columns: Checkbox, Attribute Name, Table Column Name)
- [x] T077 [US3] Set all column checkboxes checked by default in ExportDialog.vue
- [x] T078 [US3] Implement export mode selection (全部/分页) in ExportDialog.vue
- [x] T079 [US3] Implement page size and page number inputs for paginated mode in ExportDialog.vue
- [x] T080 [US3] Implement file name input with default "BOM主数据" in ExportDialog.vue
- [x] T081 [US3] Implement export execution and file download in ExportDialog.vue

#### Delete Functionality

- [x] T082 [US3] Implement delete button enable/disable logic based on selectedRowKeys in apps/web-antd/src/views/manufacture/baseData/sqe-supplier-bom/index.vue
- [x] T083 [US3] Implement delete confirmation dialog using Modal.confirm in index.vue
- [x] T084 [US3] Implement delete API call and table refresh after deletion in index.vue
- [x] T085 [US3] Add success message after successful deletion in index.vue

#### Report Functionality

- [x] T085a [US3] Add Report button above the data table in apps/web-antd/src/views/manufacture/baseData/sqe-supplier-bom/index.vue
- [x] T085b [US3] Implement report confirmation dialog using Modal.confirm in index.vue
- [x] T085c [US3] Implement report API call when user confirms in index.vue
- [x] T085d [US3] Add loading state and disable Report button during API call in index.vue
- [x] T085e [US3] Display success message when report API call succeeds in index.vue
- [x] T085f [US3] Display error message when report API call fails in index.vue
- [x] T085g [US3] Ensure Report button enable/disable logic matches Delete button exactly (disabled when no rows selected, enabled when rows selected) in apps/web-antd/src/views/manufacture/baseData/sqe-supplier-bom/index.vue
- [x] T085h [US3] Implement consistent visual spacing (8px gap) between all action buttons (Import, Export, Delete, Report) in apps/web-antd/src/views/manufacture/baseData/sqe-supplier-bom/index.vue

#### Integration

- [x] T086 [US3] Integrate ImportDialog into main page component (open on Import button click) in apps/web-antd/src/views/manufacture/baseData/sqe-supplier-bom/index.vue
- [x] T087 [US3] Integrate ExportDialog into main page component (open on Export button click) in index.vue
- [x] T088 [US3] Refresh table data after successful import in index.vue
- [x] T089 [US3] Add error handling for all import/export/delete operations in index.vue
- [x] T089a [US3] Integrate report functionality into main page component (open confirmation dialog on Report button click) in index.vue
- [x] T089b [US3] Add error handling for report operation in index.vue

**Checkpoint**: At this point, User Story 3 should be fully functional and testable independently. Users can import, export, delete, and report BOM data.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T090 [P] Add comprehensive error handling and user-friendly error messages across all components
- [x] T091 [P] Add loading states and disable buttons during API operations across all components
- [x] T092 [P] Add success notifications using Ant Design Vue message component after operations
- [x] T093 [P] Implement proper cleanup in composables using onUnmounted hooks (not needed for current implementation - no composables with side effects)
- [ ] T094 [P] Add unit tests for utility functions and composables in apps/web-antd/src/__tests__/manufacture/bom.test.ts (OPTIONAL - recommended)
- [x] T095 [P] Run ESLint, Prettier, and Stylelint checks: `pnpm lint`
- [x] T096 [P] Run TypeScript type checking: `pnpm check:type`
- [x] T097 [P] Run circular dependency check: `pnpm check:circular`
- [x] T098 [P] Run spell check: `pnpm check:cspell`
- [x] T099 [P] Verify all i18n translations are complete and consistent
- [ ] T100 [P] Performance testing: Verify search operations < 1 second, export < 5 seconds (requires manual testing)
- [ ] T101 [P] Accessibility audit: Verify keyboard navigation and screen reader support (requires manual testing)
- [x] T102 [P] Code review: Verify compliance with constitution principles
- [x] T103 Run quickstart.md validation checklist

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories. Note: Authentication already exists, this is mainly verification.
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - Depends on US1 for menu access, but can be developed independently
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - Depends on US2 for table and selection functionality, but can be developed independently

### Within Each User Story

- Tests (if included) MUST be written and FAIL before implementation
- Backend API endpoints before frontend API functions
- Frontend API functions before components
- Components before integration
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes, user stories can start in parallel (if team capacity allows)
- All tests for a user story marked [P] can run in parallel
- Backend API endpoints marked [P] can run in parallel
- Frontend components marked [P] can run in parallel
- Different user stories can be worked on in parallel by different team members

---

## Parallel Example: User Story 2

```bash
# Launch all backend API tasks for User Story 2 together:
Task: "Create GET endpoint for BOM list in apps/backend-mock/api/manufacture/bom/list.get.ts"
Task: "Create API function getBomListApi in apps/web-antd/src/api/manufacture/bom.ts"

# Launch all i18n tasks together:
Task: "Add search form field labels to apps/web-antd/src/locales/langs/zh-CN/manufacture.json"
Task: "Add search form field labels to apps/web-antd/src/locales/langs/en-US/manufacture.json"
Task: "Add table column headers to i18n files (zh-CN and en-US)"
Task: "Add date picker preset labels to i18n files (zh-CN and en-US)"
```

---

## Implementation Strategy

### MVP First (User Story 1 + User Story 2)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1 (verification of existing auth)
4. Complete Phase 4: User Story 2 (viewing and searching)
5. **STOP and VALIDATE**: Test User Stories 1 and 2 independently
6. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (Basic access)
3. Add User Story 2 → Test independently → Deploy/Demo (MVP with viewing/searching!)
4. Add User Story 3 → Test independently → Deploy/Demo (Full feature set)
5. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 (verification) + User Story 2 (search form)
   - Developer B: User Story 2 (data table) + User Story 3 (import/export)
   - Developer C: User Story 3 (delete) + Testing
3. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify tests fail before implementing
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
- All file paths are relative to repository root
- Follow Vue 3 Composition API patterns
- Use Ant Design Vue components consistently
- All user-facing text must support i18n

---

## Task Summary

- **Total Tasks**: 117
- **Phase 1 (Setup)**: 3 tasks
- **Phase 2 (Foundational)**: 5 tasks
- **Phase 3 (User Story 1)**: 5 tasks (3 implementation + 2 optional tests)
- **Phase 4 (User Story 2)**: 28 tasks (24 implementation + 2 optional tests + 2 i18n)
- **Phase 5 (User Story 3)**: 62 tasks (56 implementation + 4 optional tests + 7 i18n)
- **Phase 6 (Polish)**: 14 tasks

**Parallel Opportunities**: 50+ tasks can be executed in parallel

**Suggested MVP Scope**: Phase 1 + Phase 2 + Phase 3 + Phase 4 (User Stories 1 and 2) = 41 tasks

