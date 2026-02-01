import apiClient from './index';

interface LoginData {
  username: string;
  password: string;
}

interface LoginResponse {
  access_token: string;
  token_type: string;
}

interface RegisterData {
  username: string;
  email: string;
  password: string;
}

export const authApi = {
  // 登录
  login: (data: LoginData): Promise<LoginResponse> => {
    // 创建URLSearchParams对象来发送表单数据
    const formData = new URLSearchParams();
    formData.append('username', data.username);
    formData.append('password', data.password);
    
    return apiClient.post('/api/v1/auth/login', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
  },
  
  // 注册
  register: (data: RegisterData): Promise<any> => {
    return apiClient.post('/api/v1/auth/register', data);
  },
  
  // 刷新token
  refreshToken: (): Promise<any> => {
    return apiClient.post('/api/v1/auth/refresh');
  },
  
  // 登出
  logout: (): Promise<any> => {
    return apiClient.post('/api/v1/auth/logout');
  },
  
  // 获取当前用户信息
  getCurrentUser: (): Promise<any> => {
    return apiClient.get('/api/v1/auth/me');
  },
};