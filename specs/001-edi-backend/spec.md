# Feature Specification: EDI Backend Management Project

**Feature Branch**: `001-edi-backend`  
**Created**: 2025-11-19  
**Status**: Draft  
**Input**: User description: "我要创建一个名字为EDI的后台管理项目，用于管理数据。用户登录之后进入首页。用户可以查看表格数据，表单输入关键词进入快捷搜索，支持导入和导出数据。"

**Updated**: 2025-11-19  
**Supplement**: "表格的第一列都是checkbox, 前两列是固定定位，表格的上方都有导入，导出，删除的按钮。导入功能包括选择文件和下载模版。导出功能包括自定义导出弹窗（可选择导出列、导出方式、文件名称）。删除功能通过checkbox选择后启用。所有Datepicker组件支持rangePresets（今天、近三天、近一周、近30天、近90天）。"

**Updated**: 2025-11-20  
**Supplement**: "BOM主数据页面必须可以通过完整路径 `http://localhost:5666/manufacture/baseData/sqe_supplier_bom` 访问，而不是简化的路径 `http://localhost:5666/sqe_supplier_bom`。路由配置应使用嵌套路由结构，确保路径正确反映菜单层级结构。"

**Updated**: 2025-11-20  
**Supplement**: "表格上方增加上报按钮。实现数据的上报。点击之后二次弹窗确认，成功后需要调用上报接口。"

**Updated**: 2025-11-20  
**Supplement**: "表格上方增加上报按钮，跟删除按钮一样，如果表格没有勾选，则按钮禁用。删除按钮和上报按钮都需要添加二次确认弹窗。样式上按钮之间保持间隔。"

**Updated**: 2025-11-20  
**Supplement**: "明确要求：1) 上报按钮的启用/禁用逻辑必须与删除按钮完全一致（无勾选时禁用，有勾选时启用）；2) 删除按钮和上报按钮都必须显示二次确认弹窗；3) 所有操作按钮（导入、导出、删除、上报）之间必须保持一致的视觉间距。"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - User Authentication and Homepage Access (Priority: P1)

Users must be able to authenticate and access the EDI backend management system homepage after successful login.

**Why this priority**: Authentication and homepage access are foundational requirements. Without this, users cannot access any features of the system. This is the entry point for all other functionality.

**Independent Test**: Can be fully tested by verifying that users can log in with valid credentials and are redirected to the homepage, where they can see the main navigation and dashboard elements. This delivers secure access to the system.

**Acceptance Scenarios**:

1. **Given** a user with valid credentials, **When** they submit the login form, **Then** they are authenticated and redirected to the homepage
2. **Given** a user on the homepage, **When** they view the page, **Then** they can see the main navigation menu and dashboard
3. **Given** an unauthenticated user, **When** they attempt to access protected pages, **Then** they are redirected to the login page
4. **Given** an authenticated user, **When** they log out, **Then** their session is terminated and they are redirected to the login page

---

### User Story 2 - BOM Master Data Viewing and Searching (Priority: P2)

Users must be able to view BOM (Bill of Materials) master data in a table format and search for specific records using multiple search criteria.

**Why this priority**: Data viewing and searching are core functionality for data management. Users need to quickly find and review BOM data to perform their work. This story enables users to locate specific BOM records efficiently.

**Independent Test**: Can be fully tested by navigating to the BOM Master Data page, viewing the data table, and using the search form with various criteria to filter results. This delivers the ability to locate and review BOM master data records.

**Acceptance Scenarios**:

1. **Given** an authenticated user on the homepage, **When** they navigate to "生产质量/生产质量数据/BOM主数据" menu, **Then** they are taken to the BOM Master Data page at URL path `/manufacture/baseData/sqe_supplier_bom`
2. **Given** a user on the BOM Master Data page, **When** the page loads, **Then** they see a search form with all required fields, action buttons (Import, Export, Delete, Report) above the table, and a data table displaying BOM records
3. **Given** a user viewing the data table, **When** they look at the table, **Then** the first column contains checkboxes for row selection and the first two columns are fixed in position when scrolling horizontally
4. **Given** a user with search criteria entered, **When** they submit the search form, **Then** the table displays only records matching the criteria
5. **Given** a user viewing search results, **When** they clear the search form, **Then** the table displays all available records
6. **Given** a user on the BOM Master Data page, **When** they enter keywords in any search field, **Then** they can perform quick search to filter results
7. **Given** a user viewing the data table, **When** they scroll horizontally, **Then** the first two columns remain fixed while other columns scroll
8. **Given** a user using date picker fields, **When** they open the date picker, **Then** they see range presets: Today, Last 3 Days, Last Week, Last 30 Days, Last 90 Days

