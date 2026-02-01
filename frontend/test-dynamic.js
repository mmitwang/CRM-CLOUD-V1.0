import { chromium } from 'playwright';

async function testDynamic() {
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
    // 启用网络请求监听
    page.on('request', request => {
      console.log(`[Request] ${request.method()} ${request.url()}`);
    });
    
    page.on('response', async response => {
      console.log(`[Response] ${response.status()} ${response.url()}`);
      // 如果是登录请求，打印响应内容
      if (response.url().includes('/api/v1/auth/login')) {
        try {
          const responseBody = await response.json();
          console.log('[Login Response]', responseBody);
        } catch (e) {
          console.log('[Login Response] 无法解析响应内容');
        }
      }
      // 如果是获取用户信息请求，打印响应内容
      if (response.url().includes('/api/v1/auth/me')) {
        try {
          const responseBody = await response.json();
          console.log('[User Info Response]', responseBody);
        } catch (e) {
          console.log('[User Info Response] 无法解析响应内容');
        }
      }
    });

    // 1. 访问登录页面
    console.log('访问登录页面...');
    await page.goto('http://localhost:3002/');
    await page.waitForLoadState('networkidle');

    // 2. 选择测试账户
    console.log('选择测试账户...');
    try {
      // 点击测试账户选择框
      await page.click('.test-account-select', { timeout: 10000 });
      // 等待下拉框出现
      await page.waitForSelector('.el-select-dropdown__item', { timeout: 10000 });
      // 选择默认公司 - 管理员
      const dropdownItems = await page.$$('.el-select-dropdown__item');
      if (dropdownItems.length > 1) {
        await dropdownItems[1].click(); // 选择第一个测试账户
        console.log('测试账户已选择');
      } else {
        console.log('没有找到测试账户选项');
      }
    } catch (error) {
      console.error('选择测试账户时出现错误:', error);
      // 尝试直接填写登录表单
      console.log('尝试直接填写登录表单...');
      await page.fill('input[placeholder="请输入登录账号（格式：email@company_code）"]', 'admin@default.com@DEFAULT');
      await page.fill('input[placeholder="请输入密码"]', '123456');
    }

    // 3. 点击登录按钮
    console.log('点击登录按钮...');
    await page.click('.login-button', { timeout: 10000 });

    // 4. 等待登录结果
    console.log('等待登录结果...');
    try {
      // 等待登录成功并跳转到仪表盘
      await page.waitForNavigation({ waitUntil: 'networkidle', timeout: 15000 });
      console.log('登录成功，已跳转到仪表盘页面');
    } catch (error) {
      // 检查是否有错误提示
      console.log('登录可能失败，检查错误提示...');
      try {
        const errorMessage = await page.textContent('.el-message__content');
        if (errorMessage) {
          console.error('登录错误:', errorMessage);
        } else {
          console.error('登录超时，可能是网络问题或页面无响应');
        }
      } catch (e) {
        console.error('无法获取错误信息:', e);
      }
    }

    // 5. 检查当前页面
    console.log('当前页面URL:', page.url());
    
    // 检查页面内容
    console.log('检查页面内容...');
    const pageTitle = await page.title();
    console.log('页面标题:', pageTitle);
    
    // 检查是否有登录表单
    const loginForm = await page.$('form');
    console.log(`是否有登录表单: ${loginForm ? '是' : '否'}`);
    
    // 检查是否有仪表盘内容
    const hasDashboardContent = await page.evaluate(() => {
      return document.body.textContent.includes('仪表盘');
    });
    console.log(`页面是否包含"仪表盘": ${hasDashboardContent}`);

    // 6. 检查本地存储
    console.log('检查本地存储...');
    const localStorageData = await page.evaluate(() => {
      return {
        token: localStorage.getItem('token'),
        user: JSON.parse(localStorage.getItem('user') || 'null')
      };
    });
    console.log('本地存储中的token:', localStorageData.token ? '存在' : '不存在');
    console.log('本地存储中的用户信息:', localStorageData.user);

    // 7. 尝试使用前端路由导航
    console.log('尝试使用前端路由导航到公司管理页面...');
    try {
      await page.evaluate(() => {
        // 尝试使用Vue Router导航
        if (window.$router) {
          window.$router.push('/companies');
        } else {
          console.log('未找到Vue Router实例');
        }
      });
      await page.waitForLoadState('networkidle', { timeout: 15000 });
      console.log('使用前端路由导航后，当前URL:', page.url());
    } catch (error) {
      console.error('使用前端路由导航时出现错误:', error);
    }

    // 8. 尝试直接访问公司管理页面（不使用哈希路由）
    console.log('尝试直接访问公司管理页面（不使用哈希路由）...');
    try {
      await page.goto('http://localhost:3002/companies');
      await page.waitForLoadState('networkidle', { timeout: 15000 });
      console.log('已访问公司管理页面，当前URL:', page.url());

      // 检查页面内容
      console.log('检查公司管理页面内容...');
      const pageContent = await page.content();
      
      // 检查是否有公司管理相关的内容
      const hasCompaniesText = pageContent.includes('公司管理');
      console.log(`页面是否包含"公司管理": ${hasCompaniesText}`);
      
      // 检查是否有新增按钮
      const hasAddButton = pageContent.includes('新增公司');
      console.log(`页面是否包含"新增公司": ${hasAddButton}`);

      // 9. 检查新增公司按钮是否可用
      if (hasAddButton) {
        console.log('检查新增公司按钮是否可用...');
        try {
          // 尝试使用不同的选择器
          const addButtons = await page.$$('button');
          console.log(`页面按钮数量: ${addButtons.length}`);
          
          // 遍历按钮，寻找新增公司按钮
          for (let i = 0; i < addButtons.length; i++) {
            const buttonText = await addButtons[i].textContent();
            console.log(`按钮 ${i} 文本: ${buttonText}`);
          }
          
          // 尝试使用更具体的选择器
          const addButton = await page.$('text=新增公司');
          if (addButton) {
            const isDisabled = await addButton.evaluate(button => button.disabled);
            console.log(`新增公司按钮状态: ${isDisabled ? '禁用' : '可用'}`);
            
            if (!isDisabled) {
              console.log('测试新增公司功能...');
              await addButton.click();
              await page.waitForSelector('.el-dialog', { timeout: 10000 });
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
            }
          } else {
            console.log('未找到新增公司按钮');
          }
        } catch (error) {
          console.error('检查新增公司按钮时出现错误:', error);
        }
      }
    } catch (error) {
      console.error('访问公司管理页面时出现错误:', error);
    }

    console.log('动态测试完成！');
  } catch (error) {
    console.error('测试过程中出现错误:', error);
  } finally {
    // 关闭浏览器
    await browser.close();
  }
}

// 运行测试
testDynamic();
