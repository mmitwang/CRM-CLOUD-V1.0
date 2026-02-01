import { defineStore } from 'pinia'
import request from '../utils/request'

export const useUserStore = defineStore('user', {
  state: () => ({
    // 用户信息
    user: null,
    // 登录状态
    isLoggedIn: false,
    // 加载状态
    loading: false,
    // 错误信息
    error: null
  }),
  
  getters: {
    // 获取用户名
    username: (state) => state.user?.username || '',
    // 获取用户角色
    role: (state) => state.user?.role || '',
    // 获取用户ID
    userId: (state) => state.user?.id || ''
  },
  
  actions: {
    // 登录
    async login(credentials) {
      this.loading = true
      this.error = null
      
      try {
        // 创建表单数据
        const formData = new URLSearchParams()
        formData.append('username', credentials.username)
        formData.append('password', credentials.password)
        
        const response = await request.post('/api/v1/auth/login', formData, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        })
        
        // 保存token到本地存储
        uni.setStorageSync('token', response.access_token)
        
        // 解析用户名获取邮箱和公司信息
        const parts = credentials.username.split('@')
        const email = parts.slice(0, -1).join('@')
        const companyCode = parts[parts.length - 1]
        
        // 构建用户信息
        this.user = {
          email: email,
          companyCode: companyCode,
          name: email.split('@')[0]
        }
        
        // 保存用户信息到本地存储
        uni.setStorageSync('user', this.user)
        
        this.isLoggedIn = true
        
        return response
      } catch (error) {
        this.error = error.response?.data?.detail || error.message || '登录失败'
        throw error
      } finally {
        this.loading = false
      }
    },
    
    // 登出
    async logout() {
      try {
        // 调用后端登出接口
        await request.post('/api/v1/auth/logout')
      } catch (error) {
        console.error('登出失败:', error)
      } finally {
        // 清除本地存储
        uni.removeStorageSync('token')
        uni.removeStorageSync('user')
        
        // 重置状态
        this.user = null
        this.isLoggedIn = false
        this.error = null
        
        // 跳转到登录页
        uni.reLaunch({
          url: '/pages/login/login'
        })
      }
    },
    
    // 初始化用户信息
    async initUserInfo() {
      const token = uni.getStorageSync('token')
      const storedUser = uni.getStorageSync('user')
      
      if (token) {
        this.isLoggedIn = true
        if (storedUser) {
          this.user = storedUser
        } else {
          // 从后端获取用户信息
          await this.getUserInfo()
        }
      }
    },
    
    // 获取用户信息
    async getUserInfo() {
      this.loading = true
      
      try {
        const response = await request.get('/api/v1/auth/me')
        this.user = response
        
        // 保存到本地存储
        uni.setStorageSync('user', response)
        
        return response
      } catch (error) {
        this.error = error.message || '获取用户信息失败'
        
        // 如果获取失败，清除登录状态
        if (error.response?.status === 401) {
          this.logout()
        }
        
        throw error
      } finally {
        this.loading = false
      }
    },
    
    // 更新用户信息
    async updateUserInfo(data) {
      this.loading = true
      
      try {
        const response = await request.put('/api/v1/auth/profile', data)
        this.user = response
        
        // 更新本地存储
        uni.setStorageSync('user', response)
        
        return response
      } catch (error) {
        this.error = error.message || '更新用户信息失败'
        throw error
      } finally {
        this.loading = false
      }
    },
    
    // 修改密码
    async changePassword(data) {
      this.loading = true
      
      try {
        const response = await request.post('/api/v1/auth/change-password', data)
        return response
      } catch (error) {
        this.error = error.message || '修改密码失败'
        throw error
      } finally {
        this.loading = false
      }
    }
  }
})
