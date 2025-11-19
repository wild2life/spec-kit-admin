# Research: EDI Backend Management - BOM Master Data

**Date**: 2025-11-19  
**Feature**: EDI Backend Management Project  
**Phase**: 0 - Research & Technology Decisions

## Technology Stack Decisions

### Frontend Framework: Vue 3 Composition API

**Decision**: Use Vue 3 with Composition API (already established in project)

**Rationale**: 
- Project already uses Vue 3.5+ with Composition API
- Composition API provides better code organization and reusability
- Consistent with existing codebase patterns
- TypeScript support is excellent

**Alternatives considered**: 
- Options API: Rejected - less type-safe and harder to organize complex logic
- React: Not applicable - project is Vue-based

### UI Component Library: Ant Design Vue

**Decision**: Use Ant Design Vue components (already established in project)

**Rationale**:
- Project already uses Ant Design Vue in `apps/web-antd`
- Provides comprehensive table, form, and dialog components needed for this feature
- Consistent design system
- Excellent TypeScript support
- Built-in i18n support

**Alternatives considered**:
- Element Plus: Not applicable - project uses Ant Design Vue
- Custom components: Rejected - would violate UX consistency principle

### Table Component: Ant Design Vue Table with Fixed Columns

**Decision**: Use `a-table` component with `fixed` prop for first two columns

**Rationale**:
- Ant Design Vue Table supports fixed columns natively via `columns[].fixed` prop
- First column (checkbox) and second column (Business Unit Code) will be fixed
- Supports horizontal scrolling with fixed columns
- Built-in row selection via `row-selection` prop

**Implementation Pattern**:
```typescript
const columns = [
  { 
    title: '', 
    dataIndex: 'selection', 
    fixed: 'left',
    width: 60,
    // Custom checkbox render
  },
  { 
    title: '事业部编号', 
    dataIndex: 'businessUnitCode', 
    fixed: 'left',
    width: 120 
  },
  // ... other columns without fixed
]
```

**Alternatives considered**:
- VXE Table: Rejected - project uses Ant Design Vue for consistency
- Custom table implementation: Rejected - unnecessary complexity

### Search Form: Ant Design Vue Form with Debouncing

**Decision**: Use `a-form` with `a-form-item` and debounced search input

**Rationale**:
- Ant Design Vue Form provides validation and layout capabilities
- Debouncing reduces API calls during typing
- Supports various input types: `a-input`, `a-select`, `a-date-picker`
- Consistent with existing form patterns

**Implementation Pattern**:
- Use `useDebounceFn` from VueUse or custom composable
- Debounce delay: 300-500ms for search inputs
- Date pickers use `a-range-picker` with presets

**Alternatives considered**:
- Immediate search on every keystroke: Rejected - performance impact
- Manual search button only: Rejected - poor UX

### Date Picker Range Presets

**Decision**: Use Ant Design Vue `a-range-picker` with `presets` prop

**Rationale**:
- Ant Design Vue RangePicker supports presets natively
- Provides quick access to common date ranges
- Consistent with requirement: Today, Last 3 Days, Last Week, Last 30 Days, Last 90 Days

**Implementation Pattern**:
```typescript
const rangePresets = [
  { label: '今天', value: () => [dayjs(), dayjs()] },
  { label: '近三天', value: () => [dayjs().subtract(2, 'day'), dayjs()] },
  { label: '近一周', value: () => [dayjs().subtract(6, 'day'), dayjs()] },
  { label: '近30天', value: () => [dayjs().subtract(29, 'day'), dayjs()] },
  { label: '近90天', value: () => [dayjs().subtract(89, 'day'), dayjs()] },
]
```

**Alternatives considered**:
- Custom date picker: Rejected - unnecessary when built-in supports presets

### Import/Export Functionality

**Decision**: 
- Import: Use `a-upload` component with file validation
- Export: Custom dialog with column selection using `a-table` and `a-checkbox`

**Rationale**:
- Ant Design Vue Upload component handles file selection and validation
- Custom export dialog provides flexibility for column selection
- File download via browser download API or blob URLs
- Excel/CSV parsing can use libraries like `xlsx` or `papaparse` if needed

**Implementation Pattern**:
- Import: `a-upload` with `beforeUpload` for validation, `customRequest` for API call
- Export: POST request to backend, receive blob, trigger download
- Template download: Direct link to template file or API endpoint

**Alternatives considered**:
- Third-party import/export libraries: Considered but not needed for MVP
- Server-side file processing only: Rejected - client-side validation improves UX

### Routing Pattern

