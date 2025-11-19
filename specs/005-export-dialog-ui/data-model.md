# Data Model: Export Dialog UI Optimization

**Date**: 2025-01-27  
**Feature**: Export Dialog UI Optimization  
**Phase**: 1 - Design

## Entities

### Export Dialog Table Configuration

Represents the table display configuration for column selection in Export Dialog.

**Key Attributes**:

| Attribute | Type | Required | Description | Default |
|-----------|------|----------|-------------|---------|
| `pagination` | boolean | Yes | Whether pagination is enabled | false |
| `scrollY` | number | No | Vertical scroll height in pixels | 400 |
| `rowSelection` | object | Yes | Row selection configuration | Required |
| `columns` | array | Yes | Table column definitions (without checkbox column) | Required |

**Validation Rules**:
- `pagination`: Must be false to disable pagination
- `scrollY`: Must be positive number if provided (typically 300-500px)
- `columns`: Must not contain checkbox column definition when row-selection is enabled

**State Transitions**:
- Initial → Configured (on component mount with default values)
- Configured → Updated (when user scrolls or interacts with table)

### Export Dialog Form Layout Configuration

Represents the horizontal layout configuration for export form fields.

**Key Attributes**:

| Attribute | Type | Required | Description | Default |
|-----------|------|----------|-------------|---------|
| `layout` | 'horizontal' | Yes | Layout direction | 'horizontal' |
| `fieldOrder` | array | Yes | Order of fields from left to right | ['fileName', 'exportMode', 'pageSize', 'pageNumber'] |
| `wrap` | boolean | Yes | Whether fields can wrap to multiple lines | true |
| `spacing` | number | Yes | Spacing between fields in pixels | 16 |

**Validation Rules**:
- `fieldOrder`: Must contain exactly ['fileName', 'exportMode', 'pageSize', 'pageNumber'] in that order
- `wrap`: Must be true for responsive behavior
- `spacing`: Must be non-negative number

**State Transitions**:
- Initial → Configured (on component mount)
- Configured → Updated (when screen size changes, fields may wrap)

### Column Selection Table State

Represents the current state of the column selection table.

**Key Attributes**:

| Attribute | Type | Required | Description |
|-----------|------|----------|-------------|
| `selectedColumns` | string[] | Yes | Array of selected column keys |
| `scrollPosition` | number | No | Current vertical scroll position |
| `visibleColumns` | number | No | Number of columns currently visible |

**Validation Rules**:
- `selectedColumns`: Must be array of valid column keys
- `scrollPosition`: Must be non-negative if provided

**State Transitions**:
- Empty → Selected (when user selects columns)
- Selected → Updated (when user changes selection)
- Any → Scrolled (when user scrolls table)

## Relationships

- **Export Dialog Table Configuration** → **Column Selection Table State**: Table configuration determines how the table state is displayed
- **Export Dialog Form Layout Configuration** → **Export Dialog**: Form layout configuration is applied to the export dialog component

## Notes

- All entities are UI configuration objects, not data models
- No database persistence required
- State is managed by Vue component reactive state
- Configuration is applied at component initialization

