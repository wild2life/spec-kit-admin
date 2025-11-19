# API Contracts: EDI Backend Management - BOM Master Data

**Date**: 2025-11-19  
**Feature**: EDI Backend Management Project  
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

### 1. Get BOM Master Data List

**Endpoint**: `GET /api/manufacture/bom/list`

**Description**: Retrieve paginated list of BOM master data records with optional search filters.

**Query Parameters**:

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `page` | number | No | Page number (default: 1) |
| `pageSize` | number | No | Page size (default: 10, max: 100) |
| `businessUnit` | string | No | Filter by 事业部 |
| `supplier` | string | No | Filter by 供应商 |
| `cheryPartNumber` | string | No | Filter by 奇瑞零件号 (partial match) |
| `cheryPartName` | string | No | Filter by 奇瑞零件名称 (partial match) |
| `bomCode` | string | No | Filter by BOM编码 (partial match) |
| `bomName` | string | No | Filter by BOM名称 (partial match) |
| `supplierParentPartCode` | string | No | Filter by 供应商父件编码 (partial match) |
| `supplierParentPartName` | string | No | Filter by 供应商父件名称 (partial match) |
| `childPartCode` | string | No | Filter by 子件编码 (partial match) |
| `childPartName` | string | No | Filter by 子件名称 (partial match) |
| `bomVersion` | string | No | Filter by BOM版本 (partial match) |
| `categoryName` | string | No | Filter by 品类名称 (partial match) |
| `bomChangeTimeStart` | string (ISO 8601) | No | Filter by BOM变更时间 start (inclusive) |
| `bomChangeTimeEnd` | string (ISO 8601) | No | Filter by BOM变更时间 end (inclusive) |
| `changeTimeStart` | string (ISO 8601) | No | Filter by 变更时间 start (inclusive) |
| `changeTimeEnd` | string (ISO 8601) | No | Filter by 变更时间 end (inclusive) |
| `sortBy` | string | No | Sort field (default: 'createTime') |
| `sortOrder` | 'asc' \| 'desc' | No | Sort order (default: 'desc') |

**Response**:

```typescript
{
  code: 200,
  message: 'success',
  data: {
    list: BOMRecord[],
    total: number,
    page: number,
    pageSize: number
  }
}
```

**BOMRecord Type**:
```typescript
interface BOMRecord {
  id: string;
  businessUnitCode: string;
  businessUnit?: string;
  supplierCode?: string;
  supplierName?: string;
  cheryPartNumber?: string;
  cheryPartName?: string;
  bomCode: string;
  bomName?: string;
  supplierParentPartCode?: string;
  supplierParentPartName?: string;
  parentPartType?: string;
  parentPartUnit?: string;
  childPartCode?: string;
  childPartName?: string;
  childPartType?: string;
  childPartQuantity?: number;
  childPartUnit?: string;
  bomVersion: string;
  bomChangeTime?: string; // ISO 8601
  createTime: string; // ISO 8601
  updateTime: string; // ISO 8601
  categoryCode?: string;
  categoryName?: string;
  creatorLoginAccount: string;
  dataSource?: string;
  updaterAccount?: string;
}
```

**Error Responses**:
- `401 Unauthorized`: Missing or invalid token
- `400 Bad Request`: Invalid query parameters

---

### 2. Import BOM Master Data

**Endpoint**: `POST /api/manufacture/bom/import`

**Description**: Import BOM master data from uploaded file.

**Request**:

- Content-Type: `multipart/form-data`
- Body:
  - `file`: File (required) - Excel (.xlsx, .xls) or CSV (.csv) file
  - `overwriteDuplicates`: boolean (optional, default: true) - Whether to update existing records

**Response**:

```typescript
{
  code: 200,
  message: 'success',
  data: {
    totalRows: number,
    successCount: number,
    errorCount: number,
    duplicateCount: number,
    errors?: Array<{
      rowNumber: number;
      field?: string;
      message: string;
      value?: any;
    }>
  }
}
```

**Error Responses**:
- `401 Unauthorized`: Missing or invalid token
- `400 Bad Request`: Invalid file format, file too large (>10MB), or validation errors
- `500 Internal Server Error`: Server error during import

---

### 3. Export BOM Master Data

**Endpoint**: `POST /api/manufacture/bom/export`

**Description**: Export BOM master data to file with customizable columns and filters.

**Request**:

- Content-Type: `application/json`
- Body:
```typescript
{
  selectedColumns: string[]; // Column keys to export
  exportMode: 'all' | 'paginated';
  pageSize?: number; // Required if exportMode is 'paginated'
  pageNumber?: number; // Required if exportMode is 'paginated'
  fileName?: string; // Default: 'BOM主数据'
  // Optional: same search filters as GET /list
  businessUnit?: string;
  supplier?: string;
  // ... other search filters
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

### 4. Delete BOM Master Data

**Endpoint**: `POST /api/manufacture/bom/delete`

**Description**: Delete selected BOM master data records.

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
  code: 200,
  message: 'success',
  data: {
    deletedCount: number;
    failedIds?: string[]; // IDs that failed to delete
  }
}
```

**Error Responses**:
- `401 Unauthorized`: Missing or invalid token
- `400 Bad Request`: Empty ids array or invalid IDs
- `404 Not Found`: One or more IDs not found
- `500 Internal Server Error`: Server error during deletion

---

### 5. Download Import Template

**Endpoint**: `GET /api/manufacture/bom/template`

**Description**: Download Excel template file for BOM data import.

**Response**:

- Content-Type: `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`
- Content-Disposition: `attachment; filename="BOM主数据导入模板.xlsx"`
- Body: Excel file binary data

**Template Structure**:
- First row: Column headers (Chinese names)
- Columns match BOMRecord fields (excluding auto-generated: id, createTime, updateTime, creatorLoginAccount, updaterAccount)

**Error Responses**:
- `401 Unauthorized`: Missing or invalid token
- `500 Internal Server Error`: Server error generating template

---

## Common Response Format

All API responses follow this structure:

```typescript
interface ApiResponse<T> {
  code: number; // 200 for success, 4xx/5xx for errors
  message: string; // Human-readable message
  data?: T; // Response data (if success)
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}
```

## Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| 200 | 200 OK | Success |
| 400 | 400 Bad Request | Invalid request parameters |
| 401 | 401 Unauthorized | Authentication required or invalid token |
| 403 | 403 Forbidden | Insufficient permissions |
| 404 | 404 Not Found | Resource not found |
| 500 | 500 Internal Server Error | Server error |

### 5. Report BOM Master Data

**Endpoint**: `POST /api/manufacture/bom/report`

**Description**: Submit BOM master data to external reporting system.

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

**Error Response**:

```typescript
{
  code: 400 | 500,
  message: 'error message',
  data: null,
  error: {
    code: 'REPORT_FAILED' | 'VALIDATION_ERROR' | 'NETWORK_ERROR',
    message: 'Detailed error message',
    details?: any;
  }
}
```

**Status Codes**:
- `200 OK`: Report submitted successfully
- `400 Bad Request`: Invalid request or validation error
- `500 Internal Server Error`: Server error during report submission

## Notes

- All date/time fields use ISO 8601 format (e.g., `2025-11-19T10:30:00Z`)
- Text search filters are case-insensitive and support partial matching
- Pagination: page numbers are 1-based
- File uploads: Max file size 10MB
- Export file formats: Excel (.xlsx) or CSV (.csv) based on request
- Report API: If `recordIds` is not provided, reports all currently visible/filtered records

