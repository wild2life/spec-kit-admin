# Quick Start Guide: EDI Backend Management - BOM Master Data

**Date**: 2025-11-19  
**Feature**: EDI Backend Management Project  
**Phase**: 1 - Design

## Overview

This guide provides step-by-step instructions for implementing the EDI Backend Management BOM Master Data feature. Follow these steps in order to build the feature incrementally.

## Prerequisites

- Node.js >= 20.10.0
- pnpm >= 9.12.0
- Understanding of Vue 3 Composition API
- Familiarity with Ant Design Vue components
- Access to the monorepo codebase

## Implementation Steps

### Step 1: Setup Route and Menu Structure

1. **Create route module** (`apps/web-antd/src/router/routes/modules/manufacture.ts`):
   - Define route structure: `/manufacture/baseData/sqe_supplier_bom`
   - Add menu metadata: "生产质量/生产质量数据/BOM主数据"
   - Configure lazy loading for the page component

2. **Update menu API** (`apps/backend-mock/api/menu/all.ts`):
   - Add menu item to mock menu data
   - Ensure menu structure matches route hierarchy

**Validation**: Navigate to the route and verify menu appears in sidebar.

---

### Step 2: Create Basic Page Component

1. **Create page component** (`apps/web-antd/src/views/manufacture/baseData/sqe-supplier-bom/index.vue`):
   - Basic Vue 3 Composition API setup
   - Import Ant Design Vue components
   - Add page title and layout structure
   - Placeholder for search form and table

**Validation**: Page loads without errors, displays basic layout.

---

### Step 3: Implement Search Form

1. **Create SearchForm component** (`apps/web-antd/src/views/manufacture/baseData/sqe-supplier-bom/components/SearchForm.vue`):
   - Use `a-form` with `a-form-item` for each search field
   - Implement select components for 事业部 and 供应商
   - Implement input components for text fields
   - Implement `a-range-picker` for date fields with presets
   - Add search and reset buttons
   - Implement debounced search (300-500ms)

2. **Add i18n translations** (`apps/web-antd/src/locales/langs/zh-CN/manufacture.json` and `en-US/manufacture.json`):
   - Add all search field labels
   - Add button labels (Search, Reset)
   - Add date preset labels

**Validation**: Search form displays all fields, date pickers show presets, debouncing works.

---

### Step 4: Implement Data Table

1. **Create DataTable component** (`apps/web-antd/src/views/manufacture/baseData/sqe-supplier-bom/components/DataTable.vue`):
   - Use `a-table` component
   - Define all table columns
   - Set first column (checkbox) and second column (事业部编号) as fixed
   - Implement row selection with checkboxes
   - Add pagination
   - Add loading state

2. **Implement table data fetching**:
   - Create API function (`apps/web-antd/src/api/manufacture/bom.ts`)
   - Use `requestClient.get()` to fetch data
   - Handle pagination and search parameters
   - Update table when search criteria change

**Validation**: Table displays data, fixed columns work, pagination works, row selection works.

---

### Step 5: Implement Mock API Endpoints

1. **Create mock data generator** (`apps/backend-mock/utils/mock-bom-data.ts`):
   - Generate 100-1000 mock BOM records
   - Include all required fields
   - Use realistic Chinese data

2. **Create API endpoints** (`apps/backend-mock/api/manufacture/bom/`):
   - `list.get.ts`: Handle GET request with search and pagination
   - `template.get.ts`: Return Excel template file
   - `import.post.ts`: Handle file upload and import
   - `export.post.ts`: Generate and return export file
   - `delete.post.ts`: Handle delete operation

**Validation**: All API endpoints return correct data format, search filtering works.

---

### Step 6: Implement Import Functionality

1. **Create ImportDialog component** (`apps/web-antd/src/views/manufacture/baseData/sqe-supplier-bom/components/ImportDialog.vue`):
   - Use `a-modal` for dialog
   - Add `a-upload` component for file selection
   - Add "Download Template" button/link
   - Implement file validation (type, size)
   - Show import progress and results
   - Display error messages for failed rows

2. **Add import API function** (`apps/web-antd/src/api/manufacture/bom.ts`):
   - `importBomApi()`: Upload file and handle response
   - `downloadTemplateApi()`: Download template file

**Validation**: Can download template, can upload file, import results display correctly.

---

### Step 7: Implement Export Functionality

1. **Create ExportDialog component** (`apps/web-antd/src/views/manufacture/baseData/sqe-supplier-bom/components/ExportDialog.vue`):
   - Use `a-modal` for dialog
   - Add `a-table` showing all columns with checkboxes
   - Default: all columns checked
   - Add export mode selection (全部/分页)
   - Add page size and page number inputs (if paginated)
   - Add file name input (default: "BOM主数据")
   - Implement export logic

