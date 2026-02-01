import axios from 'axios';

async function testAPI() {
  try {
    // 创建 axios 实例
    const apiClient = axios.create({
      baseURL: 'http://localhost:8000',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log('测试登录 API...');
    // 测试登录
    const loginResponse = await apiClient.post('/api/v1/auth/login', {
      username: 'admin@default.com@DEFAULT',
      password: '123456'
    }, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      transformRequest: [(data) => {
        return Object.keys(data).map(key => `${key}=${encodeURIComponent(data[key])}`).join('&');
      }]
    });
    console.log('登录成功:', loginResponse.data);

    // 设置认证令牌
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${loginResponse.data.access_token}`;

    console.log('测试获取用户信息 API...');
    // 测试获取用户信息
    const userInfoResponse = await apiClient.get('/api/v1/auth/me');
    console.log('用户信息:', userInfoResponse.data);

    console.log('测试获取公司列表 API...');
    // 测试获取公司列表
    const companiesResponse = await apiClient.get('/api/v1/companies');
    console.log('公司列表:', companiesResponse.data);

    console.log('测试新增公司 API...');
    // 测试新增公司
    const createCompanyResponse = await apiClient.post('/api/v1/companies', {
      name: '测试公司',
      code: 'TEST',
      contact_person: '测试联系人',
      phone: '13800138000',
      email: 'test@test.com',
      address: '测试地址',
      status: 'active'
    });
    console.log('新增公司成功:', createCompanyResponse.data);

    const companyId = createCompanyResponse.data.id;

    console.log('测试更新公司 API...');
    // 测试更新公司
    const updateCompanyResponse = await apiClient.put(`/api/v1/companies/${companyId}`, {
      name: '测试公司（已编辑）',
      code: 'TEST',
      contact_person: '测试联系人',
      phone: '13800138000',
      email: 'test@test.com',
      address: '测试地址',
      status: 'active'
    });
    console.log('更新公司成功:', updateCompanyResponse.data);

    console.log('测试删除公司 API...');
    // 测试删除公司
    const deleteCompanyResponse = await apiClient.delete(`/api/v1/companies/${companyId}`);
    console.log('删除公司成功:', deleteCompanyResponse.data);

    console.log('测试获取客户列表 API...');
    // 测试获取客户列表
    const customersResponse = await apiClient.get('/api/v1/customers');
    console.log('客户列表:', customersResponse.data);

    console.log('测试新增客户 API...');
    // 测试新增客户
    const createCustomerResponse = await apiClient.post('/api/v1/customers', {
      name: '测试客户',
      phone: '13900139000',
      email: 'customer@test.com',
      address: '客户地址',
      status: 'active'
    });
    console.log('新增客户成功:', createCustomerResponse.data);

    const customerId = createCustomerResponse.data.id;

    console.log('测试更新客户 API...');
    // 测试更新客户
    const updateCustomerResponse = await apiClient.put(`/api/v1/customers/${customerId}`, {
      name: '测试客户（已编辑）',
      phone: '13900139000',
      email: 'customer@test.com',
      address: '客户地址',
      status: 'active'
    });
    console.log('更新客户成功:', updateCustomerResponse.data);

    console.log('测试删除客户 API...');
    // 测试删除客户
    const deleteCustomerResponse = await apiClient.delete(`/api/v1/customers/${customerId}`);
    console.log('删除客户成功:', deleteCustomerResponse.data);

    console.log('测试获取设备列表 API...');
    // 测试获取设备列表
    const devicesResponse = await apiClient.get('/api/v1/devices');
    console.log('设备列表:', devicesResponse.data);

    console.log('测试新增设备 API...');
    // 测试新增设备
    const createDeviceResponse = await apiClient.post('/api/v1/devices', {
      name: '测试设备',
      model: 'TEST-MODEL',
      serial_number: 'TEST-001',
      installation_address: '设备安装地址',
      status: 'active'
    });
    console.log('新增设备成功:', createDeviceResponse.data);

    const deviceId = createDeviceResponse.data.id;

    console.log('测试更新设备 API...');
    // 测试更新设备
    const updateDeviceResponse = await apiClient.put(`/api/v1/devices/${deviceId}`, {
      name: '测试设备（已编辑）',
      model: 'TEST-MODEL',
      serial_number: 'TEST-001',
      installation_address: '设备安装地址',
      status: 'active'
    });
    console.log('更新设备成功:', updateDeviceResponse.data);

    console.log('测试删除设备 API...');