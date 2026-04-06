import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRouter } from 'vue-router'
import { useConversationStore } from '@/composables/useConversationStore'
import { useUserStore } from '@/stores/user'

export function useChat() {
  const store = useConversationStore()
  const userStore = useUserStore()
  const router = useRouter()

  const loading = ref(false)
  const abortController = ref(null)

  // 根据模式生成带格式要求的指令
  const getInstruction = (mode) => {
    switch (mode) {
      case 'translate':
        return `请将以下内容翻译成英文，只输出翻译结果。  
输出时使用 **Markdown 格式**，适当使用表格、emoji（✅ 🚀 ⭐ 等）、加粗、列表，使排版清晰美观。`
      case 'polish':
        return `请润色以下文本，使其表达更流畅、更地道，只输出润色后的文本。  
输出时使用 **Markdown 格式**，适当使用表格、emoji（✅ 🚀 ⭐ 等）、加粗、列表，使排版清晰美观。`
      case 'summary':
        return `请回答以下内容，抓住核心要点。  
输出时使用 **Markdown 格式**，适当使用表格、emoji（✅ 🚀 ⭐ 等）、加粗、列表，使排版清晰美观。`
      default:
        return ''
    }
  }

  // 提取文件内容（使用后端解析的文本）
  const extractFileContent = async (file) => {
    return file.extractedText || null
  }

 
  const stopGeneration = () => {
    if (abortController.value) {
      abortController.value.abort()
    }
  }

  const sendMessage = async ({ text, mode, attachments = [] }) => {
    if (!userStore.isLoggedIn()) {
      try {
        await ElMessageBox.confirm('您尚未登录，请先登录后使用AI助手', '提示', {
          confirmButtonText: '去登录',
          cancelButtonText: '取消',
          type: 'warning',
          draggable: true,
        })
        router.push({
          path: '/login',
          query: { redirect: router.currentRoute.value.fullPath },
        })
      } catch {}
      return
    }

    const originalInput = text.trim()
    if (!originalInput && attachments.length === 0) {
      ElMessage.warning('请输入内容或上传文件')
      return
    }

    // 处理附件：提取文本内容
    let fileContent = ''
    for (const att of attachments) {
      const content = await extractFileContent(att)
      if (content) {
        fileContent += `\n\n【文件 ${att.filename} 的内容】：\n${content}`
      } else {
        fileContent += `\n\n【文件 ${att.filename}】已上传，但无法自动解析内容（可能为图片或加密文档）。`
      }
    }

    // 构建最终用户消息
    let userMessageContent = originalInput
    if (fileContent) {
      userMessageContent = originalInput
        ? originalInput + fileContent
        : fileContent
    }

    const instruction = getInstruction(mode)
    const fullContent = instruction
      ? `${instruction}\n\n${userMessageContent}`
      : userMessageContent

    const userMsg = {
      role: 'user',
      content: fullContent,
      originalContent: originalInput,
      attachments: attachments, // 保存附件信息，用于前端展示
    }
    store.addMessage(userMsg)
    loading.value = true

    const historyForAPI = store.currentMessages.value.map((m) => ({
      role: m.role,
      content: m.content,
    }))

    abortController.value = new AbortController()

    try {
      const res = await fetch('http://localhost:3000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: userStore.token,
        },
        body: JSON.stringify({ messages: historyForAPI }),
        signal: abortController.value.signal,
      })

      if (res.status === 401) {
        userStore.logout()
        ElMessage.error('登录已过期，请重新登录')
        router.push('/login')
        return
      }

      if (!res.ok) throw new Error(`HTTP ${res.status}`)

      const reader = res.body.getReader()
      const decoder = new TextDecoder('utf-8')

      store.addMessage({ role: 'assistant', content: '' })
      let assistantContent = ''
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const events = buffer.split('\n\n')
        buffer = events.pop() || ''

        for (const event of events) {
          if (event.startsWith('data:')) {
            const data = event.slice(5).trim()
            if (data === '[DONE]') continue
            try {
              const parsed = JSON.parse(data)
              if (parsed.content) {
                assistantContent += parsed.content
                store.updateLastAssistantMessage(assistantContent)
              }
            } catch (e) {
              console.warn('解析失败:', data)
            }
          }
        }
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('请求失败:', error)
        if (
          error.message?.includes('401') ||
          error.message?.includes('Unauthorized')
        ) {
          userStore.logout()
          ElMessage.error('登录已过期，请重新登录')
          router.push('/login')
        } else {
          ElMessage.error('AI 服务出错，请稍后再试')
        }
        store.popLastAssistantMessage()
      } else {
        ElMessage.info('已停止生成')
        store.popLastAssistantMessage()
      }
    } finally {
      loading.value = false
      abortController.value = null
    }
  }

  return {
    loading,
    sendMessage,
    stopGeneration,
  }
}
