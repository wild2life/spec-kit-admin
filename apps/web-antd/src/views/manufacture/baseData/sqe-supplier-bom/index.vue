<script setup lang="ts">
import type { VbenFormProps } from '#/adapter/form';
import type {
  VxeGridListeners,
  VxeTableGridOptions,
} from '#/adapter/vxe-table';
import type { BomListParams, BOMRecord } from '#/api/manufacture/bom';

import { computed, ref } from 'vue';

import { Page } from '@vben/common-ui';

import { Button, message, Modal } from 'ant-design-vue';
import dayjs from 'dayjs';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  deleteBomApi,
  getBomListApi,
  reportBomApi,
} from '#/api/manufacture/bom';
import { $t } from '#/locales';

import ExportDialog from './components/ExportDialog.vue';
import ImportDialog from './components/ImportDialog.vue';

defineOptions({ name: 'SqeSupplierBom' });

// Date range presets
const rangePresets = [
  {
    label: $t('manufacture.bom.datePresets.today'),
    value: [dayjs(), dayjs()],
  },
  {
    label: $t('manufacture.bom.datePresets.last3Days'),
    value: [dayjs().subtract(2, 'day'), dayjs()],
  },
  {
    label: $t('manufacture.bom.datePresets.lastWeek'),
    value: [dayjs().subtract(6, 'day'), dayjs()],
  },
  {
    label: $t('manufacture.bom.datePresets.last30Days'),
    value: [dayjs().subtract(29, 'day'), dayjs()],
  },
  {
    label: $t('manufacture.bom.datePresets.last90Days'),
    value: [dayjs().subtract(89, 'day'), dayjs()],
  },
];

// Mock options for select fields (in real app, these would come from API)
const businessUnitOptions = [
  { label: '乘用车事业部', value: 'BU001' },
  { label: '商用车事业部', value: 'BU002' },
  { label: '新能源事业部', value: 'BU003' },
  { label: '零部件事业部', value: 'BU004' },
];

const supplierOptions = [
  { label: '奇瑞汽车零部件有限公司', value: 'SUP001' },
  { label: '安徽奇瑞科技有限公司', value: 'SUP002' },
  { label: '芜湖奇瑞汽车技术有限公司', value: 'SUP003' },
  { label: '奇瑞新能源技术有限公司', value: 'SUP004' },
  { label: '奇瑞商用车有限公司', value: 'SUP005' },
];