2. **Add export API function** (`apps/web-antd/src/api/manufacture/bom.ts`):
   - `exportBomApi()`: Send export configuration, receive file blob
   - Trigger browser download

**Validation**: Export dialog shows all columns, can select columns, export generates correct file.

---

### Step 8: Implement Delete Functionality

1. **Update DataTable component**:
   - Add Delete button above table
   - Enable/disable based on selected rows
   - Implement delete confirmation using `Modal.confirm()`

2. **Add delete API function** (`apps/web-antd/src/api/manufacture/bom.ts`):
   - `deleteBomApi()`: Send selected IDs, handle response

3. **Update main page component**:
   - Handle delete success/error
   - Refresh table after deletion

**Validation**: Delete button enables/disables correctly, confirmation works, deletion succeeds.

---

### Step 9: Add Action Buttons

1. **Update main page component**:
   - Add Import, Export, Delete buttons above table
   - Position buttons consistently with design
   - Wire up button click handlers

**Validation**: All buttons visible, click handlers work, buttons positioned correctly.

---

### Step 10: Polish and Testing

1. **Add error handling**:
   - Handle API errors gracefully
   - Show user-friendly error messages
   - Handle network errors

2. **Add loading states**:
   - Show loading indicators during API calls
   - Disable buttons during operations

3. **Add success messages**:
   - Show success notifications after operations
   - Use Ant Design Vue `message` component

4. **Write unit tests** (`apps/web-antd/src/__tests__/manufacture/bom.test.ts`):
   - Test API functions
   - Test data transformation utilities
   - Test form validation logic

5. **Write E2E tests** (Playwright):
   - Test user authentication flow
   - Test search and filter operations
   - Test import/export workflows
   - Test delete operations

**Validation**: All features work end-to-end, tests pass, no console errors.

---

## File Checklist

### Frontend Files
- [ ] `apps/web-antd/src/router/routes/modules/manufacture.ts`
- [ ] `apps/web-antd/src/views/manufacture/baseData/sqe-supplier-bom/index.vue`
- [ ] `apps/web-antd/src/views/manufacture/baseData/sqe-supplier-bom/components/SearchForm.vue`
- [ ] `apps/web-antd/src/views/manufacture/baseData/sqe-supplier-bom/components/DataTable.vue`
- [ ] `apps/web-antd/src/views/manufacture/baseData/sqe-supplier-bom/components/ImportDialog.vue`
- [ ] `apps/web-antd/src/views/manufacture/baseData/sqe-supplier-bom/components/ExportDialog.vue`
- [ ] `apps/web-antd/src/api/manufacture/bom.ts`
- [ ] `apps/web-antd/src/locales/langs/zh-CN/manufacture.json`
- [ ] `apps/web-antd/src/locales/langs/en-US/manufacture.json`
- [ ] `apps/web-antd/src/__tests__/manufacture/bom.test.ts`

### Backend Mock Files
- [ ] `apps/backend-mock/api/manufacture/bom/list.get.ts`
- [ ] `apps/backend-mock/api/manufacture/bom/template.get.ts`
- [ ] `apps/backend-mock/api/manufacture/bom/import.post.ts`
- [ ] `apps/backend-mock/api/manufacture/bom/export.post.ts`
- [ ] `apps/backend-mock/api/manufacture/bom/delete.post.ts`
- [ ] `apps/backend-mock/utils/mock-bom-data.ts`
- [ ] `apps/backend-mock/api/menu/all.ts` (update existing)

## Testing Checklist

### Unit Tests
- [ ] API functions handle errors correctly
- [ ] Data transformation utilities work correctly
- [ ] Form validation logic works correctly

### E2E Tests
- [ ] User can log in and navigate to BOM page
- [ ] User can search and filter data
- [ ] User can import data from file
- [ ] User can export data with custom columns
- [ ] User can delete selected records
- [ ] Table fixed columns work correctly
- [ ] Date picker presets work correctly

## Common Issues and Solutions

### Issue: Fixed columns not working
**Solution**: Ensure `fixed: 'left'` is set on column definition and table has `scroll={{ x: true }}`

### Issue: Date picker presets not showing
**Solution**: Ensure `presets` prop is passed to `a-range-picker` with correct format

### Issue: Import file validation failing
**Solution**: Check file type and size limits, ensure MIME type is correct

### Issue: Export file not downloading
**Solution**: Ensure blob is created correctly and `URL.createObjectURL()` is used

### Issue: Delete button not enabling
**Solution**: Check `selectedRowKeys` is updating correctly, ensure computed property is reactive

## Next Steps After Implementation

1. Code review for compliance with constitution
2. Run linting and type checking: `pnpm lint && pnpm check:type`
3. Run tests: `pnpm test:unit && pnpm test:e2e`
4. Performance testing with large datasets
5. Accessibility audit
6. Documentation updates