**Search Form Fields**:
- 事业部 (Business Unit - select component)
- 供应商 (Supplier - select component)
- 奇瑞零件号 (Chery Part Number - input)
- 奇瑞零件名称 (Chery Part Name - input)
- BOM编码 (BOM Code - input)
- BOM名称 (BOM Name - input)
- 供应商父件编码 (Supplier Parent Part Code - input)
- 供应商父件名称 (Supplier Parent Part Name - input)
- 子件编码 (Child Part Code - input)
- 子件名称 (Child Part Name - input)
- BOM版本 (BOM Version - input)
- 品类名称 (Category Name - input)
- BOM变更时间 (BOM Change Time - date picker with range presets)
- 变更时间 (Change Time - date picker with range presets)

**Date Picker Range Presets** (applies to all date picker fields):
- 今天 (Today)
- 近三天 (Last 3 Days)
- 近一周 (Last Week)
- 近30天 (Last 30 Days)
- 近90天 (Last 90 Days)

**Table Structure**:
- First column: Checkbox for row selection
- First two columns: Fixed position (remain visible when scrolling horizontally)
- Action buttons above table: Import, Export, Delete, Report

**Table Display Columns**:
- [Checkbox column - first column, fixed]
- 事业部编号 (Business Unit Code - second column, fixed)
- 事业部 (Business Unit)
- 供应商代码 (Supplier Code)
- 供应商名称 (Supplier Name)
- 奇瑞零件号 (Chery Part Number)
- BOM编码 (BOM Code)
- BOM名称 (BOM Name)
- 供应商父件编码 (Supplier Parent Part Code)
- 供应商父件名称 (Supplier Parent Part Name)
- 父件类型 (Parent Part Type)
- 父件单位 (Parent Part Unit)
- 子件编码 (Child Part Code)
- 子件名称 (Child Part Name)
- 子件类型 (Child Part Type)
- 子件用量 (Child Part Quantity)
- 子件单位 (Child Part Unit)
- BOM版本 (BOM Version)
- BOM变更时间 (BOM Change Time)
- 创建时间 (Creation Time)
- 更新时间 (Update Time)
- 品类编码 (Category Code)
- 创建人登录账号 (Creator Login Account)
- 品类名称 (Category Name)
- 数据来源 (Data Source)
- 更新人账号 (Updater Account)

---

### User Story 3 - BOM Master Data Import, Export, Delete, and Report (Priority: P3)

Users must be able to import BOM master data from external files, export BOM master data to files with customizable options, delete selected records, and report data to external systems.

**Why this priority**: Import, export, delete, and report functionality enables bulk data operations and data exchange with external systems. While viewing and searching are more frequently used, these operations are essential for data management workflows and system integration.

**Independent Test**: Can be fully tested by selecting records via checkboxes, exporting data with custom column selection, importing a file, deleting selected records, and reporting data, verifying that all operations complete successfully and data is correctly processed. This delivers the ability to perform bulk data operations and data exchange.

**Acceptance Scenarios**:

**Import Functionality**:

1. **Given** a user on the BOM Master Data page, **When** they click the Import button, **Then** they can select a file to import
2. **Given** a user on the Import dialog, **When** they click the "Download Template" option, **Then** a template file is downloaded with the correct format and column structure
3. **Given** a user with a valid data file, **When** they select the file and confirm import, **Then** the system processes the file and displays import results
4. **Given** a user importing data with validation errors, **When** the import process completes, **Then** error details are displayed and invalid records are not imported
5. **Given** a user importing valid data, **When** the import process completes, **Then** new records appear in the data table and a success message is displayed
6. **Given** a user importing data, **When** duplicate records are detected, **Then** the system handles them according to business rules (update existing or skip)

**Export Functionality**:

7. **Given** a user on the BOM Master Data page, **When** they click the Export button, **Then** a dialog titled "自定义导出" (Custom Export) opens
8. **Given** a user in the Custom Export dialog, **When** they view the column selection table, **Then** they see three columns: Checkbox (first column, all checked by default), Attribute Name (second column), and Table Column Name (third column)
9. **Given** a user in the Custom Export dialog, **When** they submit without changing column selections, **Then** all columns are exported with all table data
10. **Given** a user in the Custom Export dialog, **When** they uncheck some column checkboxes and submit, **Then** only selected columns are exported
11. **Given** a user in the Custom Export dialog, **When** they view export mode options, **Then** they see "全部" (All) selected by default and "分页" (Paginated) as an alternative
12. **Given** a user selecting paginated export mode, **When** they set page size and page number, **Then** only the specified page range is exported
13. **Given** a user in the Custom Export dialog, **When** they view the file name field, **Then** they see the default name is "BOM主数据" (BOM Master Data) which can be manually edited
14. **Given** a user with custom export settings, **When** they submit the export, **Then** a file is downloaded with the selected columns, data range, and custom file name

