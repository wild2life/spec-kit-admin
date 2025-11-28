# Implementation Plan: 统一 Mock 服务表格数据返回格式

**Branch**: `003-unify-table-response-format` | **Date**: 2025-11-19 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/003-unify-table-response-format/spec.md`

## Summary

统一所有 mock 服务表格数据 API 的返回格式，使用 `usePageResponseSuccess` 工具函数，确保所有表格数据 API 返回一致的响应结构 `{ code: 0, data: { items: T[], total: number }, error: null, message: 'ok' }`。前端代码将使用 `useVbenVxeGrid` 重构，参考 playground 代码风格（`playground/src/views/examples/vxe-table/form.vue`），利用统一的响应格式和 `useVbenVxeGrid` 的内置功能，减少代码重复，提高开发效率和代码质量。

## Technical Context

**Language/Version**: TypeScript 5.x, Node.js (H3/Nitro)  
**Primary Dependencies**: 
- Backend Mock: H3, Nitro, TypeScript
- Frontend: Vue 3, TypeScript, VXE Table (via `useVbenVxeGrid`)
- Shared: 
  - `apps/backend-mock/utils/response.ts` 中的 `usePageResponseSuccess` 函数
  - `apps/web-antd/src/adapter/vxe-table.ts` 中的 `useVbenVxeGrid` composable

**Storage**: N/A (mock 服务，内存数据)  
**Testing**: Vitest (unit tests), Playwright (E2E tests)  
**Target Platform**: Node.js (mock server), Modern web browsers (frontend)  
**Project Type**: Monorepo (backend-mock + web-antd)  
**Performance Goals**: 
- API 响应时间 < 500ms (mock 延迟)
- 前端代码重构后性能无退化

**Constraints**: 
- 必须保持向后兼容或提供迁移路径
- 代码修改限制在 `apps/backend-mock` 和 `apps/web-antd` 目录
- 必须遵循现有的代码规范和项目结构
- 所有修改必须通过 ESLint、Prettier、TypeScript 检查
- 前端组件必须使用 `useVbenVxeGrid`，参考 playground 代码风格

**Scale/Scope**: 
- 影响范围：所有表格数据 API 端点（至少包括 BOM 列表 API）
- 需要重构的 API：1+ 个（BOM list API 已确认需要修改）
- 需要更新的前端代码：
  - API 类型定义：1 个文件（`apps/web-antd/src/api/manufacture/bom.ts`）
  - 前端组件重构：1 个文件（`apps/web-antd/src/views/manufacture/baseData/sqe-supplier-bom/index.vue`）
  - 组件文件：可能需要移除或重构（`SearchForm.vue`, `DataTable.vue` 等）

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Verify compliance with all constitution principles:

- **Code Quality**: 
  - ✅ 不引入新依赖，使用现有的 `usePageResponseSuccess` 工具函数
  - ✅ 使用现有的 `useVbenVxeGrid` composable，无需新依赖
  - ✅ 代码将遵循 ESLint/Prettier/Stylelint 规范
  - ✅ TypeScript 类型完整，需要更新类型定义以匹配新的响应格式
  - ✅ 代码修改在 `apps/` 目录内，符合 monorepo 结构
  - ✅ 不涉及新的包依赖，无需 workspace protocol 配置

- **Testing Standards**: 
  - ✅ 单元测试：验证 API 响应格式（可选）
  - ✅ E2E 测试：验证前端表格功能（可选）
  - ✅ 测试文件命名遵循项目规范
  - ✅ 测试可在 Turbo monorepo 上下文中运行

- **UX Consistency**: 
  - ✅ 使用 `useVbenVxeGrid` 保持与 playground 代码风格一致
  - ✅ 保持现有的 i18n 支持
  - ✅ 保持现有的响应式设计
  - ✅ 表格功能（搜索、分页、导出）由 `useVbenVxeGrid` 统一提供

- **Performance**: 
  - ✅ API 响应时间目标：< 500ms（mock 延迟 300ms）
  - ✅ 前端重构使用 `useVbenVxeGrid`，性能无退化
  - ✅ 无额外的 bundle 大小增加
  - ✅ 代码分割已由框架处理

**Status**: ✅ All checks passed

## Project Structure

### Documentation (this feature)

```text
specs/003-unify-table-response-format/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
apps/backend-mock/
└── api/
    └── manufacture/
        └── bom/
            └── list.get.ts           # 需要重构为使用 usePageResponseSuccess

apps/web-antd/
└── src/
    ├── api/
    │   └── manufacture/
    │       └── bom.ts                # 需要更新类型定义
    └── views/
        └── manufacture/
            └── baseData/
                └── sqe-supplier-bom/
                    ├── index.vue     # 需要重构为使用 useVbenVxeGrid
                    └── components/   # 可能需要移除或重构
                        ├── SearchForm.vue
                        ├── DataTable.vue
                        ├── ImportDialog.vue
                        └── ExportDialog.vue
```

**Structure Decision**: 这是一个重构任务，主要修改现有的 API 端点和前端组件。后端 API 使用标准工具函数，前端组件重构为使用 `useVbenVxeGrid`，参考 playground 代码风格（`playground/src/views/examples/vxe-table/form.vue`）。所有修改都在 `apps/` 目录内，符合 monorepo 结构。

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

无需填写 - 所有 Constitution 检查已通过。
