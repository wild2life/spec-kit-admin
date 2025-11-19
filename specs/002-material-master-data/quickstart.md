# Quick Start Guide: Material Master Data Page

**Date**: 2025-01-27  
**Feature**: Material Master Data Page  
**Phase**: 1 - Design

## Overview

This guide provides step-by-step instructions for implementing the Material Master Data page feature. Follow these steps in order to build the feature incrementally using `useVbenVxeGrid` for table functionality.

## Prerequisites

- Node.js >= 20.10.0
- pnpm >= 9.12.0
- Understanding of Vue 3 Composition API
- Familiarity with Ant Design Vue components
- Understanding of `useVbenVxeGrid` composable (reference: `playground/src/views/examples/vxe-table/form.vue`)
- Access to the monorepo codebase

## Implementation Steps

### Step 1: Setup Route and Menu Structure

1. **Update route module** (`apps/web-antd/src/router/routes/modules/manufacture.ts`):
   - Add route: `/manufacture/baseData/supplier_pro_material_data`
   - Add menu metadata: "生产质量/生产质量数据/物料主数据"
   - Configure lazy loading for the page component

2. **Update menu API** (`apps/backend-mock/utils/mock-data.ts`):
   - Add menu item to mock menu data
   - Ensure menu structure matches route hierarchy

**Validation**: Navigate to the route and verify menu appears in sidebar.

---

### Step 2: Create Main Page Component with useVbenVxeGrid

1. **Create page component** (`apps/web-antd/src/views/manufacture/baseData/supplier-pro-material-data/index.vue`):
   - Import `useVbenVxeGrid` from `#/adapter/vxe-table`
   - Import `VbenFormProps` and `VxeTableGridOptions` types
   - Set up basic component structure

2. **Configure search form** (`formOptions`):
   - Set `collapsed: true` (default collapsed)
   - Set `wrapperClass: 'w-full'` (100% width)
   - Define `schema` array with 8 search fields:
     - 事业部 (Select)
     - 供应商 (Select)
     - 供应商名称 (Input)
     - 奇瑞零件名称 (Input)
     - 供应商总成零件名称 (Input)
     - 项目名称 (Input)
     - 工厂名称 (Input)
     - 芯片MPN标识名称 (Input)
   - Set `showCollapseButton: true`
   - Set `submitOnChange: false`

3. **Configure table** (`gridOptions`):
   - Define `columns` array with 26 columns
   - First column: checkbox (`type: 'checkbox'`, `fixed: 'left'`)
   - Second column: 奇瑞零件号 (`fixed: 'left'`)
   - No sequence column
   - Configure `proxyConfig.ajax.query` to call API
   - Configure `toolbarConfig` for export, refresh, search, zoom

4. **Initialize grid**:
   ```typescript
   const [Grid, gridApi] = useVbenVxeGrid({ formOptions, gridOptions });
   ```

**Validation**: Page loads, search form is collapsed by default, table displays (with mock data or empty state).

---

### Step 3: Implement Mock API Endpoints

1. **Create mock data generator** (`apps/backend-mock/utils/mock-material-data.ts`):
   - Generate 100-1000 mock Material Master Data records
   - Include all 26 required fields
   - Use realistic Chinese data

2. **Create API endpoints** (`apps/backend-mock/api/manufacture/material/`):
   - `list.get.ts`: Handle GET request with search and pagination
     - Use `usePageResponseSuccess` for unified response format
     - Implement filtering logic for all search fields
     - Support pagination and sorting
   - `template.get.ts`: Return Excel template file
   - `import.post.ts`: Handle file upload and import
   - `export.post.ts`: Generate and return export file
   - `delete.post.ts`: Handle delete operation

**Validation**: API endpoints return correct response format, list API supports search and pagination.

---

### Step 4: Create API Client Functions

1. **Create API file** (`apps/web-antd/src/api/manufacture/material.ts`):
   - Define TypeScript interfaces: `MaterialRecord`, `MaterialListParams`, `ImportResult`, etc.
   - Implement `getMaterialListApi(params: MaterialListParams)`
   - Implement `importMaterialApi(file: File)`
   - Implement `exportMaterialApi(config: ExportConfig)`
   - Implement `deleteMaterialApi(ids: string[])`
   - Implement `downloadTemplateApi()`

2. **Update main page component**:
   - Import API functions
   - Update `proxyConfig.ajax.query` to use `getMaterialListApi`
   - Handle API responses correctly

**Validation**: API calls work, data displays in table, search and pagination work.

---

### Step 5: Implement Import Dialog

1. **Create ImportDialog component** (`apps/web-antd/src/views/manufacture/baseData/supplier-pro-material-data/components/ImportDialog.vue`):
   - Use Ant Design Vue `a-upload` component
   - Add "Download Template" button
   - Handle file selection and upload
   - Display import results (success count, failed count, errors)
   - Emit `success` event on successful import
   - Emit `update:visible` for dialog visibility

2. **Integrate with main page**:
   - Add import button in toolbar
   - Open ImportDialog on click
   - Refresh table on successful import: `gridApi.query()`

