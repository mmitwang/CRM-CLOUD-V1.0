import { defineStore } from 'pinia';
import { customerApi } from '../api/customer';
import { ElMessage } from 'element-plus';

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

interface CustomerState {
  customers: Customer[];
  total: number;
  page: number;
  pageSize: number;
  loading: boolean;
  currentCustomer: Customer | null;
}

export const useCustomerStore = defineStore('customer', {
  state: (): CustomerState => ({
    customers: [],
    total: 0,
    page: 1,
    pageSize: 10,
    loading: false,
    currentCustomer: null,
  }),
  
  getters: {
    activeCustomers: (state) => state.customers.filter(customer => customer.status === 'active'),
    inactiveCustomers: (state) => state.customers.filter(customer => customer.status === 'inactive'),
  },
  
  actions: {
    // 获取客户列表
    async getCustomers(params?: {
      page?: number;
      page_size?: number;
      search?: string;
      status?: string;
    }) {
      this.loading = true;
      try {
        const response = await customerApi.getCustomers({
          page: params?.page || this.page,
          page_size: params?.page_size || this.pageSize,
          search: params?.search,
          status: params?.status,
        });
        
        // 处理后端返回的数组格式
        if (Array.isArray(response)) {
          this.customers = response;
          this.total = response.length;
          this.page = params?.page || 1;
          this.pageSize = params?.page_size || this.pageSize;
          return {
            items: response,
            total: response.length,
            page: params?.page || 1,
            page_size: params?.page_size || this.pageSize
          };
        } else {
          // 处理前端期望的对象格式
          this.customers = response.items;
          this.total = response.total;
          this.page = response.page;
          this.pageSize = response.page_size;
          return response;
        }
      } catch (error) {
        ElMessage.error('获取客户列表失败');
        return null;
      } finally {
        this.loading = false;
      }
    },
    
    // 获取客户详情
    async getCustomerDetail(id: number) {
      this.loading = true;
      try {
        const customer = await customerApi.getCustomerDetail(id);
        this.currentCustomer = customer;
        return customer;
      } catch (error) {
        ElMessage.error('获取客户详情失败');
        return null;
      } finally {
        this.loading = false;
      }
    },
    
    // 创建客户
    async createCustomer(data: any) {
      this.loading = true;
      try {
        const customer = await customerApi.createCustomer(data);
        this.customers.unshift(customer);
        this.total++;
        ElMessage.success('创建客户成功');
        return customer;
      } catch (error) {
        ElMessage.error('创建客户失败');
        return null;
      } finally {
        this.loading = false;
      }
    },
    
    // 更新客户
    async updateCustomer(id: number, data: any) {
      this.loading = true;
      try {
        const customer = await customerApi.updateCustomer(id, data);
        const index = this.customers.findIndex(c => c.id === id);
        if (index !== -1) {
          this.customers[index] = customer;
        }
        if (this.currentCustomer?.id === id) {
          this.currentCustomer = customer;
        }
        ElMessage.success('更新客户成功');
        return customer;
      } catch (error) {
        ElMessage.error('更新客户失败');
        return null;
      } finally {
        this.loading = false;
      }
    },
    
    // 删除客户
    async deleteCustomer(id: number) {
      this.loading = true;
      try {
        await customerApi.deleteCustomer(id);
        this.customers = this.customers.filter(c => c.id !== id);
        this.total--;
        if (this.currentCustomer?.id === id) {
          this.currentCustomer = null;
        }
        ElMessage.success('删除客户成功');
        return true;
      } catch (error) {
        ElMessage.error('删除客户失败');
        return false;
      } finally {
        this.loading = false;
      }
    },
    
    // 批量删除客户
    async batchDeleteCustomers(ids: number[]) {
      this.loading = true;
      try {
        await customerApi.batchDeleteCustomers(ids);
        this.customers = this.customers.filter(c => !ids.includes(c.id));
        this.total -= ids.length;
        ElMessage.success('批量删除客户成功');
        return true;
      } catch (error) {
        ElMessage.error('批量删除客户失败');
        return false;
      } finally {
        this.loading = false;
      }
    },
    
    // 导出客户数据
    async exportCustomers(params?: {
      status?: string;
      start_date?: string;
      end_date?: string;
    }) {
      try {
        const blob = await customerApi.exportCustomers(params);
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `customers_${new Date().toISOString().split('T')[0]}.xlsx`;
        a.click();
        URL.revokeObjectURL(url);
        ElMessage.success('导出客户数据成功');
        return true;
      } catch (error) {
        ElMessage.error('导出客户数据失败');
        return false;
      }
    },
  },
});