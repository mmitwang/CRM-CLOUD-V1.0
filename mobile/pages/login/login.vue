<template>
  <view class="login-page">
    <div class="login-container">
      <!--  logo和标题  -->
      <div class="login-header">
        <div class="logo">
          <uni-icons type="electrical" size="64" color="#1890ff"></uni-icons>
        </div>
        <h1 class="title">智能电气CRM</h1>
        <p class="subtitle">专业的电气设备管理系统</p>
      </div>
      
      <!--  登录表单  -->
      <div class="login-form">
        <!-- 预设测试账户选择 -->
        <div class="form-item">
          <uni-select
            v-model="selectedTestAccount"
            placeholder="选择测试账户（可选）"
            @change="selectTestAccount"
            class="test-account-select"
          >
            <uni-select-option value="" :disabled="true">请选择测试账户</uni-select-option>
            <uni-select-option value="admin@default.com@DEFAULT">默认公司 - 管理员</uni-select-option>
            <uni-select-option value="user@default.com@DEFAULT">默认公司 - 普通用户</uni-select-option>
            <uni-select-option value="admin@test1.com@TEST1">测试公司1 - 管理员</uni-select-option>
            <uni-select-option value="user@test1.com@TEST1">测试公司1 - 普通用户</uni-select-option>
            <uni-select-option value="admin@test2.com@TEST2">测试公司2 - 管理员</uni-select-option>
            <uni-select-option value="user@test2.com@TEST2">测试公司2 - 普通用户</uni-select-option>
          </uni-select>
        </div>
        
        <div class="form-item">
          <uni-input
            v-model="form.username"
            placeholder="请输入登录账号（格式：email@company_code）"
            :disabled="loading"
            class="input"
          >
            <template #prefix>
              <uni-icons type="person" size="20" color="#999"></uni-icons>
            </template>
          </uni-input>
        </div>
        
        <div class="form-item">
          <uni-input
            v-model="form.password"
            type="password"
            placeholder="请输入密码"
            :disabled="loading"
            class="input"
            :password-visible="showPassword"
            @click-icon="showPassword = !showPassword"
          >
            <template #prefix>
              <uni-icons type="lock-filled" size="20" color="#999"></uni-icons>
            </template>
          </uni-input>
        </div>
        
        <div class="form-item remember">
          <uni-checkbox v-model="rememberMe" :disabled="loading">
            记住我
          </uni-checkbox>
          <text class="forgot-password">忘记密码？</text>
        </div>
        
        <uni-button
          type="primary"
          :loading="loading"
          :disabled="loading"
          @click="handleLogin"
          class="login-button"
        >
          {{ loading ? '登录中...' : '登录' }}
        </uni-button>
        
        <!--  错误提示  -->
        <div v-if="error" class="error-message">
          {{ error }}
        </div>
      </div>
      
      <!--  其他登录方式  -->
      <div class="other-login">
        <text class="divider">其他登录方式</text>
        <div class="login-methods">
          <uni-icons type="wechat" size="32" color="#07C160" class="method-icon"></uni-icons>
          <uni-icons type="qq" size="32" color="#12B7F5" class="method-icon"></uni-icons>
          <uni-icons type="sina-weibo" size="32" color="#E6162D" class="method-icon"></uni-icons>
        </div>
      </div>
    </div>
  </view>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useUserStore } from '../../stores/user'
import { useRouter } from 'vue-router'

const userStore = useUserStore()
const router = useRouter()

// 表单数据
const form = reactive({
  username: 'test@default.com@DEFAULT',
  password: '123456'
})

// 状态
const loading = ref(false)
const error = ref('')
const showPassword = ref(false)
const rememberMe = ref(false)
const selectedTestAccount = ref('')

// 测试账户信息
const testAccounts = {
  'admin@default.com@DEFAULT': { username: 'admin@default.com@DEFAULT', password: '123456' },
  'user@default.com@DEFAULT': { username: 'user@default.com@DEFAULT', password: '123456' },
  'admin@test1.com@TEST1': { username: 'admin@test1.com@TEST1', password: '123456' },
  'user@test1.com@TEST1': { username: 'user@test1.com@TEST1', password: '123456' },
  'admin@test2.com@TEST2': { username: 'admin@test2.com@TEST2', password: '123456' },
  'user@test2.com@TEST2': { username: 'user@test2.com@TEST2', password: '123456' }
}

