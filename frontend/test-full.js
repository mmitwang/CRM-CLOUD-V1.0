import { chromium } from 'playwright';

async function testFull() {
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

    // 检查页面内容
    const hasDashboardText = await page.evaluate(() => {
      return document.body.textContent.includes('仪表盘');
    });
    console.log(`页面是否包含"仪表盘": ${hasDashboardText}`);

    // 5. 测试公司管理页面
    console.log('=== 测试公司管理页面 ===');
    await page.goto('http://localhost:3002/companies');
    await page.waitForLoadState('networkidle');
    console.log('公司管理页面加载成功');

    // 检查页面内容
    const hasCompaniesText = await page.evaluate(() => {
      return document.body.textContent.includes('公司管理');
    });
    console.log(`页面是否包含"公司管理": ${hasCompaniesText}`);

    // 检查新增公司按钮
    const hasAddCompanyButton = await page.evaluate(() => {
      return document.body.textContent.includes('新增公司');
    });
    console.log(`页面是否包含"新增公司": ${hasAddCompanyButton}`);

    // 6. 测试客户管理页面
    console.log('=== 测试客户管理页面 ===');
    await page.goto('http://localhost:3002/customers');
    await page.waitForLoadState('networkidle');
    console.log('客户管理页面加载成功');

    // 检查页面内容
    const hasCustomersText = await page.evaluate(() => {
      return document.body.textContent.includes('客户管理');
    });
    console.log(`页面是否包含"客户管理": ${hasCustomersText}`);

    // 检查新增客户按钮
    const hasAddCustomerButton = await page.evaluate(() => {
      return document.body.textContent.includes('新增客户');
    });
    console.log(`页面是否包含"新增客户": ${hasAddCustomerButton}`);

    // 7. 测试设备管理页面
    console.log('=== 测试设备管理页面 ===');
    await page.goto('http://localhost:3002/devices');
    await page.waitForLoadState('networkidle');
    console.log('设备管理页面加载成功');

    // 检查页面内容
    const hasDevicesText = await page.evaluate(() => {
      return document.body.textContent.includes('设备管理');
    });
    console.log(`页面是否包含"设备管理": ${hasDevicesText}`);

    // 检查新增设备按钮
    const hasAddDeviceButton = await page.evaluate(() => {
      return document.body.textContent.includes('新增设备');
    });
    console.log(`页面是否包含"新增设备": ${hasAddDeviceButton}`);

    // 8. 测试个人资料页面
    console.log('=== 测试个人资料页面 ===');
    await page.goto('http://localhost:3002/profile');
    await page.waitForLoadState('networkidle');
    console.log('个人资料页面加载成功');

    // 检查页面内容
    const hasProfileText = await page.evaluate(() => {
      return document.body.textContent.includes('个人资料');
    });
    console.log(`页面是否包含"个人资料": ${hasProfileText}`);

    // 9. 测试导航菜单
    console.log('=== 测试导航菜单 ===');
    await page.goto('http://localhost:3002/dashboard');
    await page.waitForLoadState('networkidle');

    // 检查导航菜单是否存在
    const hasNavigationMenu = await page.evaluate(() => {
      return document.querySelector('.sidebar-menu') !== null;
    });
    console.log(`导航菜单是否存在: ${hasNavigationMenu}`);

    // 10. 测试响应式布局
    console.log('=== 测试响应式布局 ===');
    // 缩小窗口大小
    await page.setViewportSize({ width: 768, height: 1024 });