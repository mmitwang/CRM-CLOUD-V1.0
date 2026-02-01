<template>
  <div class="login-container">
    <div class="login-form-wrapper">
      <div class="login-header">
        <h2 class="login-title">智析客户管理系统V1.0</h2>
        <p class="login-subtitle">请登录您的账户</p>
      </div>
      
      <el-form :model="loginForm" :rules="loginRules" ref="loginFormRef" label-width="0px">
        <!-- 预设测试账户选择 -->
        <el-form-item>
          <div class="test-account-container">
            <el-select 
              v-model="selectedTestAccount" 
              placeholder="选择测试账户（可选）" 
              @change="selectTestAccount" 
              size="large"
              class="test-account-select"
              style="width: 100%;"
            >
              <el-option label="请选择测试账户" value="" />
              <el-option label="默认公司 - 管理员" value="admin@default.com@DEFAULT" />
              <el-option label="默认公司 - 普通用户" value="user@default.com@DEFAULT" />
              <el-option label="测试公司1 - 管理员" value="admin@test1.com@TEST1" />
              <el-option label="测试公司1 - 普通用户" value="user@test1.com@TEST1" />
              <el-option label="测试公司2 - 管理员" value="admin@test2.com@TEST2" />
              <el-option label="测试公司2 - 普通用户" value="user@test2.com@TEST2" />
            </el-select>
          </div>
        </el-form-item>
        
        <el-form-item prop="username">
          <el-input 
            v-model="loginForm.username" 
            type="text" 
            placeholder="请输入登录账号（格式：email@company_code）" 
            prefix-icon="el-icon-message"
            size="large"
          />
        </el-form-item>
        
        <el-form-item prop="password">
          <el-input 
            v-model="loginForm.password" 
            type="password" 
            placeholder="请输入密码" 
            prefix-icon="el-icon-lock"
            show-password
            size="large"
          />
        </el-form-item>
        
        <el-form-item>
          <el-checkbox v-model="loginForm.remember">记住我</el-checkbox>
          <el-link type="primary" :underline="false" class="forgot-password">忘记密码？</el-link>
        </el-form-item>
        
        <el-form-item>
          <el-button 
            type="primary" 
            :loading="loading" 
            @click="handleLogin" 
            size="large" 
            class="login-button"
          >
            登录
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { authApi } from '../../api/auth'

const router = useRouter()
const loginFormRef = ref()
const loading = ref(false)
const selectedTestAccount = ref('')

const loginForm = reactive({
  username: 'test@default.com@DEFAULT',
  password: '123456',
  remember: false
})

const loginRules = {
  username: [
    { required: true, message: '请输入登录账号', trigger: 'blur' },
    { pattern: /^.+@.+@.+$/, message: '请输入正确的登录格式：email@company_code', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度至少为6位', trigger: 'blur' }
  ]
}

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
const selectTestAccount = (value: string) => {
  console.log('选择测试账户:', value)
  if (value && testAccounts[value]) {
    const account = testAccounts[value]
    console.log('测试账户信息:', account)
    loginForm.username = account.username
    loginForm.password = account.password
    console.log('更新后的登录表单:', loginForm)
  }
}

const handleLogin = async () => {
  console.log('开始登录:', loginForm)
  if (!loginFormRef.value) return
  
  try {
    await loginFormRef.value.validate()
    console.log('表单验证成功')
    loading.value = true
    
    // 调用后端登录API
    console.log('调用登录API:', {
      username: loginForm.username,
      password: loginForm.password
    })
    const response = await authApi.login({
      username: loginForm.username,
      password: loginForm.password
    })
    console.log('登录API响应:', response)
    
    // 存储token
    localStorage.setItem('token', response.access_token)
    
    // 调用 /api/v1/auth/me 获取用户信息
    console.log('调用获取用户信息API')
    const userInfoResponse = await authApi.getCurrentUser()
    console.log('用户信息响应:', userInfoResponse)
    
    // 解析用户名获取公司信息
    const parts = loginForm.username.split('@')
    const companyCode = parts[parts.length - 1]
    
    // 存储用户信息，包括角色
    localStorage.setItem('user', JSON.stringify({
      email: userInfoResponse.email,
      companyCode: companyCode,
      name: userInfoResponse.name,
      role: userInfoResponse.role
    }))
    
    // 存储用户名为单独的项，方便Layout组件使用
    localStorage.setItem('userName', userInfoResponse.name)
    
    ElMessage.success('登录成功')
    router.push('/dashboard')
  } catch (error: any) {
    console.error('登录失败:', error)
    console.error('错误响应:', error.response)
    ElMessage.error(error.response?.data?.detail || '登录失败，请检查账号和密码')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.login-form-wrapper {
  width: 400px;
  padding: 40px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.login-header {
  text-align: center;
  margin-bottom: 32px;
}

.login-title {
  font-size: 24px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 8px;
}

.login-subtitle {
  font-size: 14px;
  color: #606266;
}

.forgot-password {
  float: right;
}

.login-button {
  width: 100%;
  margin-top: 16px;
}

.test-account-container {
  width: 100%;
  margin-bottom: 16px;
}

.test-account-select {
  width: 100%;
  z-index: 1000;
}

@media (max-width: 480px) {
  .login-form-wrapper {
    width: 90%;
    padding: 30px 20px;
  }
}
</style>
