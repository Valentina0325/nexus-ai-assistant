<script setup>
  import { ref, onMounted, computed } from 'vue'
  import { useUserStore } from '@/stores/user'
  import { useChat } from '@/composables/useChat'
  import { useConversationStore } from '@/composables/useConversationStore'
  import ConversationSidebar from '@/components/ConversationSidebar.vue'
  import ChatInput from '@/components/ChatInput.vue'
  import ChatMessage from '@/components/ChatMessage.vue'
  import ChatHeader from '@/components/ChatHeader.vue'

  const store = useConversationStore()
  const userStore = useUserStore()

  const { loading, sendMessage, stopGeneration } = useChat()

  const isLoggedIn = computed(() => userStore.isLoggedIn())
  const chatMessagesRef = ref(null)
  const showScrollButton = ref(false)

  const onScrollChange = (show) => {
    showScrollButton.value = show
  }

  const scrollToBottom = () => {
    if (chatMessagesRef.value) {
      chatMessagesRef.value.scrollToBottom(true)
    }
  }
  const handleSend = async (params) => {
    if (chatMessagesRef.value) {
      chatMessagesRef.value.forceScrollToBottom()
    }
    await sendMessage(params)
  }

  // 页面加载时，从本地存储加载历史对话
  onMounted(() => {
    if (isLoggedIn.value) {
      store.loadUserConversations(userStore.userInfo?.mobile)
    } else {
      store.resetStore()
    }
  })
</script>

<template>
  <div class="home-container">
    <div class="ai-assistant-wrapper">
      <ConversationSidebar />
      <div class="ai-assistant">
        <div class="header-glow"></div>
        <ChatHeader />
        <ChatMessage
          ref="chatMessagesRef"
          :messages="store.currentMessages"
          :loading="loading"
          @scroll-change="onScrollChange"
        />

        <transition name="fade-up">
          <button
            v-if="showScrollButton"
            class="scroll-to-bottom-btn"
            @click="scrollToBottom"
            title="回到底部"
          >
            ↓
          </button>
        </transition>

        <ChatInput
          :loading="loading"
          @send="handleSend"
          @stop="stopGeneration"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
  .home-container {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    margin: 0;
  }

  .ai-assistant-wrapper {
    display: flex;
    width: 100%;
    height: 100vh;
    max-width: 1400px;
    margin: 0 auto;
    background: rgba(8, 12, 25, 0.65);
    backdrop-filter: blur(16px);
    border-radius: 2rem;
    border: 1px solid var(--glass-border);
    box-shadow: var(--card-shadow);
    overflow: hidden;
  }

  .ai-assistant {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    position: relative;
  }

  .header-glow {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 4px;
    background: linear-gradient(90deg, #00d4ff, #7b2cbf, #ff00cc, #00d4ff);
    background-size: 200% auto;
    animation: scanline 3s linear infinite;
  }

  @keyframes scanline {
    0% {
      background-position: 0% 0;
    }
    100% {
      background-position: 200% 0;
    }
  }

  @media (max-width: 680px) {
    .ai-assistant-wrapper {
      flex-direction: column;
      height: 90vh;
    }
    .conversation-sidebar {
      width: 100%;
      height: auto;
      max-height: 30%;
      flex-direction: row;
      overflow-x: auto;
    }
    .ai-assistant {
      height: 70%;
    }
    .bubble {
      max-width: 85%;
    }
    .title-section h1 {
      font-size: 1.4rem;
    }
    .chat-messages {
      padding: 1rem;
    }
    .input-area {
      padding: 1rem;
    }
  }

 @media (max-width: 768px) {
    .ai-assistant-wrapper {
      flex-direction: column;
      height: 100vh;
      border-radius: 0;
    }
    .ai-assistant {
      height: 100%;
      padding: 0;
    }
    .chat-messages {
      padding: 1rem;
    }
    .input-area {
      padding: 0.8rem;
    }
    .bubble {
      max-width: 85%;
    }
    .title-section h1 {
      font-size: 1.4rem;
    }
    .title-section {
      padding: 1rem 1rem 0.5rem;
    }
    .scroll-to-bottom-btn {
      bottom: 200px;
      right: 20px;
      width: 40px;
      height: 40px;
      font-size: 20px;
    }
  }

  .scroll-to-bottom-btn {
    position: absolute;
    bottom: 280px;
    right: 30px;
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background: rgba(0, 212, 255, 0.8);
    backdrop-filter: blur(8px);
    border: 1px solid rgba(255, 255, 255, 0.3);
    color: white;
    font-size: 24px;
    font-weight: bold;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    z-index: 10;
  }
  .scroll-to-bottom-btn:hover {
    background: #00d4ff;
    transform: scale(1.05);
    box-shadow: 0 0 12px rgba(0, 212, 255, 0.6);
  }
  .fade-up-enter-active,
  .fade-up-leave-active {
    transition: all 0.2s ease;
  }
  .fade-up-enter-from,
  .fade-up-leave-to {
    opacity: 0;
    transform: translateY(20px);
  }
</style>
