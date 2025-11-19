# Feature Specification: Material Master Data Page

**Feature Branch**: `001-material-master-data`  
**Created**: 2025-11-19  
**Status**: Draft  
**Input**: User description: "这是我的第二个需求：页面2：物料主数据。菜单结构：生产质量/生产质量数据/物料主数据。VueRouter定义：manufacture/baseData/supplier_pro_material_data。包含搜索表单、表格展示、导入导出删除功能。"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Material Master Data Viewing and Searching (Priority: P1)

Users must be able to view Material Master Data in a table format and search for specific records using multiple search criteria.

**Why this priority**: Data viewing and searching are core functionality for data management. Users need to quickly find and review material data to perform their work. This story enables users to locate specific material master data records efficiently.

**Independent Test**: Can be fully tested by navigating to the Material Master Data page, viewing the data table, and using the search form with various criteria to filter results. This delivers the ability to locate and review material master data records.

**Acceptance Scenarios**:

1. **Given** an authenticated user on the homepage, **When** they navigate to "生产质量/生产质量数据/物料主数据" menu, **Then** they are taken to the Material Master Data page
2. **Given** a user on the Material Master Data page, **When** the page loads, **Then** they see a search form with all required fields, action buttons (Import, Export, Delete) above the table, and a data table displaying material records
3. **Given** a user viewing the data table, **When** they look at the table, **Then** the first column contains checkboxes for row selection and the first two columns are fixed in position when scrolling horizontally
4. **Given** a user with search criteria entered, **When** they submit the search form, **Then** the table displays only records matching the criteria
5. **Given** a user viewing search results, **When** they clear the search form, **Then** the table displays all available records
6. **Given** a user on the Material Master Data page, **When** they enter keywords in any search field, **Then** they can perform quick search to filter results
7. **Given** a user viewing the data table, **When** they scroll horizontally, **Then** the first two columns remain fixed while other columns scroll
8. **Given** a user using date picker fields (if any), **When** they open the date picker, **Then** they see range presets: Today, Last 3 Days, Last Week, Last 30 Days, Last 90 Days

**Search Form Fields**:
- 事业部 (Business Unit - select component)
- 供应商 (Supplier - select component)
- 供应商名称 (Supplier Name - input)
- 奇瑞零件名称 (Chery Part Name - input)
- 供应商总成零件名称 (Supplier Assembly Part Name - input)
- 项目名称 (Project Name - input)
- 工厂名称 (Factory Name - input)
- 芯片MPN标识名称 (Chip MPN Identifier Name - input)

**Note**: All date picker components (if added to search form) MUST support range presets: 今天 (Today), 近三天 (Last 3 Days), 近一周 (Last Week), 近30天 (Last 30 Days), 近90天 (Last 90 Days)

**Table Structure**:
- First column: Checkbox for row selection
- First two columns: Fixed position (remain visible when scrolling horizontally)
- Action buttons above table: Import, Export, Delete

**Table Display Columns**:
- [Checkbox column - first column, fixed]
- 奇瑞零件号 (Chery Part Number - second column, fixed)
- 奇瑞零件名称 (Chery Part Name)
- 事业部编号 (Business Unit Code)
- 事业部 (Business Unit)
- 供应商代码 (Supplier Code)
- 供应商名称 (Supplier Name)
- 供应商总成零件号 (Supplier Assembly Part Number)
- 供应商总成零件名称 (Supplier Assembly Part Name)
- 奇瑞硬件版本号 (Chery Hardware Version Number)
- 奇瑞软件版本号 (Chery Software Version Number)
- 车型 (Vehicle Model)
- 项目名称 (Project Name)
- 是否SOP (Is SOP)
- 数据同步执行时间 (Data Sync Execution Time)
- 工厂代码 (Factory Code)
- 工厂名称 (Factory Name)
- 供应商零件版本号 (Supplier Part Version Number)
- 芯片采购类型 (Chip Procurement Type)
- 芯片MPN标识码 (Chip MPN Identifier Code)
- 芯片MPN标识名称 (Chip MPN Identifier Name)
- 数据来源 (Data Source)
- 物料有效期（天）(Material Validity Period in Days)
- 类型 (Type)
- 创建人登录账号 (Creator Login Account)
- 创建时间 (Creation Time)
- 更新人登录账号 (Updater Account)
- 更新时间 (Update Time)

