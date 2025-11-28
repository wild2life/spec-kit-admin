# Tasks: Material Master Data Page

**Input**: Design documents from `/specs/002-material-master-data/`
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

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Create directory structure for Material Master Data feature in apps/web-antd/src/views/manufacture/baseData/supplier-pro-material-data/
- [x] T002 [P] Create directory structure for Material API endpoints in apps/backend-mock/api/manufacture/material/
- [x] T003 [P] Verify i18n locale files exist in apps/web-antd/src/locales/langs/zh-CN/manufacture.json and apps/web-antd/src/locales/langs/en-US/manufacture.json

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T004 Create TypeScript type definitions for MaterialRecord interface in apps/web-antd/src/api/manufacture/material.ts
- [x] T005 [P] Create mock data generator utility in apps/backend-mock/utils/mock-material-data.ts with 100-1000 sample Material Master Data records
- [x] T006 [P] Add material section to i18n translation files: apps/web-antd/src/locales/langs/zh-CN/manufacture.json and apps/web-antd/src/locales/langs/en-US/manufacture.json with base structure
- [x] T007 Update route module file in apps/web-antd/src/router/routes/modules/manufacture.ts with route structure for /manufacture/baseData/supplier_pro_material_data
- [x] T008 Update menu API mock data in apps/backend-mock/utils/mock-data.ts to include "生产质量/生产质量数据/物料主数据" menu item

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Material Master Data Viewing and Searching (Priority: P1) 🎯 MVP

**Goal**: Users can view Material Master Data in a table format and search for specific records using multiple search criteria.

**Independent Test**: Can be fully tested by navigating to the Material Master Data page, viewing the data table, and using the search form with various criteria to filter results. This delivers the ability to locate and review material master data records.

### Tests for User Story 1 (OPTIONAL - Recommended) ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T009 [P] [US1] Unit test: Material API functions in apps/web-antd/src/__tests__/manufacture/material.test.ts
- [ ] T010 [P] [US1] E2E test: Search form functionality and table display in playground/__tests__/e2e/material-search.spec.ts

### Implementation for User Story 1

#### Backend Mock API

- [x] T011 [P] [US1] Create GET endpoint for Material list in apps/backend-mock/api/manufacture/material/list.get.ts with pagination and search filtering using usePageResponseSuccess
- [x] T012 [US1] Implement search filtering logic in list.get.ts to filter mock data by all search criteria (businessUnit, supplier, supplierName, cheryPartName, supplierAssemblyPartName, projectName, factoryName, chipMPNIdentifierName)
- [x] T013 [US1] Implement sorting logic in list.get.ts to support sortBy and sortOrder parameters

#### Frontend API Layer

- [x] T014 [P] [US1] Create API function getMaterialListApi in apps/web-antd/src/api/manufacture/material.ts with TypeScript types
- [x] T015 [US1] Add TypeScript interfaces for MaterialListParams and MaterialListResponse in apps/web-antd/src/api/manufacture/material.ts

#### i18n Translations

- [x] T016 [P] [US1] Add search form field labels to apps/web-antd/src/locales/langs/zh-CN/manufacture.json (material.search section)
- [x] T017 [P] [US1] Add search form field labels to apps/web-antd/src/locales/langs/en-US/manufacture.json (material.search section)
- [x] T018 [P] [US1] Add table column headers to apps/web-antd/src/locales/langs/zh-CN/manufacture.json (material.table section)
- [x] T019 [P] [US1] Add table column headers to apps/web-antd/src/locales/langs/en-US/manufacture.json (material.table section)

#### Main Page Component with useVbenVxeGrid

