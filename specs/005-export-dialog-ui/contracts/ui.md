# UI Contracts: Export Dialog UI Optimization

**Date**: 2025-01-27  
**Feature**: Export Dialog UI Optimization  
**Phase**: 1 - Design

## Component Contracts

### ExportDialog Component

**Component Path**: 
- `apps/web-antd/src/views/manufacture/baseData/sqe-supplier-bom/components/ExportDialog.vue`
- `apps/web-antd/src/views/manufacture/baseData/supplier-pro-material-data/components/ExportDialog.vue`

**Props**:
- `visible: boolean` - Dialog visibility state
- `searchParams?: any` - Optional search parameters for export filtering

**Emits**:
- `update:visible: [value: boolean]` - Update dialog visibility

**UI Requirements**:

#### Table Configuration

1. **Pagination**: 
   - MUST be disabled (`pagination={false}`)
   - MUST NOT display pagination controls

2. **Scrolling**:
   - MUST enable vertical scrolling via `scroll` prop
   - MUST set scroll height to appropriate value (e.g., `{ y: 400 }`)
   - MUST display scrollbar when content exceeds visible area

3. **Column Definitions**:
   - MUST NOT include checkbox column in `columnTableColumns`
   - MUST use `row-selection` prop for checkbox functionality
   - MUST include only data columns (attributeName, tableColumnName)

#### Form Layout

1. **Layout Direction**:
   - MUST display fields in horizontal row
   - MUST use Ant Design Vue `Space` component or equivalent

2. **Field Order** (left to right):
   1. File Name input
   2. Export Mode selection (RadioGroup)
   3. Page Size input (conditional, shown when export mode is "paginated")
   4. Page Number input (conditional, shown when export mode is "paginated")

3. **Responsive Behavior**:
   - MUST allow fields to wrap to multiple lines on small screens
   - MUST maintain field order when wrapping
   - MUST maintain usability on all screen sizes

4. **Field Visibility**:
   - Page Size and Page Number inputs MUST be hidden/disabled when export mode is "全部" (All)
   - Page Size and Page Number inputs MUST be visible/enabled when export mode is "分页" (Paginated)

## Visual Specifications

### Table Scroll Height
- Default: 400px
- Minimum: 300px
- Maximum: 600px
- Should be adjusted based on dialog height and content

### Field Spacing
- Default: 16px between fields
- Should use Ant Design Vue Space component default spacing

### Responsive Breakpoints
- Small screens (< 768px): Fields may wrap to multiple lines
- Medium screens (768px - 1024px): Fields should remain in single row
- Large screens (> 1024px): Fields should remain in single row with appropriate spacing

## Validation Rules

### Table Configuration
- `pagination` prop MUST be `false`
- `scroll` prop MUST be defined with `y` value
- `columnTableColumns` MUST NOT contain checkbox column definition
- `row-selection` prop MUST be defined

### Form Layout
- Field order MUST match specification (fileName → exportMode → pageSize → pageNumber)
- Conditional fields MUST respect export mode state
- Layout MUST be responsive and wrap on small screens

## Error Handling

- If table configuration is invalid, component should log warning and use safe defaults
- If form layout breaks on small screens, fields should wrap gracefully
- If checkbox selection fails, component should maintain existing selection state

## Accessibility

- Table scrollbar MUST be keyboard accessible
- Form fields MUST maintain proper tab order
- Screen readers MUST announce field labels correctly
- Focus management MUST work correctly when fields wrap

