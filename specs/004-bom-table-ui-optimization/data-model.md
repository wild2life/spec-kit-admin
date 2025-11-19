# Data Model: BOM 表格 UI 优化

**Feature**: 004-bom-table-ui-optimization  
**Date**: 2025-01-27

## Overview

本文档定义了 BOM 表格 UI 优化涉及的配置实体。这些实体主要用于控制表格列的显示和搜索表单的样式与行为。

## Entities

### 表格列配置 (Table Column Configuration)

定义表格列的显示顺序和属性。

**Structure**:
```typescript
interface ColumnConfig {
  type?: 'seq' | 'checkbox' | 'radio' | string;
  field?: string;
  title?: string;
  width?: number;
  fixed?: 'left' | 'right';
  align?: 'left' | 'center' | 'right';
  // ... other VXE Table column properties
}
```

**Fields**:
- `type` (string, optional): 列类型
  - `'seq'`: 序号列（将被移除）
  - `'checkbox'`: 复选框列（移到第一列）
  - 其他类型：数据列
- `field` (string, optional): 数据字段名
- `title` (string, optional): 列标题
- `width` (number, optional): 列宽度
- `fixed` ('left' | 'right', optional): 固定位置
- `align` ('left' | 'center' | 'right', optional): 对齐方式

**Validation Rules**:
- checkbox 列必须位于 columns 数组的第一位
- checkbox 列必须设置 `fixed: 'left'`
- 序号列（type: 'seq'）必须被移除
- 其他列的顺序和配置保持不变

**Examples**:

当前配置（需要修改）:
```typescript
columns: [
  { title: '序号', type: 'seq', width: 50, fixed: 'left' },
  { field: 'id', title: '', type: 'checkbox', width: 60 },
  { field: 'businessUnitCode', title: '事业部编号', width: 120 },
  // ... other columns
]
```

目标配置:
```typescript
columns: [
  { field: 'id', title: '', type: 'checkbox', width: 60, fixed: 'left' },
  { field: 'businessUnitCode', title: '事业部编号', width: 120 },
  // ... other columns (序号列已移除)
]
```

### 搜索表单配置 (Search Form Configuration)

定义搜索表单的样式和行为。

**Structure**:
```typescript
interface FormOptions {
  collapsed?: boolean;
  wrapperClass?: string;
  schema?: FormSchemaItem[];
  showCollapseButton?: boolean;
  submitOnChange?: boolean;
  submitOnEnter?: boolean;
  // ... other VbenFormProps properties
}
```

**Fields**:
- `collapsed` (boolean, optional): 搜索面板的默认折叠状态
  - `true`: 默认折叠
  - `false`: 默认展开
- `wrapperClass` (string, optional): 表单容器的 CSS class
  - `'w-full'`: 宽度100%
- `schema` (array, optional): 表单字段配置
- `showCollapseButton` (boolean, optional): 是否显示折叠按钮
- `submitOnChange` (boolean, optional): 字段值改变时是否提交
- `submitOnEnter` (boolean, optional): 按下回车时是否提交

**Validation Rules**:
- `collapsed` 必须设置为 `true`（默认折叠）
- `wrapperClass` 必须设置为 `'w-full'`（宽度100%）
- 其他配置保持不变

**Examples**:

当前配置（需要修改）:
```typescript
const formOptions: VbenFormProps = {
  collapsed: false,
  schema: [/* ... */],
  showCollapseButton: true,
  // ... other options
};
```

目标配置:
```typescript
const formOptions: VbenFormProps = {
  collapsed: true,
  wrapperClass: 'w-full',
  schema: [/* ... */],
  showCollapseButton: true,
  // ... other options
};
```

## Data Flow

### 配置应用流程

1. 组件加载时读取 `gridOptions.columns` 配置
2. VXE Table 根据列配置渲染表格
3. checkbox 列显示在第一列位置
4. 序号列不显示（已从配置中移除）

### 搜索表单渲染流程

1. 组件加载时读取 `formOptions` 配置
2. 根据 `collapsed` 值决定搜索面板的初始状态
3. 根据 `wrapperClass` 应用 CSS class
4. 用户可以通过折叠按钮切换搜索面板状态

## State Transitions

### 搜索面板状态

```
[Page Load] → [Collapsed State (collapsed: true)]
                      ↓
              [User Clicks Expand Button]
                      ↓
              [Expanded State]
                      ↓
              [User Clicks Collapse Button]
                      ↓
              [Collapsed State]
```

## Relationships

- **Table Column Configuration** 控制表格的列显示顺序
- **Search Form Configuration** 控制搜索表单的样式和行为
- 两者独立配置，互不影响

## Constraints

1. checkbox 列必须位于第一列
2. 序号列必须被移除
3. 搜索表单宽度必须为100%
4. 搜索面板默认必须折叠
5. 所有现有功能必须保持不变

