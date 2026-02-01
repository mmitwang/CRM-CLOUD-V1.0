import { chromium } from 'playwright';

async function testCRUD() {
  // 启动浏览器
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // 1. 访问登录页面
    await page.goto('http://localhost:3002/');
    await page.waitForLoadState('networkidle');

    // 2. 选择测试账户并登录
    console.log('选择测试账户...');
    await page.click('.test-account-select');
    await page.waitForSelector('.el-select-dropdown__item');
    await page.click('.el-select-dropdown__item:has-text("默认公司 - 管理员")');
    await page.waitForTimeout(1000);

    console.log('点击登录按钮...');
    await page.click('.login-button');
    await page.waitForNavigation({ waitUntil: 'networkidle' });

    // 3. 测试公司管理
    console.log('测试公司管理...');
    await page.click('text=公司管理');
    await page.waitForLoadState('networkidle');

    // 测试新增公司
    console.log('测试新增公司...');
    await page.click('text=新增公司');
    await page.waitForSelector('.el-dialog');
    await page.fill('input[placeholder="请输入公司名称"]', '测试公司');
    await page.fill('input[placeholder="请输入公司代码"]', 'TEST');
    await page.fill('input[placeholder="请输入联系人"]', '测试联系人');
    await page.fill('input[placeholder="请输入联系电话"]', '13800138000');
    await page.fill('input[placeholder="请输入邮箱"]', 'test@test.com');
    await page.fill('textarea[placeholder="请输入地址"]', '测试地址');
    await page.click('text=确定');
    await page.waitForLoadState('networkidle');

    // 测试编辑公司
    console.log('测试编辑公司...');
    await page.click('text=编辑');
    await page.waitForSelector('.el-dialog');
    await page.fill('input[placeholder="请输入公司名称"]', '测试公司（已编辑）');
    await page.click('text=确定');
    await page.waitForLoadState('networkidle');

    // 测试删除公司
    console.log('测试删除公司...');
    await page.click('text=删除');
    await page.waitForSelector('.el-message-box');
    await page.click('text=确定');
    await page.waitForLoadState('networkidle');

    // 4. 测试客户管理
    console.log('测试客户管理...');
    await page.click('text=客户管理');
    await page.waitForLoadState('networkidle');

    // 测试新增客户
    console.log('测试新增客户...');
    await page.click('text=新增客户');
    await page.waitForSelector('.el-dialog');
    await page.fill('input[placeholder="请输入客户姓名"]', '测试客户');
    await page.fill('input[placeholder="请输入联系电话"]', '13900139000');
    await page.fill('input[placeholder="请输入邮箱"]', 'customer@test.com');
    await page.fill('input[placeholder="请输入地址"]', '客户地址');
    await page.click('text=确定');
    await page.waitForLoadState('networkidle');

    // 测试编辑客户
    console.log('测试编辑客户...');
    await page.click('text=编辑');
    await page.waitForSelector('.el-dialog');
    await page.fill('input[placeholder="请输入客户姓名"]', '测试客户（已编辑）');
    await page.click('text=确定');
    await page.waitForLoadState('networkidle');

    // 测试删除客户
    console.log('测试删除客户...');
    await page.click('text=删除');
    await page.waitForSelector('.el-message-box');
    await page.click('text=确定');
    await page.waitForLoadState('networkidle');

    // 5. 测试设备管理
    console.log('测试设备管理...');
    await page.click('text=设备管理');
    await page.waitForLoadState('networkidle');

    // 测试新增设备
    console.log('测试新增设备...');
    await page.click('text=新增设备');
    await page.waitForSelector('.el-dialog');
    await page.fill('input[placeholder="请输入设备名称"]', '测试设备');
    await page.fill('input[placeholder="请输入设备型号"]', 'TEST-MODEL');
    await page.fill('input[placeholder="请输入设备编号"]', 'TEST-001');
    await page.fill('input[placeholder="请输入安装地址"]', '设备安装地址');
    await page.click('text=确定');
    await page.waitForLoadState('networkidle');

    // 测试编辑设备
    console.log('测试编辑设备...');
    await page.click('text=编辑');
    await page.waitForSelector('.el-dialog');
    await page.fill('input[placeholder="请输入设备名称"]', '测试设备（已编辑）');
    await page.click('text=确定');
    await page.waitForLoadState('networkidle');

    // 测试删除设备
    console.log('测试删除设备...');
    await page.click('text=删除');
    await page.waitForSelector('.el-message-box');
    await page.click('text=确定');
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
testCRUD();