---

### User Story 2 - Material Master Data Import, Export, and Delete (Priority: P2)

Users must be able to import Material Master Data from external files, export Material Master Data to files with customizable options, and delete selected records.

**Why this priority**: Import, export, and delete functionality enables bulk data operations and data exchange with external systems. These operations are essential for data management workflows and system integration.

**Independent Test**: Can be fully tested by selecting records via checkboxes, exporting data with custom column selection, importing a file, and deleting selected records, verifying that all operations complete successfully and data is correctly processed. This delivers the ability to perform bulk data operations and data exchange.

**Acceptance Scenarios**:

**Import Functionality**:

1. **Given** a user on the Material Master Data page, **When** they click the Import button, **Then** they can select a file to import
2. **Given** a user on the Import dialog, **When** they click the "Download Template" option, **Then** a template file is downloaded with the correct format and column structure
3. **Given** a user with a valid data file, **When** they select the file and confirm import, **Then** the system processes the file and displays import results
4. **Given** a user importing data with validation errors, **When** the import process completes, **Then** error details are displayed and invalid records are not imported
5. **Given** a user importing valid data, **When** the import process completes, **Then** new records appear in the data table and a success message is displayed
6. **Given** a user importing data, **When** duplicate records are detected, **Then** the system handles them according to business rules (update existing or skip)

**Export Functionality**:

7. **Given** a user on the Material Master Data page, **When** they click the Export button, **Then** a dialog titled "自定义导出" (Custom Export) opens
8. **Given** a user in the Custom Export dialog, **When** they view the column selection table, **Then** they see three columns: Checkbox (first column, all checked by default), Attribute Name (second column), and Table Column Name (third column)
9. **Given** a user in the Custom Export dialog, **When** they submit without changing column selections, **Then** all columns are exported with all table data
10. **Given** a user in the Custom Export dialog, **When** they uncheck some column checkboxes and submit, **Then** only selected columns are exported
11. **Given** a user in the Custom Export dialog, **When** they view export mode options, **Then** they see "全部" (All) selected by default and "分页" (Paginated) as an alternative
12. **Given** a user selecting paginated export mode, **When** they set page size and page number, **Then** only the specified page range is exported
13. **Given** a user in the Custom Export dialog, **When** they view the file name field, **Then** they see the default name is "物料主数据" (Material Master Data) which can be manually edited
14. **Given** a user with custom export settings, **When** they submit the export, **Then** a file is downloaded with the selected columns, data range, and custom file name

**Delete Functionality**:

