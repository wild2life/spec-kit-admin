<script setup lang="ts">
import type { VbenFormProps } from '#/adapter/form';
import type {
  VxeGridListeners,
  VxeTableGridOptions,
} from '#/adapter/vxe-table';
import type {
  MaterialListParams,
  MaterialRecord,
} from '#/api/manufacture/material';

import { computed, ref } from 'vue';

import { Page } from '@vben/common-ui';

import { Button, message, Modal } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  deleteMaterialApi,
  getMaterialListApi,
  reportMaterialApi,
} from '#/api/manufacture/material';
import { $t } from '#/locales';

import ExportDialog from './components/ExportDialog.vue';
import ImportDialog from './components/ImportDialog.vue';

defineOptions({ name: 'SupplierProMaterialData' });

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
  schema: [
    {
      component: 'Select',
      componentProps: {
        allowClear: true,
        options: businessUnitOptions,
        placeholder: $t('manufacture.material.search.businessUnit'),
        class: 'w-full',
      },
      fieldName: 'businessUnit',
      label: $t('manufacture.material.search.businessUnit'),
    },
    {
      component: 'Select',
      componentProps: {
        allowClear: true,
        options: supplierOptions,
        placeholder: $t('manufacture.material.search.supplier'),
        class: 'w-full',
      },
      fieldName: 'supplier',
      label: $t('manufacture.material.search.supplier'),
    },
    {
      component: 'Input',
      componentProps: {
        allowClear: true,
        placeholder: $t('manufacture.material.search.supplierName'),
        class: 'w-full',
      },
      fieldName: 'supplierName',
      label: $t('manufacture.material.search.supplierName'),
    },
    {
      component: 'Input',
      componentProps: {
        allowClear: true,
        placeholder: $t('manufacture.material.search.cheryPartName'),
        class: 'w-full',
      },
      fieldName: 'cheryPartName',
      label: $t('manufacture.material.search.cheryPartName'),
    },
    {
      component: 'Input',
      componentProps: {
        allowClear: true,
        placeholder: $t('manufacture.material.search.supplierAssemblyPartName'),
        class: 'w-full',
      },
      fieldName: 'supplierAssemblyPartName',
      label: $t('manufacture.material.search.supplierAssemblyPartName'),
    },
    {
      component: 'Input',
      componentProps: {
        allowClear: true,
        placeholder: $t('manufacture.material.search.projectName'),
        class: 'w-full',
      },
      fieldName: 'projectName',
      label: $t('manufacture.material.search.projectName'),
    },
    {
      component: 'Input',
      componentProps: {
        allowClear: true,
        placeholder: $t('manufacture.material.search.factoryName'),
        class: 'w-full',
      },
      fieldName: 'factoryName',
      label: $t('manufacture.material.search.factoryName'),
    },
    {
      component: 'Input',
      componentProps: {
        allowClear: true,
        placeholder: $t('manufacture.material.search.chipMPNIdentifierName'),
        class: 'w-full',
      },
      fieldName: 'chipMPNIdentifierName',
      label: $t('manufacture.material.search.chipMPNIdentifierName'),
    },
  ],
  showCollapseButton: true,
  submitOnChange: false,
  submitOnEnter: false,
};

