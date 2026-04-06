import { defineStore } from 'pinia'
import { ref } from 'vue'
import router from '@/router'
import { ElMessage } from 'element-plus'
import request from '@/utils/request'

export const useUserStore = defineStore(
  'user',
  () => {
    const token = ref('')
    const userInfo = ref(null)

    const mobileRegex = /^1[3-9]\d{9}$/
    const pwdRegex = /^\d{6}$/

    const login = async (mobile, password) => {
      if (!mobileRegex.test(mobile)) {
        throw new Error('手机号格式不正确（11位，1开头，第二位3-9）')
      }
      if (!pwdRegex.test(password)) {
        throw new Error('密码必须为6位数字')
      }

      try {
        const res = await request.post('/api/login', { mobile, password })
        if (res.data.code === 0) {
          token.value = res.data.data.token
          userInfo.value = res.data.data.userInfo
          ElMessage.success(
            `欢迎回来，${mobile.slice(0, 3)}****${mobile.slice(-4)}`
          )
          return true
        } else {
          throw new Error(res.data.message || '登录失败')
        }
      } catch (error) {
        throw error
      }
    }

    const logout = () => {
      token.value = ''
      userInfo.value = null
      router.push('/login')
    }

    const isLoggedIn = () => {
      return !!token.value
    }

    return { token, userInfo, login, logout, isLoggedIn }
  },
  {
    persist: true,
  }
)
