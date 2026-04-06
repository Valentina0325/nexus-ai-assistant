<script setup>
  import { ref, watch } from 'vue'
  import { ElMessage } from 'element-plus'
  import { Delete } from '@element-plus/icons-vue'
  import { useUserStore } from '@/stores/user'

  const props = defineProps({
    modelValue: { type: Array, default: () => [] },
  })
  const emit = defineEmits(['update:modelValue'])

  const userStore = useUserStore()
  const uploadUrl = 'https://nexus-ai-backend-production-3faf.up.railway.app/api/upload'
  const uploading = ref(false)
  const files = ref([...props.modelValue])

  const headers = {
    Authorization: userStore.token,
  }

  const beforeUpload = (file) => {
    const isLt10M = file.size / 1024 / 1024 < 10
    if (!isLt10M) {
      ElMessage.error('文件大小不能超过 10MB')
      return false
    }
    uploading.value = true
    return true
  }

  const handleSuccess = (response) => {
    uploading.value = false
    if (response.code === 0) {
      const newFile = {
        filename: response.data.filename,
        url: response.data.url,
        type: response.data.type,
        size: response.data.size,
        extractedText: response.data.extractedText,
      }
      files.value.push(newFile)
      emit('update:modelValue', files.value)
      ElMessage.success('文件上传成功')
    } else {
      ElMessage.error(response.message || '上传失败')
    }
  }

  const handleError = (err) => {
    uploading.value = false
    ElMessage.error(err.message || '上传失败，请重试')
  }

  const removeFile = (index) => {
    files.value.splice(index, 1)
    emit('update:modelValue', files.value)
  }

  const getFileIcon = (type) => {
    if (type.startsWith('image/')) return '🖼️'
    if (type === 'text/plain') return '📄'
    if (type === 'application/pdf') return '📕'
    if (type.includes('word')) return '📘'
    if (type.includes('excel') || type.includes('spreadsheet')) return '📗'
    return '📎'
  }

  const formatSize = (bytes) => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  watch(
    () => props.modelValue,
    (newVal) => {
      files.value = [...newVal]
    },
    { deep: true }
  )
</script>

<template>
  <div class="file-upload">
    <el-upload
      :action="uploadUrl"
      :headers="headers"
      :before-upload="beforeUpload"
      :on-success="handleSuccess"
      :on-error="handleError"
      :show-file-list="false"
      :multiple="false"
      class="upload-btn"
    >
      <el-button
        size="small"
        type="primary"
        :loading="uploading"
        :disabled="uploading"
      >
        {{ uploading ? '上传中...' : '📎 上传文件' }}
      </el-button>
    </el-upload>

    <div v-if="files.length > 0" class="file-list">
      <div
        v-for="(file, index) in files"
        :key="index"
        class="file-item"
        :class="{
          'has-error': file.extractedText && file.extractedText.startsWith('['),
        }"
      >
        <div class="file-info">
          <span class="file-icon">{{ getFileIcon(file.type) }}</span>
          <span class="file-name" :title="file.filename">{{
            file.filename
          }}</span>
          <span class="file-size">{{ formatSize(file.size) }}</span>
        </div>
        <div class="file-actions">
          <el-tooltip
            v-if="file.extractedText && file.extractedText.startsWith('[')"
            content="文件解析失败，AI 可能无法读取内容"
            placement="top"
          >
            <span class="warning-icon">⚠️</span>
          </el-tooltip>
          <el-button
            type="danger"
            size="small"
            circle
            :icon="Delete"
            @click="removeFile(index)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .file-upload {
    margin-bottom: 12px;
  }
  .upload-btn {
    display: inline-block;
  }
  .file-list {
    margin-top: 8px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .file-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: rgba(0, 212, 255, 0.1);
    border-radius: 8px;
    padding: 6px 12px;
    border: 1px solid rgba(0, 212, 255, 0.3);
  }
  .file-info {
    display: flex;
    align-items: center;
    gap: 8px;
    flex: 1;
    overflow: hidden;
  }
  .file-actions {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .warning-icon {
    color: #ffaa00;
    cursor: help;
    font-size: 1rem;
  }
  .file-icon {
    font-size: 1.2rem;
  }
  .file-name {
    font-size: 0.85rem;
    color: #eef4ff;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .file-size {
    font-size: 0.7rem;
    color: #8a9bb5;
  }
</style>