const gridOptions: VxeTableGridOptions<MaterialRecord> = {
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
      field: 'cheryPartNumber',
      fixed: 'left',
      title: $t('manufacture.material.table.cheryPartNumber'),
      width: 150,
    },
    {
      field: 'cheryPartName',
      title: $t('manufacture.material.table.cheryPartName'),
      width: 200,
    },
    {
      field: 'businessUnitCode',
      title: $t('manufacture.material.table.businessUnitCode'),
      width: 120,
    },
    {
      field: 'businessUnit',
      title: $t('manufacture.material.table.businessUnit'),
      width: 150,
    },
    {
      field: 'supplierCode',
      title: $t('manufacture.material.table.supplierCode'),
      width: 120,
    },
    {
      field: 'supplierName',
      title: $t('manufacture.material.table.supplierName'),
      width: 200,
    },
    {
      field: 'supplierAssemblyPartNumber',
      title: $t('manufacture.material.table.supplierAssemblyPartNumber'),
      width: 180,
    },
    {
      field: 'supplierAssemblyPartName',
      title: $t('manufacture.material.table.supplierAssemblyPartName'),
      width: 200,
    },
    {
      field: 'cheryHardwareVersionNumber',
      title: $t('manufacture.material.table.cheryHardwareVersionNumber'),
      width: 150,
    },
    {
      field: 'cherySoftwareVersionNumber',
      title: $t('manufacture.material.table.cherySoftwareVersionNumber'),
      width: 150,
    },
    {
      field: 'vehicleModel',
      title: $t('manufacture.material.table.vehicleModel'),
      width: 120,
    },
    {
      field: 'projectName',
      title: $t('manufacture.material.table.projectName'),
      width: 150,
    },
    {
      field: 'isSOP',
      title: $t('manufacture.material.table.isSOP'),
      width: 100,
    },
    {
      field: 'dataSyncExecutionTime',
      formatter: 'formatDateTime',
      title: $t('manufacture.material.table.dataSyncExecutionTime'),
      width: 180,
    },
    {
      field: 'factoryCode',
      title: $t('manufacture.material.table.factoryCode'),
      width: 120,
    },
    {
      field: 'factoryName',
      title: $t('manufacture.material.table.factoryName'),
      width: 150,
    },
    {
      field: 'supplierPartVersionNumber',
      title: $t('manufacture.material.table.supplierPartVersionNumber'),
      width: 150,
    },
    {
      field: 'chipProcurementType',
      title: $t('manufacture.material.table.chipProcurementType'),
      width: 120,
    },
    {
      field: 'chipMPNIdentifierCode',
      title: $t('manufacture.material.table.chipMPNIdentifierCode'),
      width: 150,
    },
    {
      field: 'chipMPNIdentifierName',
      title: $t('manufacture.material.table.chipMPNIdentifierName'),
      width: 200,
    },
    {
      field: 'dataSource',
      title: $t('manufacture.material.table.dataSource'),
      width: 120,
    },
    {
      align: 'right',
      field: 'materialValidityPeriodDays',
      title: $t('manufacture.material.table.materialValidityPeriodDays'),
      width: 150,
    },
    {
      field: 'type',
      title: $t('manufacture.material.table.type'),
      width: 100,
    },
    {
      field: 'creatorLoginAccount',
      title: $t('manufacture.material.table.creatorLoginAccount'),
      width: 150,
    },
    {
      field: 'createTime',
      formatter: 'formatDateTime',
      title: $t('manufacture.material.table.createTime'),
      width: 180,
    },
    {
      field: 'updaterAccount',
      title: $t('manufacture.material.table.updaterAccount'),
      width: 150,
    },
    {
      field: 'updateTime',
      formatter: 'formatDateTime',
      title: $t('manufacture.material.table.updateTime'),
      width: 180,
    },
  ],
  exportConfig: {},
  height: 'auto',
  keepSource: true,
  pagerConfig: {},
  proxyConfig: {
    ajax: {
      query: async ({ page }, formValues) => {
        const params: MaterialListParams = {
          page: page.currentPage,
          pageSize: page.pageSize,
          ...formValues,
        };

        // Remove empty values
        Object.keys(params).forEach((key) => {
          const value = params[key as keyof MaterialListParams];
          if (value === undefined || value === null || value === '') {
            delete params[key as keyof MaterialListParams];
          }
        });

        return await getMaterialListApi(params);
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
const gridEvents: VxeGridListeners<MaterialRecord> = {
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
    message.warning($t('manufacture.material.messages.pleaseSelect'));
    return;
  }
  const selectedRows = gridApi.grid.getCheckboxRecords();
  if (selectedRows.length === 0) {
    message.warning($t('manufacture.material.messages.pleaseSelect'));
    return;
  }

  Modal.confirm({
    title: $t('manufacture.material.delete.confirm'),
    content: $t('manufacture.material.delete.confirmMessage', {
      count: selectedRows.length,
    }),
    onOk: async () => {
      try {
        const ids = selectedRows.map((row: MaterialRecord) => row.id);
        const response = await deleteMaterialApi({ ids });
        if (response) {
          message.success($t('manufacture.material.delete.success'));
          selectedRowsCount.value = 0; // Reset selected count after deletion
          gridApi.query();
        } else {
          message.error($t('manufacture.material.delete.failed'));
        }
      } catch (error) {
        console.error('Failed to delete:', error);
        message.error($t('manufacture.material.delete.failed'));
      }
    },
  });
}

function handleReport() {
  if (!gridApi.grid || typeof gridApi.grid.getCheckboxRecords !== 'function') {
    message.warning($t('manufacture.material.messages.pleaseSelect'));
    return;
  }
  const selectedRows = gridApi.grid.getCheckboxRecords();
  if (selectedRows.length === 0) {
    message.warning($t('manufacture.material.messages.pleaseSelect'));
    return;
  }

  Modal.confirm({
    title: $t('manufacture.material.report.confirm'),
    content: $t('manufacture.material.report.confirmMessage'),
    onOk: async () => {
      try {
        reportLoading.value = true;
        const ids = selectedRows.map((row: MaterialRecord) => row.id);
        const response = await reportMaterialApi({ recordIds: ids });
        if (response && response.success) {
          message.success($t('manufacture.material.report.success'));
        } else {
          message.error($t('manufacture.material.report.failed'));
        }
      } catch (error) {
        console.error('Failed to report:', error);
        message.error($t('manufacture.material.report.failed'));
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

function getCurrentSearchParams(): MaterialListParams {
  // Get current form values from grid store
  // The form values are stored in the grid's internal state
  // For now, return empty object - ExportDialog will handle its own search params
  return {};
}
</script>

<template>
  <Page auto-content-height>
    <Grid table-title="物料主数据">
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
            {{ $t('manufacture.material.report.button') }}
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