**Validation**: Import dialog opens, template downloads, file uploads, results display, table refreshes.

---

### Step 6: Implement Export Dialog

1. **Create ExportDialog component** (`apps/web-antd/src/views/manufacture/baseData/supplier-pro-material-data/components/ExportDialog.vue`):
   - Display column selection table (checkbox, attribute name, table column name)
   - All columns checked by default
   - Export mode selection: "全部" (All) or "分页" (Paginated)
   - Page size and page number inputs (if paginated)
   - File name input (default: "物料主数据")
   - Handle export and file download
   - Emit `update:visible` for dialog visibility

2. **Integrate with main page**:
   - Add export button in toolbar
   - Open ExportDialog on click
   - Pass current search params to export API

**Validation**: Export dialog opens, column selection works, export modes work, file downloads.

---

### Step 7: Implement Delete Functionality

1. **Update main page component**:
   - Add delete button in toolbar
   - Get selected rows: `gridApi.getCheckboxRecords()`
   - Show confirmation dialog using `Modal.confirm`
   - Call `deleteMaterialApi` with selected IDs
   - Refresh table on success: `gridApi.query()`
   - Show success/error messages

**Validation**: Delete button enables/disables based on selection, confirmation works, deletion works, table refreshes.

---

### Step 8: Add i18n Translations

1. **Update Chinese translations** (`apps/web-antd/src/locales/langs/zh-CN/manufacture.json`):
   - Add `material` section with:
     - `title`: "物料主数据"
     - `search`: All search field labels
     - `table`: All table column titles
     - `import`: Import dialog labels
     - `export`: Export dialog labels
     - `delete`: Delete confirmation messages
     - `messages`: Success/error messages

2. **Update English translations** (`apps/web-antd/src/locales/langs/en-US/manufacture.json`):
   - Add corresponding English translations

**Validation**: All text displays correctly in both languages.

---

### Step 9: Verify UI Optimizations

1. **Verify table configuration**:
   - Checkbox column is first column
   - No sequence column displayed
   - First two columns are fixed when scrolling horizontally

2. **Verify search form configuration**:
   - Search form width is 100% (w-full class)
   - Search panel is collapsed by default
   - Search panel can be expanded/collapsed

3. **Verify all functionality**:
   - Search works correctly
   - Pagination works correctly
   - Row selection works correctly
   - Import/export/delete work correctly

**Validation**: All UI optimizations are correctly implemented and functional.

---

### Step 10: Testing

1. **Unit tests** (`apps/web-antd/src/__tests__/manufacture/material.test.ts`):
   - Test API functions
   - Test utility functions
   - Test data transformations

2. **E2E tests** (Playwright):
   - Test page navigation
   - Test search functionality
   - Test import/export/delete workflows
   - Test UI optimizations

**Validation**: All tests pass.

---

## Key Implementation Patterns

### useVbenVxeGrid Pattern

```typescript
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import type { VbenFormProps } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';

const formOptions: VbenFormProps = {
  collapsed: true,
  wrapperClass: 'w-full',
  schema: [/* search fields */],
  showCollapseButton: true,
  submitOnChange: false,
};

const gridOptions: VxeTableGridOptions<MaterialRecord> = {
  columns: [
    {
      field: 'id',
      type: 'checkbox',
      fixed: 'left',
      width: 60,
    },
    {
      field: 'cheryPartNumber',
      fixed: 'left',
      title: $t('manufacture.material.table.cheryPartNumber'),
      width: 150,
    },
    // ... other columns
  ],
  proxyConfig: {
    ajax: {
      query: async ({ page }, formValues) => {
        return await getMaterialListApi({
          page: page.currentPage,
          pageSize: page.pageSize,
          ...formValues,
        });
      },
    },
  },
};

const [Grid, gridApi] = useVbenVxeGrid({ formOptions, gridOptions });
```

### Unified Response Format

Backend mock services use `usePageResponseSuccess`:

```typescript
import { usePageResponseSuccess } from '~/utils/response';

return usePageResponseSuccess(
  String(pageNumber),
  String(pageSizeNumber),
  filteredData,
);
```

This returns:
```typescript
{
  code: 0,
  message: 'ok',
  data: {
    items: MaterialRecord[],
    total: number,
  },
  error: null,
}
```

## Troubleshooting

### Issue: Table not displaying data
- Check API response format matches `{ items: T[], total: number }`
- Verify `proxyConfig.ajax.query` is correctly configured
- Check browser console for errors

### Issue: Search form not working
- Verify `formOptions.schema` is correctly configured
- Check field names match API parameter names
- Verify `submitOnChange` and `submitOnEnter` settings

### Issue: UI optimizations not applied
- Verify `collapsed: true` in `formOptions`
- Verify `wrapperClass: 'w-full'` in `formOptions`
- Verify checkbox column is first in `columns` array
- Verify no sequence column in `columns` array

## Next Steps

1. Run code quality checks: `pnpm lint`, `pnpm check:type`
2. Run tests: `pnpm test:unit`, `pnpm test:e2e`
3. Manual testing in browser
4. Code review
5. Deploy to test environment