- [x] T020 [US1] Create main page component in apps/web-antd/src/views/manufacture/baseData/supplier-pro-material-data/index.vue
- [x] T021 [US1] Import useVbenVxeGrid, VbenFormProps, and VxeTableGridOptions in index.vue
- [x] T022 [US1] Configure formOptions with collapsed: true, wrapperClass: 'w-full', and schema array with 8 search fields in index.vue
- [x] T023 [US1] Configure search form schema fields: 事业部 (Select), 供应商 (Select), 供应商名称 (Input), 奇瑞零件名称 (Input), 供应商总成零件名称 (Input), 项目名称 (Input), 工厂名称 (Input), 芯片MPN标识名称 (Input) in index.vue
- [x] T024 [US1] Set all search form fields to use class: 'w-full' for 100% width in index.vue
- [x] T025 [US1] Configure gridOptions with columns array (26 columns) in index.vue
- [x] T026 [US1] Configure checkbox column as first column (type: 'checkbox', fixed: 'left', no sequence column) in index.vue
- [x] T027 [US1] Configure 奇瑞零件号 column as second column (fixed: 'left') in index.vue
- [x] T028 [US1] Configure all other 24 table columns with proper field names and titles in index.vue
- [x] T029 [US1] Configure proxyConfig.ajax.query to call getMaterialListApi with pagination and form values in index.vue
- [x] T030 [US1] Configure toolbarConfig with export, refresh, search, zoom options in index.vue
- [x] T031 [US1] Initialize useVbenVxeGrid with formOptions and gridOptions in index.vue
- [x] T032 [US1] Add Import, Export, Delete buttons in toolbar-tools slot in index.vue (buttons disabled for now, will be enabled in US2)
- [x] T033 [US1] Add error handling and user-friendly error messages in index.vue
- [x] T034 [US1] Add empty state message when no data in index.vue

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently. Users can view Material Master Data, search, and filter results. Table displays with checkbox first column, no sequence column, search form is 100% width and collapsed by default.

---

## Phase 4: User Story 2 - Material Master Data Import, Export, Delete, and Report (Priority: P2)

**Goal**: Users can import Material Master Data from external files, export Material Master Data to files with customizable options, delete selected records, and report data to external systems.

**Independent Test**: Can be fully tested by selecting records via checkboxes, exporting data with custom column selection, importing a file, deleting selected records, and reporting data, verifying that all operations complete successfully and data is correctly processed. This delivers the ability to perform bulk data operations and data exchange.

### Tests for User Story 2 (OPTIONAL - Recommended) ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T035 [P] [US2] E2E test: Import functionality workflow in playground/__tests__/e2e/material-import.spec.ts
- [ ] T036 [P] [US2] E2E test: Export functionality workflow in playground/__tests__/e2e/material-export.spec.ts
- [ ] T037 [P] [US2] E2E test: Delete functionality workflow in playground/__tests__/e2e/material-delete.spec.ts
- [ ] T037a [P] [US2] E2E test: Report functionality workflow in playground/__tests__/e2e/material-report.spec.ts

### Implementation for User Story 2

#### Backend Mock API

- [x] T038 [P] [US2] Create GET endpoint for template download in apps/backend-mock/api/manufacture/material/template.get.ts
- [x] T039 [P] [US2] Create POST endpoint for import in apps/backend-mock/api/manufacture/material/import.post.ts with file parsing, validation, and result reporting
- [x] T040 [P] [US2] Create POST endpoint for export in apps/backend-mock/api/manufacture/material/export.post.ts with column filtering, pagination, and Excel file generation
- [x] T041 [P] [US2] Create POST endpoint for delete in apps/backend-mock/api/manufacture/material/delete.post.ts with batch deletion support

#### Backend Mock API - Report

- [x] T041a [P] [US2] Create POST endpoint for report in apps/backend-mock/api/manufacture/material/report.post.ts
- [x] T041b [US2] Implement report logic to submit data to external system in report.post.ts
- [x] T041c [US2] Implement report response with success status and reported count in report.post.ts

#### Frontend API Layer

- [x] T042 [P] [US2] Add importMaterialApi function in apps/web-antd/src/api/manufacture/material.ts
- [x] T043 [P] [US2] Add exportMaterialApi function in apps/web-antd/src/api/manufacture/material.ts
- [x] T044 [P] [US2] Add deleteMaterialApi function in apps/web-antd/src/api/manufacture/material.ts
- [x] T045 [P] [US2] Add downloadTemplateApi function in apps/web-antd/src/api/manufacture/material.ts
- [x] T045a [P] [US2] Add reportMaterialApi function in apps/web-antd/src/api/manufacture/material.ts
- [x] T046 [US2] Add TypeScript interfaces for ImportResult, ExportConfig, DeleteParams in apps/web-antd/src/api/manufacture/material.ts
- [x] T046a [US2] Add TypeScript interfaces for ReportParams and ReportResponse in apps/web-antd/src/api/manufacture/material.ts

