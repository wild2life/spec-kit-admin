# Research: 统一 Mock 服务表格数据返回格式

**Feature**: 003-unify-table-response-format  
**Date**: 2025-11-19

## Research Objectives

1. 分析现有的 `usePageResponseSuccess` 工具函数的实现和使用方式
2. 确定当前 BOM 列表 API 的响应格式与标准格式的差异
3. 确定前端代码需要修改的位置和方式
4. 评估向后兼容性和迁移策略

## Findings

### 1. usePageResponseSuccess 工具函数分析

**Decision**: 使用现有的 `usePageResponseSuccess` 工具函数

**Rationale**: 
- 该函数已存在于 `apps/backend-mock/utils/response.ts`
- 函数签名：`usePageResponseSuccess<T>(page: number | string, pageSize: number | string, list: T[], { message = 'ok' } = {})`
- 返回格式：`{ code: 0, data: { items: T[], total: number }, error: null, message: 'ok' }`
- 该函数已经实现了分页逻辑和响应包装

**Alternatives considered**:
- 创建新的工具函数：被拒绝，因为会引入不必要的重复代码
- 直接返回自定义格式：被拒绝，因为不符合统一标准的要求

### 2. 当前 BOM 列表 API 响应格式

**Decision**: 当前格式需要重构

**Current Format**:
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

**Target Format** (使用 usePageResponseSuccess):
```typescript
{
  code: 0,
  data: {
    items: BOMRecord[],
    total: number
  },
  error: null,
  message: 'ok'
}
```

**Key Differences**:
1. `code`: 200 → 0 (标准成功码)
2. `data.list` → `data.items` (字段名变更)
3. `data.page` 和 `data.pageSize` 被移除（这些信息可以从请求参数获取）
4. 添加了 `error: null` 字段

**Rationale**: 
- 统一格式使前端代码可以复用相同的数据处理逻辑
- 移除冗余的分页信息（page, pageSize）简化响应结构
- 使用标准的成功码（0）符合项目规范

### 3. 前端代码修改策略

**Decision**: 使用 `useVbenVxeGrid` 重构前端表格组件，参考 playground 代码风格

**Required Changes**:
1. 更新 `BomListResponse` 接口定义：
   - `list` → `items`
   - 移除 `page` 和 `pageSize` 字段
2. 重构前端组件使用 `useVbenVxeGrid`：
   - 使用 `VbenFormProps` 定义搜索表单
   - 使用 `VxeTableGridOptions` 定义表格配置
   - 通过 `proxyConfig.ajax.query` 处理数据请求
   - 利用 `useVbenVxeGrid` 的内置响应格式处理（`result: 'items', total: 'total'`）

**Rationale**: 
- `useVbenVxeGrid` 已配置为期望 `{ items: T[], total: number }` 格式，与统一响应格式完美匹配
- 参考 playground 代码风格，保持项目代码一致性
- `useVbenVxeGrid` 提供了更强大的表格功能（搜索、分页、导出等）
- 减少手动数据管理代码，提高开发效率
- 统一的响应格式使 `useVbenVxeGrid` 可以直接使用，无需适配层

**Alternatives considered**:
- 仅更新响应处理逻辑（保持 Ant Design Vue Table）：被拒绝，因为不符合 playground 代码风格要求
- 创建适配器层：被拒绝，因为 `useVbenVxeGrid` 已支持统一响应格式，无需适配
- 保持双重支持：被拒绝，因为不符合统一格式的目标

### 4. 分页参数处理

**Decision**: 保持现有的分页参数规范化逻辑

**Current Implementation**:
- 使用 `getQuery(event)` 获取查询参数
- 处理数组格式的查询参数（`Array.isArray(page) ? page[0] : page`）
- 规范化页码和每页数量（最小值、最大值限制）

**Rationale**: 
- 现有的参数处理逻辑已经完善
- `usePageResponseSuccess` 函数接受字符串或数字类型的 page 和 pageSize
- 无需修改参数处理逻辑

