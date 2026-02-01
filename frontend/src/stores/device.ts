import { defineStore } from 'pinia';
import { deviceApi } from '../api/device';
import { ElMessage } from 'element-plus';

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

interface DeviceState {
  devices: Device[];
  total: number;
  page: number;
  pageSize: number;
  loading: boolean;
  currentDevice: Device | null;
  deviceStatuses: Map<string, DeviceStatus>;
}

export const useDeviceStore = defineStore('device', {
  state: (): DeviceState => ({
    devices: [],
    total: 0,
    page: 1,
    pageSize: 10,
    loading: false,
    currentDevice: null,
    deviceStatuses: new Map(),
  }),
  
  getters: {
    onlineDevices: (state) => state.devices.filter(device => device.status === 'online'),
    offlineDevices: (state) => state.devices.filter(device => device.status === 'offline'),
    warningDevices: (state) => state.devices.filter(device => device.status === 'warning'),
    deviceStatus: (state) => (deviceId: string) => state.deviceStatuses.get(deviceId),
  },
  
  actions: {
    // 获取设备列表
    async getDevices(params?: {
      page?: number;
      page_size?: number;
      search?: string;
      status?: string;
      type?: string;
      customer_id?: number;
    }) {
      this.loading = true;
      try {
        const response = await deviceApi.getDevices({
          page: params?.page || this.page,
          page_size: params?.page_size || this.pageSize,
          search: params?.search,
          status: params?.status,
          type: params?.type,
          customer_id: params?.customer_id,
        });
        
        // 处理后端返回的数据格式
        if (Array.isArray(response)) {
          // 后端返回的是设备数组
          this.devices = response;
          this.total = response.length;
          this.page = params?.page || 1;
          this.pageSize = params?.page_size || this.pageSize;
        } else if (response.items) {
          // 后端返回的是包含items属性的对象
          this.devices = response.items;
          this.total = response.total;
          this.page = response.page;
          this.pageSize = response.page_size;
        }
        
        return response;
      } catch (error) {
        ElMessage.error('获取设备列表失败');
        return null;
      } finally {
        this.loading = false;
      }
    },
    
    // 获取设备详情
    async getDeviceDetail(id: number) {
      this.loading = true;
      try {
        const device = await deviceApi.getDeviceDetail(id);
        this.currentDevice = device;
        return device;
      } catch (error) {
        ElMessage.error('获取设备详情失败');
        return null;
      } finally {
        this.loading = false;
      }
    },
    
    // 获取设备状态
    async getDeviceStatus(deviceId: string) {
      try {
        const status = await deviceApi.getDeviceStatus(deviceId);
        this.deviceStatuses.set(deviceId, status);
        return status;
      } catch (error) {
        console.error('获取设备状态失败:', error);
        return null;
      }
    },
    
    // 创建设备
    async createDevice(data: any) {
      this.loading = true;
      try {
        // 转换数据结构以匹配后端API要求
        const deviceData = {
          device_id: data.device_id,
          name: data.name,
          model: data.model || `MODEL${Math.floor(Math.random() * 1000)}`,
          serial_number: data.serial_number || `SN${Date.now()}`,
          location: data.location,
          status: data.status || 'offline',
          customer_id: data.customer_id,
          type: data.type || 'meter'
        };
        
        console.log('创建设备数据:', deviceData);
        
        const device = await deviceApi.createDevice(deviceData);
        
        // 确保this.devices是一个数组
        if (Array.isArray(this.devices)) {
          this.devices.unshift(device);
          this.total++;
        }
        
        ElMessage.success('创建设备成功');
        return device;
      } catch (error) {
        console.error('创建设备失败:', error);
        ElMessage.error('创建设备失败');
        return null;
      } finally {
        this.loading = false;
      }
    },
    
    // 更新设备
    async updateDevice(id: number, data: any) {
      this.loading = true;
      try {
        const device = await deviceApi.updateDevice(id, data);
        const index = this.devices.findIndex(d => d.id === id);
        if (index !== -1) {
          this.devices[index] = device;
        }
        if (this.currentDevice?.id === id) {
          this.currentDevice = device;
        }
        ElMessage.success('更新设备成功');
        return device;
      } catch (error) {
        ElMessage.error('更新设备失败');
        return null;
      } finally {
        this.loading = false;
      }
    },
    
    // 删除设备
    async deleteDevice(id: number) {
      this.loading = true;
      try {
        const device = this.devices.find(d => d.id === id);
        if (device) {
          this.deviceStatuses.delete(device.device_id);
        }
        await deviceApi.deleteDevice(id);
        this.devices = this.devices.filter(d => d.id !== id);
        this.total--;
        if (this.currentDevice?.id === id) {
          this.currentDevice = null;
        }
        ElMessage.success('删除设备成功');
        return true;
      } catch (error) {
        ElMessage.error('删除设备失败');
        return false;
      } finally {
        this.loading = false;
      }
    },
    
    // 批量删除设备
    async batchDeleteDevices(ids: number[]) {
      this.loading = true;
      try {
        const devicesToDelete = this.devices.filter(d => ids.includes(d.id));
        devicesToDelete.forEach(device => {
          this.deviceStatuses.delete(device.device_id);
        });
        await deviceApi.batchDeleteDevices(ids);
        this.devices = this.devices.filter(d => !ids.includes(d.id));
        this.total -= ids.length;
        ElMessage.success('批量删除设备成功');
        return true;
      } catch (error) {
        ElMessage.error('批量删除设备失败');
        return false;
      } finally {
        this.loading = false;
      }
    },
    
    // 导出设备数据
    async exportDevices(params?: {
      status?: string;
      type?: string;
      start_date?: string;
      end_date?: string;
    }) {
      try {
        const blob = await deviceApi.exportDevices(params);
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `devices_${new Date().toISOString().split('T')[0]}.xlsx`;
        a.click();
        URL.revokeObjectURL(url);
        ElMessage.success('导出设备数据成功');
        return true;
      } catch (error) {
        ElMessage.error('导出设备数据失败');
        return false;
      }
    },
    
    // 获取设备统计数据
    async getDeviceStats(params?: {
      start_date?: string;
      end_date?: string;
    }) {
      try {
        const stats = await deviceApi.getDeviceStats(params);
        return stats;
      } catch (error) {
        ElMessage.error('获取设备统计数据失败');
        return null;
      }
    },
    
    // 刷新所有设备状态
    async refreshAllDeviceStatuses() {
      const onlineDevices = this.onlineDevices;
      for (const device of onlineDevices) {
        await this.getDeviceStatus(device.device_id);
      }
    },
  },
});