const formOptions: VbenFormProps = {
  collapsed: true,
  fieldMappingTime: [
    ['bomChangeTime', ['bomChangeTimeStart', 'bomChangeTimeEnd']],
    ['changeTime', ['changeTimeStart', 'changeTimeEnd']],
  ],
  schema: [
    {
      component: 'Select',
      componentProps: {
        allowClear: true,
        options: businessUnitOptions,
        placeholder: $t('manufacture.bom.search.businessUnit'),
        // style: { width: '180px' },
        class: 'w-full',
      },
      fieldName: 'businessUnit',
      label: $t('manufacture.bom.search.businessUnit'),
    },
    {
      component: 'Select',
      componentProps: {
        allowClear: true,
        options: supplierOptions,
        placeholder: $t('manufacture.bom.search.supplier'),
        // style: { width: '200px' },
        class: 'w-full',
      },
      fieldName: 'supplier',
      label: $t('manufacture.bom.search.supplier'),
    },
    {
      component: 'Input',
      componentProps: {
        allowClear: true,
        placeholder: $t('manufacture.bom.search.cheryPartNumber'),
        // style: { width: '180px' },
        class: 'w-full',
      },
      fieldName: 'cheryPartNumber',
      label: $t('manufacture.bom.search.cheryPartNumber'),
    },
    {
      component: 'Input',
      componentProps: {
        allowClear: true,
        placeholder: $t('manufacture.bom.search.cheryPartName'),
        // style: { width: '180px' },
        class: 'w-full',
      },
      fieldName: 'cheryPartName',
      label: $t('manufacture.bom.search.cheryPartName'),
    },
    {
      component: 'Input',
      componentProps: {
        allowClear: true,
        placeholder: $t('manufacture.bom.search.bomCode'),
        // style: { width: '180px' },
        class: 'w-full',
      },
      fieldName: 'bomCode',
      label: $t('manufacture.bom.search.bomCode'),
    },
    {
      component: 'Input',
      componentProps: {
        allowClear: true,
        placeholder: $t('manufacture.bom.search.bomName'),
        // style: { width: '180px' },
        class: 'w-full',
      },
      fieldName: 'bomName',
      label: $t('manufacture.bom.search.bomName'),
    },
    {
      component: 'Input',
      componentProps: {
        allowClear: true,
        placeholder: $t('manufacture.bom.search.supplierParentPartCode'),
        // style: { width: '200px' },
        class: 'w-full',
      },
      fieldName: 'supplierParentPartCode',
      label: $t('manufacture.bom.search.supplierParentPartCode'),
    },
    {
      component: 'Input',
      componentProps: {
        allowClear: true,
        placeholder: $t('manufacture.bom.search.supplierParentPartName'),
        // style: { width: '200px' },
        class: 'w-full',
      },
      fieldName: 'supplierParentPartName',
      label: $t('manufacture.bom.search.supplierParentPartName'),
    },
    {
      component: 'Input',
      componentProps: {
        allowClear: true,
        placeholder: $t('manufacture.bom.search.childPartCode'),
        // style: { width: '180px' },
        class: 'w-full',
      },
      fieldName: 'childPartCode',
      label: $t('manufacture.bom.search.childPartCode'),
    },
    {
      component: 'Input',
      componentProps: {
        allowClear: true,
        placeholder: $t('manufacture.bom.search.childPartName'),
        // style: { width: '180px' },
        class: 'w-full',
      },
      fieldName: 'childPartName',
      label: $t('manufacture.bom.search.childPartName'),
    },
    {
      component: 'Input',
      componentProps: {
        allowClear: true,
        placeholder: $t('manufacture.bom.search.bomVersion'),
        // style: { width: '150px' },
        class: 'w-full',
      },
      fieldName: 'bomVersion',
      label: $t('manufacture.bom.search.bomVersion'),
    },
    {
      component: 'Input',
      componentProps: {
        allowClear: true,
        placeholder: $t('manufacture.bom.search.categoryName'),
        // style: { width: '180px' },
        class: 'w-full',
      },
      fieldName: 'categoryName',
      label: $t('manufacture.bom.search.categoryName'),
    },
    {
      component: 'RangePicker',
      componentProps: {
        format: 'YYYY-MM-DD',
        presets: rangePresets,
        // style: { width: '240px' },
        class: 'w-full',
      },
      fieldName: 'bomChangeTime',
      label: $t('manufacture.bom.search.bomChangeTime'),
    },
    {
      component: 'RangePicker',
      componentProps: {
        format: 'YYYY-MM-DD',
        presets: rangePresets,
        // style: { width: '240px' },
        class: 'w-full',
      },
      fieldName: 'changeTime',
      label: $t('manufacture.bom.search.changeTime'),
    },
  ],
  showCollapseButton: true,
  submitOnChange: false,
  submitOnEnter: false,
};

