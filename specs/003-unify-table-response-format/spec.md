# Feature Specification: 统一 Mock 服务表格数据返回格式

**Feature Branch**: `003-unify-table-response-format`  
**Created**: 2025-11-19  
**Status**: Draft  
**Input**: User description: "我希望mock服务的表格数据返回的格式可以参考apps/backend-mock/api/table/list.ts文件"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - 统一表格数据 API 响应格式 (Priority: P1)

作为前端开发者，我希望所有表格数据 API 返回统一的响应格式，这样我可以复用相同的数据处理逻辑，减少代码重复，提高开发效率。

**Why this priority**: 这是基础设施级别的改进，影响所有使用表格数据的功能。统一的格式可以减少前端代码的复杂性，降低维护成本，提高代码质量。

**Independent Test**: 可以独立测试通过验证所有表格数据 API 端点返回相同的响应结构，前端代码可以使用统一的数据处理函数。

**Acceptance Scenarios**:

1. **Given** 存在多个表格数据 API 端点（如 BOM 列表、物料列表等），**When** 调用这些 API，**Then** 所有 API 返回相同的响应格式结构
2. **Given** 前端代码需要处理表格数据，**When** 使用统一的数据处理函数，**Then** 可以正确处理所有表格数据 API 的响应
3. **Given** 新的表格数据 API 被创建，**When** 实现该 API，**Then** 自动遵循统一的响应格式标准

---

### Edge Cases

- 当 API 返回空数据列表时，响应格式应该保持一致
- 当分页参数无效时（如负数、超出范围），响应格式应该保持一致
- 当发生错误时，错误响应格式应该与成功响应格式在结构上保持一致（使用相同的包装结构）

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: 所有表格数据 API 端点 MUST 使用 `usePageResponseSuccess` 工具函数返回响应
- **FR-002**: 响应格式 MUST 包含以下结构：`{ code: 0, data: { items: T[], total: number }, error: null, message: 'ok' }`
- **FR-003**: 响应中的 `items` 字段 MUST 包含当前页的数据数组
- **FR-004**: 响应中的 `total` 字段 MUST 包含符合查询条件的总记录数（不是当前页的数量）
- **FR-005**: 响应中的 `code` 字段 MUST 为 0 表示成功
- **FR-006**: 所有表格数据 API MUST 支持分页参数（page, pageSize）
- **FR-007**: 分页参数 MUST 被规范化处理，兼容数组格式的查询参数
- **FR-008**: 所有表格数据 API MUST 在响应前进行身份验证检查

### Key Entities *(include if feature involves data)*

- **表格数据响应 (Table Data Response)**: 表示分页表格数据的标准响应结构
  - `code`: 响应状态码（0 表示成功）
  - `data`: 响应数据对象
    - `items`: 当前页的数据项数组
    - `total`: 符合查询条件的总记录数
  - `error`: 错误信息（成功时为 null）
  - `message`: 响应消息（通常为 'ok'）

- **分页参数 (Pagination Parameters)**: 控制数据分页的查询参数
  - `page`: 页码（从 1 开始）
  - `pageSize`: 每页记录数

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 所有现有的表格数据 API 端点（至少包括 BOM 列表 API）在重构后返回统一的响应格式
- **SC-002**: 前端代码可以使用单一的数据处理函数处理所有表格数据 API 响应，代码重复率降低 100%
- **SC-003**: 新创建的表格数据 API 在首次实现时就遵循统一格式，无需后续重构
- **SC-004**: 所有表格数据 API 的分页行为一致，用户在不同页面间切换时体验一致
- **SC-005**: API 响应格式的变更不会导致前端代码需要修改超过 1 个文件

## Assumptions

- 现有的 `usePageResponseSuccess` 工具函数已经实现并可用
- 前端代码可以适配新的响应格式（从 `data.list` 改为 `data.items`）
- 所有表格数据 API 都支持分页功能
- 响应格式的统一不会影响现有的业务逻辑

## Dependencies

- 依赖现有的 `apps/backend-mock/utils/response.ts` 中的 `usePageResponseSuccess` 函数
- 需要更新前端代码以适配新的响应格式（从 `data.list` 改为 `data.items`）

## Out of Scope

- 不涉及非表格数据 API 的响应格式统一
- 不涉及错误响应格式的详细规范（仅要求结构一致）
- 不涉及 API 性能优化
- 不涉及数据过滤和排序逻辑的变更
