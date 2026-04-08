<script setup>
  import { ref, watch, nextTick,computed } from 'vue'
  import marked from 'marked'

  const props = defineProps({
    messages: { type: [Array,Object], required: true },
    loading: { type: Boolean, default: false },
  })

const messagesArray = computed(() => {
  if (Array.isArray(props.messages)) {
    return props.messages
  }
  if (props.messages && typeof props.messages === 'object' && 'value' in props.messages) {
    return props.messages.value
  }
  return []
})

  const emit = defineEmits(['scroll-change'])

  const chatMsgRef = ref(null)
  const autoScroll = ref(true)

  const scrollToBottom = async (force = false) => {
    if (!force && !autoScroll.value) return
    await nextTick()
    if (chatMsgRef.value) {
      const lastMessage = chatMsgRef.value.lastElementChild
      if (lastMessage) {
        lastMessage.scrollIntoView({ behavior: 'smooth', block: 'end' })
      } else {
        chatMsgRef.value.scrollTop = chatMsgRef.value.scrollHeight
      }
    }
  }

  const handleScroll = () => {
    if (!chatMsgRef.value) return
    const { scrollTop, scrollHeight, clientHeight } = chatMsgRef.value
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 50
    const hasOverflow = scrollHeight > clientHeight
    emit('scroll-change', hasOverflow && !isNearBottom)
    autoScroll.value = isNearBottom
  }

  watch(
    () => messagesArray.value,
    () => {
      scrollToBottom()
    },
    { deep: true }
  )

  watch(
    () => props.loading,
    (newVal) => {
      if (newVal) scrollToBottom()
    }
  )

  const renderMarkdown = (text) => {
    if (!text) return ''
    return marked(text)
  }

  const getUserDisplayContent = (msg) => {
    if (msg.role !== 'user') return msg.content
    if (msg.originalContent) return msg.originalContent
    if (msg.attachments && msg.attachments.length) {
      return `已上传 ${msg.attachments.length} 个文件`
    }
    return msg.content
  }

  const getFileIcon = (type) => {
    if (type.startsWith('image/')) return '🖼️'
    if (type === 'text/plain') return '📄'
    if (type === 'application/pdf') return '📕'
    if (type.includes('word')) return '📘'
    if (type.includes('excel')) return '📗'
    return '📎'
  }

  // 强制滚动到底部（用于发送新消息时）
  const forceScrollToBottom = () => {
    autoScroll.value = true
    scrollToBottom(true)
  }

  defineExpose({
    scrollToBottom,
    scrollContainer: chatMsgRef,
    forceScrollToBottom,
  })
</script>

<template>
  <div class="chat-messages" ref="chatMsgRef" @scroll="handleScroll">
    <div
      v-for="(item, index) in messagesArray"
      :key="index"
      :class="['message', item.role]"
    >
      <div class="avatar">{{ item.role === 'user' ? '👤' : '✨' }}</div>
      <div class="bubble">
        <div class="role">{{ item.role === 'user' ? '用户' : 'AI 中枢' }}</div>
        <div
          class="content"
          v-html="renderMarkdown(getUserDisplayContent(item))"></div>

        <div
          v-if="
            item.role === 'user' && item.attachments && item.attachments.length
          "
          class="attachments"
        >
          <div class="attachments-title">📎 附件：</div>
          <div
            v-for="(att, idx) in item.attachments"
            :key="idx"
            class="attachment-item"
          >
            <a
              :href="att.url"
              target="_blank"
              class="attachment-link"
              :title="att.filename"
            >
              <span class="attach-icon">{{ getFileIcon(att.type) }}</span>
              <span class="attach-name">{{ att.filename }}</span>
            </a>
          </div>
        </div>
      </div>
    </div>
    <div
      v-if="
        loading &&
        messages.length &&
        messages[messages.length - 1]?.role === 'assistant' &&
        !messages[messages.length - 1].content
      "
      class="thinking"
    >
      <span class="dot"></span><span class="dot"></span
      ><span class="dot"></span>
      <span>AI 正在思考...</span>
    </div>
  </div>
</template>

