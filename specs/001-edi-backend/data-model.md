# Data Model: EDI Backend Management - BOM Master Data

**Date**: 2025-11-19  
**Feature**: EDI Backend Management Project  
**Phase**: 1 - Design

## Entities

### BOM Master Data Record

Represents a Bill of Materials master data entry in the system.

**Key Attributes**:

| Attribute | Type | Required | Description | Validation Rules |
|-----------|------|----------|-------------|------------------|
| `id` | string | Yes | Unique identifier | UUID or auto-increment |
| `businessUnitCode` | string | Yes | 事业部编号 | Max 50 chars |
| `businessUnit` | string | No | 事业部 | Max 100 chars |
| `supplierCode` | string | No | 供应商代码 | Max 50 chars |
| `supplierName` | string | No | 供应商名称 | Max 200 chars |
| `cheryPartNumber` | string | No | 奇瑞零件号 | Max 100 chars |
| `cheryPartName` | string | No | 奇瑞零件名称 | Max 200 chars |
| `bomCode` | string | Yes | BOM编码 | Max 100 chars, unique with version |
| `bomName` | string | No | BOM名称 | Max 200 chars |
| `supplierParentPartCode` | string | No | 供应商父件编码 | Max 100 chars |
| `supplierParentPartName` | string | No | 供应商父件名称 | Max 200 chars |
| `parentPartType` | string | No | 父件类型 | Max 50 chars |
| `parentPartUnit` | string | No | 父件单位 | Max 20 chars |
| `childPartCode` | string | No | 子件编码 | Max 100 chars |
| `childPartName` | string | No | 子件名称 | Max 200 chars |
| `childPartType` | string | No | 子件类型 | Max 50 chars |
| `childPartQuantity` | number | No | 子件用量 | >= 0 |
| `childPartUnit` | string | No | 子件单位 | Max 20 chars |
| `bomVersion` | string | Yes | BOM版本 | Max 50 chars, unique with bomCode |
| `bomChangeTime` | Date | No | BOM变更时间 | Valid date |
| `createTime` | Date | Yes | 创建时间 | Auto-generated |
| `updateTime` | Date | Yes | 更新时间 | Auto-updated |
| `categoryCode` | string | No | 品类编码 | Max 50 chars |
| `categoryName` | string | No | 品类名称 | Max 100 chars |
| `creatorLoginAccount` | string | Yes | 创建人登录账号 | Max 100 chars |
| `dataSource` | string | No | 数据来源 | Max 100 chars |
| `updaterAccount` | string | No | 更新人账号 | Max 100 chars |

**Unique Constraints**:
- `bomCode` + `bomVersion` combination must be unique

**Relationships**:
- None (flat structure for MVP)

**State Transitions**:
- Created → Active (on import/create)
- Active → Deleted (on delete operation, soft delete or hard delete)

### Search Criteria

Represents user input for filtering BOM data.

**Key Attributes**:

| Attribute | Type | Required | Description | Component Type |
|-----------|------|----------|-------------|----------------|
| `businessUnit` | string | No | 事业部 | Select (dropdown) |
| `supplier` | string | No | 供应商 | Select (dropdown) |
| `cheryPartNumber` | string | No | 奇瑞零件号 | Input (text) |
| `cheryPartName` | string | No | 奇瑞零件名称 | Input (text) |
| `bomCode` | string | No | BOM编码 | Input (text) |
| `bomName` | string | No | BOM名称 | Input (text) |
| `supplierParentPartCode` | string | No | 供应商父件编码 | Input (text) |
| `supplierParentPartName` | string | No | 供应商父件名称 | Input (text) |
| `childPartCode` | string | No | 子件编码 | Input (text) |
| `childPartName` | string | No | 子件名称 | Input (text) |
| `bomVersion` | string | No | BOM版本 | Input (text) |
| `categoryName` | string | No | 品类名称 | Input (text) |
| `bomChangeTime` | [Date, Date] | No | BOM变更时间 | DateRangePicker |
| `changeTime` | [Date, Date] | No | 变更时间 | DateRangePicker |

**Validation Rules**:
- All fields are optional (empty form shows all records)
- Date ranges: start date <= end date
- Text fields: trim whitespace, case-insensitive search

### Export Configuration

Represents user settings for data export.

**Key Attributes**:

| Attribute | Type | Required | Description | Default |
|-----------|------|----------|-------------|---------|
| `selectedColumns` | string[] | Yes | Column keys to export | All columns |
| `exportMode` | 'all' \| 'paginated' | Yes | Export mode | 'all' |
| `pageSize` | number | No | Page size (if paginated) | 100 |
| `pageNumber` | number | No | Page number (if paginated) | 1 |
| `fileName` | string | Yes | Export file name | 'BOM主数据' |

