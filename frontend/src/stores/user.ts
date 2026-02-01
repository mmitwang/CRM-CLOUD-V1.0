import { defineStore } from 'pinia';
import { authApi } from '../api/auth';
import { ElMessage } from 'element-plus';

interface UserState {
  user: {
    id: number;
    username: string;
    email: string;
    role: string;
  } | null;
  token: string | null;
  isLoggedIn: boolean;
  isLoading: boolean;
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    user: null,
    token: localStorage.getItem('token'),
    isLoggedIn: localStorage.getItem('token') !== null,
    isLoading: false,
  }),
  
  getters: {
    isAdmin: (state) => state.user?.role === 'admin',
    isUser: (state) => state.user?.role === 'user',
  },
  
  actions: {
    // 登录
    async login(username: string, password: string) {
      this.isLoading = true;
      try {
        const response = await authApi.login({ username, password });
        this.token = response.access_token;
        this.user = response.user;
        this.isLoggedIn = true;
        
        // 保存到localStorage
        localStorage.setItem('token', response.access_token);
        localStorage.setItem('user', JSON.stringify(response.user));
        
        ElMessage.success('登录成功');
        return true;
      } catch (error) {
        ElMessage.error('登录失败，请检查用户名和密码');
        return false;
      } finally {
        this.isLoading = false;
      }
    },
    
    // 登出
    async logout() {
      try {
        await authApi.logout();
      } catch (error) {
        console.error('登出失败:', error);
      } finally {
        // 清除状态
        this.token = null;
        this.user = null;
        this.isLoggedIn = false;
        
        // 清除localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        ElMessage.success('登出成功');
      }
    },
    
    // 初始化用户信息
    async initUserInfo() {
      if (this.token) {
        try {
          const user = await authApi.getCurrentUser();
          this.user = user;
          this.isLoggedIn = true;
          localStorage.setItem('user', JSON.stringify(user));
        } catch (error) {
          // token无效，清除状态
          this.logout();
        }
      }
    },
    
    // 刷新token
    async refreshToken() {
      if (this.token) {
        try {
          const response = await authApi.refreshToken();
          this.token = response.access_token;
          localStorage.setItem('token', response.access_token);
          return true;
        } catch (error) {
          // token刷新失败，清除状态
          this.logout();
          return false;
        }
      }
      return false;
    },
  },
});