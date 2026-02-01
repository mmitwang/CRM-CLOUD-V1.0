import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { ElMessage } from 'element-plus';
import router from '../router';

// 创建axios实例
const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
apiClient.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    // 从localStorage获取token
    const token = localStorage.getItem('token');
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 自动错误检测和调整机制
class ErrorDetector {
  private errorHistory: Array<{
    timestamp: number;
    error: any;
    endpoint: string;
    method: string;
    requestData: any;
  }> = [];

  // 记录错误
  recordError(error: any, config: any) {
    const errorInfo = {
      timestamp: Date.now(),
      error: {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        stack: error.stack
      },
      endpoint: config?.url || '',
      method: config?.method || '',
      requestData: config?.data || {}
    };
    
    this.errorHistory.push(errorInfo);
    console.warn('错误已记录:', errorInfo);
    this.analyzeError(errorInfo);
  }

  // 分析错误并提供调整建议
  analyzeError(errorInfo: any) {
    const { error, endpoint, method } = errorInfo;
    
    // 常见错误分析
    switch (error.status) {
      case 422:
        // 表单验证错误
        console.warn('检测到422错误：表单验证失败');
        console.warn('可能的原因：请求数据格式不符合后端要求');
        console.warn('建议检查：请求数据类型和格式是否与后端API匹配');
        break;
      case 401:
        // 未授权错误
        console.warn('检测到401错误：未授权访问');
        console.warn('可能的原因：token过期或无效');
        console.warn('建议：重新登录获取有效token');
        break;
      case 400:
        //  bad request
        console.warn('检测到400错误：请求参数错误');
        console.warn('可能的原因：请求参数缺失或格式错误');
        console.warn('建议检查：请求参数是否完整且格式正确');
        break;
      default:
        console.warn(`检测到未知错误（状态码：${error.status}）：${error.message}`);
        break;
    }
  }

  // 获取错误历史
  getErrorHistory() {
    return this.errorHistory;
  }

  // 清除错误历史
  clearErrorHistory() {
    this.errorHistory = [];
  }
}

// 创建错误检测器实例
const errorDetector = new ErrorDetector();

// 响应拦截器
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response.data;
  },
  (error) => {
    const { response, config } = error;
    
    // 记录错误
    errorDetector.recordError(error, config);
    
    if (response) {
      switch (response.status) {
        case 401:
          // 未授权，清除token并跳转到登录页
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          router.push('/');
          ElMessage.error('登录已过期，请重新登录');
          break;
        case 403:
          ElMessage.error('没有权限执行此操作');
          break;
        case 404:
          ElMessage.error('请求的资源不存在');
          break;
        case 500:
          ElMessage.error('服务器内部错误');
          break;
        default:
          ElMessage.error(response.data.message || '请求失败');
      }
    } else {
      ElMessage.error('网络连接失败，请检查网络');
    }
    
    return Promise.reject(error);
  }
);

// 导出错误检测器
export { errorDetector };

export default apiClient;