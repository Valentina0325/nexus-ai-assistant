<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useConversationStore } from '../composables/useConversationStore'
import { useUserStore } from '@/stores/user'
import { ElMessageBox, ElMessage } from 'element-plus'

const store = useConversationStore()
const userStore = useUserStore()

const isSidebarVisible = ref(true)
const isSmallScreen = ref(false)

const BREAKPOINT = 768

const checkScreenSize = () => {
  isSmallScreen.value = window.innerWidth < BREAKPOINT
  if (isSmallScreen.value && isSidebarVisible.value) {
    isSidebarVisible.value = false
  }
}

const toggleSidebar = () => {
  isSidebarVisible.value = !isSidebarVisible.value
}

const closeSidebar = () => {
  if (isSmallScreen.value) {
    isSidebarVisible.value = false
  }
}

const createNewChat = () => {
  store.createNewConversation()
  closeSidebar()
}

const switchToConversation = (id) => {
  store.switchToConversation(id)
  closeSidebar()
}

const formatTime = (timestamp) => {
  if (!timestamp) return ''
  const date = new Date(timestamp)
  const now = new Date()
  const diff = now - date
  if (diff < 60 * 1000) return '刚刚'
  if (diff < 60 * 60 * 1000) return `${Math.floor(diff / 60000)}分钟前`
  if (diff < 24 * 60 * 60 * 1000) return `${Math.floor(diff / 3600000)}小时前`
  return `${date.getMonth() + 1}/${date.getDate()}`
}

const handleLogout = async () => {
  try {
    await ElMessageBox.confirm('确定要退出登录吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
    userStore.logout()
    ElMessage.success('已退出登录')
    store.resetStore()
    closeSidebar()
  } catch {}
}

onMounted(() => {
  checkScreenSize()
  window.addEventListener('resize', checkScreenSize)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkScreenSize)
})
</script>

<template>
  <div 
    v-if="isSmallScreen && isSidebarVisible" 
    class="mobile-overlay" 
    @click="closeSidebar"
  ></div>

  <button 
    class="menu-toggle-btn" 
    @click="toggleSidebar"
    :title="isSidebarVisible ? '关闭侧边栏' : '打开侧边栏'"
  >
    <svg class="menu-icon" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <line x1="3" y1="6" x2="21" y2="6"></line>
      <line x1="3" y1="12" x2="21" y2="12"></line>
      <line x1="3" y1="18" x2="21" y2="18"></line>
    </svg>
  </button>

  <aside
    :class="[
      'conversation-sidebar',
      { 'sidebar-hidden': !isSidebarVisible }
    ]"
  >
    <template v-if="userStore.isLoggedIn()">
      <button class="new-chat-btn" @click="createNewChat">
        <span class="btn-icon">➕</span>
        <span class="btn-text">新建对话</span>
      </button>

      <div class="conv-list">
        <div
          v-for="conv in store.conversations.value"
          :key="conv.id"
          :class="['conv-item', { active: store.activeId.value === conv.id }]"
          @click="switchToConversation(conv.id)"
        >
          <span class="conv-icon">💬</span>
          <div class="conv-info">
            <span class="conv-title">{{ conv.title }}</span>
            <span class="conv-time">{{ formatTime(conv.updatedAt) }}</span>
          </div>
          <button
            class="delete-btn"
            @click.stop="store.deleteConversation(conv.id)"
            title="删除对话"
          >🗑️</button>
        </div>
      </div>

      <div class="sidebar-footer">
        <div class="user-info">
          <span class="user-avatar">📱</span>
          <span class="user-name">
            {{
              userStore.userInfo?.mobile
                ? userStore.userInfo.mobile.slice(0, 3) +
                  '****' +
                  userStore.userInfo.mobile.slice(-4)
                : '用户'
            }}
          </span>
        </div>
        <button class="logout-btn" @click="handleLogout">
          <span class="logout-icon">🚪</span>
          <span class="logout-text">退出登录</span>
        </button>
      </div>
    </template>

    <div v-else class="guest-prompt">
      <span>🔒</span>
      <span>请登录查看对话</span>
      <el-button type="primary" size="small" @click="$router.push('/login')">
        去登录
      </el-button>
    </div>
  </aside>
</template>