**Decision**: Use existing Vue Router pattern with route modules

**Rationale**:
- Project uses route modules in `router/routes/modules/`
- Route path: `/manufacture/baseData/sqe_supplier_bom`
- Menu structure: "生产质量/生产质量数据/BOM主数据"
- Lazy loading via `() => import(...)` for code splitting

**Implementation Pattern**:
```typescript
// router/routes/modules/manufacture.ts
{
  name: 'Manufacture',
  path: '/manufacture',
  meta: { title: '生产质量', icon: '...' },
  children: [
    {
      name: 'BaseData',
      path: 'baseData', // Relative path for nested route: /manufacture/baseData
      meta: { title: '生产质量数据' },
      children: [
        {
          name: 'SqeSupplierBom',
          path: 'sqe_supplier_bom', // Relative path for nested route: /manufacture/baseData/sqe_supplier_bom
          component: () => import('#/views/manufacture/baseData/sqe-supplier-bom/index.vue'),
          meta: { title: 'BOM主数据' }
        }
      ]
    }
  ]
}
```

**Alternatives considered**:
- Flat routing: Rejected - doesn't match menu hierarchy
- Dynamic routing only: Rejected - static routes needed for menu structure

### API Pattern

**Decision**: Use existing request client pattern with TypeScript types

**Rationale**:
- Project uses `requestClient` from `#/api/request`
- Type-safe API functions with TypeScript
- Consistent error handling
- Mock services in `apps/backend-mock` using Nitro/H3

**Implementation Pattern**:
```typescript
// api/manufacture/bom.ts
export async function getBomListApi(params: BomListParams) {
  return requestClient.get<BomListResponse>('/manufacture/bom/list', { params });
}

// backend-mock/api/manufacture/bom/list.get.ts
export default eventHandler(async (event) => {
  const params = getQuery(event);
  // ... mock data logic
  return useResponseSuccess(data);
});
```

**Alternatives considered**:
- GraphQL: Rejected - REST API pattern already established
- tRPC: Rejected - REST API pattern already established

### Report Functionality Pattern

**Decision**: Use confirmation dialog pattern with API call for data reporting, with enable/disable logic matching delete button

**Rationale**:
- Report operation is critical and should require user confirmation
- Ant Design Vue Modal.confirm provides standard confirmation dialog pattern
- Follows existing delete confirmation pattern for consistency
- API call pattern matches existing import/export/delete operations
- Loading state prevents duplicate submissions
- Report button enable/disable logic must match delete button for consistency (disabled when no rows selected, enabled when rows selected)
- Both delete and report buttons must show confirmation dialogs before executing actions

**Implementation Pattern**:
```typescript
// In component
const selectedRowKeys = ref<Key[]>([]);
const reportLoading = ref(false);

// Report button disabled state matches delete button
const isReportDisabled = computed(() => selectedRowKeys.value.length === 0);

const handleReport = () => {
  Modal.confirm({
    title: '确认上报',
    content: '确定要上报当前数据吗？',
    onOk: async () => {
      try {
        reportLoading.value = true;
        await reportBomApi();
        message.success('上报成功');
      } catch (error) {
        message.error('上报失败：' + error.message);
      } finally {
        reportLoading.value = false;
      }
    },
  });
};

// API function
export async function reportBomApi(params?: { recordIds?: string[] }) {
  return requestClient.post<ReportResponse>('/manufacture/bom/report', params);
}
```

**Alternatives considered**:
- Direct API call without confirmation: Rejected - report is critical operation, needs user confirmation
- Separate report dialog component: Rejected - simple confirmation is sufficient, Modal.confirm is standard pattern

### Button Layout and Spacing Pattern

**Decision**: Maintain consistent visual spacing between all action buttons (Import, Export, Delete, Report)

**Rationale**:
- Consistent spacing improves visual hierarchy and user experience
- Follows Ant Design Vue spacing guidelines
- All action buttons should have uniform spacing for professional appearance
- Spacing should be consistent across all pages in the application

**Implementation Pattern**:
```vue
<template>
  <div class="action-buttons">
    <Button type="primary" @click="handleImport">导入</Button>
    <Button @click="handleExport">导出</Button>
    <Button danger @click="handleDelete" :disabled="isDeleteDisabled">删除</Button>
    <Button :loading="reportLoading" @click="handleReport" :disabled="isReportDisabled">
      上报
    </Button>
  </div>
</template>

<style scoped>
.action-buttons {
  display: flex;
  gap: 8px; /* Consistent spacing between all buttons */
}
</style>
```

### State Management

