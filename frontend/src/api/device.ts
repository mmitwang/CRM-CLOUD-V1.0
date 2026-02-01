import apiClient from './index';

interface Device {
  id: number;
  device_id: string;
  name: string;
  type: string;
  status: string;
  customer_id: number;
  customer_name: string;
  location: string;
  installed_at: string;
  last_active: string;
  created_at: string;
  updated_at: string;
}

interface DeviceCreateData {
  device_id: string;
  name: string;
  model: string;
  serial_number: string;
  location: string;
  status: string;
  customer_id: number;
  type: string;
}

interface DeviceUpdateData {
  name?: string;
  type?: string;
  customer_id?: number;
  location?: string;
  status?: string;
}

interface DeviceListResponse {
  items: Device[];
  total: number;
  page: number;
  page_size: number;
}

interface DeviceStatus {
  device_id: string;
  status: string;
  last_active: string;
  metrics: {
    voltage?: number;
    current?: number;
    power?: number;
    temperature?: number;
  };
}

export const deviceApi = {
  // 获取设备列表
  getDevices: (params?: {
    page?: number;
    page_size?: number;
    search?: string;
    status?: string;
    type?: string;
    customer_id?: number;
  }): Promise<DeviceListResponse> => {
    // 转换参数格式，将page和page_size转换为skip和limit
    const transformedParams = {
      ...params,
      skip: params?.page ? (params.page - 1) * (params.page_size || 10) : 0,
      limit: params?.page_size || 10
    };
    // 删除不需要的参数
    delete transformedParams.page;
    delete transformedParams.page_size;
    
    return apiClient.get('/api/v1/devices', { params: transformedParams });
  },
  
  // 获取设备详情
  getDeviceDetail: (id: number): Promise<Device> => {
    return apiClient.get(`/api/v1/devices/${id}`);
  },
  
  // 获取设备状态
  getDeviceStatus: (device_id: string): Promise<DeviceStatus> => {
    return apiClient.get(`/api/v1/devices/${device_id}/status`);
  },
  
  // 创建设备
  createDevice: (data: DeviceCreateData): Promise<Device> => {
    return apiClient.post('/api/v1/devices', data);
  },
  
  // 更新设备
  updateDevice: (id: number, data: DeviceUpdateData): Promise<Device> => {
    return apiClient.put(`/api/v1/devices/${id}`, data);
  },
  
  // 删除设备
  deleteDevice: (id: number): Promise<any> => {
    return apiClient.delete(`/api/v1/devices/${id}`);
  },
  
  // 批量删除设备
  batchDeleteDevices: (ids: number[]): Promise<any> => {
    return apiClient.post('/api/v1/devices/batch-delete', { ids });
  },
  
  // 导出设备数据
  exportDevices: (params?: {
    status?: string;
    type?: string;
    start_date?: string;
    end_date?: string;
  }): Promise<Blob> => {
    return apiClient.get('/api/v1/devices/export', {
      responseType: 'blob',
      params,
    });
  },
  
  // 获取设备统计数据
  getDeviceStats: (params?: {
    start_date?: string;
    end_date?: string;
  }): Promise<any> => {
    return apiClient.get('/api/v1/devices/stats', { params });
  },
};