<template>
  <tiny-file-upload ref="uploadRef" :action="action" accept=".jpg,.png" re-uploadable :re-upload-tip="reUploadTip">
    <template #trigger>
      <tiny-button type="primary">选取文件</tiny-button>
    </template>
    <template #tip>
      <div class="tiny-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
    </template>
  </tiny-file-upload>
</template>

<script setup lang="jsx">
import { ref } from 'vue'
import { FileUpload as TinyFileUpload, Button as TinyButton } from '@opentiny/vue'

const action = ref('http://localhost:3000/api/upload')
const reUploadTip = (count) => `我是自定义重新上传的左侧提示，${count}个文件变红啦！`
</script>