**Delete Functionality**:

15. **Given** a user on the BOM Master Data page, **When** no rows are selected, **Then** the Delete button is disabled (disabled=true)
16. **Given** a user viewing the data table, **When** they select one or more rows using checkboxes, **Then** the Delete button becomes enabled (disabled=false)
17. **Given** a user with selected rows, **When** they click the Delete button, **Then** a confirmation dialog appears
18. **Given** a user confirming deletion, **When** they confirm the action, **Then** the selected records are deleted and removed from the table
19. **Given** a user after deletion, **When** the operation completes, **Then** a success message is displayed and the table refreshes to show remaining records

**Report Functionality**:

20. **Given** a user on the BOM Master Data page, **When** no rows are selected, **Then** the Report button is disabled (disabled=true)
21. **Given** a user viewing the data table, **When** they select one or more rows using checkboxes, **Then** the Report button becomes enabled (disabled=false)
22. **Given** a user with selected rows, **When** they click the Report button, **Then** a confirmation dialog appears asking them to confirm the report action
23. **Given** a user in the report confirmation dialog, **When** they confirm the report action, **Then** the system calls the report API to submit the data
24. **Given** a user after confirming report, **When** the report API call succeeds, **Then** a success message is displayed indicating the data has been successfully reported
25. **Given** a user in the report confirmation dialog, **When** they cancel the confirmation, **Then** the dialog closes without calling the report API
26. **Given** a user after confirming report, **When** the report API call fails, **Then** an error message is displayed with details about the failure

---

### Edge Cases

- What happens when search returns no results? System should display an empty state message indicating no matching records found
- How does system handle very large datasets? System should support pagination and limit the number of records displayed per page
- What happens when import file format is incorrect? System should validate file format and display clear error messages
- How does system handle concurrent imports? System should queue or prevent concurrent imports to avoid data conflicts
- What happens when export file is very large? System should handle large exports efficiently, possibly using background processing
- How does system handle special characters in search fields? System should properly escape and handle special characters in search queries
- What happens when date range search has invalid dates? System should validate date inputs and display appropriate error messages
- How does system handle network errors during import/export? System should display user-friendly error messages and allow retry
- What happens when user selects all rows using the header checkbox? System should select all visible rows and enable the Delete button
- How does system handle deletion of a large number of selected records? System should process deletions efficiently and provide progress feedback
- What happens when export file name contains invalid characters? System should validate file name and prevent invalid characters or suggest alternatives
- How does system handle paginated export when page number exceeds available pages? System should validate page number and export available data or display an error
- What happens when user cancels the Custom Export dialog? System should close the dialog without exporting and return to the table view
- How does system handle fixed columns when table has very few columns? System should maintain fixed column behavior or adjust based on available space
- What happens when user clicks Report button? System should display a confirmation dialog before calling the report API
- How does system handle report API failures? System should display user-friendly error messages and allow retry
- What happens when report API call is in progress? System should show loading state and disable the Report button to prevent duplicate submissions
- How does system handle network errors during report submission? System should display appropriate error messages and allow retry

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST authenticate users before allowing access to any features
- **FR-002**: System MUST redirect authenticated users to the homepage after successful login
- **FR-003**: System MUST provide a homepage that displays after user login
- **FR-004**: System MUST provide navigation menu structure: "生产质量/生产质量数据/BOM主数据"
- **FR-005**: System MUST route to BOM Master Data page using full path: `/manufacture/baseData/sqe_supplier_bom` (accessible via `http://localhost:5666/manufacture/baseData/sqe_supplier_bom`). The route MUST use nested route structure to reflect the menu hierarchy, NOT a simplified path like `/sqe_supplier_bom`
- **FR-006**: System MUST display BOM Master Data in a table format with all required columns
- **FR-007**: System MUST provide a search form with all specified search fields
- **FR-008**: System MUST support quick search functionality using keywords entered in search fields
- **FR-009**: System MUST filter table data based on search criteria submitted by users
- **FR-010**: System MUST support select components for "事业部" and "供应商" fields with dropdown options
- **FR-011**: System MUST support date picker components for "BOM变更时间" and "变更时间" fields with range presets (Today, Last 3 Days, Last Week, Last 30 Days, Last 90 Days)
- **FR-012**: System MUST support input fields (default) for all other search fields
- **FR-013**: System MUST display all required table columns with proper data formatting
- **FR-014**: System MUST display a checkbox column as the first column in the data table for row selection
- **FR-015**: System MUST fix the first two columns in position when users scroll horizontally in the data table
- **FR-016**: System MUST display Import, Export, Delete, and Report buttons above the data table
- **FR-017**: System MUST support data import functionality with file selection capability
- **FR-018**: System MUST provide a "Download Template" option in the import functionality
- **FR-019**: System MUST validate imported data and report errors for invalid records
- **FR-020**: System MUST handle duplicate records during import according to business rules
- **FR-021**: System MUST open a "自定义导出" (Custom Export) dialog when Export button is clicked
- **FR-022**: System MUST display a column selection table in the Custom Export dialog with three columns: Checkbox, Attribute Name, and Table Column Name
- **FR-023**: System MUST have all column checkboxes checked by default in the Custom Export dialog
- **FR-024**: System MUST export all columns when user submits Custom Export dialog without changing selections
- **FR-025**: System MUST export only selected columns when user unchecks some column checkboxes
- **FR-026**: System MUST default export mode to "全部" (All) in the Custom Export dialog
- **FR-027**: System MUST support "分页" (Paginated) export mode with configurable page size and page number
- **FR-028**: System MUST default export file name to "BOM主数据" (BOM Master Data) in the Custom Export dialog
- **FR-029**: System MUST allow users to manually edit the export file name in the Custom Export dialog
- **FR-030**: System MUST disable the Delete button by default (when no rows are selected)
- **FR-031**: System MUST enable the Delete button when one or more rows are selected via checkboxes
- **FR-032**: System MUST require confirmation before deleting selected records
- **FR-033**: System MUST delete selected records and refresh the table after confirmed deletion
- **FR-034**: System MUST persist BOM Master Data and maintain data integrity
- **FR-035**: System MUST display appropriate error messages for failed operations
- **FR-036**: System MUST display a Report button above the data table
- **FR-037**: System MUST disable the Report button by default (when no rows are selected), using the same enable/disable logic as the Delete button
- **FR-038**: System MUST enable the Report button when one or more rows are selected via checkboxes, using the same enable/disable logic as the Delete button
- **FR-039**: System MUST display a confirmation dialog when the Report button is clicked
- **FR-040**: System MUST call the report API when the user confirms the report action in the confirmation dialog
- **FR-041**: System MUST display a success message when the report API call succeeds
- **FR-042**: System MUST display an error message when the report API call fails
- **FR-043**: System MUST allow users to cancel the report action in the confirmation dialog without calling the report API
- **FR-044**: System MUST show loading state during report API call and disable the Report button to prevent duplicate submissions
- **FR-045**: System MUST maintain consistent spacing between all action buttons (Import, Export, Delete, Report) above the data table

