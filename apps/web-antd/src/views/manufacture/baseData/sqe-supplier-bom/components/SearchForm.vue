<script setup lang="ts">
import type { Dayjs } from 'dayjs';

import type { BomListParams } from '#/api/manufacture/bom';

import { ref } from 'vue';

import { Button, DatePicker, Form, Input, Select, Space } from 'ant-design-vue';
import dayjs from 'dayjs';

import { $t } from '#/locales';

defineOptions({ name: 'BomSearchForm' });

const emit = defineEmits<{
  reset: [];
  search: [params: BomListParams];
}>();

const formRef = ref();
const formState = ref<BomListParams>({});

// Date range presets
const rangePresets = [
  {
    label: $t('manufacture.bom.datePresets.today'),
    value: [dayjs(), dayjs()] as [Dayjs, Dayjs],
  },
  {
    label: $t('manufacture.bom.datePresets.last3Days'),
    value: [dayjs().subtract(2, 'day'), dayjs()] as [Dayjs, Dayjs],
  },
  {
    label: $t('manufacture.bom.datePresets.lastWeek'),
    value: [dayjs().subtract(6, 'day'), dayjs()] as [Dayjs, Dayjs],
  },
  {
    label: $t('manufacture.bom.datePresets.last30Days'),
    value: [dayjs().subtract(29, 'day'), dayjs()] as [Dayjs, Dayjs],
  },
  {
    label: $t('manufacture.bom.datePresets.last90Days'),
    value: [dayjs().subtract(89, 'day'), dayjs()] as [Dayjs, Dayjs],
  },
];

// Mock options for select fields (in real app, these would come from API)
const businessUnitOptions = ref([
  { label: '乘用车事业部', value: 'BU001' },
  { label: '商用车事业部', value: 'BU002' },
  { label: '新能源事业部', value: 'BU003' },
  { label: '零部件事业部', value: 'BU004' },
]);

const supplierOptions = ref([
  { label: '奇瑞汽车零部件有限公司', value: 'SUP001' },
  { label: '安徽奇瑞科技有限公司', value: 'SUP002' },
  { label: '芜湖奇瑞汽车技术有限公司', value: 'SUP003' },
  { label: '奇瑞新能源技术有限公司', value: 'SUP004' },
  { label: '奇瑞商用车有限公司', value: 'SUP005' },
]);

// Note: Search is triggered manually via search button click
// For auto-search on input change, implement debounce in the parent component

function handleSearch() {
  const params: BomListParams = { ...formState.value };

  // Convert date ranges to ISO strings
  if (params.bomChangeTime && Array.isArray(params.bomChangeTime)) {
    const [start, end] = params.bomChangeTime as [Dayjs, Dayjs];
    params.bomChangeTimeStart = start?.toISOString();
    params.bomChangeTimeEnd = end?.toISOString();
    delete params.bomChangeTime;
  }

  if (params.changeTime && Array.isArray(params.changeTime)) {
    const [start, end] = params.changeTime as [Dayjs, Dayjs];
    params.changeTimeStart = start?.toISOString();
    params.changeTimeEnd = end?.toISOString();
    delete params.changeTime;
  }

  // Remove empty values
  Object.keys(params).forEach((key) => {
    const value = params[key as keyof BomListParams];
    if (value === undefined || value === null || value === '') {
      delete params[key as keyof BomListParams];
    }
  });

  emit('search', params);
}

function handleReset() {
  formState.value = {};
  formRef.value?.resetFields();
  emit('reset');
}
</script>

