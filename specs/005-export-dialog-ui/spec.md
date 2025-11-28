# Feature Specification: Export Dialog UI Optimization

**Feature Branch**: `005-export-dialog-ui`  
**Created**: 2025-01-27  
**Status**: Draft  
**Input**: User description: "1. 页面所有的@ExportDialog.vue 组件里面的表格不分页，滚动条显示。2. 文件名称和导出方式和页码、每页数量都放在一行显示。3. 展示顺序为 文件名称，导出方式，页码、每页数量。4. 表格设置了row-selection之后就不用设置columnTableColumns"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Optimize Export Dialog Table Display (Priority: P1)

Users must be able to view all export column options in the Export Dialog without pagination, using scrollable table display instead.

**Why this priority**: This improves user experience by allowing users to see all available columns at once without navigating through pages, making column selection faster and more intuitive. This is a core UI improvement that affects all export dialogs in the system.

**Independent Test**: Can be fully tested by opening any Export Dialog (BOM or Material Master Data), verifying that the column selection table displays all columns without pagination controls, and confirming that a scrollbar appears when the table content exceeds the visible area. This delivers improved usability for column selection.

**Acceptance Scenarios**:

1. **Given** a user opens the Export Dialog (BOM or Material Master Data), **When** they view the column selection table, **Then** all available columns are displayed in a single scrollable view without pagination controls
2. **Given** a user viewing the Export Dialog with many columns, **When** the table content exceeds the visible area, **Then** a vertical scrollbar appears allowing users to scroll through all columns
3. **Given** a user viewing the Export Dialog, **When** they scroll through the column table, **Then** all columns remain selectable via checkboxes
4. **Given** a user viewing the Export Dialog, **When** they check or uncheck column checkboxes, **Then** the selection state is maintained correctly while scrolling

---

### User Story 2 - Optimize Export Dialog Form Layout (Priority: P1)

Users must be able to view and configure file name, export mode, page size, and page number in a single horizontal row layout for better space utilization and visual organization.

**Why this priority**: Consolidating form fields into a single row improves dialog layout efficiency, reduces vertical space usage, and creates a more compact, professional appearance. This enhances the overall user experience when configuring export options.

**Independent Test**: Can be fully tested by opening any Export Dialog, verifying that file name input, export mode selection, page size input, and page number input are displayed in a single horizontal row in the specified order (file name, export mode, page size, page number). This delivers improved form layout and space efficiency.

**Acceptance Scenarios**:

1. **Given** a user opens the Export Dialog, **When** they view the export configuration section, **Then** file name input, export mode selection, page size input, and page number input are displayed in a single horizontal row
2. **Given** a user viewing the Export Dialog, **When** they check the field order, **Then** the fields appear in the order: file name, export mode, page size, page number (from left to right)
3. **Given** a user viewing the Export Dialog, **When** export mode is set to "全部" (All), **Then** page size and page number inputs are hidden or disabled
4. **Given** a user viewing the Export Dialog, **When** export mode is set to "分页" (Paginated), **Then** page size and page number inputs are visible and enabled in the same row
5. **Given** a user viewing the Export Dialog, **When** they interact with any field in the horizontal row, **Then** all fields remain properly aligned and functional

---

### User Story 3 - Remove Redundant Checkbox Column Definition (Priority: P2)

The Export Dialog column selection table must not define a separate checkbox column in columnTableColumns when row-selection is already configured, eliminating redundant column definitions.

**Why this priority**: This is a code quality improvement that removes redundant configuration. When row-selection is enabled on a table, the checkbox column is automatically handled by the table component, so manually defining it in columnTableColumns is unnecessary and can cause conflicts or visual issues.

**Independent Test**: Can be fully tested by opening any Export Dialog, verifying that the column selection table displays checkboxes correctly via row-selection, and confirming that no separate checkbox column is defined in the columnTableColumns configuration. This delivers cleaner code and prevents potential UI conflicts.

**Acceptance Scenarios**:

1. **Given** a user opens the Export Dialog, **When** they view the column selection table, **Then** checkboxes are displayed for each row via row-selection configuration
2. **Given** a developer viewing the Export Dialog component code, **When** they check the columnTableColumns definition, **Then** no checkbox column (with key 'checkbox') is defined in the columns array
3. **Given** a user viewing the Export Dialog, **When** they interact with row checkboxes, **Then** the selection functionality works correctly without any visual or functional issues

---

### Edge Cases

- What happens when the Export Dialog is opened on a small screen? The horizontal row layout should adapt responsively, potentially wrapping to multiple lines if necessary while maintaining usability
- How does the table handle when there are very few columns (less than 5)? The scrollbar should not appear unnecessarily, and the table should display normally
- What happens when the table has many columns (50+)? The scrollbar should appear and allow smooth scrolling through all columns
- How does the system handle when export mode changes from "分页" to "全部"? Page size and page number inputs should be hidden or disabled appropriately
- What happens when file name field is very long? The input should handle long text appropriately without breaking the horizontal layout
- How does the system handle when page size or page number inputs are empty or invalid? Appropriate validation should be applied
- What happens when the Export Dialog is resized? The table scrollbar and horizontal row layout should adapt appropriately

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST display all columns in the Export Dialog column selection table without pagination controls
- **FR-002**: System MUST display a vertical scrollbar in the column selection table when content exceeds the visible area
- **FR-003**: System MUST allow users to scroll through all columns in the Export Dialog table
- **FR-004**: System MUST maintain checkbox selection state correctly while scrolling through the table
- **FR-005**: System MUST display file name input, export mode selection, page size input, and page number input in a single horizontal row
- **FR-006**: System MUST display fields in the order: file name, export mode, page size, page number (from left to right)
- **FR-007**: System MUST hide or disable page size and page number inputs when export mode is set to "全部" (All)
- **FR-008**: System MUST show and enable page size and page number inputs when export mode is set to "分页" (Paginated)
- **FR-009**: System MUST NOT define a separate checkbox column in columnTableColumns when row-selection is configured
- **FR-010**: System MUST apply these changes to all ExportDialog components in the system (BOM and Material Master Data)
- **FR-011**: System MUST maintain all existing export functionality after UI layout changes
- **FR-012**: System MUST ensure the horizontal row layout adapts appropriately on different screen sizes

### Key Entities *(include if feature involves data)*

- **Export Dialog Configuration**: Represents the UI layout and display settings for export dialogs. Key attributes: table pagination state (disabled), scrollbar visibility, form field layout (horizontal row), field order, checkbox column configuration
- **Column Selection Table**: Represents the table component for selecting export columns. Key attributes: pagination disabled, scrollable display, row-selection enabled, column definitions without checkbox column

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can view all available export columns in Export Dialog without pagination in 100% of dialog opens
- **SC-002**: Column selection table displays scrollbar when content exceeds visible area in 100% of cases with many columns
- **SC-003**: File name, export mode, page size, and page number fields are displayed in a single horizontal row in 100% of Export Dialog opens
- **SC-004**: Field order (file name, export mode, page size, page number) is correct in 100% of Export Dialog displays
- **SC-005**: All Export Dialog components (BOM and Material) implement the UI optimizations consistently
- **SC-006**: Checkbox column is not redundantly defined in columnTableColumns in 100% of Export Dialog components
- **SC-007**: All existing export functionality continues to work correctly after UI changes
- **SC-008**: Users can complete export configuration in the same or less time compared to previous layout