const gridOptions: VxeTableGridOptions<BOMRecord> = {
  checkboxConfig: {
    highlight: true,
  },
  columns: [
    {
      align: 'left',
      field: 'id',
      fixed: 'left',
      title: '',
      type: 'checkbox',
      width: 60,
    },
    {
      field: 'businessUnitCode',
      fixed: 'left',
      title: $t('manufacture.bom.table.businessUnitCode'),
      width: 120,
    },
    {
      field: 'businessUnit',
      title: $t('manufacture.bom.table.businessUnit'),
      width: 150,
    },
    {
      field: 'supplierCode',
      title: $t('manufacture.bom.table.supplierCode'),
      width: 120,
    },
    {
      field: 'supplierName',
      title: $t('manufacture.bom.table.supplierName'),
      width: 200,
    },
    {
      field: 'cheryPartNumber',
      title: $t('manufacture.bom.table.cheryPartNumber'),
      width: 150,
    },
    {
      field: 'cheryPartName',
      title: $t('manufacture.bom.table.cheryPartName'),
      width: 200,
    },
    {
      field: 'bomCode',
      title: $t('manufacture.bom.table.bomCode'),
      width: 150,
    },
    {
      field: 'bomName',
      title: $t('manufacture.bom.table.bomName'),
      width: 200,
    },
    {
      field: 'supplierParentPartCode',
      title: $t('manufacture.bom.table.supplierParentPartCode'),
      width: 180,
    },
    {
      field: 'supplierParentPartName',
      title: $t('manufacture.bom.table.supplierParentPartName'),
      width: 200,
    },
    {
      field: 'parentPartType',
      title: $t('manufacture.bom.table.parentPartType'),
      width: 120,
    },
    {
      field: 'parentPartUnit',
      title: $t('manufacture.bom.table.parentPartUnit'),
      width: 100,
    },
    {
      field: 'childPartCode',
      title: $t('manufacture.bom.table.childPartCode'),
      width: 150,
    },
    {
      field: 'childPartName',
      title: $t('manufacture.bom.table.childPartName'),
      width: 200,
    },
    {
      field: 'childPartType',
      title: $t('manufacture.bom.table.childPartType'),
      width: 120,
    },
    {
      align: 'right',
      field: 'childPartQuantity',
      title: $t('manufacture.bom.table.childPartQuantity'),
      width: 120,
    },
    {
      field: 'childPartUnit',
      title: $t('manufacture.bom.table.childPartUnit'),
      width: 100,
    },
    {
      field: 'bomVersion',
      title: $t('manufacture.bom.table.bomVersion'),
      width: 120,
    },
    {
      field: 'bomChangeTime',
      formatter: 'formatDateTime',
      title: $t('manufacture.bom.table.bomChangeTime'),
      width: 180,
    },
    {
      field: 'createTime',
      formatter: 'formatDateTime',
      title: $t('manufacture.bom.table.createTime'),
      width: 180,
    },
    {
      field: 'updateTime',
      formatter: 'formatDateTime',
      title: $t('manufacture.bom.table.updateTime'),
      width: 180,
    },
    {
      field: 'categoryCode',
      title: $t('manufacture.bom.table.categoryCode'),
      width: 120,
    },
    {
      field: 'categoryName',
      title: $t('manufacture.bom.table.categoryName'),
      width: 150,
    },
    {
      field: 'creatorLoginAccount',
      title: $t('manufacture.bom.table.creatorLoginAccount'),
      width: 150,
    },
    {
      field: 'dataSource',
      title: $t('manufacture.bom.table.dataSource'),
      width: 120,
    },
    {
      field: 'updaterAccount',
      title: $t('manufacture.bom.table.updaterAccount'),
      width: 150,
    },
  ],
  exportConfig: {},
  height: 'auto',
  keepSource: true,
  pagerConfig: {},
  proxyConfig: {
    ajax: {
      query: async ({ page }, formValues) => {
        const params: BomListParams = {
          page: page.currentPage,
          pageSize: page.pageSize,
          ...formValues,
        };

        // Remove empty values
        Object.keys(params).forEach((key) => {
          const value = params[key as keyof BomListParams];
          if (value === undefined || value === null || value === '') {
            delete params[key as keyof BomListParams];
          }
        });

        return await getBomListApi(params);
      },
    },
  },
  toolbarConfig: {
    custom: true,
    export: true,
    refresh: true,
    resizable: true,
    search: true,
    zoom: true,
  },
};

// Track selected rows count for reactive button state
const selectedRowsCount = ref(0);

// Update selected rows count when checkbox changes
const gridEvents: VxeGridListeners<BOMRecord> = {
  checkboxChange: () => {
    // gridApi will be available after useVbenVxeGrid is called
    setTimeout(() => {
      if (
        gridApi.grid &&
        typeof gridApi.grid.getCheckboxRecords === 'function'
      ) {
        selectedRowsCount.value = gridApi.grid.getCheckboxRecords().length;
      }
    }, 0);
  },
  checkboxAll: () => {
    setTimeout(() => {
      if (
        gridApi.grid &&
        typeof gridApi.grid.getCheckboxRecords === 'function'
      ) {
        selectedRowsCount.value = gridApi.grid.getCheckboxRecords().length;
      }
    }, 0);
  },
};

