# Data Model: Material Master Data Page

**Date**: 2025-01-27  
**Feature**: Material Master Data Page  
**Phase**: 1 - Design

## Entities

### Material Master Data Record

Represents a Material Master Data entry in the system.

**Key Attributes**:

| Attribute | Type | Required | Description | Validation Rules |
|-----------|------|----------|-------------|------------------|
| `id` | string | Yes | Unique identifier | UUID or auto-increment |
| `cheryPartNumber` | string | Yes | 奇瑞零件号 | Max 100 chars, fixed column |
| `cheryPartName` | string | No | 奇瑞零件名称 | Max 200 chars |
| `businessUnitCode` | string | No | 事业部编号 | Max 50 chars |
| `businessUnit` | string | No | 事业部 | Max 100 chars |
| `supplierCode` | string | No | 供应商代码 | Max 50 chars |
| `supplierName` | string | No | 供应商名称 | Max 200 chars |
| `supplierAssemblyPartNumber` | string | No | 供应商总成零件号 | Max 100 chars |
| `supplierAssemblyPartName` | string | No | 供应商总成零件名称 | Max 200 chars |
| `cheryHardwareVersionNumber` | string | No | 奇瑞硬件版本号 | Max 50 chars |
| `cherySoftwareVersionNumber` | string | No | 奇瑞软件版本号 | Max 50 chars |
| `vehicleModel` | string | No | 车型 | Max 100 chars |
| `projectName` | string | No | 项目名称 | Max 200 chars |
| `isSOP` | boolean | No | 是否SOP | true/false |
| `dataSyncExecutionTime` | Date | No | 数据同步执行时间 | Valid date |
| `factoryCode` | string | No | 工厂代码 | Max 50 chars |
| `factoryName` | string | No | 工厂名称 | Max 200 chars |
| `supplierPartVersionNumber` | string | No | 供应商零件版本号 | Max 50 chars |
| `chipProcurementType` | string | No | 芯片采购类型 | Max 50 chars |
| `chipMPNIdentifierCode` | string | No | 芯片MPN标识码 | Max 100 chars |
| `chipMPNIdentifierName` | string | No | 芯片MPN标识名称 | Max 200 chars |
| `dataSource` | string | No | 数据来源 | Max 100 chars |
| `materialValidityPeriodDays` | number | No | 物料有效期（天） | >= 0 |
| `type` | string | No | 类型 | Max 50 chars |
| `creatorLoginAccount` | string | Yes | 创建人登录账号 | Max 100 chars |
| `createTime` | Date | Yes | 创建时间 | Auto-generated |
| `updaterAccount` | string | No | 更新人账号 | Max 100 chars |
| `updateTime` | Date | Yes | 更新时间 | Auto-updated |

**Unique Constraints**:
- `id` must be unique

**Relationships**:
- None (flat structure for MVP)

**State Transitions**:
- Created → Active (on import/create)
- Active → Deleted (on delete operation, soft delete or hard delete)

### Search Criteria

Represents user input for filtering Material Master Data.

**Key Attributes**:

| Attribute | Type | Required | Description | Component Type |
|-----------|------|----------|-------------|----------------|
| `businessUnit` | string | No | 事业部 | Select (dropdown) |
| `supplier` | string | No | 供应商 | Select (dropdown) |
| `supplierName` | string | No | 供应商名称 | Input (text) |
| `cheryPartName` | string | No | 奇瑞零件名称 | Input (text) |
| `supplierAssemblyPartName` | string | No | 供应商总成零件名称 | Input (text) |
| `projectName` | string | No | 项目名称 | Input (text) |
| `factoryName` | string | No | 工厂名称 | Input (text) |
| `chipMPNIdentifierName` | string | No | 芯片MPN标识名称 | Input (text) |

**Validation Rules**:
- All fields are optional (empty form shows all records)
- Text fields: trim whitespace, case-insensitive search
- Select fields: exact match

### Export Configuration

Represents user settings for data export.

**Key Attributes**:

| Attribute | Type | Required | Description | Default |
|-----------|------|----------|-------------|---------|
| `selectedColumns` | string[] | Yes | Column keys to export | All columns |
| `exportMode` | 'all' \| 'paginated' | Yes | Export mode | 'all' |
| `pageSize` | number | No | Page size (if paginated) | 100 |
| `pageNumber` | number | No | Page number (if paginated) | 1 |
| `fileName` | string | Yes | Export file name | '物料主数据' |

**Validation Rules**:
- `selectedColumns`: At least one column must be selected
- `exportMode`: Must be 'all' or 'paginated'
- `pageSize`: 1-1000 if paginated
- `pageNumber`: >= 1 if paginated
- `fileName`: Non-empty, valid file name characters

