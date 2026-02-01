// 简单的 API 测试脚本，测试后端 API 的响应
import axios from 'axios';

async function testAPI() {
  try {
    // 1. 测试登录
    console.log('测试登录 API...');
    const loginResponse = await axios.post('http://localhost:8000/api/v1/auth/login', {
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

    // 2. 测试获取用户信息
    console.log('测试获取用户信息 API...');
    const userInfoResponse = await axios.get('http://localhost:8000/api/v1/auth/me', {
      headers: {
        'Authorization': `Bearer ${loginResponse.data.access_token}`
      }
    });
    console.log('用户信息:', userInfoResponse.data);

    // 3. 测试获取公司列表
    console.log('测试获取公司列表 API...');
    const companiesResponse = await axios.get('http://localhost:8000/api/v1/companies', {
      headers: {
        'Authorization': `Bearer ${loginResponse.data.access_token}`
      }
    });
    console.log('公司列表数量:', companiesResponse.data.length);

    // 4. 测试新增公司
    console.log('测试新增公司 API...');
    const createCompanyResponse = await axios.post('http://localhost:8000/api/v1/companies', {
      name: '测试公司',
      code: 'TEST',
      contact_person: '测试联系人',
      phone: '13800138000',
      email: 'test@test.com',
      address: '测试地址',
      status: 'active'
    }, {
      headers: {
        'Authorization': `Bearer ${loginResponse.data.access_token}`
      }
    });
    console.log('新增公司成功:', createCompanyResponse.data);

    const companyId = createCompanyResponse.data.id;

    // 5. 测试更新公司
    console.log('测试更新公司 API...');
    const updateCompanyResponse = await axios.put(`http://localhost:8000/api/v1/companies/${companyId}`, {
      name: '测试公司（已编辑）',
      code: 'TEST',
      contact_person: '测试联系人',
      phone: '13800138000',
      email: 'test@test.com',
      address: '测试地址',
      status: 'active'
    }, {
      headers: {
        'Authorization': `Bearer ${loginResponse.data.access_token}`
      }
    });
    console.log('更新公司成功:', updateCompanyResponse.data);

    // 6. 测试删除公司
    console.log('测试删除公司 API...');
    const deleteCompanyResponse = await axios.delete(`http://localhost:8000/api/v1/companies/${companyId}`, {
      headers: {
        'Authorization': `Bearer ${loginResponse.data.access_token}`
      }
    });
    console.log('删除