const [Grid, gridApi] = useVbenVxeGrid({
  formOptions,
  gridOptions,
  gridEvents,
});

const importDialogVisible = ref(false);
const exportDialogVisible = ref(false);
const reportLoading = ref(false);

// Computed properties for button disabled states
const isDeleteDisabled = computed(() => {
  return selectedRowsCount.value === 0;
});

const isReportDisabled = computed(() => {
  return selectedRowsCount.value === 0;
});

function handleImport() {
  importDialogVisible.value = true;
}

function handleExport() {
  exportDialogVisible.value = true;
}

function handleDelete() {
  if (!gridApi.grid || typeof gridApi.grid.getCheckboxRecords !== 'function') {
    message.warning($t('manufacture.bom.messages.pleaseSelect'));
    return;
  }
  const selectedRows = gridApi.grid.getCheckboxRecords();
  if (selectedRows.length === 0) {
    message.warning($t('manufacture.bom.messages.pleaseSelect'));
    return;
  }

  Modal.confirm({
    title: $t('manufacture.bom.delete.confirm'),
    content: $t('manufacture.bom.delete.confirmMessage', {
      count: selectedRows.length,
    }),
    onOk: async () => {
      try {
        const ids = selectedRows.map((row: BOMRecord) => row.id);
        const response = await deleteBomApi({ ids });
        if (response) {
          message.success($t('manufacture.bom.delete.success'));
          selectedRowsCount.value = 0; // Reset selected count after deletion
          gridApi.query();
        } else {
          message.error($t('manufacture.bom.delete.failed'));
        }
      } catch (error) {
        console.error('Failed to delete:', error);
        message.error($t('manufacture.bom.delete.failed'));
      }
    },
  });
}

function handleReport() {
  if (!gridApi.grid || typeof gridApi.grid.getCheckboxRecords !== 'function') {
    message.warning($t('manufacture.bom.messages.pleaseSelect'));
    return;
  }
  const selectedRows = gridApi.grid.getCheckboxRecords();
  if (selectedRows.length === 0) {
    message.warning($t('manufacture.bom.messages.pleaseSelect'));
    return;
  }

  Modal.confirm({
    title: $t('manufacture.bom.report.confirm'),
    content: $t('manufacture.bom.report.confirmMessage'),
    onOk: async () => {
      try {
        reportLoading.value = true;
        const ids = selectedRows.map((row: BOMRecord) => row.id);
        const response = await reportBomApi({ recordIds: ids });
        if (response && response.success) {
          message.success($t('manufacture.bom.report.success'));
        } else {
          message.error($t('manufacture.bom.report.failed'));
        }
      } catch (error) {
        console.error('Failed to report:', error);
        message.error($t('manufacture.bom.report.failed'));
      } finally {
        reportLoading.value = false;
      }
    },
  });
}

function handleImportSuccess() {
  selectedRowsCount.value = 0; // Reset selected count after import
  gridApi.query();
}

function getCurrentSearchParams(): BomListParams {
  // Get current form values from grid store
  // The form values are stored in the grid's internal state
  // For now, return empty object - ExportDialog will handle its own search params
  return {};
}
</script>

<template>
  <Page auto-content-height>
    <Grid table-title="BOM主数据">
      <template #toolbar-tools>
        <div class="action-buttons">
          <Button type="primary" @click="handleImport"> 导入 </Button>
          <Button @click="handleExport"> 导出 </Button>
          <Button danger :disabled="isDeleteDisabled" @click="handleDelete">
            删除
          </Button>
          <Button
            :loading="reportLoading"
            :disabled="isReportDisabled"
            @click="handleReport"
          >
            {{ $t('manufacture.bom.report.button') }}
          </Button>
        </div>
      </template>
    </Grid>

    <ImportDialog
      :visible="importDialogVisible"
      @success="handleImportSuccess"
      @update:visible="importDialogVisible = $event"
    />

    <ExportDialog
      :visible="exportDialogVisible"
      :search-params="getCurrentSearchParams()"
      @update:visible="exportDialogVisible = $event"
    />
  </Page>
</template>

<style scoped>
.action-buttons {
  display: flex;
  gap: 8px; /* Consistent spacing between all buttons */
}
</style>
