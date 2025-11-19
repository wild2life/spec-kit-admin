# Quick Start: Export Dialog UI Optimization

**Date**: 2025-01-27  
**Feature**: Export Dialog UI Optimization

## Overview

This guide provides step-by-step instructions for implementing the Export Dialog UI optimizations. The changes affect two components: BOM Export Dialog and Material Export Dialog.

## Prerequisites

- Vue 3 Composition API knowledge
- Ant Design Vue Table and Form components familiarity
- Understanding of reactive state management in Vue

## Implementation Steps

### Step 1: Remove Table Pagination and Enable Scrolling

**File**: Both Export Dialog components

**Changes**:
1. Remove `:pagination="{ pageSize: 10 }"` from Table component
2. Add `:pagination="false"` to explicitly disable pagination
3. Add `:scroll="{ y: 400 }"` to enable vertical scrolling

**Before**:
```vue
<Table
  :columns="columnTableColumns"
  :data-source="allColumns"
  :row-selection="rowSelection"
  :pagination="{ pageSize: 10 }"
  row-key="key"
  size="small"
/>
```

**After**:
```vue
<Table
  :columns="columnTableColumns"
  :data-source="allColumns"
  :row-selection="rowSelection"
  :pagination="false"
  :scroll="{ y: 400 }"
  row-key="key"
  size="small"
/>
```

### Step 2: Remove Checkbox Column from columnTableColumns

**File**: Both Export Dialog components

**Changes**:
1. Remove checkbox column definition from `columnTableColumns` computed property
2. Remove any manual checkbox rendering in template (if exists)

**Before**:
```typescript
const columnTableColumns = computed<TableColumnsType<ColumnOption>>(() => [
  {
    title: '',
    key: 'checkbox',
    width: 60,
    fixed: 'left',
  },
  {
    title: $t('manufacture.bom.export.selectColumns'),
    dataIndex: 'attributeName',
    key: 'attributeName',
  },
  {
    title: $t('manufacture.bom.export.selectColumns'),
    dataIndex: 'tableColumnName',
    key: 'tableColumnName',
  },
]);
```

**After**:
```typescript
const columnTableColumns = computed<TableColumnsType<ColumnOption>>(() => [
  {
    title: $t('manufacture.bom.export.selectColumns'),
    dataIndex: 'attributeName',
    key: 'attributeName',
  },
  {
    title: $t('manufacture.bom.export.selectColumns'),
    dataIndex: 'tableColumnName',
    key: 'tableColumnName',
  },
]);
```

**Template Cleanup** (if exists):
Remove any manual checkbox rendering in `#bodyCell` template slot.

### Step 3: Consolidate Form Fields into Horizontal Row

**File**: Both Export Dialog components

**Changes**:
1. Wrap file name, export mode, page size, and page number fields in `Space` component
2. Set `wrap` property for responsive behavior
3. Reorder fields: fileName → exportMode → pageSize → pageNumber
4. Use conditional rendering for page size and page number based on export mode

**Before**:
```vue
<div class="mb-4">
  <h4>{{ $t('manufacture.bom.export.exportMode') }}</h4>
  <RadioGroup v-model:value="exportMode">
    <Radio value="all">{{ $t('manufacture.bom.export.all') }}</Radio>
    <Radio value="paginated">{{ $t('manufacture.bom.export.paginated') }}</Radio>
  </RadioGroup>
</div>

<div v-if="exportMode === 'paginated'" class="mb-4">
  <div class="mb-2">
    <label>{{ $t('manufacture.bom.export.pageSize') }}: </label>
    <Input v-model:value="pageSize" type="number" :min="1" :max="1000" />
  </div>
  <div>
    <label>{{ $t('manufacture.bom.export.pageNumber') }}: </label>
    <Input v-model:value="pageNumber" type="number" :min="1" />
  </div>
</div>

<div class="mb-4">
  <h4>{{ $t('manufacture.bom.export.fileName') }}</h4>
  <Input v-model:value="fileName" :placeholder="$t('manufacture.bom.export.fileName')" />
</div>
```

**After**:
```vue
<div class="mb-4">
  <Space :size="16" align="center" wrap class="w-full">
    <div>
      <label class="mr-2">{{ $t('manufacture.bom.export.fileName') }}:</label>
      <Input
        v-model:value="fileName"
        :placeholder="$t('manufacture.bom.export.fileName')"
        style="width: 200px"
      />
    </div>
    <div>
      <label class="mr-2">{{ $t('manufacture.bom.export.exportMode') }}:</label>
      <RadioGroup v-model:value="exportMode">
        <Radio value="all">{{ $t('manufacture.bom.export.all') }}</Radio>
        <Radio value="paginated">{{ $t('manufacture.bom.export.paginated') }}</Radio>
      </RadioGroup>
    </div>
    <template v-if="exportMode === 'paginated'">
      <div>
        <label class="mr-2">{{ $t('manufacture.bom.export.pageSize') }}:</label>
        <Input
          v-model:value="pageSize"
          type="number"
          :min="1"
          :max="1000"
          style="width: 120px"
        />
      </div>
      <div>
        <label class="mr-2">{{ $t('manufacture.bom.export.pageNumber') }}:</label>
        <Input
          v-model:value="pageNumber"
          type="number"
          :min="1"
          style="width: 120px"
        />
      </div>
    </template>
  </Space>
</div>
```

**Note**: Import `Space` component if not already imported:
```typescript
import { Space } from 'ant-design-vue';
```

### Step 4: Apply Changes to Both Components

Repeat Steps 1-3 for both Export Dialog components:
1. `apps/web-antd/src/views/manufacture/baseData/sqe-supplier-bom/components/ExportDialog.vue`
2. `apps/web-antd/src/views/manufacture/baseData/supplier-pro-material-data/components/ExportDialog.vue`

### Step 5: Testing

1. **Table Scrolling**:
   - Open Export Dialog
   - Verify no pagination controls are visible
   - Verify scrollbar appears when table content exceeds visible area
   - Verify all columns are accessible via scrolling

2. **Form Layout**:
   - Verify fields are displayed in horizontal row
   - Verify field order: fileName → exportMode → pageSize → pageNumber
   - Verify page size and page number are hidden when export mode is "全部"
   - Verify page size and page number are visible when export mode is "分页"

3. **Checkbox Selection**:
   - Verify checkboxes appear via row-selection
   - Verify selection works correctly
   - Verify no duplicate checkbox columns

4. **Responsive Behavior**:
   - Resize browser window to small width
   - Verify fields wrap to multiple lines if needed
   - Verify layout remains usable

## Verification Checklist

- [ ] Table pagination is disabled
- [ ] Table scrollbar appears when content exceeds visible area
- [ ] Checkbox column is removed from columnTableColumns
- [ ] Row-selection checkboxes work correctly
- [ ] Form fields are in horizontal row
- [ ] Field order is correct (fileName → exportMode → pageSize → pageNumber)
- [ ] Conditional fields respect export mode
- [ ] Layout is responsive on small screens
- [ ] Changes applied to both BOM and Material Export Dialogs
- [ ] All existing export functionality still works

## Common Issues

### Issue: Checkbox column still appears
**Solution**: Ensure checkbox column is removed from `columnTableColumns` and no manual checkbox rendering exists in template

### Issue: Fields don't wrap on small screens
**Solution**: Ensure `Space` component has `wrap` property set to `true`

### Issue: Table doesn't scroll
**Solution**: Verify `scroll` prop is set with `y` value and `pagination` is `false`

### Issue: Page size/number fields always visible
**Solution**: Ensure conditional rendering uses `v-if="exportMode === 'paginated'"`

