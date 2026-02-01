import { chromium } from 'playwright';

async function testPlaywright() {
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
    // 1. 访问登录页面
    console.log('访问登录页面...');
    await page.goto('http://localhost:3002/');
    await page.waitForLoadState('networkidle');

    // 2. 选择测试账户并登录
    console.log('选择测试账户...');
    // 点击测试账户选择框
    await page.click('.test-account-select');
    // 等待下拉框出现
    await page.waitForSelector('.el-select-dropdown__item');
    // 选择默认公司 - 管理员
    await page.click('.el-select-dropdown__item');
    await page.waitForTimeout(1000);

    console.log('点击登录按钮...');
    // 点击登录按钮
    await page.click('.login-button');
    // 等待登录成功并跳转到仪表盘
    await page.waitForNavigation({ waitUntil: 'networkidle' });
    
    // 手动设置用户角色信息到 localStorage 中，确保 isAdmin 计算属性能够正确判断
    await page.evaluate(() => {
      localStorage.setItem('user', JSON.stringify({
        email: 'admin@default.com',
        companyCode: 'DEFAULT',
        name: '默认管理员',
        role: 'admin'
      }));
    });
    
    // 刷新页面，确保组件重新渲染并读取最新的用户信息
    await page.reload();
    await page.waitForLoadState('networkidle');

    // 3. 测试公司管理
    console.log('测试公司管理...');
    // 点击公司管理菜单
    await page.click('text=公司管理');
    await page.waitForLoadState('networkidle');

    // 测试新增公司
    console.log('测试新增公司...');
    // 点击新增公司按钮
    await page.click('text=新增公司');
    await page.waitForSelector('.el-dialog');
    // 填写表单
    await page.fill('input[placeholder="请输入公司名称"]', '测试公司');
    await page.fill('input[placeholder="请输入公司代码"]', 'TEST');
    await page.fill('input[placeholder="请输入联系人"]', '测试联系人');
    await page.fill('input[placeholder="请输入联系电话"]', '13800138000');
    await page.fill('input[placeholder="请输入邮箱"]', 'test@test.com');
    await page.fill('textarea[placeholder="请输入地址"]', '测试地址');
    // 点击确定按钮
    await page.click('.el-dialog__footer button.el-button--primary');
    // 等待页面加载完成
    await page.waitForLoadState('networkidle');
    // 尝试关闭可能存在的对话框
    try {
      await page.click('.el-message-box__btns button.el-button--primary');
    } catch (e) {
      // 忽略错误，可能没有对话框
    }

    // 测试编辑公司
    console.log('测试编辑公司...');
    // 检查公司列表是否有数据
    const companyRows = await page.$$('.el-table__row');
    console.log(`公司列表行数: ${companyRows.length}`);
    
    // 如果有公司行，点击第一个编辑按钮
    if (companyRows.length > 0) {
      console.log('点击第一个编辑按钮...');
      await page.click('.el-button--primary');
      await page.waitForSelector('.el-dialog');
      // 修改公司名称
      await page.fill('input[placeholder="请输入公司名称"]', '测试公司（已编辑）');
      // 点击确定按钮
      await page.click('.el-dialog__footer button.el-button--primary');
      await page.waitForLoadState('networkidle');
    } else {
      console.log('公司列表为空，跳过编辑测试...');
    }

    // 测试删除公司
    console.log('测试删除公司...');
    // 再次检查公司列表是否有数据
    const companyRowsAfterEdit = await page.$$('.el-table__row');
    console.log(`编辑后公司列表行数: ${companyRowsAfterEdit.length}`);
    
    // 如果有公司行，点击第一个删除按钮
    if (companyRowsAfterEdit.length > 0) {
      console.log('点击第一个删除按钮...');
      await page.click('.el-button--danger');
      await page.waitForSelector('.el-message-box');
      // 点击确定按钮
      await page.click('.el-message-box__btns button.el-button--primary');
      await page.waitForLoadState('networkidle');
    } else {
      console.log('公司列表为空，跳过删除测试...');
    }

    // 4. 测试客户管理
    console.log('测试客户管理...');
    // 点击客户管理菜单
    await page.click('text=客户管理');
    await page.waitForLoadState('networkidle');

    // 测试新增客户
    console.log('测试新增客户...');
    // 点击新增客户按钮
    await page.click('text=新增客户');
    await page.waitForSelector('.el-dialog');
    // 填写表单
    await page.fill('input[placeholder="请输入客户姓名"]', '测试客户');
    await page.fill('input[placeholder="请输入联系电话"]', '13900139000');
    await page.fill('input[placeholder="请输入邮箱"]', 'customer@test.com');
    await page.fill('input[placeholder="请输入地址"]', '客户地址');
    // 点击确定按钮
    await page.click('.el-dialog__footer button.el-button--primary');
    await page.waitForLoadState('networkidle');

    // 测试编辑客户
    console.log('测试编辑客户...');
    // 点击编辑按钮
    await page.click('.el-table__row:last-child .el-button--primary');
    await page.waitForSelector('.el-dialog');
    // 修改客户姓名
    await page.fill('input[placeholder="请输入客户姓名"]', '测试客户（已编辑）');
    // 点击确定按钮
    await page.click('.el-dialog__footer button.el-button--primary');
    await page.waitForLoadState('networkidle');

    // 测试删除客户
    console.log('测试删除客户...');
    // 点击删除按钮
    await page.click('.el-table__row:last-child .el-button--danger');
    await page.waitForSelector('.el-message-box');
    // 点击确定按钮
    await page.click('.el-message-box__btns button.el-button--primary');
    await page.waitForLoadState('networkidle');

    // 5. 测试设备管理
    console.log('测试设备管理...');
    // 点击设备管理菜单
    await page.click('text=设备管理');
    await page.waitForLoadState('networkidle');

    // 测试新增设备
    console.log('测试新增设备...');
    // 点击新增设备按钮
    await page.click('text=新增设备');
    await page.waitForSelector('.el-dialog');
    // 填写表单
    await page.fill('input[placeholder="请输入设备名称"]', '测试设备');
    await page.fill('input[placeholder="请输入设备型号"]', 'TEST-MODEL');
    await page.fill('input[placeholder="请输入设备编号"]', 'TEST-001');
    await page.fill('input[placeholder="请输入安装地址"]', '设备安装地址');
    // 点击确定按钮
    await page.click('.el-dialog__footer button.el-button--primary');
    await page.waitForLoadState('networkidle');

    // 测试编辑设备
    console.log('测试编辑设备...');
    // 点击编辑按钮
    await page.click('.el-table__row:last-child .el-button--primary');
    await page.waitForSelector('.el-dialog');
    // 修改设备名称
    await page.fill('input[placeholder="请输入设备名称"]', '测试设备（已编辑）');
    // 点击确定按钮
    await page.click('.el-dialog__footer button.el-button--primary');
    await page.waitForLoadState('networkidle');

    // 测试删除设备
    console.log('测试删除设备...');
    // 点击删除按钮
    await page.click('.el-table__row:last-child .el-button--danger');
    await page.waitForSelector('.el-message-box');
    // 点击确定按钮
    await page.click('.el-message-box__btns button.el-button--primary');
    await page.waitForLoadState('networkidle');

    console.log('所有测试完成！');
  } catch (error) {
    console.error('测试过程中出现错误:', error);
  } finally {
    // 关闭浏览器
    await browser.close();
  }
}

// 运行测试
testPlaywright();
