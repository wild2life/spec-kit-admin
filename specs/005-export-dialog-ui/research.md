# Research: Export Dialog UI Optimization

**Date**: 2025-01-27  
**Feature**: Export Dialog UI Optimization  
**Phase**: 0 - Research & Technology Decisions

## Research Objectives

1. 确定 Ant Design Vue Table 组件如何禁用分页并启用滚动条
2. 分析 Ant Design Vue 表单字段水平布局的最佳实践
3. 确定 row-selection 配置与手动 checkbox 列定义的关系
4. 分析响应式布局在小屏幕上的适配方案

## Findings

### 1. Ant Design Vue Table Pagination Removal and Scrolling

**Decision**: 使用 Ant Design Vue Table 的 `scroll` 属性启用滚动，通过设置 `pagination={false}` 禁用分页

**Rationale**: 
- Ant Design Vue Table 组件原生支持通过 `scroll` 属性配置滚动行为
- 设置 `pagination={false}` 可以完全禁用分页控件
- `scroll` 属性可以设置 `y` 值来限制表格高度并启用垂直滚动
- 这是 Ant Design Vue 推荐的方式，无需自定义实现

**Implementation Pattern**:
```typescript
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

**Alternatives Considered**:
- 自定义滚动容器：需要额外的 CSS 和容器元素，增加复杂度
- 使用虚拟滚动：对于列数不多的场景（通常 < 30 列），不需要虚拟滚动优化

### 2. Horizontal Row Layout for Form Fields

**Decision**: 使用 Ant Design Vue 的 `Space` 组件或 Flexbox 布局实现水平排列

**Rationale**: 
- Ant Design Vue 的 `Space` 组件专门用于水平/垂直排列元素
- 可以使用 `Space` 组件的 `align` 和 `size` 属性控制对齐和间距
- 对于需要响应式适配的场景，可以结合 Tailwind CSS 的 flex 类
- 当字段较多时，可以使用 `wrap` 属性允许换行

**Implementation Pattern**:
```vue
<Space :size="16" align="center" wrap>
  <div>
    <label>{{ $t('manufacture.material.export.fileName') }}</label>
    <Input v-model:value="fileName" />
  </div>
  <div>
    <label>{{ $t('manufacture.material.export.exportMode') }}</label>
    <RadioGroup v-model:value="exportMode">
      <Radio value="all">{{ $t('manufacture.material.export.all') }}</Radio>
      <Radio value="paginated">{{ $t('manufacture.material.export.paginated') }}</Radio>
    </RadioGroup>
  </div>
  <div v-if="exportMode === 'paginated'">
    <label>{{ $t('manufacture.material.export.pageSize') }}</label>
    <Input v-model:value="pageSize" type="number" />
  </div>
  <div v-if="exportMode === 'paginated'">
    <label>{{ $t('manufacture.material.export.pageNumber') }}</label>
    <Input v-model:value="pageNumber" type="number" />
  </div>
</Space>
```

**Alternatives Considered**:
- 使用原生 Flexbox：需要额外的 CSS 类，不如使用组件库提供的组件
- 使用 Grid 布局：对于简单的水平排列，Space 组件更简洁

### 3. Row-Selection vs Manual Checkbox Column

**Decision**: 移除 columnTableColumns 中的 checkbox 列定义，仅使用 row-selection 配置

**Rationale**: 
- Ant Design Vue Table 的 `row-selection` 属性会自动处理 checkbox 列的渲染
- 手动在 `columns` 中定义 checkbox 列会导致重复渲染或冲突
- `row-selection` 提供了完整的行选择功能，包括全选、单选等
- 移除手动定义可以简化代码并避免潜在的 UI 冲突

**Implementation Pattern**:
```typescript
// ❌ 错误：不要手动定义 checkbox 列
const columnTableColumns = computed(() => [
  {
    title: '',
    key: 'checkbox',  // 移除这个
    width: 60,
    fixed: 'left',
  },
  // ... 其他列
]);

// ✅ 正确：只使用 row-selection
const rowSelection = computed(() => ({
  selectedRowKeys: selectedColumns.value,
  onChange: (keys: Key[]) => {
    selectedColumns.value = keys as string[];
  },
  getCheckboxProps: () => ({}),
}));

<Table
  :row-selection="rowSelection"
  // 不再需要手动定义 checkbox 列
/>
```

**Alternatives Considered**:
- 保留手动定义但禁用 row-selection：会导致失去 row-selection 提供的便利功能（如全选）
- 同时使用两者：会导致 checkbox 重复显示或冲突

### 4. Responsive Layout for Small Screens

**Decision**: 使用 Ant Design Vue Space 组件的 `wrap` 属性实现响应式换行

**Rationale**: 
- `Space` 组件的 `wrap` 属性允许子元素在空间不足时自动换行
- 结合 Tailwind CSS 的响应式类可以进一步控制不同屏幕尺寸下的布局
- 在小屏幕上，字段可以自动换行到多行，保持可用性
- 不需要额外的媒体查询或 JavaScript 逻辑

**Implementation Pattern**:
```vue
<Space :size="16" align="center" wrap class="w-full">
  <!-- 字段会自动换行 -->
</Space>
```

**Alternatives Considered**:
- 使用媒体查询：需要额外的 CSS，不如使用组件库的内置功能
- 使用 JavaScript 动态调整：增加复杂度，不如 CSS 方案简洁

## Implementation Strategy

### Phase 1: Table Pagination Removal
1. 移除 Table 组件的 `:pagination="{ pageSize: 10 }"` 属性
2. 添加 `:pagination="false"` 明确禁用分页
3. 添加 `:scroll="{ y: 400 }"` 启用垂直滚动（可根据实际需要调整高度）

### Phase 2: Form Layout Consolidation
1. 将文件名称、导出方式、页码、每页数量字段包装在 `Space` 组件中
2. 设置 `wrap` 属性允许响应式换行
3. 使用条件渲染控制页码和每页数量字段的显示（基于导出模式）
4. 调整字段顺序：文件名称 → 导出方式 → 页码 → 每页数量

### Phase 3: Checkbox Column Cleanup
1. 从 `columnTableColumns` 数组中移除 checkbox 列定义
2. 移除 template 中手动渲染 checkbox 的代码（如果存在）
3. 验证 row-selection 功能正常工作

## Testing Strategy

### Unit Tests
- 验证 Table 组件的 pagination 属性为 false
- 验证 scroll 属性正确配置
- 验证 columnTableColumns 不包含 checkbox 列

### E2E Tests
- 验证表格可以滚动查看所有列
- 验证表单字段水平排列且顺序正确
- 验证响应式布局在小屏幕上正常工作
- 验证 checkbox 选择功能正常

## Notes

- 两个 Export Dialog 组件（BOM 和 Material）需要应用相同的修改
- 表格滚动高度可以根据实际内容调整（建议 300-500px）
- 水平布局的字段间距可以根据设计需求调整
- 响应式换行行为在大多数现代浏览器中都能正常工作

