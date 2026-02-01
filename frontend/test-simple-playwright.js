import { chromium } from 'playwright';

async function testSimplePlaywright() {
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

    // 2. 手动设置用户角色信息到 localStorage 中，确保 isAdmin 计算属性能够正确判断
    await page.evaluate(() => {
      localStorage.setItem('token', 'test-token');
      localStorage.setItem('user', JSON.stringify({
        email: 'admin@default.com',
        companyCode: 'DEFAULT',
        name: '默认管理员',
        role: 'admin'
      }));
    });

    // 3. 直接访问公司管理页面
    console.log('访问公司管理页面...');
    await page.goto('http://localhost:3002/#/companies');
    await page.waitForLoadState('networkidle');

    // 4. 测试新增公司
    console.log('测试新增公司...');
    try {
      // 检查页面状态
      console.log('页面URL:', page.url());
      
      // 检查是否有新增公司按钮
      const addCompanyButtons = await page.$$('button');
      console.log(`页面按钮数量: ${addCompanyButtons.length}`);
      
      // 尝试使用更具体的选择器
      await page.click('.page-header button');
      await page.waitForSelector('.el-dialog');
      console.log('新增公司对话框已打开');
      
      // 填写表单
      await page.fill('input[placeholder="请输入公司名称"]', '测试公司');
      await page.fill('input[placeholder="请输入公司代码"]', 'TEST');
      await page.fill('input[placeholder="请输入联系人"]', '测试联系人');
      await page.fill('input[placeholder="请输入联系电话"]', '13800138000');
      await page.fill('input[placeholder="请输入邮箱"]', 'test@test.com');
      await page.fill('textarea[placeholder="请输入地址"]', '测试地址');
      console.log('表单填写完成');
      
      // 点击取消按钮，关闭对话框
      await page.click('.el-dialog__footer button.el-button--default');
      await page.waitForLoadState('networkidle');
      console.log('新增公司对话框已关闭');
    } catch (error) {
      console.error('测试新增公司时出现错误:', error);
    }

    console.log('测试完成！');
  } catch (error) {
    console.error('测试过程中出现错误:', error);
  } finally {
    // 关闭浏览器
    await browser.close();
  }
}

// 运行测试
testSimplePlaywright();
