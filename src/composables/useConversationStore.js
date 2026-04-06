import { ref } from 'vue'

// 根据手机号获取存储 key
const getStorageKey = (mobile) => `nexus_ai_conversations_${mobile || 'guest'}`

const conversations = ref([])
const activeId = ref(null)
const currentMessages = ref([])
let currentUserMobile = null 

const persist = (mobile) => {
  if (!mobile) return
  const key = getStorageKey(mobile)
  localStorage.setItem(
    key,
    JSON.stringify({
      conversations: conversations.value,
      activeId: activeId.value,
    })
  )
}

export function useConversationStore() {
  const resetStore = () => {
    conversations.value = []
    activeId.value = null
    currentMessages.value = []
    currentUserMobile = null
  }


  const loadUserConversations = (mobile) => {
    if (!mobile) {
      resetStore()
      currentUserMobile = null
      return
    }
    if (currentUserMobile === mobile) return 
    resetStore()
    currentUserMobile = mobile
    const key = getStorageKey(mobile)
    const raw = localStorage.getItem(key)
    if (raw) {
      const data = JSON.parse(raw)
      conversations.value = data.conversations || []
      activeId.value = data.activeId || null
    }
    if (conversations.value.length === 0) {
      createNewConversation()
    } else if (activeId.value) {
      switchToConversation(activeId.value)
    } else {
      switchToConversation(conversations.value[0].id)
    }
  }

  const createNewConversation = () => {
    const newConv = {
      id: Date.now().toString(),
      title: '新对话',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      messages: [],
    }
    conversations.value.unshift(newConv)
    activeId.value = newConv.id
    currentMessages.value = [...newConv.messages]
    if (currentUserMobile) persist(currentUserMobile)
  }

  const switchToConversation = (id) => {
    const conv = conversations.value.find((c) => c.id === id)
    if (conv) {
      activeId.value = id
      currentMessages.value = [...conv.messages]
      if (currentUserMobile) persist(currentUserMobile)
    }
  }

  const deleteConversation = (id) => {
    const index = conversations.value.findIndex((c) => c.id === id)
    if (index !== -1) {
      conversations.value.splice(index, 1)
      if (activeId.value === id) {
        if (conversations.value.length > 0) {
          switchToConversation(conversations.value[0].id)
        } else {
          createNewConversation()
        }
      } else {
        if (currentUserMobile) persist(currentUserMobile)
      }
    }
  }

  const updateConversationTitle = (id, newTitle) => {
    const conv = conversations.value.find((c) => c.id === id)
    if (conv && newTitle) {
      let title = newTitle.substring(0, 20)
      if (title.length === 0) title = '新对话'
      conv.title = title
      conv.updatedAt = Date.now()
      conversations.value = [...conversations.value]
      if (currentUserMobile) persist(currentUserMobile)
    }
  }

  const addMessage = (message) => {
    if (!activeId.value) return
    const conv = conversations.value.find((c) => c.id === activeId.value)
    if (conv) {
      conv.messages.push(message)
      conv.updatedAt = Date.now()
      currentMessages.value = [...conv.messages]
      if (conv.messages.length === 1 && message.role === 'user') {
        const titleSource = message.originalContent || message.content
        updateConversationTitle(activeId.value, titleSource)
      }
      if (currentUserMobile) persist(currentUserMobile)
    }
  }

  const updateLastAssistantMessage = (content) => {
    if (!activeId.value) return
    const conv = conversations.value.find((c) => c.id === activeId.value)
    if (
      conv &&
      conv.messages.length > 0 &&
      conv.messages[conv.messages.length - 1].role === 'assistant'
    ) {
      conv.messages[conv.messages.length - 1].content = content
      conv.updatedAt = Date.now()
      currentMessages.value = [...conv.messages]
      if (currentUserMobile) persist(currentUserMobile)
    }
  }

  const popLastAssistantMessage = () => {
    if (!activeId.value) return
    const conv = conversations.value.find((c) => c.id === activeId.value)
    if (
      conv &&
      conv.messages.length > 0 &&
      conv.messages[conv.messages.length - 1].role === 'assistant'
    ) {
      conv.messages.pop()
      conv.updatedAt = Date.now()
      currentMessages.value = [...conv.messages]
      if (currentUserMobile) persist(currentUserMobile)
    }
  }

  return {
    conversations,
    activeId,
    currentMessages,
    resetStore,
    loadUserConversations,
    createNewConversation,
    switchToConversation,
    deleteConversation,
    addMessage,
    updateLastAssistantMessage,
    popLastAssistantMessage,
  }
}
