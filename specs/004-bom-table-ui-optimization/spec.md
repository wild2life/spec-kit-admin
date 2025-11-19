# Feature Specification: BOM 表格 UI 优化

**Feature Branch**: `004-bom-table-ui-optimization`  
**Created**: 2025-01-27  
**Status**: Draft  
**Input**: User description: "1. 表格去掉序号列，checkbox放到第一列。2. 搜索表单需要设置宽度100%，（class设置为w-full）3. 默认搜索面板是折叠的"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - 优化表格布局和搜索面板 (Priority: P1)

作为用户，我希望 BOM 主数据表格的布局更加简洁，checkbox 列位于第一列以便快速选择，搜索面板默认折叠以节省屏幕空间，搜索表单宽度占满容器以便更好地利用空间。

**Why this priority**: 这些 UI 优化可以提升用户体验，使界面更加简洁高效。移除序号列可以节省空间，将 checkbox 放在第一列符合用户习惯，搜索面板默认折叠可以减少视觉干扰，搜索表单宽度100%可以更好地利用屏幕空间。

**Independent Test**: 可以独立测试通过验证表格列顺序（checkbox 在第一列，无序号列），搜索表单宽度为100%，以及搜索面板默认状态为折叠。

**Acceptance Scenarios**:

1. **Given** 用户打开 BOM 主数据页面，**When** 查看表格列，**Then** checkbox 列位于第一列，且没有序号列
2. **Given** 用户打开 BOM 主数据页面，**When** 查看搜索表单，**Then** 搜索表单宽度为100%（class 设置为 w-full）
3. **Given** 用户打开 BOM 主数据页面，**When** 页面加载完成，**Then** 搜索面板默认处于折叠状态
4. **Given** 搜索面板处于折叠状态，**When** 用户点击展开按钮，**Then** 搜索面板展开显示所有搜索字段
5. **Given** 搜索面板处于展开状态，**When** 用户点击折叠按钮，**Then** 搜索面板折叠隐藏搜索字段

---

### Edge Cases

- 当表格数据为空时，checkbox 列仍然显示在第一列
- 当搜索面板折叠时，用户仍然可以通过展开按钮访问所有搜索功能
- 当屏幕宽度变化时，搜索表单宽度始终保持100%
- 当用户刷新页面时，搜索面板状态重置为默认折叠状态

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: 表格 MUST 移除序号列（type: 'seq'）
- **FR-002**: 表格 MUST 将 checkbox 列放在第一列位置
- **FR-003**: checkbox 列 MUST 保持固定在最左侧（fixed: 'left'）
- **FR-004**: 搜索表单容器 MUST 设置宽度为100%（class 设置为 w-full）
- **FR-005**: 搜索面板 MUST 默认处于折叠状态（collapsed: true）
- **FR-006**: 搜索面板 MUST 支持用户手动展开和折叠
- **FR-007**: 表格其他列的顺序和功能 MUST 保持不变

### Key Entities *(include if feature involves data)*

- **表格列配置 (Table Column Configuration)**: 定义表格列的显示顺序和属性
  - checkbox 列：位于第一列，固定在最左侧
  - 数据列：保持原有顺序和配置
  - 序号列：已移除

- **搜索表单配置 (Search Form Configuration)**: 定义搜索表单的样式和行为
  - 宽度：100%（w-full class）
  - 折叠状态：默认折叠（collapsed: true）
  - 展开/折叠功能：支持用户切换

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 表格 checkbox 列位于第一列，且没有序号列，100% 的页面访问中都能正确显示
- **SC-002**: 搜索表单宽度为100%，在所有屏幕尺寸下都能正确显示
- **SC-003**: 搜索面板默认折叠状态，100% 的页面加载时都处于折叠状态
- **SC-004**: 用户可以在1次点击内展开或折叠搜索面板
- **SC-005**: 所有表格功能（选择、排序、分页等）在布局调整后仍然正常工作

## Assumptions

- 用户熟悉表格的 checkbox 选择功能
- 搜索面板的展开/折叠功能使用现有的折叠按钮实现
- 搜索表单的 w-full class 在项目样式系统中已定义
- 表格列的顺序调整不会影响现有的数据绑定和业务逻辑

## Dependencies

- 依赖现有的 BOM 主数据表格实现（002-unify-table-response-format 功能）
- 依赖 useVbenVxeGrid 组件的列配置功能
- 依赖 VbenFormProps 的 collapsed 配置选项
- 依赖项目样式系统中的 w-full class

## Out of Scope

- 不涉及表格数据的修改
- 不涉及搜索功能的逻辑修改
- 不涉及其他页面的表格布局
- 不涉及响应式布局的其他优化