### 5. 错误处理

**Decision**: 保持现有的错误响应格式

**Current Error Format**:
```typescript
{
  code: -1,
  data: null,
  error: string,
  message: string
}
```

**Rationale**: 
- 错误响应格式已经符合统一结构要求
- 使用 `unAuthorizedResponse` 等工具函数确保一致性
- 无需修改错误处理逻辑

## Implementation Strategy

### Phase 1: 后端 API 重构
1. 修改 `apps/backend-mock/api/manufacture/bom/list.get.ts`
2. 将自定义响应格式替换为 `usePageResponseSuccess` 调用
3. 确保分页逻辑正确传递

### Phase 2: 前端类型定义更新
1. 更新 `apps/web-antd/src/api/manufacture/bom.ts` 中的 `BomListResponse` 接口
2. 将 `list` 字段改为 `items`
3. 移除 `page` 和 `pageSize` 字段

### Phase 3: 前端组件重构
1. 重构 `apps/web-antd/src/views/manufacture/baseData/sqe-supplier-bom/index.vue` 使用 `useVbenVxeGrid`
2. 将搜索表单迁移到 `VbenFormProps` 配置
3. 将表格配置迁移到 `VxeTableGridOptions` 配置
4. 通过 `proxyConfig.ajax.query` 集成 API 调用
5. 移除手动数据管理和分页逻辑（由 `useVbenVxeGrid` 自动处理）

### Phase 4: 测试验证
1. 编写单元测试验证响应格式
2. 编写 E2E 测试验证前端正确处理数据
3. 验证分页功能正常工作

## Risks and Mitigations

**Risk 1**: 前端代码可能在其他地方也使用了旧的响应格式
- **Mitigation**: 全局搜索 `response.data.list` 和 `BomListResponse` 的使用

**Risk 2**: 类型定义更新可能导致编译错误
- **Mitigation**: 使用 TypeScript 编译器检查所有相关文件

**Risk 3**: 分页逻辑可能受到影响
- **Mitigation**: 仔细验证分页参数传递和响应处理

### 6. useVbenVxeGrid 集成分析

**Decision**: 使用 `useVbenVxeGrid` 重构前端表格组件

**Rationale**: 
- `useVbenVxeGrid` 已配置为期望响应格式：`{ items: T[], total: number }`
- 配置位置：`apps/web-antd/src/adapter/vxe-table.ts` 中的 `proxyConfig.response`
- 由于 `requestClient` 配置了 `responseReturn: 'data'`，API 返回的 `{ items, total }` 可以直接被 `useVbenVxeGrid` 使用
- 参考 `playground/src/views/examples/vxe-table/form.vue` 的实现模式
- `useVbenVxeGrid` 提供了内置的搜索表单、分页、导出等功能

**Implementation Pattern**:
```typescript
const formOptions: VbenFormProps = {
  schema: [/* 搜索字段配置 */],
  submitOnChange: true,
};

const gridOptions: VxeTableGridOptions<BOMRecord> = {
  columns: [/* 表格列配置 */],
  proxyConfig: {
    ajax: {
      query: async ({ page }, formValues) => {
        return await getBomListApi({
          page: page.currentPage,
          pageSize: page.pageSize,
          ...formValues,
        });
      },
    },
  },
};

const [Grid] = useVbenVxeGrid({ formOptions, gridOptions });
```

**Benefits**:
- 代码更简洁，减少手动状态管理
- 内置搜索、分页、导出功能
- 与 playground 代码风格一致
- 更好的类型支持

## Conclusion

统一表格数据 API 响应格式是一个低风险的重构任务。主要工作是：
1. 后端 API 使用标准工具函数
2. 前端类型定义更新
3. 前端组件重构为使用 `useVbenVxeGrid`
4. 测试验证

所有必要的工具和函数都已存在，无需引入新的依赖或复杂的技术方案。统一的响应格式与 `useVbenVxeGrid` 的期望格式完美匹配，使重构更加顺畅。

