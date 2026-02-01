import apiClient from './index';

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  status: string;
  created_at: string;
  updated_at: string;
}

interface UserCreateData {
  username: string;
  email: string;
  password: string;
  role: string;
}

interface UserUpdateData {
  username?: string;
  email?: string;
  password?: string;
  role?: string;
  status?: string;
}

interface UserListResponse {
  items: User[];
  total: number;
  page: number;
  page_size: number;
}

export const userApi = {
  // 获取用户列表
  getUsers: (params?: {
    page?: number;
    page_size?: number;
    search?: string;
    role?: string;
    status?: string;
  }): Promise<UserListResponse> => {
    return apiClient.get('/users', { params });
  },
  
  // 获取用户详情
  getUserDetail: (id: number): Promise<User> => {
    return apiClient.get(`/users/${id}`);
  },
  
  // 创建用户
  createUser: (data: UserCreateData): Promise<User> => {
    return apiClient.post('/users', data);
  },
  
  // 更新用户
  updateUser: (id: number, data: UserUpdateData): Promise<User> => {
    return apiClient.put(`/users/${id}`, data);
  },
  
  // 删除用户
  deleteUser: (id: number): Promise<any> => {
    return apiClient.delete(`/users/${id}`);
  },
  
  // 批量删除用户
  batchDeleteUsers: (ids: number[]): Promise<any> => {
    return apiClient.post('/users/batch-delete', { ids });
  },
  
  // 更新用户状态
  updateUserStatus: (id: number, status: string): Promise<User> => {
    return apiClient.patch(`/users/${id}/status`, { status });
  },
  
  // 重置用户密码
  resetPassword: (id: number, newPassword: string): Promise<any> => {
    return apiClient.post(`/users/${id}/reset-password`, { new_password: newPassword });
  },
};