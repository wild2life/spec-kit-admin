# Research: Material Master Data Page

**Date**: 2025-11-20  
**Feature**: Material Master Data Page  
**Phase**: 0 - Research & Technology Decisions

## Research Objectives

1. 确定使用 `useVbenVxeGrid` 实现表格功能的最佳实践
2. 分析搜索表单字段配置和 UI 优化要求
3. 确定 mock 服务响应格式的统一实现方式
4. 分析导入/导出/删除功能的实现模式

## Findings

### 1. Table Component: useVbenVxeGrid

**Decision**: 使用 `useVbenVxeGrid` composable 实现表格功能

**Rationale**: 
- 项目已提供 `useVbenVxeGrid` composable，集成 VXE Table 和 Vben Form
- 参考实现：`playground/src/views/examples/vxe-table/form.vue`
- 支持统一的响应格式 `{ items: T[], total: number }`
- 内置搜索表单、分页、导出等功能
- 支持列配置，包括固定列、checkbox 列等

**Implementation Pattern**:
```typescript
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import type { VbenFormProps } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';

const formOptions: VbenFormProps = {
  collapsed: true,  // 默认折叠
  wrapperClass: 'w-full',  // 宽度100%
  schema: [/* search form fields */],
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
      title: '奇瑞零件号',
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

**Alternatives considered**:
- 直接使用 Ant Design Vue Table: 被拒绝，项目已采用 VXE Table 方案
- 自定义表格实现: 被拒绝，`useVbenVxeGrid` 已提供完整功能

### 2. Search Form Configuration

**Decision**: 使用 `VbenFormProps` 配置搜索表单，应用 UI 优化

**Rationale**: 
- `VbenFormProps` 支持 `collapsed` 属性控制默认折叠状态
- 搜索表单字段使用 `schema` 数组配置
- 支持 Select、Input、RangePicker 等组件类型
- 字段宽度使用 `class: 'w-full'` 实现 100% 宽度

**Search Form Fields**:
- 事业部 (Business Unit) - Select component
- 供应商 (Supplier) - Select component
- 供应商名称 (Supplier Name) - Input component
- 奇瑞零件名称 (Chery Part Name) - Input component
- 供应商总成零件名称 (Supplier Assembly Part Name) - Input component
- 项目名称 (Project Name) - Input component
- 工厂名称 (Factory Name) - Input component
- 芯片MPN标识名称 (Chip MPN Identifier Name) - Input component

**Implementation Pattern**:
```typescript
const formOptions: VbenFormProps = {
  collapsed: true,  // 默认折叠
  schema: [
    {
      component: 'Select',
      componentProps: {
        allowClear: true,
        options: businessUnitOptions,
        placeholder: $t('manufacture.material.search.businessUnit'),
        class: 'w-full',
      },
      fieldName: 'businessUnit',
      label: $t('manufacture.material.search.businessUnit'),
    },
    {
      component: 'Input',
      componentProps: {
        allowClear: true,
        placeholder: $t('manufacture.material.search.supplierName'),
        class: 'w-full',
      },
      fieldName: 'supplierName',
      label: $t('manufacture.material.search.supplierName'),
    },
    // ... other fields
  ],
  showCollapseButton: true,
  submitOnChange: false,
};
```

**Alternatives considered**:
- 使用固定宽度字段: 被拒绝，不符合 100% 宽度要求
- 默认展开搜索面板: 被拒绝，不符合默认折叠要求

### 3. Table Column Configuration

**Decision**: checkbox 列作为第一列，无序号列，前两列固定

**Rationale**: 
- 符合 UI 优化要求：checkbox 第一列，无序号列
- VXE Table 支持 `fixed: 'left'` 固定列
- checkbox 列使用 `type: 'checkbox'` 配置
- 第二列（奇瑞零件号）也需要固定

**Implementation Pattern**:
```typescript
const gridOptions: VxeTableGridOptions<MaterialRecord> = {
  columns: [
    {
      align: 'left',
      field: 'id',
      fixed: 'left',
      title: '',
      type: 'checkbox',
      width: 60,
    },
    {
      field: 'cheryPartNumber',
      fixed: 'left',
      title: $t('manufacture.material.table.cheryPartNumber'),
      width: 150,
    },
    // ... other columns without fixed
  ],
};
```

**Alternatives considered**:
- 保留序号列: 被拒绝，不符合需求
- 不固定列: 被拒绝，不符合前两列固定的要求

### 4. Mock Service Response Format

**Decision**: 使用统一的响应格式，参考 `apps/backend-mock/api/table/list.ts`

**Rationale**: 
- 项目已统一 mock 服务响应格式
- 使用 `usePageResponseSuccess` 工具函数
- 响应格式：`{ code: 0, data: { items: T[], total: number }, message: 'ok', error: null }`
- 前端 `useVbenVxeGrid` 自动处理该格式

**Implementation Pattern**:
```typescript
// Backend mock service
import { usePageResponseSuccess } from '~/utils/response';

