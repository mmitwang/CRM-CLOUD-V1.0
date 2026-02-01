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

    console.log('所有 API 测试完成！');
  } catch (error) {
    console.error('测试过程中出现错误:', error);
    if (error.response) {
      console.error('错误响应:', error.response.data);
    }
  }
}

// 运行测试
testAPI();
