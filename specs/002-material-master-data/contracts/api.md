# API Contracts: Material Master Data Page

**Date**: 2025-11-20  
**Feature**: Material Master Data Page  
**Phase**: 1 - Design

## Base URL

- Development: `http://localhost:5173/api` (via Vite proxy to backend-mock)
- Mock Service: `http://localhost:3000/api` (Nitro/H3 backend-mock)

## Authentication

All endpoints (except login) require authentication via Bearer token in Authorization header:

```
Authorization: Bearer <access_token>
```

## Endpoints

### 1. Get Material Master Data List

**Endpoint**: `GET /api/manufacture/material/list`

**Description**: Retrieve paginated list of Material Master Data records with optional search filters.

**Query Parameters**:

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `page` | number | No | Page number (default: 1) |
| `pageSize` | number | No | Page size (default: 10, max: 100) |
| `businessUnit` | string | No | Filter by 事业部 |
| `supplier` | string | No | Filter by 供应商 |
| `supplierName` | string | No | Filter by 供应商名称 (partial match) |
| `cheryPartName` | string | No | Filter by 奇瑞零件名称 (partial match) |
| `supplierAssemblyPartName` | string | No | Filter by 供应商总成零件名称 (partial match) |
| `projectName` | string | No | Filter by 项目名称 (partial match) |
| `factoryName` | string | No | Filter by 工厂名称 (partial match) |
| `chipMPNIdentifierName` | string | No | Filter by 芯片MPN标识名称 (partial match) |
| `sortBy` | string | No | Sort field (default: 'createTime') |
| `sortOrder` | 'asc' \| 'desc' | No | Sort order (default: 'desc') |

**Response**:

```typescript
{
  code: 0,
  message: 'ok',
  data: {
    items: MaterialRecord[],
    total: number,
  },
  error: null,
}
```

**MaterialRecord Type**:
```typescript
interface MaterialRecord {
  id: string;
  cheryPartNumber: string;
  cheryPartName?: string;
  businessUnitCode?: string;
  businessUnit?: string;
  supplierCode?: string;
  supplierName?: string;
  supplierAssemblyPartNumber?: string;
  supplierAssemblyPartName?: string;
  cheryHardwareVersionNumber?: string;
  cherySoftwareVersionNumber?: string;
  vehicleModel?: string;
  projectName?: string;
  isSOP?: boolean;
  dataSyncExecutionTime?: Date;
  factoryCode?: string;
  factoryName?: string;
  supplierPartVersionNumber?: string;
  chipProcurementType?: string;
  chipMPNIdentifierCode?: string;
  chipMPNIdentifierName?: string;
  dataSource?: string;
  materialValidityPeriodDays?: number;
  type?: string;
  creatorLoginAccount: string;
  createTime: Date;
  updaterAccount?: string;
  updateTime: Date;
}
```

**Error Responses**:
- `401 Unauthorized`: Missing or invalid token
- `400 Bad Request`: Invalid query parameters

---

### 2. Import Material Master Data

**Endpoint**: `POST /api/manufacture/material/import`

**Description**: Import Material Master Data from uploaded file.

**Request**:

- Content-Type: `multipart/form-data`
- Body:
  - `file`: File (required) - Excel (.xlsx, .xls) or CSV (.csv) file
  - `overwriteDuplicates`: boolean (optional, default: true) - Whether to update existing records

**Response**:

```typescript
{
  code: 0,
  message: 'ok',
  data: {
    totalRows: number,
    successCount: number,
    failedCount: number,
    duplicateCount: number,
    errors?: Array<{
      rowNumber: number;
      field?: string;
      message: string;
      value?: any;
    }>
  },
  error: null,
}
```

**Error Responses**:
- `401 Unauthorized`: Missing or invalid token
- `400 Bad Request`: Invalid file format, file too large (>10MB), or validation errors
- `500 Internal Server Error`: Server error during import

---

### 3. Export Material Master Data

**Endpoint**: `POST /api/manufacture/material/export`

**Description**: Export Material Master Data to file with customizable columns and filters.

**Request**:

- Content-Type: `application/json`
- Body:
```typescript
{
  selectedColumns: string[]; // Column keys to export
  exportMode: 'all' | 'paginated';
  pageSize?: number; // Required if exportMode is 'paginated'
  pageNumber?: number; // Required if exportMode is 'paginated'
  fileName?: string; // Default: '物料主数据'
  // Optional: same search filters as GET /list
  businessUnit?: string;
  supplier?: string;
  supplierName?: string;
  cheryPartName?: string;
  supplierAssemblyPartName?: string;
  projectName?: string;
  factoryName?: string;
  chipMPNIdentifierName?: string;
}
```

