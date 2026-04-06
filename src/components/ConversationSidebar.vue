<script setup>
  import { ref } from 'vue'
  import { useConversationStore } from '../composables/useConversationStore'
  import { useUserStore } from '@/stores/user'
  import { ElMessageBox, ElMessage } from 'element-plus'

  const store = useConversationStore()
  const userStore = useUserStore()

  const isCollapsed = ref(false) // 侧边栏折叠状态

  const toggleCollapse = () => {
    isCollapsed.value = !isCollapsed.value
  }

  const createNewChat = () => {
    store.createNewConversation()
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
    } catch {}
  }
</script>

<template>
  <aside :class="['conversation-sidebar', { collapsed: isCollapsed }]">
    <button
      class="toggle-btn"
      @click="toggleCollapse"
      :title="isCollapsed ? '展开侧边栏' : '收起侧边栏'"
    >
      {{ isCollapsed ? '➡️' : '⬅️' }}
    </button>

    <template v-if="userStore.isLoggedIn()">
      <button
        class="new-chat-btn"
        @click="createNewChat"
        :title="isCollapsed ? '新建对话' : ''"
      >
        <span class="btn-icon">➕</span>
        <span v-if="!isCollapsed" class="btn-text">新建对话</span>
      </button>

      <div class="conv-list">
        <div
          v-for="conv in store.conversations.value"
          :key="conv.id"
          :class="['conv-item', { active: store.activeId.value === conv.id }]"
          @click="store.switchToConversation(conv.id)"
          :title="isCollapsed ? conv.title : ''"
        >
          <span class="conv-icon">💬</span>
          <div v-if="!isCollapsed" class="conv-info">
            <span class="conv-title">{{ conv.title }}</span>
            <span class="conv-time">{{ formatTime(conv.updatedAt) }}</span>
          </div>
          <button
            class="delete-btn"
            @click.stop="store.deleteConversation(conv.id)"
            title="删除对话"
          >
            🗑️
          </button>
        </div>
      </div>

      <div class="sidebar-footer">
        <div
          class="user-info"
          :title="isCollapsed ? userStore.userInfo?.mobile : ''"
        >
          <span class="user-avatar">📱</span>
          <span v-if="!isCollapsed" class="user-name">
            {{
              userStore.userInfo?.mobile
                ? userStore.userInfo.mobile.slice(0, 3) +
                  '****' +
                  userStore.userInfo.mobile.slice(-4)
                : '用户'
            }}
          </span>
        </div>
        <button
          class="logout-btn"
          @click="handleLogout"
          :title="isCollapsed ? '退出登录' : ''"
        >
          <span class="logout-icon">🚪</span>
          <span v-if="!isCollapsed" class="logout-text">退出登录</span>
        </button>
      </div>
    </template>

    <div v-else class="guest-prompt">
      <span>🔒</span>
      <span v-if="!isCollapsed">请登录查看对话</span>
      <el-button
        type="primary"
        size="small"
        @click="$router.push('/login')"
        :title="isCollapsed ? '去登录' : ''"
      >
        <span v-if="isCollapsed">🔑</span>
        <span v-else>去登录</span>
      </el-button>
    </div>
  </aside>
</template>

<style scoped>
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
    transition: width 0.3s ease;
    position: relative;
  }

  .conversation-sidebar.collapsed {
    width: 70px;
  }

  /* 折叠按钮样式 */
  .toggle-btn {
    position: absolute;
    top: 12px;
    right: 5px;
    width: 28px;
    height: 28px;
    background: #0b2b44;
    border: 1px solid rgba(0, 212, 255, 0.5);
    border-radius: 50%;
    color: #00d4ff;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    z-index: 10;
    transition: all 0.2s;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  }
  .toggle-btn:hover {
    background: #00a6d4;
    color: white;
    transform: scale(1.05);
  }

  /* 新建对话按钮 */
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
  }
  .new-chat-btn:hover {
    background: linear-gradient(95deg, #00a6d4, #2c5f8a);
    transform: translateY(-2px);
  }
  .collapsed .new-chat-btn {
    margin: 2rem 0.5rem 1rem 0.5rem;
    padding: 0.6rem 0;
  }
  .btn-icon {
    font-size: 1.1rem;
  }
  .btn-text {
    font-size: 0.9rem;
  }

  /* 对话列表 */
  .conv-list {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    padding: 0 0.8rem;
    overflow-y: auto;
  }
  .collapsed .conv-list {
    padding: 0 0.5rem;
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
    position: relative;
  }
  .conv-item:hover {
    background: rgba(0, 212, 255, 0.15);
    border-color: #00d4ff;
  }
  .conv-item.active {
    background: rgba(0, 212, 255, 0.25);
    border-color: #00d4ff;
    box-shadow: 0 0 8px rgba(0, 212, 255, 0.4);
  }
  .conv-icon {
    font-size: 1.1rem;
    flex-shrink: 0;
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
    font-size: 0.65rem;
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
    flex-shrink: 0;
  }
  .delete-btn:hover {
    opacity: 1;
    transform: scale(1.1);
  }
  .collapsed .conv-item {
    justify-content: center;
    padding: 0.6rem;
  }
  .collapsed .delete-btn {
    display: none; /* 折叠时隐藏删除按钮，避免拥挤，鼠标悬停时可通过其他方式删除？可保留但影响体验，简单起见隐藏 */
  }
  /* 折叠时，鼠标悬停在 conv-item 上显示完整标题（已通过 title 属性实现） */

  /* 底部用户区域 */
  .sidebar-footer {
    margin-top: auto;
    padding: 1rem;
    border-top: 1px solid rgba(0, 212, 255, 0.2);
    display: flex;
    flex-direction: column;
    gap: 0.8rem;
  }
  .collapsed .sidebar-footer {
    padding: 1rem 0.5rem;
    align-items: center;
  }

  .user-info {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 0.4rem 0;
  }
  .user-avatar {
    font-size: 1.2rem;
    width: 32px;
    height: 32px;
    background: rgba(0, 212, 255, 0.2);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  .user-name {
    font-size: 0.85rem;
    color: #eef4ff;
    font-weight: 500;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .logout-btn {
    background: rgba(255, 70, 70, 0.2);
    border: 1px solid rgba(255, 70, 70, 0.4);
    border-radius: 40px;
    padding: 0.4rem;
    color: #ff7b7b;
    cursor: pointer;
    transition: 0.2s;
    font-size: 0.8rem;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
  }
  .logout-btn:hover {
    background: rgba(255, 70, 70, 0.4);
    border-color: #ff4646;
    color: #ffa5a5;
  }
  .collapsed .logout-btn {
    padding: 0.4rem;
    width: 36px;
  }
  .logout-icon {
    font-size: 1rem;
  }
  .logout-text {
    font-size: 0.8rem;
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
  .collapsed .guest-prompt {
    padding: 0.5rem;
  }
</style>
