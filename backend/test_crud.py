import requests
import json

# 测试配置
BASE_URL = "http://127.0.0.1:8000/api/v1"
LOGIN_URL = f"{BASE_URL}/auth/login"
COMPANIES_URL = f"{BASE_URL}/companies"
CUSTOMERS_URL = f"{BASE_URL}/customers"
DEVICES_URL = f"{BASE_URL}/devices"

# 测试账号
TEST_ACCOUNTS = {
    "default_admin": {
        "username": "admin@default.com@DEFAULT",
        "password": "123456"
    },
    "test1_admin": {
        "username": "admin@test1.com@TEST1",
        "password": "123456"
    },
    "test2_admin": {
        "username": "admin@test2.com@TEST2",
        "password": "123456"
    }
}

# 辅助函数：登录并获取token
def login(username, password):
    """登录并获取访问令牌"""
    response = requests.post(LOGIN_URL, data={"username": username, "password": password})
    if response.status_code == 200:
        return response.json()["access_token"]
    else:
        print(f"登录失败: {response.status_code} - {response.text}")
        return None

# 测试公司管理的增删改查
def test_company_crud():
    """测试公司管理的增删改查功能"""
    print("\n=== 测试公司管理增删改查 ===")
    
    # 使用默认公司管理员登录
    token = login(TEST_ACCOUNTS["default_admin"]["username"], TEST_ACCOUNTS["default_admin"]["password"])
    if not token:
        return False
    
    headers = {"Authorization": f"Bearer {token}"}
    
    # 1. 测试获取公司列表
    print("1. 测试获取公司列表...")
    response = requests.get(COMPANIES_URL, headers=headers)
    if response.status_code == 200:
        companies = response.json()
        print(f"   成功获取 {len(companies)} 个公司")
    else:
        print(f"   失败: {response.status_code} - {response.text}")
        return False
    
    # 2. 测试添加新公司
    print("2. 测试添加新公司...")
    new_company_data = {
        "name": "测试公司3",
        "code": "TEST3",
        "contact_person": "测试管理员3",
        "phone": "13800138003",
        "email": "admin@test3.com",
        "address": "成都市锦江区"
    }
    response = requests.post(COMPANIES_URL, json=new_company_data, headers=headers)
    if response.status_code == 201:
        new_company = response.json()
        print(f"   成功添加公司: {new_company['name']} (ID: {new_company['id']})")
        test_company_id = new_company['id']
    else:
        print(f"   失败: {response.status_code} - {response.text}")
        return False
    
    # 3. 测试更新公司信息
    print("3. 测试更新公司信息...")
    update_data = {
        "name": "测试公司3 (更新)",
        "address": "成都市青羊区"
    }
    response = requests.put(f"{COMPANIES_URL}/{test_company_id}", json=update_data, headers=headers)
    if response.status_code == 200:
        updated_company = response.json()
        print(f"   成功更新公司: {updated_company['name']}")
    else:
        print(f"   失败: {response.status_code} - {response.text}")
        return False
    
    # 4. 测试删除公司
    print("4. 测试删除公司...")
    response = requests.delete(f"{COMPANIES_URL}/{test_company_id}", headers=headers)
    if response.status_code == 204:
        print("   成功删除公司")
    else:
        print(f"   失败: {response.status_code} - {response.text}")
        return False
    
    print("公司管理增删改查测试通过！")
    return True

# 测试客户管理的增删改查
def test_customer_crud():
    """测试客户管理的增删改查功能"""
    print("\n=== 测试客户管理增删改查 ===")
    
    # 使用默认公司管理员登录
    token = login(TEST_ACCOUNTS["default_admin"]["username"], TEST_ACCOUNTS["default_admin"]["password"])
    if not token:
        return False
    
    headers = {"Authorization": f"Bearer {token}"}
    
    # 1. 测试获取客户列表
    print("1. 测试获取客户列表...")
    response = requests.get(CUSTOMERS_URL, headers=headers)
    if response.status_code == 200:
        customers = response.json()
        print(f"   成功获取 {len(customers)} 个客户")
    else:
        print(f"   失败: {response.status_code} - {response.text}")
        return False
    
    # 2. 测试添加新客户
    print("2. 测试添加新客户...")
    new_customer_data = {
        "name": "测试客户有限公司",
        "contact_person": "测试联系人",
        "phone": "13900139009",
        "email": "test@customer.com",
        "address": "北京市朝阳区"
    }
    response = requests.post(CUSTOMERS_URL, json=new_customer_data, headers=headers)
    if response.status_code == 201:
        new_customer = response.json()
        print(f"   成功添加客户: {new_customer['name']} (ID: {new_customer['id']})")
        test_customer_id = new_customer['id']
    else:
        print(f"   失败: {response.status_code} - {response.text}")
        return False
    
    # 3. 测试更新客户信息
    print("3. 测试更新客户信息...")
    update_data = {
        "name": "测试客户有限公司 (更新)",
        "address": "北京市海淀区"
    }
    response = requests.put(f"{CUSTOMERS_URL}/{test_customer_id}", json=update_data, headers=headers)
    if response.status_code == 200:
        updated_customer = response.json()
        print(f"   成功更新客户: {updated_customer['name']}")
    else:
        print(f"   失败: {response.status_code} - {response.text}")
        return False
    
    # 4. 测试删除客户
    print("4. 测试删除客户...")
    response = requests.delete(f"{CUSTOMERS_URL}/{test_customer_id}", headers=headers)
    if response.status_code == 204:
        print("   成功删除客户")
    else:
        print(f"   失败: {response.status_code} - {response.text}")
        return False
    
    print("客户管理增删改查测试通过！")
    return True

