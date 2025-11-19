<script setup lang="ts">
import type { TableColumnsType } from 'ant-design-vue';
import type { Key } from 'ant-design-vue/es/table/interface';

import type {
  ExportConfig,
  MaterialListParams,
} from '#/api/manufacture/material';

import { computed, ref } from 'vue';

import {
  Button,
  Input,
  message,
  Modal,
  Radio,
  RadioGroup,
  Space,
  Table,
} from 'ant-design-vue';

import { exportMaterialApi } from '#/api/manufacture/material';
import { $t } from '#/locales';

defineOptions({ name: 'MaterialExportDialog' });

const props = defineProps<{
  searchParams?: MaterialListParams;
  visible: boolean;
}>();

const emit = defineEmits<{
  'update:visible': [value: boolean];
}>();

const loading = ref(false);
const exportMode = ref<'all' | 'paginated'>('all');
const pageSize = ref(100);
const pageNumber = ref(1);
const fileName = ref('物料主数据');

// Column definitions for export selection
interface ColumnOption {
  key: string;
  attributeName: string;
  tableColumnName: string;
}

const allColumns: ColumnOption[] = [
  {
    key: 'cheryPartNumber',
    attributeName: 'cheryPartNumber',
    tableColumnName: $t('manufacture.material.table.cheryPartNumber'),
  },
  {
    key: 'cheryPartName',
    attributeName: 'cheryPartName',
    tableColumnName: $t('manufacture.material.table.cheryPartName'),
  },
  {
    key: 'businessUnitCode',
    attributeName: 'businessUnitCode',
    tableColumnName: $t('manufacture.material.table.businessUnitCode'),
  },
  {
    key: 'businessUnit',
    attributeName: 'businessUnit',
    tableColumnName: $t('manufacture.material.table.businessUnit'),
  },
  {
    key: 'supplierCode',
    attributeName: 'supplierCode',
    tableColumnName: $t('manufacture.material.table.supplierCode'),
  },
  {
    key: 'supplierName',
    attributeName: 'supplierName',
    tableColumnName: $t('manufacture.material.table.supplierName'),
  },
  {
    key: 'supplierAssemblyPartNumber',
    attributeName: 'supplierAssemblyPartNumber',
    tableColumnName: $t(
      'manufacture.material.table.supplierAssemblyPartNumber',
    ),
  },
  {
    key: 'supplierAssemblyPartName',
    attributeName: 'supplierAssemblyPartName',
    tableColumnName: $t('manufacture.material.table.supplierAssemblyPartName'),
  },
  {
    key: 'cheryHardwareVersionNumber',
    attributeName: 'cheryHardwareVersionNumber',
    tableColumnName: $t(
      'manufacture.material.table.cheryHardwareVersionNumber',
    ),
  },
  {
    key: 'cherySoftwareVersionNumber',
    attributeName: 'cherySoftwareVersionNumber',
    tableColumnName: $t(
      'manufacture.material.table.cherySoftwareVersionNumber',
    ),
  },
  {
    key: 'vehicleModel',
    attributeName: 'vehicleModel',
    tableColumnName: $t('manufacture.material.table.vehicleModel'),
  },
  {
    key: 'projectName',
    attributeName: 'projectName',
    tableColumnName: $t('manufacture.material.table.projectName'),
  },
  {
    key: 'isSOP',
    attributeName: 'isSOP',
    tableColumnName: $t('manufacture.material.table.isSOP'),
  },
  {
    key: 'dataSyncExecutionTime',
    attributeName: 'dataSyncExecutionTime',
    tableColumnName: $t('manufacture.material.table.dataSyncExecutionTime'),
  },
  {
    key: 'factoryCode',
    attributeName: 'factoryCode',
    tableColumnName: $t('manufacture.material.table.factoryCode'),
  },
  {
    key: 'factoryName',
    attributeName: 'factoryName',
    tableColumnName: $t('manufacture.material.table.factoryName'),
  },
  {
    key: 'supplierPartVersionNumber',
    attributeName: 'supplierPartVersionNumber',
    tableColumnName: $t('manufacture.material.table.supplierPartVersionNumber'),
  },
  {
    key: 'chipProcurementType',
    attributeName: 'chipProcurementType',
    tableColumnName: $t('manufacture.material.table.chipProcurementType'),
  },
  {
    key: 'chipMPNIdentifierCode',
    attributeName: 'chipMPNIdentifierCode',
    tableColumnName: $t('manufacture.material.table.chipMPNIdentifierCode'),
  },
  {
    key: 'chipMPNIdentifierName',
    attributeName: 'chipMPNIdentifierName',
    tableColumnName: $t('manufacture.material.table.chipMPNIdentifierName'),
  },
  {
    key: 'dataSource',
    attributeName: 'dataSource',
    tableColumnName: $t('manufacture.material.table.dataSource'),
  },
  {
    key: 'materialValidityPeriodDays',
    attributeName: 'materialValidityPeriodDays',
    tableColumnName: $t(
      'manufacture.material.table.materialValidityPeriodDays',
    ),
  },
  {
    key: 'type',
    attributeName: 'type',
    tableColumnName: $t('manufacture.material.table.type'),
  },
  {
    key: 'creatorLoginAccount',
    attributeName: 'creatorLoginAccount',
    tableColumnName: $t('manufacture.material.table.creatorLoginAccount'),
  },
  {
    key: 'createTime',
    attributeName: 'createTime',
    tableColumnName: $t('manufacture.material.table.createTime'),
  },
  {
    key: 'updaterAccount',
    attributeName: 'updaterAccount',
    tableColumnName: $t('manufacture.material.table.updaterAccount'),
  },
  {
    key: 'updateTime',
    attributeName: 'updateTime',
    tableColumnName: $t('manufacture.material.table.updateTime'),
  },
];

