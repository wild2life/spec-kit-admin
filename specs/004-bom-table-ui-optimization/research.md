# Research: BOM 表格 UI 优化

**Feature**: 004-bom-table-ui-optimization  
**Date**: 2025-01-27

## Research Objectives

1. 分析 VXE Table 列配置选项，确定如何移除序号列和调整 checkbox 列位置
2. 分析 VbenFormProps 配置选项，确定如何设置搜索表单宽度和默认折叠状态
3. 确定 w-full class 在项目中的使用方式

## Findings

### 1. VXE Table 列配置分析

**Decision**: 移除序号列，将 checkbox 列移到第一列

**Rationale**: 
- VXE Table 支持通过 `type: 'seq'` 定义序号列，移除该列配置即可
- checkbox 列通过 `type: 'checkbox'` 定义，需要将其移到 columns 数组的第一位
- checkbox 列需要保持 `fixed: 'left'` 属性以确保固定在最左侧

**Current Configuration**:
```typescript
columns: [
  { title: '序号', type: 'seq', width: 50, fixed: 'left' },
  { field: 'id', title: '', type: 'checkbox', width: 60 },
  // ... other columns
]
```

**Target Configuration**:
```typescript
columns: [
  { field: 'id', title: '', type: 'checkbox', width: 60, fixed: 'left' },
  // ... other columns (序号列已移除)
]
```

**Alternatives considered**:
- 保留序号列但隐藏：被拒绝，因为不符合需求（需要完全移除）
- 使用其他列类型：被拒绝，checkbox 列类型是标准实现

### 2. VbenFormProps 配置分析

**Decision**: 设置 `collapsed: true` 和 `wrapperClass: 'w-full'`

**Rationale**: 
- `VbenFormProps` 支持 `collapsed` 属性控制搜索面板的默认折叠状态
- `wrapperClass` 属性可以用于设置表单容器的 CSS class
- `w-full` 是 Tailwind CSS 的 utility class，在项目中应该可用

**Current Configuration**:
```typescript
const formOptions: VbenFormProps = {
  collapsed: false,
  // ... other options
};
```

**Target Configuration**:
```typescript
const formOptions: VbenFormProps = {
  collapsed: true,
  wrapperClass: 'w-full',
  // ... other options
};
```

**Verification**:
- 已验证 `wrapperClass` 属性存在于 `VbenFormProps` 中（参考 playground 示例）
- `wrapperClass` 用于设置表单容器的 CSS class
- 支持 Tailwind CSS utility classes（如 `w-full`）

**Alternatives considered**:
- 使用 `className` 属性：被拒绝，`wrapperClass` 是标准属性名
- 使用内联样式：被拒绝，使用 class 更符合项目规范

### 3. w-full Class 验证

**Decision**: 使用 `w-full` class（Tailwind CSS utility class）

**Rationale**: 
- 项目使用 Tailwind CSS，`w-full` 是标准的宽度 utility class
- `w-full` 等同于 `width: 100%`
- 如果项目未使用 Tailwind，可以使用 `style: { width: '100%' }` 作为备选

**Implementation**:
- 优先使用 `wrapperClass: 'w-full'`
- 如果 `wrapperClass` 不支持，使用 `componentProps.style` 或 `style` 属性

**Alternatives considered**:
- 使用内联样式：被拒绝，class 方式更符合项目规范
- 创建自定义 CSS：被拒绝，使用现有 utility class 更简单

## Implementation Strategy

### Phase 1: 表格列配置调整
1. 修改 `gridOptions.columns` 数组
2. 移除序号列配置（`type: 'seq'`）
3. 将 checkbox 列移到第一位置
4. 确保 checkbox 列有 `fixed: 'left'` 属性

### Phase 2: 搜索表单配置调整
1. 修改 `formOptions.collapsed` 为 `true`
2. 添加 `formOptions.wrapperClass` 为 `'w-full'`
3. 验证配置生效

### Phase 3: 验证和测试
1. 验证表格列顺序正确
2. 验证搜索表单宽度为100%
3. 验证搜索面板默认折叠
4. 验证所有功能正常工作

## Risks and Mitigations

**Risk 1**: `wrapperClass` 属性可能不存在于 `VbenFormProps`
- **Mitigation**: 检查 `VbenFormProps` 类型定义，如果不存在，使用 `componentProps` 或其他可用属性

**Risk 2**: `w-full` class 可能未在项目中配置
- **Mitigation**: 检查项目 Tailwind 配置，如果未配置，使用内联样式 `style: { width: '100%' }`

**Risk 3**: 列顺序调整可能影响现有功能
- **Mitigation**: 仔细验证所有表格功能（选择、排序、分页等）在调整后仍然正常工作

## Conclusion

BOM 表格 UI 优化是一个低风险的配置调整任务。主要工作是：
1. 调整表格列配置（移除序号列，调整 checkbox 列位置）
2. 调整搜索表单配置（设置宽度和折叠状态）
3. 验证功能正常

所有必要的配置选项都已存在，无需引入新的依赖或复杂的技术方案。

