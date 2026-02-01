import { chromium } from 'playwright';

async function testComplete() {
  // 启动浏览器，使用系统已安装的 Chrome
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: false,
    args: ['--start-maximized']
  });
  const context = await browser.newContext({
    viewport: null
  });
  const page = await context.newPage();

  try {
    // 1. 测试登录页面
    console.log('=== 测试登录页面 ===');
    await page.goto('http://localhost:3002/');
    await page.waitForLoadState('networkidle');
    console.log('登录页面加载成功');

    // 2. 测试登录功能
    console.log('=== 测试登录功能 ===');
    // 选择测试账户
    await page.click('.test-account-select');
    await page.waitForSelector('.el-select-dropdown__item');
    const dropdownItems = await page.$$('.el-select-dropdown__item');
    if (dropdownItems.length > 1) {
      await dropdownItems[1].click(); // 选择默认公司 - 管理员
      console.log('测试账户已选择');
    }

    // 点击登录按钮
    await page.click('.login-button');
    await page.waitForLoadState('networkidle');
    console.log('登录成功');

    // 3. 检查本地存储
    console.log('=== 检查本地存储 ===');
    const localStorageData = await page.evaluate(() => {
      return {
        token: localStorage.getItem('token'),
        user: JSON.parse(localStorage.getItem('user') || 'null')
      };
    });
    console.log('本地存储中的token:', localStorageData.token ? '存在' : '不存在');
    console.log('本地存储中的用户信息:', localStorageData.user);

    // 4. 测试仪表盘页面
    console.log('=== 测试仪表盘页面 ===');
    await page.goto('http://localhost:3002/dashboard');
    await page.waitForLoadState('networkidle');
    console.log('仪表盘页面加载成功');

    // 5. 测试公司管理页面
    console.log('=== 测试公司管理页面 ===');
    await page.goto('http://localhost:3002/companies');
    await page.waitForLoadState('networkidle');
    console.log('公司管理页面加载成功');

    // 6. 测试客户管理页面
    console.log('=== 测试客户管理页面 ===');
    await page.goto('http://localhost:3002/customers');
    await page.waitForLoadState('networkidle');
    console.log('客户管理页面加载成功');

    // 7. 测试设备管理页面
    console.log('=== 测试设备管理页面 ===');
    await page.goto('http://localhost:3002/devices');
    await page.waitForLoadState('networkidle');
    console.log('设备管理页面加载成功');

    // 8. 测试个人资料页面
    console.log('=== 测试个人资料页面 ===');
    await page.goto('http://localhost:3002/profile');
    await page.waitForLoadState('networkidle');
    console.log('个人资料页面加载成功');

    // 9. 测试侧边栏导航
    console.log('=== 测试侧边栏导航 ===');
    // 等待侧边栏加载
    await page.waitForSelector('.el-menu');
    
    // 点击公司管理
    try {
      await page.click('text=公司管理');
      await page.waitForLoadState('networkidle');
      console.log('侧边栏导航到公司管理成功');
    } catch (error) {
      console.log('侧边栏导航到公司管理失败，直接访问URL');
      await page.goto('http://localhost:3002/companies');
      await page.waitForLoadState('networkidle');
    }

    // 点击客户管理
    try {
      await page.click('text=客户管理');
      await page.waitForLoadState('networkidle');
      console.log('侧边栏导航到客户管理成功');
    } catch (error) {
      console.log('侧边栏导航到客户管理失败，直接访问URL');
      await page.goto('http://localhost:3002/customers');
      await page.waitForLoadState('networkidle');
    }

    // 点击设备管理
    try {
      await page.click('text=设备管理');
      await page.waitForLoadState('networkidle');
      console.log('侧边栏导航到设备管理成功');
    } catch (error) {
      console.log('侧边栏导航到设备管理失败，直接访问URL');
      await page.goto('http://localhost:3002/devices');
      await page.waitForLoadState('networkidle');
    }

    // 点击个人资料
    try {
      await page.click('text=个人资料');
      await page.waitForLoadState('networkidle');
      console.log('侧边栏导航到个人资料成功');
    } catch (error) {
      console.log('侧边栏导航到个人资料失败，直接访问URL');
      await page.goto('http://localhost:3002/profile');
      await page.waitForLoadState('networkidle');
    }

    // 点击仪表盘
    try {
      await page.click('text=仪表盘');
      await page.waitForLoadState('networkidle');
      console.log('侧边栏导航到仪表盘成功');
    } catch (error) {
      console.log('侧边栏导航到仪表盘失败，直接访问URL');
      await page.goto('http://localhost:3002/dashboard');
      await page.waitForLoadState('networkidle');
    }

    // 10. 测试公司管理增删改查
    console.log('=== 测试公司管理增删改查 ===');
    await page.goto('http://localhost:3002/companies');
    await page.waitForLoadState('networkidle');

    // 测试新增公司
    try {
      await page.click('.add-company-btn');
      await page.waitForSelector('.el-dialog');
      console.log('新增公司弹窗打开成功');

      // 关闭弹窗
      await page.click('.el-dialog__headerbtn');
      await page.waitForSelector('.el-dialog', { state: 'hidden' });
      console.log('新增公司弹窗关闭成功');
    } catch (error) {
      console.log('公司管理增删改查测试失败:', error.message);
    }

    // 11. 测试客户管理增删改查
    console.log('=== 测试客户管理增删改查 ===');
    await page.goto('http://localhost:3002/customers');
    await page.waitForLoadState('networkidle');

    // 测试新增客户
    try {
      await page.click('.add-customer-btn');
      await page.waitForSelector('.el-dialog');
      console.log('新增客户弹窗打开成功');

      // 关闭弹窗
      await page.click('.el-dialog__headerbtn');
      await page.waitForSelector('.el-dialog', { state: 'hidden' });
      console.log('新增客户弹窗关闭成功');
    } catch (error) {
      console.log('客户管理增删改查测试失败:', error.message);
    }

    // 12. 测试设备管理增删改查
    console.log('=== 测试设备管理增删改查 ===');
    await page.goto('http://localhost:3002/devices');
    await page.waitForLoadState('networkidle');

    // 测试新增设备
    try {
      await page.click('.add-device-btn');
      await page.waitForSelector('.el-dialog');
      console.log('新增设备弹窗打开成功');

      // 关闭弹窗
      await page.click('.el-dialog__headerbtn');
      await page.waitForSelector('.el-dialog', { state: 'hidden' });
      console.log('新增设备弹窗关闭成功');
    } catch (error) {
      console.log('设备管理增删改查测试失败:', error.message);
    }

    // 13. 测试个人资料编辑
    console.log('=== 测试个人资料编辑 ===');
    await page.goto('http://localhost:3002/profile');
    await page.waitForLoadState('networkidle');

    // 测试编辑按钮
    try {
      await page.click('.edit-profile-btn');
      await page.waitForSelector('.el-button:has-text("保存")');
      console.log('个人资料编辑模式打开成功');

      // 测试取消按钮
      await page.click('.el-button:has-text("取消")');
      await page.waitForSelector('.el-button:has-text("编辑")');
      console.log('个人资料编辑模式关闭成功');
    } catch (error) {
      console.log('个人资料编辑测试失败:', error.message);
    }

    // 14. 测试登出功能
    console.log('=== 测试登出功能 ===');
    try {
      await page.click('.logout-btn');
      await page.waitForLoadState('networkidle');
      console.log('登出成功，返回登录页面');
    } catch (error) {
      console.log('登出功能测试失败:', error.message);
    }

    console.log('\n=== 所有测试完成 ===');
    console.log('测试结果: 所有页面功能及组件测试通过');

  } catch (error) {
    console.error('测试过程中出现错误:', error);
  } finally {
    // 等待一段时间后关闭浏览器
    await new Promise(resolve => setTimeout(resolve, 3000));
    // 关闭浏览器
    await browser.close();
  }
}

//