// 选择测试账户
const selectTestAccount = (value) => {
  if (value && testAccounts[value]) {
    const account = testAccounts[value]
    form.username = account.username
    form.password = account.password
  }
}

// 处理登录
const handleLogin = async () => {
  // 表单验证
  if (!form.username) {
    error.value = '请输入登录账号'
    return
  }
  
  if (!/^.+@.+@.+$/.test(form.username)) {
    error.value = '请输入正确的登录格式：email@company_code'
    return
  }
  
  if (!form.password) {
    error.value = '请输入密码'
    return
  }
  
  error.value = ''
  loading.value = true
  
  try {
    await userStore.login({
      username: form.username,
      password: form.password
    })
    
    // 记住用户名
    if (rememberMe.value) {
      uni.setStorageSync('username', form.username)
    } else {
      uni.removeStorageSync('username')
    }
    
    // 登录成功，跳转到首页
    uni.switchTab({
      url: '/pages/index/index'
    })
  } catch (err) {
    error.value = err.message || '登录失败，请检查账号和密码'
  } finally {
    loading.value = false
  }
}

// 初始化
onMounted(() => {
  // 检查是否已经登录
  const token = uni.getStorageSync('token')
  if (token) {
    // 跳转到首页
    uni.switchTab({
      url: '/pages/index/index'
    })
  }
  
  // 从本地存储获取记住的用户名
  const savedUsername = uni.getStorageSync('username')
  if (savedUsername) {
    form.username = savedUsername
    rememberMe.value = true
  }
})
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #1890ff 0%, #096dd9 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px 20px;
}

.login-container {
  width: 100%;
  max-width: 400px;
  background-color: #fff;
  border-radius: 12px;
  padding: 40px 30px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.login-header {
  text-align: center;
  margin-bottom: 40px;
}

.logo {
  margin-bottom: 20px;
}

.title {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
}

.subtitle {
  font-size: 14px;
  color: #666;
}

.login-form {
  margin-bottom: 30px;
}

.form-item {
  margin-bottom: 20px;
}

.input {
  border-radius: 8px;
  background-color: #f5f7fa;
  border: 1px solid #e8e8e8;
}

.remember {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.forgot-password {
  font-size: 14px;
  color: #1890ff;
}

.login-button {
  width: 100%;
  height: 48px;
  font-size: 16px;
  font-weight: 500;
  border-radius: 8px;
}

.test-account-select {
  width: 100%;
  border-radius: 8px;
  background-color: #f5f7fa;
  border: 1px solid #e8e8e8;
}

.error-message {
  margin-top: 16px;
  padding: 12px;
  background-color: #fff1f0;
  border: 1px solid #ffccc7;
  border-radius: 4px;
  color: #ff4d4f;
  font-size: 14px;
  text-align: center;
}

.other-login {
  text-align: center;
}

.divider {
  display: block;
  font-size: 14px;
  color: #999;
  margin-bottom: 20px;
  position: relative;
}

.divider::before,
.divider::after {
  content: '';
  position: absolute;
  top: 50%;
  width: 80px;
  height: 1px;
  background-color: #e8e8e8;
}

.divider::before {
  left: 0;
}

.divider::after {
  right: 0;
}

.login-methods {
  display: flex;
  justify-content: center;
  gap: 40px;
}

.method-icon {
  cursor: pointer;
  transition: transform 0.3s;
}

.method-icon:active {
  transform: scale(0.9);
}

/* 响应式设计 */
@media screen and (max-width: 375px) {
  .login-container {
    padding: 30px 20px;
  }
  
  .title {
    font-size: 22px;
  }
  
  .login-button {
    height: 44px;
    font-size: 15px;
  }
  
  .login-methods {
    gap: 30px;
  }
}
</style>
