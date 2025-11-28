# Data Model: 统一 Mock 服务表格数据返回格式

**Feature**: 003-unify-table-response-format  
**Date**: 2025-11-19

## Overview

本文档定义了统一的表格数据 API 响应格式的数据模型。所有表格数据 API 端点必须遵循此格式。

## Entities

### 表格数据响应 (Table Data Response)

表示分页表格数据的标准响应结构。

**Structure**:
```typescript
{
  code: number;           // 响应状态码，0 表示成功
  data: {
    items: T[];          // 当前页的数据项数组
    total: number;       // 符合查询条件的总记录数
  };
  error: null | string;  // 错误信息，成功时为 null
  message: string;       // 响应消息，通常为 'ok'
}
```

**Fields**:
- `code` (number, required): 响应状态码
  - `0`: 成功
  - `-1`: 错误
  - 其他值：根据具体错误类型定义
- `data` (object, required): 响应数据对象
  - `items` (array, required): 当前页的数据项数组，类型为泛型 `T[]`
  - `total` (number, required): 符合查询条件的总记录数（不是当前页的数量）
- `error` (null | string, required): 错误信息
  - 成功时：`null`
  - 失败时：错误描述字符串
- `message` (string, required): 响应消息
  - 成功时：通常为 `'ok'`
  - 失败时：错误消息

**Validation Rules**:
- `code` 必须为整数
- `data.items` 必须为数组（可以为空数组）
- `data.total` 必须为非负整数
- `data.total` 必须大于或等于 `data.items.length`
- `error` 在 `code === 0` 时必须为 `null`
- `message` 不能为空字符串

**Examples**:

成功响应（有数据）:
```json
{
  "code": 0,
  "data": {
    "items": [
      { "id": "1", "name": "Item 1" },
      { "id": "2", "name": "Item 2" }
    ],
    "total": 100
  },
  "error": null,
  "message": "ok"
}
```

成功响应（空数据）:
```json
{
  "code": 0,
  "data": {
    "items": [],
    "total": 0
  },
  "error": null,
  "message": "ok"
}
```

错误响应:
```json
{
  "code": -1,
  "data": null,
  "error": "Unauthorized Exception",
  "message": "Unauthorized Exception"
}
```

### 分页参数 (Pagination Parameters)

控制数据分页的查询参数。

**Structure**:
```typescript
{
  page?: number;      // 页码，从 1 开始，默认为 1
  pageSize?: number;  // 每页记录数，默认为 10，最大为 100
}
```

**Fields**:
- `page` (number, optional): 页码
  - 最小值：1
  - 默认值：1
  - 如果提供无效值（负数、0、非数字），将被规范化为 1
- `pageSize` (number, optional): 每页记录数
  - 最小值：1
  - 最大值：100
  - 默认值：10
  - 如果提供无效值（负数、0、非数字），将被规范化为 10
  - 如果超过最大值，将被限制为 100

**Validation Rules**:
- `page` 必须为正整数（如果提供）
- `pageSize` 必须在 1-100 范围内（如果提供）
- 查询参数可能以数组形式出现（如 `?page=1&page=2`），需要规范化处理

**Examples**:
```
GET /api/manufacture/bom/list?page=1&pageSize=10
GET /api/manufacture/bom/list?page=2
GET /api/manufacture/bom/list?pageSize=20
GET /api/manufacture/bom/list
```

## Data Flow

### 请求流程

1. 客户端发送 GET 请求，包含分页参数（可选）
2. 服务器验证身份（JWT token）
3. 服务器规范化分页参数
4. 服务器过滤数据（根据查询条件）
5. 服务器分页数据
6. 服务器使用 `usePageResponseSuccess` 包装响应
7. 服务器返回统一格式的响应

### 响应处理流程

1. 客户端接收响应
2. 客户端检查 `code` 字段
3. 如果 `code === 0`，读取 `data.items` 和 `data.total`
4. 如果 `code !== 0`，处理错误（读取 `error` 和 `message`）

## State Transitions

### 响应状态

```
[Request] → [Processing] → [Success Response (code: 0)]
                              ↓
                         [Error Response (code: -1)]
```

## Relationships

- **Table Data Response** 包含 **Pagination Parameters** 的处理结果
- **Table Data Response** 的 `data.items` 数组元素类型由具体的 API 端点定义（如 `BOMRecord[]`）

## Constraints

1. 所有表格数据 API 必须使用 `usePageResponseSuccess` 工具函数
2. 响应格式必须严格遵循上述结构
3. 分页参数必须被规范化处理
4. 错误响应必须使用统一的错误响应格式（`useResponseError` 或类似函数）

