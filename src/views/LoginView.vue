<script setup>
  import { ref, reactive } from 'vue'
  import { ElMessage } from 'element-plus'
  import { useRouter, useRoute } from 'vue-router'
  import { useUserStore } from '@/stores/user'
  import { useConversationStore } from '@/composables/useConversationStore'
  import { Iphone, Lock } from '@element-plus/icons-vue'

  const router = useRouter()
  const route = useRoute()
  const userStore = useUserStore()
  const convStore = useConversationStore()

  const loginForm = reactive({
    mobile: '',
    password: '',
  })
  const loading = ref(false)

  const mobileRegex = /^1[3-9]\d{9}$/
  const pwdRegex = /^\d{6}$/

  const rules = {
    mobile: [
      { required: true, message: '请输入手机号', trigger: 'blur' },
      {
        pattern: mobileRegex,
        message: '手机号格式不正确（11位，1开头，第二位3-9）',
        trigger: 'blur',
      },
    ],
    password: [
      { required: true, message: '请输入密码', trigger: 'blur' },
      { pattern: pwdRegex, message: '密码必须为6位数字', trigger: 'blur' },
    ],
  }

  const formRef = ref(null)

  const handleLogin = async () => {
    if (!formRef.value) return
    await formRef.value.validate(async (valid) => {
      if (!valid) return
      loading.value = true
      try {
        await userStore.login(loginForm.mobile, loginForm.password)
        convStore.loadUserConversations(loginForm.mobile)
        ElMessage.success('登录成功')
        const redirect = route.query.redirect || '/'
        router.push(redirect)
      } catch (error) {
      } finally {
        loading.value = false
      }
    })
  }
</script>

<template>
  <div class="login-container">
    <div class="login-card">
      <div class="card-glow"></div>
      <div class="login-header">
        <h2>
          <span class="icon">📱</span>
          NEXUS 登录
        </h2>
        <div class="subtitle">手机号登录 · 安全快捷</div>
      </div>

      <el-form
        ref="formRef"
        :model="loginForm"
        :rules="rules"
        class="login-form"
        @submit.prevent="handleLogin"
      >
        <el-form-item prop="mobile">
          <el-input
            v-model="loginForm.mobile"
            placeholder="手机号"
            :prefix-icon="Iphone"
            size="large"
            class="cyber-input"
            clearable
            maxlength="11"
          />
        </el-form-item>

        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            placeholder="6位数字密码"
            :prefix-icon="Lock"
            size="large"
            class="cyber-input"
            show-password
            maxlength="6"
            @keyup.enter="handleLogin"
          />
        </el-form-item>

        <el-button
          :loading="loading"
          type="primary"
          size="large"
          class="login-btn"
          @click="handleLogin"
        >
          {{ loading ? '验证中...' : '登录 / 注册' }}
        </el-button>
      </el-form>
    </div>
  </div>
</template>

<style scoped>
  .login-container {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
    position: relative;
    z-index: 10;
  }

  .login-card {
    width: 420px;
    background: rgba(8, 12, 25, 0.7);
    backdrop-filter: blur(16px);
    border-radius: 2rem;
    border: 1px solid var(--glass-border);
    box-shadow: var(--card-shadow);
    padding: 2rem 2rem 2.5rem;
    position: relative;
    overflow: hidden;
    transition: transform 0.3s ease;
  }

  .login-card:hover {
    transform: translateY(-5px);
  }

  .card-glow {
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(
      circle,
      rgba(0, 212, 255, 0.15),
      transparent 70%
    );
    pointer-events: none;
    animation: rotateGlow 20s linear infinite;
  }

  @keyframes rotateGlow {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  .login-header {
    text-align: center;
    margin-bottom: 2rem;
    position: relative;
    z-index: 2;
  }

  h2 {
    font-size: 1.8rem;
    font-weight: 700;
    background: linear-gradient(135deg, #fff, #00d4ff, #a855f7);
    background-clip: text;
    -webkit-background-clip: text;
    color: transparent;
    display: inline-flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 0.5rem;
  }

  .icon {
    font-size: 2rem;
    filter: drop-shadow(0 0 6px #00d4ff);
  }

  .subtitle {
    font-size: 0.85rem;
    color: #8a9bb5;
    letter-spacing: 1px;
    font-family: monospace;
  }

  .login-form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-bottom: 1.5rem;
    position: relative;
    z-index: 2;
  }

  .cyber-input :deep(.el-input__wrapper) {
    background: rgba(5, 10, 22, 0.7);
    border: 1px solid rgba(0, 212, 255, 0.4);
    border-radius: 1rem;
    box-shadow: none;
    transition: all 0.2s;
  }
  .cyber-input :deep(.el-input__wrapper:hover) {
    border-color: rgba(0, 212, 255, 0.7);
  }
  .cyber-input :deep(.el-input__wrapper.is-focus) {
    border-color: #00d4ff;
    box-shadow: 0 0 12px rgba(0, 212, 255, 0.3);
  }
  .cyber-input :deep(.el-input__inner) {
    color: #eef4ff;
    font-size: 0.95rem;
  }
  .cyber-input :deep(.el-input__prefix) {
    color: #00d4ff;
    margin-right: 8px;
  }

  .login-btn {
    width: 100%;
    background: linear-gradient(95deg, #0b2b44, #1b3b5c);
    border: none;
    border-radius: 60px;
    padding: 12px 0;
    font-weight: 600;
    font-size: 1rem;
    letter-spacing: 1px;
    transition: 0.2s;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    margin-top: 0.5rem;
  }
  .login-btn:hover {
    transform: translateY(-2px);
    background: linear-gradient(95deg, #00a6d4, #2c5f8a);
    box-shadow: 0 8px 24px rgba(0, 212, 255, 0.3);
  }
  .login-btn:active {
    transform: translateY(1px);
  }

  .login-footer {
    text-align: center;
    font-size: 0.85rem;
    color: #8a9bb5;
    position: relative;
    z-index: 2;
  }
  .link {
    color: #00d4ff;
    text-decoration: none;
    margin: 0 4px;
    transition: 0.2s;
    cursor: pointer;
  }
  .link:hover {
    text-shadow: 0 0 6px #00d4ff;
    text-decoration: underline;
  }
  .separator {
    margin: 0 8px;
    color: #3a4a6a;
  }

  @media (max-width: 520px) {
    .login-card {
      width: 90%;
      padding: 1.5rem;
    }
    h2 {
      font-size: 1.5rem;
    }
    .icon {
      font-size: 1.6rem;
    }
  }
</style>