**Decision**: Use composables for local component state, Pinia only if needed for global state

**Rationale**:
- Most state is local to the BOM page component
- Use Vue 3 `ref`, `reactive`, `computed` for local state
- Pinia stores only for shared state (e.g., user info, menu)
- Follows existing patterns in codebase

**Implementation Pattern**:
```typescript
// In component
const searchForm = ref<SearchFormData>({ ... });
const tableData = ref<BomRecord[]>([]);
const loading = ref(false);
const selectedRowKeys = ref<Key[]>([]);
```

**Alternatives considered**:
- Pinia store for all state: Rejected - overkill for local component state
- Vuex: Rejected - project uses Pinia

### Internationalization (i18n)

**Decision**: Use existing i18n system with locale files

**Rationale**:
- Project already has i18n setup in `locales/`
- Support Chinese (zh-CN) and English (en-US)
- Use `$t()` function for translations
- All user-facing text must be translatable

**Implementation Pattern**:
```typescript
// locales/langs/zh-CN/manufacture.json
{
  "bom": {
    "title": "BOM主数据",
    "search": { ... },
    "table": { ... }
  }
}

// In component
import { $t } from '#/locales';
const title = $t('manufacture.bom.title');
```

**Alternatives considered**:
- Hardcoded Chinese text: Rejected - violates i18n requirement
- Third-party i18n library: Rejected - project already has i18n system

## Performance Considerations

### Table Performance
- Use pagination to limit rendered rows (default 10-20 per page)
- Virtual scrolling not needed for typical dataset sizes (< 1000 visible rows)
- Fixed columns use CSS `position: sticky` (handled by Ant Design Vue)

### Search Performance
- Debounce search input (300-500ms)
- Server-side filtering (mock API will filter data)
- Clear search button to reset filters quickly

### Export Performance
- For large datasets, consider streaming or chunked export
- Show progress indicator for long-running exports
- Client-side export for small datasets, server-side for large

## Accessibility Considerations

- Ant Design Vue components have built-in ARIA attributes
- Ensure keyboard navigation works for table and forms
- Screen reader support for table data
- Focus management in dialogs

## Security Considerations

- File upload validation (type, size limits)
- XSS prevention (Ant Design Vue handles this)
- CSRF protection via existing request client
- Input sanitization for search queries

## Testing Strategy

### Unit Tests (Vitest)
- Test composables and utilities
- Test form validation logic
- Test data transformation functions
- Mock API calls

### E2E Tests (Playwright)
- User authentication flow
- Search and filter operations
- Import/export workflows
- Delete operations
- Table interactions (selection, pagination)

## Open Questions Resolved

1. **Q**: How to handle very large datasets in table?  
   **A**: Use pagination (server-side) and limit page size. Virtual scrolling not needed for MVP.

2. **Q**: File format for import/export?  
   **A**: Excel (.xlsx) for import template, Excel or CSV for export (user choice in export dialog).

3. **Q**: How to handle duplicate records during import?  
   **A**: Business rule: Update existing records if duplicate key found (BOM Code + Version).

4. **Q**: Delete confirmation dialog?  
   **A**: Use Ant Design Vue `Modal.confirm()` for delete confirmation. Both delete and report buttons must show confirmation dialogs before executing actions.

5. **Q**: Report button enable/disable logic?  
   **A**: Report button enable/disable logic must match delete button exactly: disabled when no rows are selected, enabled when one or more rows are selected via checkboxes.

6. **Q**: Button spacing requirements?  
   **A**: All action buttons (Import, Export, Delete, Report) must maintain consistent visual spacing (recommended: 8px gap using CSS gap property or margin).

5. **Q**: How to handle export with selected columns only?  
   **A**: Custom export dialog with table showing all columns, checkboxes to select, then filter data before export.

6. **Q**: Report button enable/disable logic?  
   **A**: Report button enable/disable logic must match delete button exactly: disabled when no rows are selected, enabled when one or more rows are selected via checkboxes.

7. **Q**: Button spacing requirements?  
   **A**: All action buttons (Import, Export, Delete, Report) must maintain consistent visual spacing (recommended: 8px gap using CSS gap property or margin).

## References

- [Ant Design Vue Table Documentation](https://antdv.com/components/table)
- [Ant Design Vue Form Documentation](https://antdv.com/components/form)
- [Ant Design Vue DatePicker Documentation](https://antdv.com/components/date-picker)
- [Vue 3 Composition API Guide](https://vuejs.org/guide/extras/composition-api-faq.html)
- Existing codebase patterns in `apps/web-antd/src/`