# 测试设备管理的增删改查
def test_device_crud():
    """测试设备管理的增删改查功能"""
    print("\n=== 测试设备管理增删改查 ===")
    
    # 使用默认公司管理员登录
    token = login(TEST_ACCOUNTS["default_admin"]["username"], TEST_ACCOUNTS["default_admin"]["password"])
    if not token:
        return False
    
    headers = {"Authorization": f"Bearer {token}"}
    
    # 先获取一个客户ID，用于创建设备
    print("0. 获取客户ID...")
    response = requests.get(CUSTOMERS_URL, headers=headers)
    if response.status_code == 200:
        customers = response.json()
        if len(customers) > 0:
            customer_id = customers[0]['id']
            print(f"   成功获取客户ID: {customer_id}")
        else:
            print("   没有找到客户，无法创建设备")
            return False
    else:
        print(f"   失败: {response.status_code} - {response.text}")
        return False
    
    # 1. 测试获取设备列表
    print("1. 测试获取设备列表...")
    response = requests.get(DEVICES_URL, headers=headers)
    if response.status_code == 200:
        devices = response.json()
        print(f"   成功获取 {len(devices)} 个设备")
    else:
        print(f"   失败: {response.status_code} - {response.text}")
        return False
    
    # 2. 测试添加新设备
    print("2. 测试添加新设备...")
    new_device_data = {
        "serial_number": "TEST-DEV-001",
        "name": "测试设备",
        "model": "测试型号",
        "status": "online",
        "customer_id": customer_id,
        "location": "测试位置"
    }
    response = requests.post(DEVICES_URL, json=new_device_data, headers=headers)
    if response.status_code == 201:
        new_device = response.json()
        print(f"   成功添加设备: {new_device['name']} (ID: {new_device['id']})")
        test_device_id = new_device['id']
    else:
        print(f"   失败: {response.status_code} - {response.text}")
        return False
    
    # 3. 测试更新设备信息
    print("3. 测试更新设备信息...")
    update_data = {
        "name": "测试设备 (更新)",
        "status": "offline"
    }
    response = requests.put(f"{DEVICES_URL}/{test_device_id}", json=update_data, headers=headers)
    if response.status_code == 200:
        updated_device = response.json()
        print(f"   成功更新设备: {updated_device['name']}, 状态: {updated_device['status']}")
    else:
        print(f"   失败: {response.status_code} - {response.text}")
        return False
    
    # 4. 测试删除设备
    print("4. 测试删除设备...")
    response = requests.delete(f"{DEVICES_URL}/{test_device_id}", headers=headers)
    if response.status_code == 204:
        print("   成功删除设备")
    else:
        print(f"   失败: {response.status_code} - {response.text}")
        return False
    
    print("设备管理增删改查测试通过！")
    return True

# 测试数据隔离
def test_data_isolation():
    """测试数据隔离功能"""
    print("\n=== 测试数据隔离 ===")
    
    # 使用默认公司管理员登录
    token_default = login(TEST_ACCOUNTS["default_admin"]["username"], TEST_ACCOUNTS["default_admin"]["password"])
    if not token_default:
        return False
    
    # 使用测试公司1管理员登录
    token_test1 = login(TEST_ACCOUNTS["test1_admin"]["username"], TEST_ACCOUNTS["test1_admin"]["password"])
    if not token_test1:
        return False
    
    headers_default = {"Authorization": f"Bearer {token_default}"}
    headers_test1 = {"Authorization": f"Bearer {token_test1}"}
    
    # 获取默认公司的客户数量
    response = requests.get(CUSTOMERS_URL, headers=headers_default)
    if response.status_code == 200:
        default_customers = response.json()
        print(f"默认公司客户数量: {len(default_customers)}")
    else:
        print(f"获取默认公司客户失败: {response.status_code} - {response.text}")
        return False
    
    # 获取测试公司1的客户数量
    response = requests.get(CUSTOMERS_URL, headers=headers_test1)
    if response.status_code == 200:
        test1_customers = response.json()
        print(f"测试公司1客户数量: {len(test1_customers)}")
    else:
        print(f"获取测试公司1客户失败: {response.status_code} - {response.text}")
        return False
    
    # 验证数据隔离
    if len(default_customers) != len(test1_customers):
        print("数据隔离测试通过！不同公司看到不同的客户数据")
        return True
    else:
        print("数据隔离测试失败！不同公司看到相同的客户数据")
        return False

# 主测试函数
def main():
    """运行所有测试"""
    print("开始自动测试增删改查功能...")
    
    # 运行测试
    tests = [
        ("公司管理", test_company_crud),
        ("客户管理", test_customer_crud),
        ("设备管理", test_device_crud),
        ("数据隔离", test_data_isolation)
    ]
    
    passed = 0
    failed = 0
    
    for test_name, test_func in tests:
        print(f"\n=== 开始测试 {test_name} ===")
        if test_func():
            passed += 1
        else:
            failed += 1
    
    # 打印测试结果
    print("\n=== 测试结果 ===")
    print(f"通过: {passed}")
    print(f"失败: {failed}")
    print(f"总测试数: {passed + failed}")
    
    if failed == 0:
        print("所有测试通过！")
    else:
        print(f"有 {failed} 个测试失败！")

if __name__ == "__main__":
    main()