15. **Given** a user on the Material Master Data page, **When** no rows are selected, **Then** the Delete button is disabled (disabled=true)
16. **Given** a user viewing the data table, **When** they select one or more rows using checkboxes, **Then** the Delete button becomes enabled (disabled=false)
17. **Given** a user with selected rows, **When** they click the Delete button, **Then** a confirmation dialog appears
18. **Given** a user confirming deletion, **When** they confirm the action, **Then** the selected records are deleted and removed from the table
19. **Given** a user after deletion, **When** the operation completes, **Then** a success message is displayed and the table refreshes to show remaining records

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

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide navigation menu structure: "生产质量/生产质量数据/物料主数据"
- **FR-002**: System MUST route to Material Master Data page using path: `manufacture/baseData/supplier_pro_material_data`
- **FR-003**: System MUST display Material Master Data in a table format with all required columns
- **FR-004**: System MUST provide a search form with all specified search fields
- **FR-005**: System MUST support quick search functionality using keywords entered in search fields
- **FR-006**: System MUST filter table data based on search criteria submitted by users
- **FR-007**: System MUST support select components for "事业部" and "供应商" fields with dropdown options
- **FR-008**: System MUST support input fields (default) for all other search fields
- **FR-009**: System MUST support date picker components with range presets (Today, Last 3 Days, Last Week, Last 30 Days, Last 90 Days) for any date picker fields added to the search form
- **FR-010**: System MUST display all required table columns with proper data formatting
- **FR-011**: System MUST display a checkbox column as the first column in the data table for row selection
- **FR-012**: System MUST fix the first two columns in position when users scroll horizontally in the data table
- **FR-013**: System MUST display Import, Export, and Delete buttons above the data table
- **FR-014**: System MUST support data import functionality with file selection capability
- **FR-015**: System MUST provide a "Download Template" option in the import functionality
- **FR-016**: System MUST validate imported data and report errors for invalid records
- **FR-017**: System MUST handle duplicate records during import according to business rules
- **FR-018**: System MUST open a "自定义导出" (Custom Export) dialog when Export button is clicked
- **FR-019**: System MUST display a column selection table in the Custom Export dialog with three columns: Checkbox, Attribute Name, and Table Column Name
- **FR-020**: System MUST have all column checkboxes checked by default in the Custom Export dialog
- **FR-021**: System MUST export all columns when user submits Custom Export dialog without changing selections
- **FR-022**: System MUST export only selected columns when user unchecks some column checkboxes
- **FR-023**: System MUST default export mode to "全部" (All) in the Custom Export dialog
- **FR-024**: System MUST support "分页" (Paginated) export mode with configurable page size and page number
- **FR-025**: System MUST default export file name to "物料主数据" (Material Master Data) in the Custom Export dialog
- **FR-026**: System MUST allow users to manually edit the export file name in the Custom Export dialog
- **FR-027**: System MUST disable the Delete button by default (when no rows are selected)
- **FR-028**: System MUST enable the Delete button when one or more rows are selected via checkboxes
- **FR-029**: System MUST require confirmation before deleting selected records
- **FR-030**: System MUST delete selected records and refresh the table after confirmed deletion
- **FR-031**: System MUST persist Material Master Data and maintain data integrity
- **FR-032**: System MUST display appropriate error messages for failed operations

### Key Entities *(include if feature involves data)*

- **Material Master Data Record**: Represents a Material Master Data entry. Key attributes: Chery part number and name, business unit, supplier information, assembly part details, version numbers (hardware, software, part), vehicle model, project name, SOP status, sync execution time, factory information, chip procurement details, MPN identifiers, data source, validity period, type, timestamps, creator and updater accounts
- **Search Criteria**: Represents user input for filtering Material Master Data. Key attributes: business unit, supplier, supplier name, part names, project name, factory name, chip MPN identifier name
- **Import/Export File**: Represents data files used for bulk operations. Key attributes: file format, data structure, validation rules
- **Export Configuration**: Represents user settings for data export. Key attributes: selected columns, export mode (all or paginated), page size, page number, custom file name
- **Table Selection**: Represents user's row selection state. Key attributes: selected row identifiers, selection count, delete button enabled state

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can navigate to Material Master Data page and view data table within 2 seconds of page load
- **SC-002**: Search operations return filtered results within 1 second for datasets up to 10,000 records
- **SC-003**: Users can successfully export Material Master Data to file format within 5 seconds for datasets up to 5,000 records
- **SC-004**: Users can successfully import Material Master Data from file with 95% success rate for valid data files
- **SC-005**: 90% of users can complete a search operation on first attempt without assistance
- **SC-006**: System handles concurrent access from 50 users without performance degradation
- **SC-007**: Import validation catches and reports 100% of data format errors before processing
- **SC-008**: Users can delete selected records within 3 seconds for batches up to 100 records