#### i18n Translations

- [x] T047 [P] [US2] Add import dialog labels to apps/web-antd/src/locales/langs/zh-CN/manufacture.json (material.import section)
- [x] T048 [P] [US2] Add import dialog labels to apps/web-antd/src/locales/langs/en-US/manufacture.json (material.import section)
- [x] T049 [P] [US2] Add export dialog labels to apps/web-antd/src/locales/langs/zh-CN/manufacture.json (material.export section)
- [x] T050 [P] [US2] Add export dialog labels to apps/web-antd/src/locales/langs/en-US/manufacture.json (material.export section)
- [x] T051 [P] [US2] Add delete confirmation messages to apps/web-antd/src/locales/langs/zh-CN/manufacture.json (material.delete section)
- [x] T052 [P] [US2] Add delete confirmation messages to apps/web-antd/src/locales/langs/en-US/manufacture.json (material.delete section)
- [x] T053 [P] [US2] Add success/error messages to apps/web-antd/src/locales/langs/zh-CN/manufacture.json (material.messages section)
- [x] T054 [P] [US2] Add success/error messages to apps/web-antd/src/locales/langs/en-US/manufacture.json (material.messages section)
- [x] T054a [P] [US2] Add report button label and confirmation dialog messages to apps/web-antd/src/locales/langs/zh-CN/manufacture.json (material.report section)
- [x] T054b [P] [US2] Add report button label and confirmation dialog messages to apps/web-antd/src/locales/langs/en-US/manufacture.json (material.report section)
- [x] T054c [P] [US2] Add report success/error messages to apps/web-antd/src/locales/langs/zh-CN/manufacture.json (material.report section)
- [x] T054d [P] [US2] Add report success/error messages to apps/web-antd/src/locales/langs/en-US/manufacture.json (material.report section)

#### Import Dialog Component

- [x] T055 [US2] Create ImportDialog component in apps/web-antd/src/views/manufacture/baseData/supplier-pro-material-data/components/ImportDialog.vue
- [x] T056 [US2] Implement file upload using Ant Design Vue Upload component in ImportDialog.vue
- [x] T057 [US2] Add "Download Template" button that calls downloadTemplateApi in ImportDialog.vue
- [x] T058 [US2] Implement file selection and upload handling in ImportDialog.vue
- [x] T059 [US2] Display import results (totalRows, successCount, failedCount, errors) in ImportDialog.vue
- [x] T060 [US2] Emit success event on successful import in ImportDialog.vue
- [x] T061 [US2] Emit update:visible event for dialog visibility control in ImportDialog.vue

#### Export Dialog Component

- [x] T062 [US2] Create ExportDialog component in apps/web-antd/src/views/manufacture/baseData/supplier-pro-material-data/components/ExportDialog.vue
- [x] T063 [US2] Implement column selection table with three columns (Checkbox, Attribute Name, Table Column Name) in ExportDialog.vue
- [x] T064 [US2] Set all column checkboxes checked by default in ExportDialog.vue
- [x] T065 [US2] Implement export mode selection (全部/All, 分页/Paginated) with default "全部" in ExportDialog.vue
- [x] T066 [US2] Add page size and page number inputs (visible when paginated mode selected) in ExportDialog.vue
- [x] T067 [US2] Add file name input with default value "物料主数据" in ExportDialog.vue
- [x] T068 [US2] Implement export functionality that calls exportMaterialApi with selected columns and config in ExportDialog.vue
- [x] T069 [US2] Handle file download response in ExportDialog.vue
- [x] T070 [US2] Emit update:visible event for dialog visibility control in ExportDialog.vue

#### Delete Functionality

- [x] T071 [US2] Implement delete button enable/disable logic based on row selection in index.vue using gridApi.getCheckboxRecords()
- [x] T072 [US2] Implement handleDelete function that shows confirmation dialog using Modal.confirm in index.vue
- [x] T073 [US2] Implement delete confirmation that calls deleteMaterialApi with selected IDs in index.vue
- [x] T074 [US2] Refresh table after successful deletion using gridApi.query() in index.vue
- [x] T075 [US2] Show success/error messages after delete operation in index.vue

