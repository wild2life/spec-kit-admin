<script setup lang="ts">
import type { TableColumnsType } from 'ant-design-vue';
import type { Key } from 'ant-design-vue/es/table/interface';

import type { BOMRecord } from '#/api/manufacture/bom';

import { computed, ref } from 'vue';

import { Table } from 'ant-design-vue';

import { $t } from '#/locales';

defineOptions({ name: 'BomDataTable' });

const props = defineProps<{
  data: BOMRecord[];
  loading?: boolean;
  pagination?: {
    current: number;
    pageSize: number;
    total: number;
  };
}>();

const emit = defineEmits<{
  'page-change': [page: number, pageSize: number];
  'update:selectedRowKeys': [keys: Key[]];
}>();

const selectedRowKeys = ref<Key[]>([]);

const columns = computed<TableColumnsType<BOMRecord>>(() => [
  {
    title: $t('manufacture.bom.table.businessUnitCode'),
    dataIndex: 'businessUnitCode',
    key: 'businessUnitCode',
    fixed: 'left',
    width: 120,
  },
  {
    title: $t('manufacture.bom.table.businessUnit'),
    dataIndex: 'businessUnit',
    key: 'businessUnit',
    width: 150,
  },
  {
    title: $t('manufacture.bom.table.supplierCode'),
    dataIndex: 'supplierCode',
    key: 'supplierCode',
    width: 120,
  },
  {
    title: $t('manufacture.bom.table.supplierName'),
    dataIndex: 'supplierName',
    key: 'supplierName',
    width: 200,
  },
  {
    title: $t('manufacture.bom.table.cheryPartNumber'),
    dataIndex: 'cheryPartNumber',
    key: 'cheryPartNumber',
    width: 150,
  },
  {
    title: $t('manufacture.bom.table.cheryPartName'),
    dataIndex: 'cheryPartName',
    key: 'cheryPartName',
    width: 200,
  },
  {
    title: $t('manufacture.bom.table.bomCode'),
    dataIndex: 'bomCode',
    key: 'bomCode',
    width: 150,
  },
  {
    title: $t('manufacture.bom.table.bomName'),
    dataIndex: 'bomName',
    key: 'bomName',
    width: 200,
  },
  {
    title: $t('manufacture.bom.table.supplierParentPartCode'),
    dataIndex: 'supplierParentPartCode',
    key: 'supplierParentPartCode',
    width: 180,
  },
  {
    title: $t('manufacture.bom.table.supplierParentPartName'),
    dataIndex: 'supplierParentPartName',
    key: 'supplierParentPartName',
    width: 200,
  },
  {
    title: $t('manufacture.bom.table.parentPartType'),
    dataIndex: 'parentPartType',
    key: 'parentPartType',
    width: 120,
  },
  {
    title: $t('manufacture.bom.table.parentPartUnit'),
    dataIndex: 'parentPartUnit',
    key: 'parentPartUnit',
    width: 100,
  },
  {
    title: $t('manufacture.bom.table.childPartCode'),
    dataIndex: 'childPartCode',
    key: 'childPartCode',
    width: 150,
  },
  {
    title: $t('manufacture.bom.table.childPartName'),
    dataIndex: 'childPartName',
    key: 'childPartName',
    width: 200,
  },
  {
    title: $t('manufacture.bom.table.childPartType'),
    dataIndex: 'childPartType',
    key: 'childPartType',
    width: 120,
  },
  {
    title: $t('manufacture.bom.table.childPartQuantity'),
    dataIndex: 'childPartQuantity',
    key: 'childPartQuantity',
    width: 120,
    align: 'right',
  },
  {
    title: $t('manufacture.bom.table.childPartUnit'),
    dataIndex: 'childPartUnit',
    key: 'childPartUnit',
    width: 100,
  },
  {
    title: $t('manufacture.bom.table.bomVersion'),
    dataIndex: 'bomVersion',
    key: 'bomVersion',
    width: 120,
  },
  {
    title: $t('manufacture.bom.table.bomChangeTime'),
    dataIndex: 'bomChangeTime',
    key: 'bomChangeTime',
    width: 180,
  },
  {
    title: $t('manufacture.bom.table.createTime'),
    dataIndex: 'createTime',
    key: 'createTime',
    width: 180,
  },
  {
    title: $t('manufacture.bom.table.updateTime'),
    dataIndex: 'updateTime',
    key: 'updateTime',
    width: 180,
  },
  {
    title: $t('manufacture.bom.table.categoryCode'),
    dataIndex: 'categoryCode',
    key: 'categoryCode',
    width: 120,
  },
  {
    title: $t('manufacture.bom.table.categoryName'),
    dataIndex: 'categoryName',
    key: 'categoryName',
    width: 150,
  },
  {
    title: $t('manufacture.bom.table.creatorLoginAccount'),
    dataIndex: 'creatorLoginAccount',
    key: 'creatorLoginAccount',
    width: 150,
  },
  {
    title: $t('manufacture.bom.table.dataSource'),
    dataIndex: 'dataSource',
    key: 'dataSource',
    width: 120,
  },
  {
    title: $t('manufacture.bom.table.updaterAccount'),
    dataIndex: 'updaterAccount',
    key: 'updaterAccount',
    width: 150,
  },
]);

const rowSelection = computed(() => ({
  selectedRowKeys: selectedRowKeys.value,
  onChange: (keys: Key[]) => {
    selectedRowKeys.value = keys;
    emit('update:selectedRowKeys', keys);
  },
  columnTitle: '',
  columnWidth: 60,
  fixed: 'left' as const,
}));

const paginationConfig = computed(() => {
  if (!props.pagination) return false;
  return {
    current: props.pagination.current,
    pageSize: props.pagination.pageSize,
    total: props.pagination.total,
    showSizeChanger: true,
    showQuickJumper: true,
    showTotal: (total: number) => `共 ${total} 条`,
    onChange: (page: number, pageSize: number) => {
      emit('page-change', page, pageSize);
    },
  };
});
</script>

<template>
  <Table
    :columns="columns"
    :data-source="data"
    :loading="loading"
    :pagination="paginationConfig"
    :row-selection="rowSelection"
    :scroll="{ x: 3000, y: 600 }"
    bordered
    row-key="id"
  >
    <template #emptyText>
      {{ $t('manufacture.bom.table.noData') }}
    </template>
  </Table>
</template>