<template>
  <Form ref="formRef" :model="formState" layout="inline" class="mb-4">
    <Form.Item
      :label="$t('manufacture.bom.search.businessUnit')"
      name="businessUnit"
    >
      <Select
        v-model:value="formState.businessUnit"
        :options="businessUnitOptions"
        :placeholder="$t('manufacture.bom.search.businessUnit')"
        allow-clear
        style="width: 180px"
      />
    </Form.Item>

    <Form.Item :label="$t('manufacture.bom.search.supplier')" name="supplier">
      <Select
        v-model:value="formState.supplier"
        :options="supplierOptions"
        :placeholder="$t('manufacture.bom.search.supplier')"
        allow-clear
        style="width: 200px"
      />
    </Form.Item>

    <Form.Item
      :label="$t('manufacture.bom.search.cheryPartNumber')"
      name="cheryPartNumber"
    >
      <Input
        v-model:value="formState.cheryPartNumber"
        :placeholder="$t('manufacture.bom.search.cheryPartNumber')"
        allow-clear
        style="width: 180px"
      />
    </Form.Item>

    <Form.Item
      :label="$t('manufacture.bom.search.cheryPartName')"
      name="cheryPartName"
    >
      <Input
        v-model:value="formState.cheryPartName"
        :placeholder="$t('manufacture.bom.search.cheryPartName')"
        allow-clear
        style="width: 180px"
      />
    </Form.Item>

    <Form.Item :label="$t('manufacture.bom.search.bomCode')" name="bomCode">
      <Input
        v-model:value="formState.bomCode"
        :placeholder="$t('manufacture.bom.search.bomCode')"
        allow-clear
        style="width: 180px"
      />
    </Form.Item>

    <Form.Item :label="$t('manufacture.bom.search.bomName')" name="bomName">
      <Input
        v-model:value="formState.bomName"
        :placeholder="$t('manufacture.bom.search.bomName')"
        allow-clear
        style="width: 180px"
      />
    </Form.Item>

    <Form.Item
      :label="$t('manufacture.bom.search.supplierParentPartCode')"
      name="supplierParentPartCode"
    >
      <Input
        v-model:value="formState.supplierParentPartCode"
        :placeholder="$t('manufacture.bom.search.supplierParentPartCode')"
        allow-clear
        style="width: 200px"
      />
    </Form.Item>

    <Form.Item
      :label="$t('manufacture.bom.search.supplierParentPartName')"
      name="supplierParentPartName"
    >
      <Input
        v-model:value="formState.supplierParentPartName"
        :placeholder="$t('manufacture.bom.search.supplierParentPartName')"
        allow-clear
        style="width: 200px"
      />
    </Form.Item>

    <Form.Item
      :label="$t('manufacture.bom.search.childPartCode')"
      name="childPartCode"
    >
      <Input
        v-model:value="formState.childPartCode"
        :placeholder="$t('manufacture.bom.search.childPartCode')"
        allow-clear
        style="width: 180px"
      />
    </Form.Item>

    <Form.Item
      :label="$t('manufacture.bom.search.childPartName')"
      name="childPartName"
    >
      <Input
        v-model:value="formState.childPartName"
        :placeholder="$t('manufacture.bom.search.childPartName')"
        allow-clear
        style="width: 180px"
      />
    </Form.Item>

    <Form.Item
      :label="$t('manufacture.bom.search.bomVersion')"
      name="bomVersion"
    >
      <Input
        v-model:value="formState.bomVersion"
        :placeholder="$t('manufacture.bom.search.bomVersion')"
        allow-clear
        style="width: 150px"
      />
    </Form.Item>

    <Form.Item
      :label="$t('manufacture.bom.search.categoryName')"
      name="categoryName"
    >
      <Input
        v-model:value="formState.categoryName"
        :placeholder="$t('manufacture.bom.search.categoryName')"
        allow-clear
        style="width: 180px"
      />
    </Form.Item>

    <Form.Item
      :label="$t('manufacture.bom.search.bomChangeTime')"
      name="bomChangeTime"
    >
      <DatePicker.RangePicker
        v-model:value="formState.bomChangeTime"
        :presets="rangePresets"
        format="YYYY-MM-DD"
        style="width: 240px"
      />
    </Form.Item>

    <Form.Item
      :label="$t('manufacture.bom.search.changeTime')"
      name="changeTime"
    >
      <DatePicker.RangePicker
        v-model:value="formState.changeTime"
        :presets="rangePresets"
        format="YYYY-MM-DD"
        style="width: 240px"
      />
    </Form.Item>

    <Form.Item>
      <Space>
        <Button type="primary" @click="handleSearch">
          {{ $t('manufacture.bom.search.search') }}
        </Button>
        <Button @click="handleReset">
          {{ $t('manufacture.bom.search.reset') }}
        </Button>
      </Space>
    </Form.Item>
  </Form>
</template>