#### Report Functionality

- [x] T075a [US2] Add Report button above the data table in apps/web-antd/src/views/manufacture/baseData/supplier-pro-material-data/index.vue
- [x] T075b [US2] Implement report confirmation dialog using Modal.confirm in index.vue
- [x] T075c [US2] Implement report API call when user confirms in index.vue
- [x] T075d [US2] Add loading state and disable Report button during API call in index.vue
- [x] T075e [US2] Display success message when report API call succeeds in index.vue
- [x] T075f [US2] Display error message when report API call fails in index.vue
- [x] T075g [US2] Ensure Report button enable/disable logic matches Delete button exactly (disabled when no rows selected, enabled when rows selected) in apps/web-antd/src/views/manufacture/baseData/supplier-pro-material-data/index.vue
- [x] T075h [US2] Implement consistent visual spacing (8px gap) between all action buttons (Import, Export, Delete, Report) in apps/web-antd/src/views/manufacture/baseData/supplier-pro-material-data/index.vue

#### Integration

- [x] T076 [US2] Integrate ImportDialog component in index.vue with import button in toolbar
- [x] T077 [US2] Handle import success event to refresh table using gridApi.query() in index.vue
- [x] T078 [US2] Integrate ExportDialog component in index.vue with export button in toolbar
- [x] T079 [US2] Pass current search params to ExportDialog for export filtering in index.vue
- [x] T080 [US2] Enable Import, Export, Delete buttons in toolbar (remove disabled state) in index.vue
- [x] T080a [US2] Integrate report functionality into main page component (open confirmation dialog on Report button click) in apps/web-antd/src/views/manufacture/baseData/supplier-pro-material-data/index.vue
- [x] T080b [US2] Add error handling for report operation in index.vue

**Checkpoint**: At this point, User Story 2 should be fully functional and testable independently. Users can import, export, delete, and report Material Master Data records.

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T081 [P] Run TypeScript type checking: `pnpm check:type` to verify all type definitions are correct
- [x] T082 [P] Run ESLint and Prettier checks: `pnpm lint` to ensure code quality
- [x] T083 [P] Verify table checkbox column is displayed in first position with no sequence column
- [x] T084 [P] Verify search form width is 100% (w-full class applied)
- [x] T085 [P] Verify search panel is collapsed by default on page load
- [x] T086 [P] Test search panel expand/collapse functionality
- [x] T087 [P] Verify all table functions (selection, sorting, pagination) work correctly
- [x] T088 [P] Test table functionality with empty data list
- [x] T089 [P] Test search form width responsiveness on different screen sizes
- [x] T090 [P] Verify search panel state resets to collapsed on page refresh
- [x] T091 [P] Test import functionality with valid and invalid files
- [x] T092 [P] Test export functionality with different column selections and export modes
- [x] T093 [P] Test delete functionality with single and multiple row selections
- [x] T094 [P] Verify all i18n translations are correctly applied (Chinese and English)
- [x] T095 [P] Code review: Verify compliance with constitution principles
- [x] T096 Run quickstart.md validation checklist

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Story 1 (Phase 3)**: Depends on Foundational phase completion
- **User Story 2 (Phase 4)**: Depends on User Story 1 completion (uses table and gridApi)
- **Polish (Phase 5)**: Depends on User Story 1 and User Story 2 completion

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Depends on User Story 1 completion - Uses table component and gridApi from US1

### Within Each User Story

- Tests (if included) MUST be written and FAIL before implementation
- Backend API endpoints before frontend API functions
- Frontend API functions before UI components
- i18n translations can be done in parallel with implementation
- Core implementation before integration

### Parallel Opportunities

- **Phase 1**: T002, T003 can run in parallel
- **Phase 2**: T005, T006, T008 can run in parallel
- **Phase 3**: 
  - Backend API (T011) and Frontend API (T014) can run in parallel
  - i18n translations (T016-T019) can run in parallel
  - Tests (T009-T010) can run in parallel
- **Phase 4**:
  - Backend API endpoints (T038-T041, T041a) can run in parallel
  - Frontend API functions (T042-T045, T045a) can run in parallel
  - i18n translations (T047-T054, T054a-T054d) can run in parallel
  - ImportDialog and ExportDialog components can be developed in parallel
  - Tests (T035-T037, T037a) can run in parallel
