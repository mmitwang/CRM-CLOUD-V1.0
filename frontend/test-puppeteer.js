import puppeteer from 'puppeteer';

async function testCRUD() {
  // 启动浏览器，使用系统已安装的 Chrome
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: false,
    defaultViewport: null,
    args: ['--start-maximized']
  });
  const page = await browser.newPage();

  try {
    // 1. 访问登录页面
    console.log('访问登录页面...');
    await page.goto('http://localhost:3002/');
    await page.waitForNavigation({ waitUntil: 'networkidle0' });

    // 2. 选择测试账户并登录
    console.log('选择测试账户...');
    // 点击测试账户选择框
    await page.click('.test-account-select');
    // 等待下拉框出现
    await page.waitForSelector('.el-select-dropdown__item');
    // 选择默认公司 - 管理员
    await page.click('.el-select-dropdown__item');
    await page.waitFor(1000);

    console.log('点击登录按钮...');
    // 点击登录按钮
    await page.click('.login-button');
    // 等待登录成功并跳转到仪表盘
    await page.waitForNavigation({ waitUntil: 'networkidle0' });

    // 3. 测试公司管理
    console.log('测试公司管理...');
    // 点击公司管理菜单
    await page.click('a[href="#/companies"]');
    await page.waitForNavigation({ waitUntil: 'networkidle0' });

    // 测试新增公司
    console.log('测试新增公司...');
    // 点击新增公司按钮
    await page.click('button:has-text("新增公司")');
    await page.waitForSelector('.el-dialog');
    // 填写表单
    await page.type('input[placeholder="请输入公司名称"]', '测试公司');
    await page.type('input[placeholder="请输入公司代码"]', 'TEST');
    await page.type('input[placeholder="请输入联系人"]', '测试联系人');
    await page.type('input[placeholder="请输入联系电话"]', '13800138000');
    await page.type('input[placeholder="请输入邮箱"]', 'test@test.com');
    await page.type('textarea[placeholder="请输入地址"]', '测试地址');
    // 点击确定按钮
    await page.click('.el-dialog__footer button.el-button--primary');
    await page.waitFor(2000);

    // 测试编辑公司
    console.log('测试编辑公司...');
    // 点击编辑按钮
    await page.click('.el-button--primary');
    await page.waitForSelector('.el-dialog');
    // 修改公司名称
    await page.click('input[placeholder="请输入公司名称"]');
    await page.keyboard.down('Control');
    await page.keyboard.press('A');
    await page.keyboard.up('Control');
    await page.keyboard.press('Backspace');
    await page.type('input[placeholder="请输入公司名称"]', '测试公司（已编辑）');
    // 点击确定按钮
    await page.click('.el-dialog__footer button.el-button--primary');
    await page.waitFor(2000);

    // 测试删除公司
    console.log('测试删除公司...');
    // 点击删除按钮
    await page.click('.el-button--danger');
    await page.waitForSelector('.el-message-box');
    // 点击确定按钮
    await page.click('.el-message-box__btns button.el-button--primary');
    await page.waitFor(2000);

    // 4. 测试客户管理
    console.log('测试客户管理...');
    // 点击客户管理菜单
    await page.click('a[href="#/customers"]');
    await page.waitForNavigation({ waitUntil: 'networkidle0' });

    // 测试新增客户
    console.log('测试新增客户...');
    // 点击新增客户按钮
    await page.click('button');
    await page.waitForSelector('.el-dialog');
    // 填写表单
    await page.type('input[placeholder="请输入客户姓名"]', '测试客户');
    await page.type('input[placeholder="请输入联系电话"]', '13900139000');
    await page.type('input[placeholder="请输入邮箱"]', 'customer@test.com');
    await page.type('input[placeholder="请输入地址"]', '客户地址');
    // 点击确定按钮
    await page.click('.el-dialog__footer button.el-button--primary');
    await page.waitFor(2000);

    // 测试编辑客户
    console.log('测试编辑客户...');
    // 点击编辑按钮
    await page.click('.el-button--primary');
    await page.waitForSelector('.el-dialog');
    // 修改客户姓名
    await page.click('input[placeholder="请输入客户姓名"]');
    await page.keyboard.down('Control');
    await page.keyboard.press('A');
    await page.keyboard.up('Control');
    await page.keyboard.press('Backspace');
    await page.type('input[placeholder="请输入客户姓名"]', '测试客户（已编辑）');
    // 点击确定按钮
    await page.click('.el-dialog__footer button.el-button--primary');
    await page.waitFor(2000);

    // 测试删除客户
    console.log('测试删除客户...');
    // 点击删除按钮
    await page.click('.el-button--danger');
    await page.waitForSelector('.el-message-box');
    // 点击确定按钮
    await page.click('.el-message-box__btns button.el-button--primary');
    await page.waitFor(2000);

    // 5. 测试设备管理
    console.log('测试设备管理...');
    // 点击设备管理菜单
    await page.click('a[href="#/devices"]');
    await page.waitForNavigation({ waitUntil: 'networkidle0' });

    // 测试新增设备
    console.log('测试新增设备...');
    // 点击新增设备按钮
    await page.click('button');
    await page.waitForSelector('.el-dialog');
    // 填写表单
    await page.type('input[placeholder="请输入设备名称"]', '测试设备');
    await page.type('input[placeholder="请输入设备型号"]', 'TEST-MODEL');
    await page.type('input[placeholder="请输入设备编号"]', 'TEST-001');
    await page.type('input[placeholder="请输入安装地址"]', '设备安装地址');
    // 点击确定按钮
    await page.click('.el-dialog__footer button.el-button--primary');
    await page.waitFor(2000);

    // 测试编辑设备
    console.log('测试编辑设备...');
    // 点击编辑按钮
    await page.click('.el-button--primary');
    await page.waitForSelector('.el-dialog');
    // 修改设备名称
    await page.click('input[placeholder="请输入设备名称"]');
    await page.keyboard.down('Control');
    await page.keyboard.press('A');
    await page.keyboard.up('Control');
    await page.keyboard.press('Backspace');
    await page.type('input[placeholder="请输入设备名称"]', '测试设备（已编辑）');
    // 点击确定按钮
    await page.click('.el-dialog__footer button.el-button--primary');
    await page.waitFor(2000);

    // 测试删除设备
    console.log('测试删除设备...');
    // 点击删除按钮
    await page.click('.el-button--danger');
    await page.waitForSelector('.el-message-box');
    // 点击确定按钮
    await page.click('.el-message-box__btns button.el-button--primary');
    await page.waitFor(2000);

    console.log('所有测试完成！');
  } catch (error) {
    console.error('测试过程中出现错误:', error);
  } finally {
    // 关闭浏览器
    await browser.close();
  }
}

// 运行测试
testCRUD();
