import apiClient from './index';

interface Customer {
  id: number;
  name: string;
  contact_person: string;
  phone: string;
  email: string;
  address: string;
  company: string;
  status: string;
  created_at: string;
  updated_at: string;
}

interface CustomerCreateData {
  name: string;
  contact_person: string;
  phone: string;
  email: string;
  address: string;
  company: string;
}

interface CustomerUpdateData {
  name?: string;
  contact_person?: string;
  phone?: string;
  email?: string;
  address?: string;
  company?: string;
  status?: string;
}

interface CustomerListResponse {
  items: Customer[];
  total: number;
  page: number;
  page_size: number;
}

export const customerApi = {
  // 获取客户列表
  getCustomers: (params?: {
    page?: number;
    page_size?: number;
    search?: string;
    status?: string;
  }): Promise<CustomerListResponse> => {
    return apiClient.get('/api/v1/customers', { params });
  },
  
  // 获取客户详情
  getCustomerDetail: (id: number): Promise<Customer> => {
    return apiClient.get(`/api/v1/customers/${id}`);
  },
  
  // 创建客户
  createCustomer: (data: CustomerCreateData): Promise<Customer> => {
    return apiClient.post('/api/v1/customers', data);
  },
  
  // 更新客户
  updateCustomer: (id: number, data: CustomerUpdateData): Promise<Customer> => {
    return apiClient.put(`/api/v1/customers/${id}`, data);
  },
  
  // 删除客户
  deleteCustomer: (id: number): Promise<any> => {
    return apiClient.delete(`/api/v1/customers/${id}`);
  },
  
  // 批量删除客户
  batchDeleteCustomers: (ids: number[]): Promise<any> => {
    return apiClient.post('/api/v1/customers/batch-delete', { ids });
  },
  
  // 导出客户数据
  exportCustomers: (params?: {
    status?: string;
    start_date?: string;
    end_date?: string;
  }): Promise<Blob> => {
    return apiClient.get('/api/v1/customers/export', {
      responseType: 'blob',
      params,
    });
  },
};