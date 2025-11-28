<script setup lang="ts">
import type { ImportResult } from '#/api/manufacture/material';

import { ref } from 'vue';

import { Button, message, Modal, Upload } from 'ant-design-vue';

import {
  downloadTemplateApi,
  importMaterialApi,
} from '#/api/manufacture/material';
import { $t } from '#/locales';

defineOptions({ name: 'MaterialImportDialog' });

defineProps<{
  visible: boolean;
}>();

const emit = defineEmits<{
  success: [];
  'update:visible': [value: boolean];
}>();

const loading = ref(false);
const fileList = ref<any[]>([]);
const importResult = ref<ImportResult | null>(null);
const showResult = ref(false);

const handleDownloadTemplate = async () => {
  try {
    const response = await downloadTemplateApi();
    if (response instanceof Blob) {
      const url = window.URL.createObjectURL(response);
      const link = document.createElement('a');
      link.href = url;
      link.download = '物料主数据导入模板.csv';
      document.body.append(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      message.success(
        $t('manufacture.material.messages.operationSuccess') || '操作成功',
      );
    }
  } catch (error) {
    console.error('Failed to download template:', error);
    message.error($t('manufacture.material.messages.operationFailed'));
  }
};

const handleUpload = async (file: File) => {
  // Validate file type
  const validTypes = [
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-excel',
    'text/csv',
  ];
  const validExtensions = ['.xlsx', '.xls', '.csv'];

  const fileExtension = file.name
    .slice(Math.max(0, file.name.lastIndexOf('.')))
    .toLowerCase();
  const isValidType =
    validTypes.includes(file.type) || validExtensions.includes(fileExtension);

  if (!isValidType) {
    message.error($t('manufacture.material.import.fileType'));
    return false;
  }

  // Validate file size (10MB)
  const maxSize = 10 * 1024 * 1024;
  if (file.size > maxSize) {
    message.error('文件大小不超过 10MB');
    return false;
  }

  try {
    loading.value = true;
    const response = await importMaterialApi(file, true);
    if (response) {
      importResult.value = response;
      showResult.value = true;
      message.success($t('manufacture.material.import.success'));
      emit('success');
    } else {
      message.error($t('manufacture.material.import.failed'));
    }
  } catch (error) {
    console.error('Failed to import file:', error);
    message.error($t('manufacture.material.import.failed'));
  } finally {
    loading.value = false;
    fileList.value = [];
  }

  return false; // Prevent default upload
};

const handleClose = () => {
  fileList.value = [];
  importResult.value = null;
  showResult.value = false;
  emit('update:visible', false);
};
</script>

<template>
  <Modal
    :open="visible"
    :title="$t('manufacture.material.import.title')"
    :width="600"
    :footer="null"
    @cancel="handleClose"
  >
    <div class="mb-4">
      <Button type="link" @click="handleDownloadTemplate">
        {{ $t('manufacture.material.import.downloadTemplate') }}
      </Button>
    </div>

    <Upload.Dragger
      v-model:file-list="fileList"
      :before-upload="handleUpload"
      :max-count="1"
      :show-upload-list="true"
      accept=".xlsx,.xls,.csv"
    >
      <p class="ant-upload-drag-icon">
        <span class="text-4xl">📁</span>
      </p>
      <p class="ant-upload-text">
        {{ $t('manufacture.material.import.selectFile') }}
      </p>
      <p class="ant-upload-hint">
        {{ $t('manufacture.material.import.fileType') }}<br />
        文件大小不超过 10MB
      </p>
    </Upload.Dragger>

    <div v-if="showResult && importResult" class="mt-4">
      <h4>{{ $t('manufacture.material.import.success') }}</h4>
      <p>
        {{ $t('manufacture.material.import.totalRows') }}:
        {{ importResult.totalRows }}
      </p>
      <p>
        {{ $t('manufacture.material.import.successCount') }}:
        {{ importResult.successCount }}
      </p>
      <p v-if="importResult.failedCount > 0">
        {{ $t('manufacture.material.import.failedCount') }}:
        {{ importResult.failedCount }}
      </p>
      <p v-if="importResult.duplicateCount > 0">
        重复: {{ importResult.duplicateCount }}
      </p>
      <div
        v-if="importResult.errors && importResult.errors.length > 0"
        class="mt-2"
      >
        <h5>{{ $t('manufacture.material.import.errorDetails') }}:</h5>
        <ul>
          <li v-for="error in importResult.errors" :key="error.rowNumber">
            行 {{ error.rowNumber }}: {{ error.message }}
          </li>
        </ul>
      </div>
    </div>

    <div class="mt-4 text-right">
      <Button @click="handleClose">
        {{ $t('common.cancel') || '关闭' }}
      </Button>
    </div>
  </Modal>
</template>
