# API Contracts: 统一表格数据响应格式

**Feature**: 003-unify-table-response-format  
**Date**: 2025-11-19

## Overview

本文档定义了统一的表格数据 API 响应格式规范。所有表格数据 API 端点必须遵循此规范。

## Base URL

所有 API 端点使用相对路径，base URL 由前端配置决定。

## Authentication

所有 API 端点需要身份验证：
- 请求头：`Authorization: Bearer <token>`
- 如果 token 无效或过期，返回 401 错误

## Response Format

### 成功响应格式

所有表格数据 API 的成功响应必须遵循以下格式：

```typescript
{
  code: 0,
  data: {
    items: T[],
    total: number
  },
  error: null,
  message: 'ok'
}
```

**字段说明**:
- `code` (number): 响应状态码，0 表示成功
- `data` (object): 响应数据对象
  - `items` (array): 当前页的数据项数组，类型为泛型 `T[]`（由具体 API 定义）
  - `total` (number): 符合查询条件的总记录数（不是当前页的数量）
- `error` (null): 成功时为 null
- `message` (string): 响应消息，通常为 'ok'

### 错误响应格式

错误响应格式：

```typescript
{
  code: -1,
  data: null,
  error: string,
  message: string
}
```

**HTTP 状态码**:
- `401`: 未授权（Unauthorized）
- `403`: 禁止访问（Forbidden）
- `500`: 服务器错误（Internal Server Error）

## API Endpoints

### GET /api/manufacture/bom/list

获取 BOM 主数据列表（分页）。

**Query Parameters**:
- `page` (number, optional): 页码，从 1 开始，默认为 1
- `pageSize` (number, optional): 每页记录数，默认为 10，最大为 100
- 其他查询参数：根据具体业务需求定义（如搜索条件、排序等）

**Request Example**:
```
GET /api/manufacture/bom/list?page=1&pageSize=10
Authorization: Bearer <token>
```

**Success Response** (200 OK):
```json
{
  "code": 0,
  "data": {
    "items": [
      {
        "id": "uuid-1",
        "businessUnitCode": "BU001",
        "bomCode": "BOM001",
        "bomVersion": "v1.0",
        ...
      },
      {
        "id": "uuid-2",
        "businessUnitCode": "BU002",
        "bomCode": "BOM002",
        "bomVersion": "v1.1",
        ...
      }
    ],
    "total": 500
  },
  "error": null,
  "message": "ok"
}
```

**Error Response** (401 Unauthorized):
```json
{
  "code": -1,
  "data": null,
  "error": "Unauthorized Exception",
  "message": "Unauthorized Exception"
}
```

**Notes**:
- `data.items` 数组包含当前页的数据项
- `data.total` 表示符合查询条件的总记录数（包括所有页）
- 如果 `page` 超出范围，返回空数组，但 `total` 仍然反映总记录数

## Implementation Requirements

### 后端实现

所有表格数据 API 端点必须：

1. 使用 `usePageResponseSuccess` 工具函数包装响应：
   ```typescript
   return usePageResponseSuccess(
     String(pageNumber),
     String(pageSizeNumber),
     listData,
   );
   ```

2. 规范化分页参数：
   ```typescript
   const pageRaw = Array.isArray(query.page) ? query.page[0] : query.page;
   const pageSizeRaw = Array.isArray(query.pageSize) ? query.pageSize[0] : query.pageSize;
   const pageNumber = Math.max(1, Number.parseInt(String(pageRaw ?? '1'), 10) || 1);
   const pageSizeNumber = Math.min(100, Math.max(1, Number.parseInt(String(pageSizeRaw ?? '10'), 10) || 10));
   ```

3. 进行身份验证检查：
   ```typescript
   const userinfo = verifyAccessToken(event);
   if (!userinfo) {
     return unAuthorizedResponse(event);
   }
   ```

### 前端实现

前端代码必须：

1. 使用统一的响应类型定义：
   ```typescript
   interface TableDataResponse<T> {
     code: number;
     data: {
       items: T[];
       total: number;
     };
     error: null | string;
     message: string;
   }
   ```

2. 统一处理响应：
   ```typescript
   const response = await getBomListApi(params);
   if (response) {
     const items = response.items;  // 使用 items 而不是 list
     const total = response.total;
   }
   ```

## Migration Guide

### 从旧格式迁移到新格式

**旧格式**:
```typescript
{
  code: 200,
  message: 'success',
  data: {
    list: T[],
    total: number,
    page: number,
    pageSize: number
  }
}
```

**新格式**:
```typescript
{
  code: 0,
  data: {
    items: T[],
    total: number
  },
  error: null,
  message: 'ok'
}
```

**迁移步骤**:

1. **后端**:
   - 将自定义响应格式替换为 `usePageResponseSuccess` 调用
   - 移除 `data.page` 和 `data.pageSize` 字段
   - 将 `code: 200` 改为 `code: 0`

2. **前端类型定义**:
   - 更新响应接口：`list` → `items`
   - 移除 `page` 和 `pageSize` 字段

3. **前端响应处理**:
   - `response.data.list` → `response.data.items`
   - 移除对 `response.data.page` 和 `response.data.pageSize` 的引用

## Testing Requirements

### 单元测试

- 验证响应格式符合规范
- 验证分页参数规范化逻辑
- 验证空数据列表的响应格式

### E2E 测试

- 验证前端正确处理新的响应格式
- 验证分页功能正常工作
- 验证错误处理正常工作

