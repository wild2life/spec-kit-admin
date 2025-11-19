# Quick Start: BOM 表格 UI 优化

**Feature**: 004-bom-table-ui-optimization  
**Date**: 2025-01-27

## Overview

本指南提供快速实现 BOM 表格 UI 优化的步骤。主要任务是调整表格列配置（移除序号列，调整 checkbox 列位置）和搜索表单配置（设置宽度和默认折叠状态）。

## Prerequisites

- 了解现有的 BOM 主数据表格实现
- 熟悉 `useVbenVxeGrid` 的列配置
- 熟悉 `VbenFormProps` 的配置选项

## Implementation Steps

### Step 1: 调整表格列配置

**File**: `apps/web-antd/src/views/manufacture/baseData/sqe-supplier-bom/index.vue`

**Changes**:
1. 移除序号列配置（`type: 'seq'`）
2. 将 checkbox 列移到 columns 数组的第一位
3. 确保 checkbox 列有 `fixed: 'left'` 属性

**Before**:
```typescript
const gridOptions: VxeTableGridOptions<BOMRecord> = {
  columns: [
    { title: '序号', type: 'seq', width: 50, fixed: 'left' },
    {
      align: 'left',
      field: 'id',
      title: '',
      type: 'checkbox',
      width: 60,
    },
    // ... other columns
  ],
};
```

**After**:
```typescript
const gridOptions: VxeTableGridOptions<BOMRecord> = {
  columns: [
    {
      align: 'left',
      field: 'id',
      title: '',
      type: 'checkbox',
      width: 60,
      fixed: 'left',
    },
    // ... other columns (序号列已移除)
  ],
};
```

**Validation**:
- [ ] 表格 checkbox 列位于第一列
- [ ] 表格没有序号列
- [ ] checkbox 列固定在最左侧
- [ ] 其他列的顺序和功能保持不变

### Step 2: 调整搜索表单配置

**File**: `apps/web-antd/src/views/manufacture/baseData/sqe-supplier-bom/index.vue`

**Changes**:
1. 设置 `collapsed: true`（默认折叠）
2. 添加 `wrapperClass: 'w-full'`（宽度100%）

**Before**:
```typescript
const formOptions: VbenFormProps = {
  collapsed: false,
  schema: [/* ... */],
  showCollapseButton: true,
  // ... other options
};
```

**After**:
```typescript
const formOptions: VbenFormProps = {
  collapsed: true,
  wrapperClass: 'w-full',
  schema: [/* ... */],
  showCollapseButton: true,
  // ... other options
};
```

**Note**: 如果 `wrapperClass` 属性不存在，可以尝试使用 `componentProps` 或其他可用属性。如果 `w-full` class 未配置，可以使用内联样式 `style: { width: '100%' }`。

**Validation**:
- [ ] 搜索表单宽度为100%
- [ ] 搜索面板默认处于折叠状态
- [ ] 用户可以展开和折叠搜索面板
- [ ] 搜索功能正常工作

### Step 3: 运行测试

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

### Step 4: 验证功能

**Manual Testing**:
1. 启动开发服务器
2. 登录系统
3. 导航到 BOM 主数据页面
4. 验证表格列顺序（checkbox 在第一列，无序号列）
5. 验证搜索表单宽度为100%
6. 验证搜索面板默认折叠
7. 测试展开/折叠搜索面板功能
8. 验证所有表格功能（选择、排序、分页等）正常工作

**Validation Checklist**:
- [ ] 表格 checkbox 列位于第一列
- [ ] 表格没有序号列
- [ ] 搜索表单宽度为100%
- [ ] 搜索面板默认折叠
- [ ] 搜索面板可以展开和折叠
- [ ] 所有表格功能正常工作

## Troubleshooting

### 问题 1: wrapperClass 属性不存在

**症状**: TypeScript 报错 `wrapperClass` 属性不存在

**可能原因**:
- `VbenFormProps` 类型定义中没有 `wrapperClass` 属性

**解决方案**:
1. 检查 `VbenFormProps` 类型定义
2. 如果不存在，使用 `componentProps` 或其他可用属性
3. 或者使用内联样式 `style: { width: '100%' }`

### 问题 2: w-full class 未生效

**症状**: 搜索表单宽度不是100%

**可能原因**:
- Tailwind CSS 未配置 `w-full` class
- CSS class 被其他样式覆盖

**解决方案**:
1. 检查项目 Tailwind 配置
2. 使用内联样式 `style: { width: '100%' }` 作为备选
3. 检查是否有其他 CSS 覆盖了宽度设置

### 问题 3: 表格功能异常

**症状**: 选择、排序、分页等功能不工作

**可能原因**:
- 列配置调整影响了功能绑定

**解决方案**:
1. 检查列配置是否正确
2. 确保 checkbox 列的 `field` 属性正确
3. 验证其他列的配置未改变

## Next Steps

1. 验证所有功能正常工作
2. 进行代码审查
3. 部署到测试环境
4. 收集用户反馈

## References

- [API Contracts](./contracts/api.md) - N/A (此功能不涉及 API)
- [Data Model](./data-model.md)
- [Research](./research.md)
- [Implementation Plan](./plan.md)

