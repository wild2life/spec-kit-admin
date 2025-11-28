<script setup lang="ts">
import type { TableColumnsType } from 'ant-design-vue';
import type { Key } from 'ant-design-vue/es/table/interface';

import type { ExportConfig } from '#/api/manufacture/bom';

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

import { exportBomApi } from '#/api/manufacture/bom';
import { $t } from '#/locales';

defineOptions({ name: 'BomExportDialog' });

const props = defineProps<{
  searchParams?: any;
  visible: boolean;
}>();

const emit = defineEmits<{
  'update:visible': [value: boolean];
}>();

const loading = ref(false);
const exportMode = ref<'all' | 'paginated'>('all');
const pageSize = ref(100);
const pageNumber = ref(1);
const fileName = ref('BOM主数据');

// Column definitions for export selection
interface ColumnOption {
  key: string;
  attributeName: string;
  tableColumnName: string;
}

const allColumns: ColumnOption[] = [
  {
    key: 'businessUnitCode',
    attributeName: 'businessUnitCode',
    tableColumnName: $t('manufacture.bom.table.businessUnitCode'),
  },
  {
    key: 'businessUnit',
    attributeName: 'businessUnit',
    tableColumnName: $t('manufacture.bom.table.businessUnit'),
  },
  {
    key: 'supplierCode',
    attributeName: 'supplierCode',
    tableColumnName: $t('manufacture.bom.table.supplierCode'),
  },
  {
    key: 'supplierName',
    attributeName: 'supplierName',
    tableColumnName: $t('manufacture.bom.table.supplierName'),
  },
  {
    key: 'cheryPartNumber',
    attributeName: 'cheryPartNumber',
    tableColumnName: $t('manufacture.bom.table.cheryPartNumber'),
  },
  {
    key: 'cheryPartName',
    attributeName: 'cheryPartName',
    tableColumnName: $t('manufacture.bom.table.cheryPartName'),
  },
  {
    key: 'bomCode',
    attributeName: 'bomCode',
    tableColumnName: $t('manufacture.bom.table.bomCode'),
  },
  {
    key: 'bomName',
    attributeName: 'bomName',
    tableColumnName: $t('manufacture.bom.table.bomName'),
  },
  {
    key: 'supplierParentPartCode',
    attributeName: 'supplierParentPartCode',
    tableColumnName: $t('manufacture.bom.table.supplierParentPartCode'),
  },
  {
    key: 'supplierParentPartName',
    attributeName: 'supplierParentPartName',
    tableColumnName: $t('manufacture.bom.table.supplierParentPartName'),
  },
  {
    key: 'parentPartType',
    attributeName: 'parentPartType',
    tableColumnName: $t('manufacture.bom.table.parentPartType'),
  },
  {
    key: 'parentPartUnit',
    attributeName: 'parentPartUnit',
    tableColumnName: $t('manufacture.bom.table.parentPartUnit'),
  },
  {
    key: 'childPartCode',
    attributeName: 'childPartCode',
    tableColumnName: $t('manufacture.bom.table.childPartCode'),
  },
  {
    key: 'childPartName',
    attributeName: 'childPartName',
    tableColumnName: $t('manufacture.bom.table.childPartName'),
  },
  {
    key: 'childPartType',
    attributeName: 'childPartType',
    tableColumnName: $t('manufacture.bom.table.childPartType'),
  },
  {
    key: 'childPartQuantity',
    attributeName: 'childPartQuantity',
    tableColumnName: $t('manufacture.bom.table.childPartQuantity'),
  },
  {
    key: 'childPartUnit',
    attributeName: 'childPartUnit',
    tableColumnName: $t('manufacture.bom.table.childPartUnit'),
  },
  {
    key: 'bomVersion',
    attributeName: 'bomVersion',
    tableColumnName: $t('manufacture.bom.table.bomVersion'),
  },
  {
    key: 'bomChangeTime',
    attributeName: 'bomChangeTime',
    tableColumnName: $t('manufacture.bom.table.bomChangeTime'),
  },
  {
    key: 'createTime',
    attributeName: 'createTime',
    tableColumnName: $t('manufacture.bom.table.createTime'),
  },
  {
    key: 'updateTime',
    attributeName: 'updateTime',
    tableColumnName: $t('manufacture.bom.table.updateTime'),
  },
  {
    key: 'categoryCode',
    attributeName: 'categoryCode',
    tableColumnName: $t('manufacture.bom.table.categoryCode'),
  },
  {
    key: 'categoryName',
    attributeName: 'categoryName',
    tableColumnName: $t('manufacture.bom.table.categoryName'),
  },
  {
    key: 'creatorLoginAccount',
    attributeName: 'creatorLoginAccount',
    tableColumnName: $t('manufacture.bom.table.creatorLoginAccount'),
  },
  {
    key: 'dataSource',
    attributeName: 'dataSource',
    tableColumnName: $t('manufacture.bom.table.dataSource'),
  },
  {
    key: 'updaterAccount',
    attributeName: 'updaterAccount',
    tableColumnName: $t('manufacture.bom.table.updaterAccount'),
  },
];

const selectedColumns = ref<string[]>(allColumns.map((col) => col.key));

const columnTableColumns = computed<TableColumnsType<ColumnOption>>(() => [
  {
    title: $t('manufacture.bom.export.selectColumns'),
    dataIndex: 'attributeName',
    key: 'attributeName',
  },
  {
    title: $t('manufacture.bom.export.selectColumns'),
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
    message.warning($t('manufacture.bom.messages.pleaseSelect'));
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

    const response = await exportBomApi(config);
    if (response instanceof Blob) {
      const url = window.URL.createObjectURL(response);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${fileName.value}.csv`;
      document.body.append(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      message.success($t('manufacture.bom.messages.operationSuccess'));
      emit('update:visible', false);
    }
  } catch (error) {
    console.error('Failed to export:', error);
    message.error($t('manufacture.bom.messages.operationFailed'));
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
    :title="$t('manufacture.bom.export.title')"
    :width="800"
    :footer="null"
    @cancel="handleCancel"
  >
    <div class="mb-4">
      <h4>{{ $t('manufacture.bom.export.selectColumns') }}</h4>
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
          <span class="mr-2">{{ $t('manufacture.bom.export.fileName') }}:</span>
          <Input
            v-model:value="fileName"
            :placeholder="$t('manufacture.bom.export.fileName')"
            style="width: 200px"
          />
        </div>
        <div>
          <span class="mr-2">{{ $t('manufacture.bom.export.exportMode') }}:</span>
          <RadioGroup v-model:value="exportMode">
            <Radio value="all">
              {{ $t('manufacture.bom.export.all') }}
            </Radio>
            <Radio value="paginated">
              {{ $t('manufacture.bom.export.paginated') }}
            </Radio>
          </RadioGroup>
        </div>
        <template v-if="exportMode === 'paginated'">
          <div>
            <span class="mr-2">{{ $t('manufacture.bom.export.pageSize') }}:</span>
            <Input
              v-model:value="pageSize"
              type="number"
              :min="1"
              :max="1000"
              style="width: 120px"
            />
          </div>
          <div>
            <span class="mr-2">{{ $t('manufacture.bom.export.pageNumber') }}:</span>
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
        {{ $t('manufacture.bom.export.cancel') }}
      </Button>
      <Button type="primary" :loading="loading" @click="handleExport">
        {{ $t('manufacture.bom.export.export') }}
      </Button>
    </div>
  </Modal>
</template>