<style scoped>
  .chat-messages {
    flex: 1;
    overflow-y: auto;
    padding: 1.5rem 1.8rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    scroll-behavior: smooth;
    position: relative;
  }

  .message {
    display: flex;
    gap: 12px;
    align-items: flex-start;
    animation: fadeSlideUp 0.3s ease-out;
  }

  @keyframes fadeSlideUp {
    from {
      opacity: 0;
      transform: translateY(12px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .message.user {
    flex-direction: row-reverse;
  }

  .avatar {
    width: 36px;
    height: 36px;
    background: rgba(0, 212, 255, 0.1);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.2rem;
    backdrop-filter: blur(4px);
    border: 1px solid rgba(0, 212, 255, 0.4);
    box-shadow: 0 0 6px rgba(0, 212, 255, 0.3);
    flex-shrink: 0;
  }

  .bubble {
    max-width: 75%;
    background: rgba(20, 28, 40, 0.7);
    backdrop-filter: blur(8px);
    border-radius: 1.2rem;
    padding: 0.7rem 1.2rem;
    border: 1px solid rgba(0, 212, 255, 0.2);
    transition: all 0.2s;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }

  .message.user .bubble {
    background: linear-gradient(
      135deg,
      rgba(0, 212, 255, 0.2),
      rgba(123, 44, 191, 0.2)
    );
    border: 1px solid rgba(0, 212, 255, 0.5);
    border-right: 2px solid #00d4ff;
  }

  .role {
    font-size: 0.7rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: #00d4ff;
    margin-bottom: 5px;
    opacity: 0.8;
  }

  .message.user .role {
    color: #b77eff;
    text-align: right;
  }

  .content {
    color: #eef4ff;
    font-size: 0.95rem;
    line-height: 1.5;
    word-break: break-word;
  }

  .content :deep(p) {
    margin: 0.5em 0;
  }
  .content :deep(strong) {
    color: #00d4ff;
    font-weight: 600;
  }
  .content :deep(ul),
  .content :deep(ol) {
    padding-left: 1.2rem;
    margin: 0.5rem 0;
  }
  .content :deep(li) {
    margin: 0.3rem 0;
  }
  .content :deep(h1),
  .content :deep(h2),
  .content :deep(h3) {
    color: #fff;
    border-left: 3px solid #00d4ff;
    padding-left: 0.6rem;
    margin: 0.8rem 0;
  }
  .content :deep(table) {
    border-collapse: collapse;
    width: 100%;
    margin: 0.8rem 0;
    background: rgba(0, 0, 0, 0.3);
    border-radius: 12px;
    overflow: hidden;
  }
  .content :deep(th),
  .content :deep(td) {
    border: 1px solid rgba(0, 212, 255, 0.3);
    padding: 8px 12px;
    text-align: left;
    color: #d1e2fc;
  }
  .content :deep(th) {
    background: rgba(0, 212, 255, 0.15);
    font-weight: 600;
    color: #00d4ff;
  }
  .content :deep(code) {
    background: #0a0f1c;
    padding: 0.2rem 0.4rem;
    border-radius: 6px;
    font-family: monospace;
    font-size: 0.85rem;
    color: #ff9f7c;
  }
  .content :deep(pre) {
    background: #0a0f1c;
    padding: 0.8rem;
    border-radius: 12px;
    overflow-x: auto;
    border: 1px solid #2d3e5f;
  }
  .content :deep(blockquote) {
    border-left: 3px solid #00d4ff;
    padding-left: 1rem;
    color: #bbd4ff;
    margin: 0.5rem 0;
  }

  .thinking {
    display: flex;
    align-items: center;
    gap: 8px;
    background: rgba(0, 212, 255, 0.1);
    backdrop-filter: blur(4px);
    width: fit-content;
    padding: 0.5rem 1.2rem;
    border-radius: 40px;
    margin-left: 58px;
    border: 1px solid rgba(0, 212, 255, 0.3);
    color: #8bb9fe;
    font-size: 0.75rem;
  }
  .dot {
    width: 8px;
    height: 8px;
    background-color: #00d4ff;
    border-radius: 50%;
    display: inline-block;
    animation: pulseDot 1.4s infinite ease-in-out both;
  }
  .dot:nth-child(1) {
    animation-delay: -0.32s;
  }
  .dot:nth-child(2) {
    animation-delay: -0.16s;
  }
  @keyframes pulseDot {
    0%,
    80%,
    100% {
      transform: scale(0.6);
      opacity: 0.4;
    }
    40% {
      transform: scale(1);
      opacity: 1;
    }
  }
</style>
