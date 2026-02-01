import axios from 'axios';

async function testSimple() {
  try {
    // 测试登录
    console.log('测试登录...');
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
    console.log('登录成功');

    // 测试获取用户信息
    console.log('测试获取用户信息...');
    const userInfoResponse = await axios.get('http://localhost:8000/api/v1/auth/me', {
      headers: {
        'Authorization': `Bearer ${loginResponse.data.access_token}`
      }
    });
    console.log('用户信息:', userInfoResponse.data);

    // 测试获取公司列表
    console.log('测试获取公司列表...');
    const companiesResponse = await axios.get('http://localhost:8000/api/v1/companies', {
      headers: {
        'Authorization': `Bearer ${loginResponse.data.access_token}`
      }
    });
    console.log('公司列表数量:', companiesResponse.data.length);

    console.log('测试完成！');
  } catch (error) {
    console.error('测试失败:', error);
  }
}

testSimple();