**Response**:

- Content-Type: `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet` (Excel) or `text/csv` (CSV)
- Content-Disposition: `attachment; filename="<fileName>.xlsx"`
- Body: File binary data

**Error Responses**:
- `401 Unauthorized`: Missing or invalid token
- `400 Bad Request`: Invalid export configuration
- `500 Internal Server Error`: Server error during export

---

### 4. Delete Material Master Data

**Endpoint**: `POST /api/manufacture/material/delete`

**Description**: Delete selected Material Master Data records.

**Request**:

- Content-Type: `application/json`
- Body:
```typescript
{
  ids: string[]; // Array of record IDs to delete
}
```

**Response**:

```typescript
{
  code: 0,
  message: 'ok',
  data: {
    deletedCount: number;
    failedIds?: string[]; // IDs that failed to delete
  },
  error: null,
}
```

**Error Responses**:
- `401 Unauthorized`: Missing or invalid token
- `400 Bad Request`: Empty ids array or invalid IDs
- `404 Not Found`: One or more IDs not found
- `500 Internal Server Error`: Server error during deletion

---

### 5. Download Import Template

**Endpoint**: `GET /api/manufacture/material/template`

**Description**: Download Excel template file for Material Master Data import.

**Response**:

- Content-Type: `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`
- Content-Disposition: `attachment; filename="物料主数据导入模板.xlsx"`
- Body: Excel file binary data

**Template Structure**:
- First row: Column headers (Chinese names)
- Columns match MaterialRecord fields (excluding auto-generated: id, createTime, updateTime, creatorLoginAccount, updaterAccount)

**Error Responses**:
- `401 Unauthorized`: Missing or invalid token
- `500 Internal Server Error`: Server error generating template

---

### 6. Report Material Master Data

**Endpoint**: `POST /api/manufacture/material/report`

**Description**: Submit Material Master Data to external reporting system.

**Request Body**:

```typescript
{
  // Optional: specific record IDs to report. If not provided, reports all visible records
  recordIds?: string[];
}
```

**Response**:

```typescript
{
  code: 0,
  message: 'ok',
  data: {
    success: boolean;
    reportedCount: number;
    message?: string;
  },
  error: null,
}
```

**Error Responses**:
- `401 Unauthorized`: Missing or invalid token
- `400 Bad Request`: Invalid request parameters
- `500 Internal Server Error`: Server error or external system unavailable

**Example Request**:
```json
{
  "recordIds": ["MAT001", "MAT002", "MAT003"]
}
```

**Example Response (Success)**:
```json
{
  "code": 0,
  "message": "ok",
  "data": {
    "success": true,
    "reportedCount": 3,
    "message": "Successfully reported 3 record(s)"
  },
  "error": null
}
```

**Example Response (Error)**:
```json
{
  "code": 500,
  "message": "Failed to submit data to external reporting system",
  "data": null,
  "error": {
    "code": "REPORT_FAILED",
    "message": "External system is temporarily unavailable"
  }
}
```

---

## Common Response Format

All API responses follow this structure:

```typescript
interface ApiResponse<T> {
  code: number; // 0 for success, non-zero for errors
  message: string; // 'ok' for success, error message for failures
  data: T; // Response data (type varies by endpoint)
  error: null | {
    code: string;
    message: string;
    details?: any;
  };
}
```

## List API Response Format

List endpoints use unified response format via `usePageResponseSuccess`:

```typescript
{
  code: 0,
  message: 'ok',
  data: {
    items: T[], // Array of items for current page
    total: number, // Total number of items (across all pages)
  },
  error: null,
}
```

This format is automatically handled by `useVbenVxeGrid` on the frontend.

## Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| 0 | 200 | Success |
| 400 | 400 | Bad Request (invalid parameters) |
| 401 | 401 | Unauthorized (missing or invalid token) |
| 404 | 404 | Not Found (resource not found) |
| 500 | 500 | Internal Server Error |

## Notes

- All date/time fields use ISO 8601 format (e.g., `2025-01-27T10:30:00Z`)
- File uploads are limited to 10MB
- Pagination: `page` starts at 1, `pageSize` max is 100
- Search filters use case-insensitive partial matching for text fields
- Export file format defaults to Excel (.xlsx), CSV option available

