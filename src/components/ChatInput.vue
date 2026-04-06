<script setup>
  import { ref, defineEmits } from 'vue'
  import FileUpload from './FileUpload.vue'

  const props = defineProps({
    loading: { type: Boolean, default: false },
  })

  const emit = defineEmits(['send', 'stop'])

  const userInput = ref('')
  const mode = ref('summary')
  const attachments = ref([])

  const onSend = () => {
    if (props.loading) {
      emit('stop')
    } else {
      emit('send', {
        text: userInput.value,
        mode: mode.value,
        attachments: attachments.value,
      })
      userInput.value = ''
      attachments.value = []
    }
  }
</script>

<template>
  <div class="input-area">
    <FileUpload v-model="attachments" />
    <el-input
      v-model="userInput"
      type="textarea"
      :rows="3"
      placeholder="输入文本，AI 将根据模式处理..."
      class="cyber-textarea"
      :disabled="loading"
    />
    <div class="mode-select">
      <el-radio-group v-model="mode" class="cyber-radio-group">
        <el-radio value="translate">🌐 翻译</el-radio>
        <el-radio value="polish">✨ 润色</el-radio>
        <el-radio value="summary">⚡ 回答</el-radio>
      </el-radio-group>
    </div>
    <el-button
      :type="loading ? 'danger' : 'primary'"
      @click="onSend"
      class="send-btn"
      :class="{ 'stop-btn': loading }"
      :disabled="!userInput.trim() && attachments.length === 0 && !loading"
    >
      {{ loading ? '⏹️ 停止生成' : '🚀 发送指令' }}
    </el-button>
  </div>
</template>

<style scoped>
  .input-area {
    padding: 1rem 1.8rem 1.8rem;
    background: linear-gradient(0deg, rgba(0, 0, 0, 0.3), transparent);
    border-top: 1px solid rgba(0, 212, 255, 0.2);
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .cyber-textarea :deep(.el-textarea__inner) {
    background: rgba(5, 10, 22, 0.7) !important;
    border: 1px solid rgba(0, 212, 255, 0.4) !important;
    border-radius: 1rem !important;
    color: #eef4ff !important;
    font-size: 0.9rem;
    font-family: 'JetBrains Mono', monospace;
    resize: none;
    backdrop-filter: blur(5px);
  }
  .cyber-textarea :deep(.el-textarea__inner:focus) {
    border-color: #00d4ff !important;
    box-shadow: 0 0 16px rgba(0, 212, 255, 0.3) !important;
    background: rgba(0, 0, 0, 0.6) !important;
  }
  .cyber-textarea :deep(.el-textarea__inner:disabled) {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .mode-select {
    display: flex;
    justify-content: center;
  }

  .cyber-radio-group {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
    justify-content: center;
  }
  .cyber-radio-group :deep(.el-radio) {
    --el-radio-font-color: #cbd5e6;
    margin-right: 0;
    padding: 0.3rem 1rem;
    background: rgba(0, 212, 255, 0.05);
    border-radius: 40px;
    border: 1px solid rgba(0, 212, 255, 0.2);
    transition: 0.2s;
  }
  .cyber-radio-group :deep(.el-radio.is-checked) {
    border-color: #00d4ff;
    background: rgba(0, 212, 255, 0.2);
    box-shadow: 0 0 12px rgba(0, 212, 255, 0.4);
  }
  .cyber-radio-group :deep(.el-radio__label) {
    color: #cbd5e6;
    font-weight: 500;
  }
  .cyber-radio-group :deep(.el-radio.is-checked .el-radio__label) {
    color: #00d4ff;
    text-shadow: 0 0 4px cyan;
  }
  .cyber-radio-group :deep(.el-radio__input.is-checked .el-radio__inner) {
    background-color: #00d4ff;
    border-color: #00d4ff;
  }

  .send-btn {
    width: 100%;
    background: linear-gradient(95deg, #0b2b44, #1b3b5c);
    border: none;
    border-radius: 60px;
    padding: 12px 0;
    font-weight: 600;
    letter-spacing: 1px;
    transition: 0.2s;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  }
  .send-btn:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0, 212, 255, 0.3);
    background: linear-gradient(95deg, #00a6d4, #2c5f8a);
  }
  .send-btn.stop-btn {
    background: linear-gradient(95deg, #7a2c3e, #c23b55);
    box-shadow: 0 0 15px rgba(255, 30, 70, 0.5);
  }
  .send-btn:active {
    transform: translateY(1px);
  }
</style>
