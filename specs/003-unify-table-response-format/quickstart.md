# Quick Start: 统一表格数据响应格式

**Feature**: 003-unify-table-response-format  
**Date**: 2025-11-19

## Overview

本指南提供快速实现统一表格数据响应格式的步骤。主要任务是重构现有的 BOM 列表 API 以使用标准的 `usePageResponseSuccess` 工具函数，并更新前端代码以适配新的响应格式。

## Prerequisites

- 了解现有的 `usePageResponseSuccess` 工具函数
- 熟悉 BOM 列表 API 的当前实现
- 熟悉前端 API 调用代码

## Implementation Steps

### Step 1: 重构后端 API

**File**: `apps/backend-mock/api/manufacture/bom/list.get.ts`

**Changes**:
1. 导入 `usePageResponseSuccess` 函数（如果尚未导入）
2. 将自定义响应格式替换为 `usePageResponseSuccess` 调用
3. 移除 `data.page` 和 `data.pageSize` 字段

**Before**:
```typescript
return {
  code: 200,
  message: 'success',
  data: {
    list: pageData,
    total: filteredData.length,
    page: pageNumber,
    pageSize: pageSizeNumber,
  },
};
```

**After**:
```typescript
return usePageResponseSuccess(
  String(pageNumber),
  String(pageSizeNumber),
  filteredData,
);
```

**Validation**:
- [ ] API 返回格式符合规范：`{ code: 0, data: { items: T[], total: number }, error: null, message: 'ok' }`
- [ ] 分页功能正常工作
- [ ] 身份验证检查正常工作

### Step 2: 更新前端类型定义

**File**: `apps/web-antd/src/api/manufacture/bom.ts`

**Changes**:
1. 更新 `BomListResponse` 接口定义
2. 将 `list` 字段改为 `items`
3. 移除 `page` 和 `pageSize` 字段

**Before**:
```typescript
export interface BomListResponse {
  list: BOMRecord[];
  total: number;
  page: number;
  pageSize: number;
}
```

**After**:
```typescript
export interface BomListResponse {
  items: BOMRecord[];
  total: number;
}
```

**Validation**:
- [ ] TypeScript 编译无错误
- [ ] 类型定义与实际响应格式匹配

### Step 3: 重构前端组件使用 useVbenVxeGrid

**File**: `apps/web-antd/src/views/manufacture/baseData/sqe-supplier-bom/index.vue`

**Changes**:
1. 导入 `useVbenVxeGrid` 和相关类型
2. 使用 `VbenFormProps` 定义搜索表单配置
3. 使用 `VxeTableGridOptions` 定义表格配置
4. 通过 `proxyConfig.ajax.query` 集成 API 调用
5. 移除手动数据管理和分页逻辑（由 `useVbenVxeGrid` 自动处理）

**Reference**: 参考 `playground/src/views/examples/vxe-table/form.vue` 的实现模式

**Implementation Pattern**:
```typescript
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import type { VbenFormProps } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';

const formOptions: VbenFormProps = {
  collapsed: false,
  fieldMappingTime: [['bomChangeTime', ['bomChangeTimeStart', 'bomChangeTimeEnd']]],
  schema: [
    {
      component: 'Input',
      fieldName: 'businessUnit',
      label: $t('manufacture.bom.search.businessUnit'),
    },
    // ... 其他搜索字段
  ],
  showCollapseButton: true,
  submitOnChange: true,
};

const gridOptions: VxeTableGridOptions<BOMRecord> = {
  columns: [
    { title: '序号', type: 'seq', width: 50 },
    { field: 'businessUnit', title: $t('manufacture.bom.table.businessUnit') },
    // ... 其他列配置
  ],
  proxyConfig: {
    ajax: {
      query: async ({ page }, formValues) => {
        return await getBomListApi({
          page: page.currentPage,
          pageSize: page.pageSize,
          ...formValues,
        });
      },
    },
  },
  toolbarConfig: {
    custom: true,
    export: true,
    refresh: true,
    resizable: true,
    search: true,
    zoom: true,
  },
};

const [Grid] = useVbenVxeGrid({
  formOptions,
  gridOptions,
});
```

**Note**: 
- `useVbenVxeGrid` 已配置为期望响应格式：`{ items: T[], total: number }`
- 由于 `requestClient` 配置了 `responseReturn: 'data'`，API 返回的 `{ items, total }` 可以直接被 `useVbenVxeGrid` 使用
- 搜索表单、分页、导出等功能由 `useVbenVxeGrid` 自动处理

**Validation**:
- [ ] 前端正确显示数据
- [ ] 分页功能正常工作
- [ ] 搜索功能正常工作
- [ ] 导出功能正常工作
- [ ] 代码风格与 playground 一致

### Step 4: 运行测试

**Commands**:
```bash
# TypeScript 类型检查
pnpm check:type

# ESLint 检查
pnpm lint

# 运行单元测试（如果有）
pnpm test:unit

# 运行 E2E 测试（如果有）
pnpm test:e2e
```

**Validation**:
- [ ] 所有测试通过
- [ ] 无 TypeScript 错误
- [ ] 无 ESLint 错误

### Step 5: 验证功能

**Manual Testing**:
1. 启动开发服务器
2. 登录系统
3. 导航到 BOM 主数据页面
4. 验证数据正确显示
5. 测试分页功能（切换页码、改变每页数量）
6. 测试搜索功能
7. 验证错误处理（如未授权访问）

**Validation Checklist**:
- [ ] 数据列表正确显示
- [ ] 分页功能正常工作
- [ ] 搜索功能正常工作
- [ ] 错误处理正常工作
- [ ] 响应时间正常（< 500ms）

## Troubleshooting

### 问题 1: 前端无法读取数据

**症状**: 数据列表为空，但 API 返回了数据

**可能原因**:
- 响应格式不匹配
- 字段名错误（`list` vs `items`）

**解决方案**:
1. 检查浏览器开发者工具的 Network 标签，查看实际响应格式
2. 确认前端代码使用 `response.items` 而不是 `response.data.list`
3. 检查 `requestClient` 的配置（`responseReturn: 'data'`）

### 问题 2: TypeScript 编译错误

**症状**: TypeScript 报类型错误

**可能原因**:
- 类型定义未更新
- 响应类型不匹配

**解决方案**:
1. 更新 `BomListResponse` 接口定义
2. 确保类型定义与实际响应格式匹配
3. 运行 `pnpm check:type` 检查所有类型错误

### 问题 3: 分页功能异常

**症状**: 分页不工作或显示错误的总数

**可能原因**:
- `total` 字段计算错误
- 分页参数传递错误

**解决方案**:
1. 检查后端分页逻辑
2. 确认 `total` 是总记录数，不是当前页的数量
3. 验证分页参数规范化逻辑

## Next Steps

1. 将相同的模式应用到其他表格数据 API（如果有）
2. 创建统一的响应处理工具函数（如果需要）
3. 编写单元测试和 E2E 测试
4. 更新相关文档

## References

- [API Contracts](./contracts/api.md)
- [Data Model](./data-model.md)
- [Research](./research.md)
- [Implementation Plan](./plan.md)

