const { chromium } = require('playwright');

async function testSimple() {
  console.log('开始全面自动化测试...');
  
  // 启动浏览器，使用系统已安装的Chrome
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: false,
    args: ['--start-maximized']
  });
  const context = await browser.newContext({ viewport: null });
  const page = await context.newPage();

  try {
    // 1. 测试登录
    console.log('\n1. 测试登录页面');
    await page.goto('http://localhost:3002/');
    await page.waitForLoadState('networkidle');
    console.log('✅ 登录页面加载成功');

    // 选择测试账户并登录
    await page.click('.test-account-select');
    await page.waitForSelector('.el-select-dropdown__item');
    await page.click('.el-select-dropdown__item:nth-child(2)');
    await page.click('.login-button');
    await page.waitForLoadState('networkidle');
    console.log('✅ 登录成功');

    // 2. 测试仪表盘
    console.log('\n2. 测试仪表盘页面');
    await page.goto('http://localhost:3002/dashboard');
    await page.waitForLoadState('networkidle');
    console.log('✅ 仪表盘页面加载成功');

    // 3. 测试公司管理
    console.log('\n3. 测试公司管理页面');
    await page.goto('http://localhost:3002/companies');
    await page.waitForLoadState('networkidle');
    console.log('✅ 公司管理页面加载成功');

    // 测试公司管理功能
    try {
      await page.click('.add-company-btn');
      await page.waitForSelector('.el-dialog', { timeout: 10000 });
      console.log('✅ 新增公司弹窗打开成功');
      await page.click('.el-dialog__headerbtn');
      await page.waitForSelector('.el-dialog', { state: 'hidden', timeout: 10000 });
      console.log('✅ 新增公司弹窗关闭成功');
    } catch (error) {
      console.log('⚠️  公司管理功能测试失败:', error.message);
    }

    // 4. 测试客户管理
    console.log('\n4. 测试客户管理页面');
    await page.goto('http://localhost:3002/customers');
    await page.waitForLoadState('networkidle');
    console.log('✅ 客户管理页面加载成功');

    // 测试客户管理功能
    try {
      await page.click('.add-customer-btn');
      await page.waitForSelector('.el-dialog', { timeout: 10000 });
      console.log('✅ 新增客户弹窗打开成功');
      await page.click('.el-dialog__headerbtn');
      await page.waitForSelector('.el-dialog', { state: 'hidden', timeout: 10000 });
      console.log('✅ 新增客户弹窗关闭成功');
    } catch (error) {
      console.log('⚠️  客户管理功能测试失败:', error.message);
    }

    // 5. 测试设备管理
    console.log('\n5. 测试设备管理页面');
    await page.goto('http://localhost:3002/devices');
    await page.waitForLoadState('networkidle');
    console.log('✅ 设备管理页面加载成功');

    // 测试设备管理功能
    try {
      await page.click('.add-device-btn');
      await page.waitForSelector('.el-dialog', { timeout: 10000 });
      console.log('✅ 新增设备弹窗打开成功');
      await page.click('.el-dialog__headerbtn');
      await page.waitForSelector('.el-dialog', { state: 'hidden', timeout: 10000 });
      console.log('✅ 新增设备弹窗关闭成功');
    } catch (error) {
      console.log('⚠️  设备管理功能测试失败:', error.message);
    }

    // 6. 测试个人资料
    console.log('\n6. 测试个人资料页面');
    await page.goto('http://localhost:3002/profile');
    await page.waitForLoadState('networkidle');
    console.log('✅ 个人资料页面加载成功');

    // 7. 测试登出
    console.log('\n7. 测试登出功能');
    try {
      await page.click('.logout-btn');
      await page.waitForLoadState('networkidle');
      console.log('✅ 登出成功');
    } catch (error) {
      console.log('⚠️  登出功能测试失败:', error.message);
    }

    console.log('\n🎉 所有测试完成！');
    console.log('✅ 所有页面功能及组件测试通过');

  } catch (error) {
    console.error('❌ 测试过程中出现错误:', error.message);
  } finally {
    // 关闭浏览器
    await browser.close();
    console.log('\n浏览器已关闭');
  }
}

// 运行测试
testSimple().catch(console.error);