### Key Entities *(include if feature involves data)*

- **User**: Represents authenticated users of the system. Key attributes: login credentials, session information, permissions
- **BOM Master Data Record**: Represents a Bill of Materials master data entry. Key attributes: business unit, supplier information, part numbers (Chery and supplier), BOM code and name, parent and child part details, version, timestamps, category information, data source, creator and updater accounts
- **Search Criteria**: Represents user input for filtering BOM data. Key attributes: business unit, supplier, part numbers, BOM identifiers, dates with range presets, category
- **Import/Export File**: Represents data files used for bulk operations. Key attributes: file format, data structure, validation rules
- **Export Configuration**: Represents user settings for data export. Key attributes: selected columns, export mode (all or paginated), page size, page number, custom file name
- **Table Selection**: Represents user's row selection state. Key attributes: selected row identifiers, selection count, delete button enabled state, report button enabled state
- **Report Request**: Represents a data reporting operation. Key attributes: confirmation state, API call status, success/error messages

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can successfully log in and access the homepage within 3 seconds of submitting credentials
- **SC-002**: Users can navigate to BOM Master Data page and view data table within 2 seconds of page load
- **SC-003**: Search operations return filtered results within 1 second for datasets up to 10,000 records
- **SC-004**: Users can successfully export BOM data to file format within 5 seconds for datasets up to 5,000 records
- **SC-005**: Users can successfully import BOM data from file with 95% success rate for valid data files
- **SC-006**: 90% of users can complete a search operation on first attempt without assistance
- **SC-007**: System handles concurrent access from 50 users without performance degradation
- **SC-008**: Import validation catches and reports 100% of data format errors before processing
- **SC-009**: Users can successfully submit data report within 3 seconds after confirmation
- **SC-010**: Report API call success rate is 95% or higher under normal network conditions
- **SC-011**: 90% of users can complete a report operation on first attempt without assistance