<style scoped>
.menu-toggle-btn {
  position: fixed;
  top: 10px;
  left: 16px;
  width: 33px;
  height: 33px;
  background: rgba(0, 212, 255, 0.2);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(0, 212, 255, 0.5);
  border-radius: 12px;
  color: #00d4ff;
  cursor: pointer;
  z-index: 1020;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.menu-toggle-btn:hover {
  background: rgba(0, 212, 255, 0.4);
  transform: scale(1.02);
  box-shadow: 0 0 8px rgba(0, 212, 255, 0.4);
}

.menu-icon {
  stroke: #00d4ff;
  transition: stroke 0.2s;
}

.menu-toggle-btn:hover .menu-icon {
  stroke: #ffffff;
  filter: drop-shadow(0 0 2px #00d4ff);
}

.mobile-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(3px);
  z-index: 1000;
  transition: all 0.3s;
}

.conversation-sidebar {
  width: 260px;
  background: rgba(5, 10, 22, 0.8);
  backdrop-filter: blur(12px);
  border-right: 1px solid rgba(0, 212, 255, 0.2);
  display: flex;
  flex-direction: column;
  padding: 1rem 0;
  flex-shrink: 0;
  overflow-y: auto;
  overflow-x: hidden;
  transition: width 0.3s ease, padding 0.3s ease;
  position: relative;
  z-index: 15;
}

.conversation-sidebar.sidebar-hidden {
  width: 0;
  padding: 0;
  border-right: none;
  overflow: hidden;
}

.new-chat-btn {
  margin: 2rem 1rem 1rem 1rem;
  padding: 0.6rem;
  background: linear-gradient(95deg, #0b2b44, #1b3b5c);
  border: none;
  border-radius: 40px;
  color: white;
  font-weight: bold;
  cursor: pointer;
  transition: 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  white-space: nowrap;
}

.new-chat-btn:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

.conv-list {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0 0.8rem;
  overflow-y: auto;
}

.conv-item {
  background: rgba(0, 212, 255, 0.05);
  border: 1px solid rgba(0, 212, 255, 0.2);
  border-radius: 12px;
  padding: 0.6rem 0.8rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: 0.2s;
}

.conv-item.active {
  background: rgba(0, 212, 255, 0.25);
  border-color: #00d4ff;
  box-shadow: 0 0 8px rgba(0, 212, 255, 0.4);
}

.conv-item:hover {
  background: rgba(0, 212, 255, 0.15);
  transform: translateX(2px);
}

.conv-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
  overflow: hidden;
}

.conv-title {
  font-size: 0.85rem;
  font-weight: 500;
  color: #eef4ff;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.conv-time {
  font-size: 0.7rem;
  color: #8a9bb5;
}

.delete-btn {
  background: none;
  border: none;
  font-size: 1rem;
  cursor: pointer;
  opacity: 0.6;
  transition: 0.2s;
  color: #ff6b6b;
}

.delete-btn:hover {
  opacity: 1;
  transform: scale(1.1);
}

.sidebar-footer {
  margin-top: auto;
  padding: 1rem;
  border-top: 1px solid rgba(0, 212, 255, 0.2);
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0.4rem;
  border-radius: 8px;
  background: rgba(0, 212, 255, 0.05);
}

.user-avatar {
  font-size: 1.2rem;
}

.user-name {
  font-size: 0.85rem;
  color: #eef4ff;
  font-weight: 500;
}

.logout-btn {
  background: rgba(255, 70, 70, 0.2);
  border: 1px solid rgba(255, 70, 70, 0.4);
  border-radius: 40px;
  padding: 0.5rem;
  color: #ff7b7b;
  cursor: pointer;
  transition: 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-size: 0.85rem;
}

.logout-btn:hover {
  background: rgba(255, 70, 70, 0.4);
  transform: translateY(-1px);
}

.guest-prompt {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  color: #8a9bb5;
  padding: 1rem;
  text-align: center;
}

@media (max-width: 768px) {
  .conversation-sidebar {
    position: fixed;
    left: 0;
    top: 0;
    height: 100vh;
    z-index: 1010;
    box-shadow: 4px 0 20px rgba(0, 0, 0, 0.3);
    transition: left 0.3s ease;
  }
  
  .conversation-sidebar.sidebar-hidden {
    left: -260px;
    width: 260px;
    padding: 1rem 0;
    border-right: 1px solid rgba(0, 212, 255, 0.2);
  }
}

@media (min-width: 769px) {
  .conversation-sidebar.sidebar-hidden {
    width: 0;
    left: auto;
    padding: 0;
    border-right: none;
  }
}
</style>