- **Phase 5**: All tasks marked [P] can run in parallel

---

## Parallel Example: User Story 1

```bash
# Backend and Frontend API can be developed in parallel:
Task: "Create GET endpoint for Material list in apps/backend-mock/api/manufacture/material/list.get.ts"
Task: "Create API function getMaterialListApi in apps/web-antd/src/api/manufacture/material.ts"

# i18n translations can be done in parallel:
Task: "Add search form field labels to apps/web-antd/src/locales/langs/zh-CN/manufacture.json"
Task: "Add search form field labels to apps/web-antd/src/locales/langs/en-US/manufacture.json"
Task: "Add table column headers to apps/web-antd/src/locales/langs/zh-CN/manufacture.json"
Task: "Add table column headers to apps/web-antd/src/locales/langs/en-US/manufacture.json"
```

---

## Parallel Example: User Story 2

```bash
# Backend API endpoints can be developed in parallel:
Task: "Create GET endpoint for template download in apps/backend-mock/api/manufacture/material/template.get.ts"
Task: "Create POST endpoint for import in apps/backend-mock/api/manufacture/material/import.post.ts"
Task: "Create POST endpoint for export in apps/backend-mock/api/manufacture/material/export.post.ts"
Task: "Create POST endpoint for delete in apps/backend-mock/api/manufacture/material/delete.post.ts"
Task: "Create POST endpoint for report in apps/backend-mock/api/manufacture/material/report.post.ts"

# Frontend API functions can be developed in parallel:
Task: "Add importMaterialApi function in apps/web-antd/src/api/manufacture/material.ts"
Task: "Add exportMaterialApi function in apps/web-antd/src/api/manufacture/material.ts"
Task: "Add deleteMaterialApi function in apps/web-antd/src/api/manufacture/material.ts"
Task: "Add downloadTemplateApi function in apps/web-antd/src/api/manufacture/material.ts"
Task: "Add reportMaterialApi function in apps/web-antd/src/api/manufacture/material.ts"

# Dialog components can be developed in parallel:
Task: "Create ImportDialog component in apps/web-antd/src/views/manufacture/baseData/supplier-pro-material-data/components/ImportDialog.vue"
Task: "Create ExportDialog component in apps/web-antd/src/views/manufacture/baseData/supplier-pro-material-data/components/ExportDialog.vue"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup - Create directory structure
2. Complete Phase 2: Foundational - Create types, mock data, routes, i18n
3. Complete Phase 3: User Story 1
   - Backend mock API for list
   - Frontend API functions
   - Main page component with useVbenVxeGrid
   - Search form and table display
4. **STOP and VALIDATE**: Test User Story 1 independently
   - Verify table displays correctly
   - Verify search functionality works
   - Verify UI optimizations (checkbox first, no sequence, 100% width, collapsed search)
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Add Polish → Final validation and deployment

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 (Backend API + Frontend API + Main page)
   - Developer B: User Story 2 (Backend APIs + Frontend APIs + Dialog components)
3. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [US1], [US2] labels map tasks to specific user stories for traceability
- Each user story should be independently completable and testable
- User Story 2 depends on User Story 1 (uses table and gridApi)
- Verify tests fail before implementing
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- All modifications follow monorepo structure (apps/web-antd and apps/backend-mock)
- Use useVbenVxeGrid for table functionality (reference: playground/src/views/examples/vxe-table/form.vue)
- Use unified response format via usePageResponseSuccess in mock services
- Avoid: vague tasks, breaking existing functionality, introducing circular dependencies

---

## Task Summary

- **Total Tasks**: 116
- **Phase 1 (Setup)**: 3 tasks
- **Phase 2 (Foundational)**: 5 tasks
- **Phase 3 (User Story 1)**: 26 tasks (24 implementation + 2 optional tests)
- **Phase 4 (User Story 2)**: 70 tasks (62 implementation + 4 optional tests + 4 i18n for report)
- **Phase 5 (Polish)**: 12 tasks

**Parallel Opportunities**: 50+ tasks can be executed in parallel

**Suggested MVP Scope**: Phase 1 + Phase 2 + Phase 3 (User Story 1) = 34 tasks