### Table Selection State

Represents user's row selection state in the data table.

**Key Attributes**:

| Attribute | Type | Required | Description |
|-----------|------|----------|-------------|
| `selectedRowIds` | string[] | Yes | Selected row identifiers | 
| `selectionCount` | number | Yes | Number of selected rows |
| `deleteButtonEnabled` | boolean | Yes | Delete button enabled state |

**State Transitions**:
- No selection → Selection (user clicks checkbox)
- Selection → No selection (user unchecks or clears selection)
- Selection count changes → Delete button state updates

### Import File Metadata

Represents metadata for imported files.

**Key Attributes**:

| Attribute | Type | Required | Description |
|-----------|------|----------|-------------|
| `fileName` | string | Yes | Imported file name |
| `fileSize` | number | Yes | File size in bytes |
| `fileType` | string | Yes | File MIME type (e.g., 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') |
| `uploadTime` | Date | Yes | Upload timestamp |

### Import Result

Represents the result of an import operation.

**Key Attributes**:

| Attribute | Type | Required | Description |
|-----------|------|----------|-------------|
| `totalRows` | number | Yes | Total number of rows in file |
| `successCount` | number | Yes | Number of successfully imported rows |
| `failedCount` | number | Yes | Number of failed rows |
| `errors` | ImportError[] | No | Array of import errors |

### Import Error

Represents an error during import operation.

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
2. Form values are collected via `gridApi.getFormValues()`
3. Search parameters are sent to API: `GET /api/manufacture/material/list?{params}`
4. API returns filtered results: `{ items: MaterialRecord[], total: number }`
5. Table displays filtered results

### Import Flow

1. User clicks Import button → ImportDialog opens
2. User downloads template (optional) → `GET /api/manufacture/material/template`
3. User selects file → File validation
4. User confirms import → `POST /api/manufacture/material/import` with file
5. API processes file → Returns ImportResult
6. Dialog displays results → User closes dialog
7. Table refreshes → `gridApi.query()`

### Export Flow

1. User clicks Export button → ExportDialog opens
2. User selects columns (default: all selected)
3. User selects export mode (default: 'all')
4. User sets pagination (if paginated mode)
5. User edits file name (default: '物料主数据')
6. User confirms export → `POST /api/manufacture/material/export` with config
7. API generates file → Returns file download
8. Browser downloads file → Dialog closes

### Delete Flow

1. User selects rows via checkboxes
2. Delete button becomes enabled
3. User clicks Delete button → Confirmation dialog appears
4. User confirms → `POST /api/manufacture/material/delete` with `{ ids: string[] }`
5. API deletes records → Returns success
6. Table refreshes → `gridApi.query()`

## State Transitions

### Material Record Lifecycle

```
[Not Exists] → [Created] → [Active] → [Deleted]
                    ↓
              [Updated]
```

### Search Panel State

```
[Page Load] → [Collapsed (default)]
                  ↓
          [User Clicks Expand]
                  ↓
              [Expanded]
                  ↓
          [User Clicks Collapse]
                  ↓
              [Collapsed]
```

### Delete Button State

```
[No Selection] → [Disabled]
      ↓
[User Selects Row(s)]
      ↓
[Enabled]
      ↓
[User Unselects All]
      ↓
[Disabled]
```

### Report Button State

```
[No Selection] → [Disabled]
      ↓
[User Selects Row(s)]
      ↓
[Enabled]
      ↓
[User Unselects All]
      ↓
[Disabled]
```

**Note**: Report button state transitions match Delete button state transitions exactly.

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
- Report button enable/disable logic must match delete button exactly

## Relationships

- **Material Master Data Record** is the primary entity
- **Search Criteria** filters **Material Master Data Record**
- **Export Configuration** exports **Material Master Data Record**
- **Table Selection State** tracks selected **Material Master Data Record** instances
- **Import Result** contains **Import Error** instances
- **Report Request** submits **Material Master Data Record** instances to external systems

## Constraints

1. Material records must have unique `id`
2. Search criteria are all optional
3. Export must have at least one selected column
4. Delete requires at least one selected row
5. Report requires at least one selected row (same as delete)
6. Report button enable/disable logic must match delete button exactly
7. Import file must be valid format (.xlsx, .xls, .csv)
8. Table checkbox column must be first column
9. Table must not display sequence column
10. Search form width must be 100%
11. Search panel must default to collapsed state
12. All action buttons (Import, Export, Delete, Report) must maintain consistent visual spacing (8px gap)

