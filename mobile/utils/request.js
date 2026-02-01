import uniAxios from '@dcloudio/uni-axios'

// 创建axios实例
const request = uniAxios.create({
  baseURL: 'http://localhost:8000', // 后端API基础路径
  timeout: 10000, // 请求超时时间
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器
request.interceptors.request.use(
  config => {
    // 从本地存储获取token
    const token = uni.getStorageSync('token')
    if (token) {
      // 设置Authorization头
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => {
    // 处理请求错误
    console.error('请求错误:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
request.interceptors.response.use(
  response => {
    // 直接返回响应数据，与前端保持一致
    return response.data
  },
  error => {
    // 处理响应错误
    console.error('响应错误:', error)
    
    // 显示错误消息
    const errorMessage = error.response?.data?.detail || error.message || '网络错误'
    uni.showToast({
      title: errorMessage,
      icon: 'none',
      duration: 2000
    })
    
    // 处理未登录情况
    if (error.response?.status === 401) {
      // 清除本地存储的token
      uni.removeStorageSync('token')
      uni.removeStorageSync('user')
      
      // 跳转到登录页
      uni.navigateTo({
        url: '/pages/login/login'
      })
    }
    
    // 处理网络错误
    if (!error.response) {
      // 检查是否有网络连接
      uni.getNetworkType({
        success: function (res) {
          if (res.networkType === 'none') {
            uni.showToast({
              title: '网络连接已断开',
              icon: 'none',
              duration: 3000
            })
          }
        }
      })
    }
    
    return Promise.reject(error)
  }
)

// 封装请求方法
export default {
  // GET请求
  get(url, params = {}) {
    return request({
      url,
      method: 'GET',
      params
    })
  },
  
  // POST请求
  post(url, data = {}, config = {}) {
    return request({
      url,
      method: 'POST',
      data,
      ...config
    })
  },
  
  // PUT请求
  put(url, data = {}) {
    return request({
      url,
      method: 'PUT',
      data
    })
  },
  
  // DELETE请求
  delete(url, params = {}) {
    return request({
      url,
      method: 'DELETE',
      params
    })
  },
  
  // 上传文件
  upload(url, filePath, name = 'file', formData = {}) {
    return new Promise((resolve, reject) => {
      uni.uploadFile({
        url: `${request.defaults.baseURL}${url}`,
        filePath,
        name,
        formData,
        header: {
          'Authorization': `Bearer ${uni.getStorageSync('token')}`
        },
        success: (res) => {
          try {
            const data = JSON.parse(res.data)
            resolve(data)
          } catch (e) {
            reject({ message: '上传失败' })
          }
        },
        fail: (error) => {
          reject(error)
        }
      })
    })
  },
  
  // 下载文件
  download(url, filePath) {
    return new Promise((resolve, reject) => {
      uni.downloadFile({
        url: `${request.defaults.baseURL}${url}`,
        filePath,
        header: {
          'Authorization': `Bearer ${uni.getStorageSync('token')}`
        },
        success: (res) => {
          if (res.statusCode === 200) {
            resolve(res)
          } else {
            reject({ message: '下载失败' })
          }
        },
        fail: (error) => {
          reject(error)
        }
      })
    })
  }
}