**Validation Rules**:
- `selectedColumns`: At least one column must be selected
- `exportMode`: Must be 'all' or 'paginated'
- `pageSize`: 1-1000 if paginated
- `pageNumber`: >= 1 if paginated
- `fileName`: Max 200 chars, no invalid file system characters

### Table Selection State

Represents user's row selection state in the data table.

**Key Attributes**:

| Attribute | Type | Required | Description |
|-----------|------|----------|-------------|
| `selectedRowKeys` | (string \| number)[] | Yes | Selected row IDs | [] |
| `selectedRows` | BOMRecord[] | Yes | Selected row data | [] |
| `isDeleteEnabled` | boolean | Computed | Delete button enabled state | false |

**Computed Properties**:
- `isDeleteEnabled = selectedRowKeys.length > 0`

### Import File Metadata

Represents metadata about imported files.

**Key Attributes**:

| Attribute | Type | Required | Description |
|-----------|------|----------|-------------|
| `file` | File | Yes | File object |
| `fileName` | string | Yes | File name |
| `fileSize` | number | Yes | File size in bytes |
| `fileType` | string | Yes | MIME type (e.g., 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') |

**Validation Rules**:
- File type: Excel (.xlsx, .xls) or CSV (.csv)
- Max file size: 10MB
- File must match template structure

### Import Result

Represents the result of an import operation.

**Key Attributes**:

| Attribute | Type | Required | Description |
|-----------|------|----------|-------------|
| `totalRows` | number | Yes | Total rows in file |
| `successCount` | number | Yes | Successfully imported rows |
| `errorCount` | number | Yes | Rows with errors |
| `errors` | ImportError[] | No | Error details |
| `duplicateCount` | number | Yes | Duplicate rows (updated) |

### Import Error

Represents an error during import.

**Key Attributes**:

| Attribute | Type | Required | Description |
|-----------|------|----------|-------------|
| `rowNumber` | number | Yes | Row number in file (1-based) |
| `field` | string | No | Field name with error |
| `message` | string | Yes | Error message |
| `value` | any | No | Invalid value |

## Data Flow

### Search Flow
1. User enters search criteria in form
2. Form values are debounced (300-500ms)
3. API request sent with search parameters
4. Backend filters mock data based on criteria
5. Filtered results returned and displayed in table

### Import Flow
1. User clicks Import button
2. Import dialog opens
3. User can download template or select file
4. File selected and validated (type, size)
5. File uploaded to backend
6. Backend parses file and validates data
7. Valid records imported, errors returned
8. Import result displayed to user
9. Table refreshed with new data

### Export Flow
1. User clicks Export button
2. Custom Export dialog opens
3. User selects columns to export (default: all)
4. User selects export mode (all or paginated)
5. User sets file name (default: 'BOM主数据')
6. User confirms export
7. API request sent with export configuration
8. Backend generates file with selected data
9. File downloaded to user's device

### Delete Flow
1. User selects rows via checkboxes
2. Delete button becomes enabled
3. User clicks Delete button
4. Confirmation dialog appears
5. User confirms deletion
6. API request sent with selected row IDs
7. Backend deletes records
8. Success message displayed
9. Table refreshed with remaining data

## Mock Data Generation

For development and testing, generate mock BOM records with:
- Realistic Chinese business unit and supplier names
- Valid part numbers and codes
- Random but valid dates within last year
- Various BOM versions (v1.0, v1.1, v2.0, etc.)
- Realistic quantities and units
- Diverse category names

**Sample Mock Data Size**: 100-1000 records for testing

## Report Request Entity

### Report Request

Represents a data reporting operation to external systems.

**Key Attributes**:

| Attribute | Type | Required | Description |
|-----------|------|----------|-------------|
| `recordIds` | string[] | No | Specific record IDs to report. If not provided, reports all visible records |
| `status` | 'pending' \| 'submitting' \| 'success' \| 'failed' | Yes | Current status of the report operation |
| `submittedAt` | Date | No | Timestamp when report was submitted |
| `errorMessage` | string | No | Error message if report failed |

**State Transitions**:

```
[Initial] → [User Clicks Report Button]
                ↓
        [Confirmation Dialog Shown]
                ↓
    [User Confirms] → [Status: 'submitting']
                ↓
    [API Call Success] → [Status: 'success']
                ↓
    [Success Message Displayed]
    
    OR
    
    [API Call Failed] → [Status: 'failed']
                ↓
    [Error Message Displayed]
```

**Validation Rules**:
- Report can be submitted with or without specific record IDs
- If recordIds is empty or not provided, all currently visible/filtered records are reported
- Report operation requires user confirmation before API call
- Report button should be disabled during submission to prevent duplicate requests