const selectedColumns = ref<string[]>(allColumns.map((col) => col.key));

const columnTableColumns = computed<TableColumnsType<ColumnOption>>(() => [
  {
    title: $t('manufacture.material.export.selectColumns'),
    dataIndex: 'attributeName',
    key: 'attributeName',
  },
  {
    title: $t('manufacture.material.export.selectColumns'),
    dataIndex: 'tableColumnName',
    key: 'tableColumnName',
  },
]);

const rowSelection = computed(() => ({
  selectedRowKeys: selectedColumns.value,
  onChange: (keys: Key[]) => {
    selectedColumns.value = keys as string[];
  },
  getCheckboxProps: () => ({}),
}));

const handleExport = async () => {
  if (selectedColumns.value.length === 0) {
    message.warning($t('manufacture.material.messages.pleaseSelect'));
    return;
  }

  try {
    loading.value = true;
    const config: ExportConfig = {
      selectedColumns: selectedColumns.value,
      exportMode: exportMode.value,
      fileName: fileName.value,
      ...(exportMode.value === 'paginated'
        ? { pageSize: pageSize.value, pageNumber: pageNumber.value }
        : {}),
      ...props.searchParams,
    };

    const response = await exportMaterialApi(config);
    if (response instanceof Blob) {
      const url = window.URL.createObjectURL(response);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${fileName.value}.csv`;
      document.body.append(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      message.success($t('manufacture.material.messages.operationSuccess'));
      emit('update:visible', false);
    }
  } catch (error) {
    console.error('Failed to export:', error);
    message.error($t('manufacture.material.messages.operationFailed'));
  } finally {
    loading.value = false;
  }
};

const handleCancel = () => {
  emit('update:visible', false);
};
</script>

<template>
  <Modal
    :open="visible"
    :title="$t('manufacture.material.export.title')"
    :width="800"
    :footer="null"
    @cancel="handleCancel"
  >
    <div class="mb-4">
      <h4>{{ $t('manufacture.material.export.selectColumns') }}</h4>
      <Table
        :columns="columnTableColumns"
        :data-source="allColumns"
        :row-selection="rowSelection"
        :pagination="false"
        :scroll="{ y: 400 }"
        row-key="key"
        size="small"
      />
    </div>

    <div class="mb-4">
      <Space :size="16" align="center" wrap class="w-full">
        <div>
          <span class="mr-2"
            >{{ $t('manufacture.material.export.fileName') }}:</span
          >
          <Input
            v-model:value="fileName"
            :placeholder="$t('manufacture.material.export.fileName')"
            style="width: 200px"
          />
        </div>
        <div>
          <span class="mr-2"
            >{{ $t('manufacture.material.export.exportMode') }}:</span
          >
          <RadioGroup v-model:value="exportMode">
            <Radio value="all">
              {{ $t('manufacture.material.export.all') }}
            </Radio>
            <Radio value="paginated">
              {{ $t('manufacture.material.export.paginated') }}
            </Radio>
          </RadioGroup>
        </div>
        <template v-if="exportMode === 'paginated'">
          <div>
            <span class="mr-2"
              >{{ $t('manufacture.material.export.pageSize') }}:</span
            >
            <Input
              v-model:value="pageSize"
              type="number"
              :min="1"
              :max="1000"
              style="width: 120px"
            />
          </div>
          <div>
            <span class="mr-2"
              >{{ $t('manufacture.material.export.pageNumber') }}:</span
            >
            <Input
              v-model:value="pageNumber"
              type="number"
              :min="1"
              style="width: 120px"
            />
          </div>
        </template>
      </Space>
    </div>

    <div class="text-right">
      <Button class="mr-2" @click="handleCancel">
        {{ $t('common.cancel') || '取消' }}
      </Button>
      <Button type="primary" :loading="loading" @click="handleExport">
        {{ $t('manufacture.material.export.exportButton') }}
      </Button>
    </div>
  </Modal>
</template>