export default eventHandler(async (event) => {
  // ... authentication, pagination, filtering logic
  return usePageResponseSuccess(
    String(pageNumber),
    String(pageSizeNumber),
    filteredData,
  );
});
```

**Response Format**:
```typescript
{
  code: 0,
  data: {
    items: MaterialRecord[],
    total: number,
  },
  message: 'ok',
  error: null,
}
```

**Alternatives considered**:
- 自定义响应格式: 被拒绝，不符合统一格式要求
- 直接返回数组: 被拒绝，不符合项目规范

### 5. Import/Export/Delete/Report Functionality

**Decision**: 参考 BOM 主数据的实现模式

**Rationale**: 
- BOM 主数据已实现完整的导入/导出/删除/上报功能
- 可以复用相同的组件结构和 API 模式
- 导入对话框：文件上传、模板下载、结果展示
- 导出对话框：列选择、导出模式、文件名配置
- 删除功能：checkbox 选择、确认对话框、批量删除
- 上报功能：确认对话框、API 调用、加载状态

**Implementation Pattern**:
- ImportDialog: 使用 Ant Design Vue Upload 组件
- ExportDialog: 使用 Ant Design Vue Table 展示列选择
- Delete: 使用 Modal.confirm 确认对话框
- Report: 使用 Modal.confirm 确认对话框，启用/禁用逻辑与删除按钮一致
- API 调用：使用统一的 request client

**Alternatives considered**:
- 自定义实现: 被拒绝，复用现有模式更高效
- 简化功能: 被拒绝，不符合需求规范

### 6. Report Functionality Pattern

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
        await reportMaterialApi();
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
export async function reportMaterialApi(params?: { recordIds?: string[] }) {
  return requestClient.post<ReportResponse>('/manufacture/material/report', params);
}
```

**Alternatives considered**:
- Direct API call without confirmation: Rejected - report is critical operation, needs user confirmation
- Separate report dialog component: Rejected - simple confirmation is sufficient, Modal.confirm is standard pattern

### 7. Button Layout and Spacing Pattern

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

## Implementation Strategy

### Phase 1: 基础页面结构
1. 创建路由配置
2. 创建主页面组件（使用 `useVbenVxeGrid`）
3. 配置搜索表单（8 个字段）
4. 配置表格列（26 列，checkbox 第一列，前两列固定）

### Phase 2: Mock 服务
1. 创建 mock 数据生成器
2. 实现列表 API（使用统一响应格式）
3. 实现导入/导出/删除/上报 API
4. 实现模板下载 API

### Phase 3: 功能组件
1. 实现 ImportDialog 组件
2. 实现 ExportDialog 组件
3. 实现删除确认功能（带确认对话框）
4. 实现上报功能（带确认对话框，启用/禁用逻辑与删除按钮一致）
5. 实现按钮间距样式（8px gap）
6. 集成到主页面

### Phase 4: i18n 和测试
1. 添加中英文翻译
2. 编写单元测试
3. 编写 E2E 测试

## Risks and Mitigations

**Risk 1**: `useVbenVxeGrid` 的响应格式处理可能不一致
- **Mitigation**: 参考 playground 示例和 BOM 实现，确保使用统一格式

**Risk 2**: 搜索表单字段过多可能导致布局问题
- **Mitigation**: 使用 `w-full` class 和响应式布局，支持折叠功能

**Risk 3**: 表格列过多可能导致性能问题
- **Mitigation**: 使用分页、虚拟滚动（如果 VXE Table 支持）、固定列优化

**Risk 4**: 导入/导出功能复杂度较高
- **Mitigation**: 参考 BOM 实现，复用现有组件和工具函数

**Risk 5**: 上报功能需要与删除功能保持一致的启用/禁用逻辑
- **Mitigation**: 使用相同的计算属性模式，确保两个按钮的启用/禁用逻辑完全一致

## Conclusion

物料主数据页面实现是一个中等复杂度的功能开发任务。主要技术决策：
1. 使用 `useVbenVxeGrid` 实现表格和搜索功能
2. 应用 UI 优化（checkbox 第一列、无序号列、100% 宽度、默认折叠）
3. 使用统一的 mock 服务响应格式
4. 复用 BOM 主数据的导入/导出/删除/上报实现模式
5. 上报按钮的启用/禁用逻辑与删除按钮完全一致
6. 所有操作按钮之间保持一致的视觉间距（8px gap）

所有技术选型都基于项目现有实践，风险可控，实现路径清晰。

