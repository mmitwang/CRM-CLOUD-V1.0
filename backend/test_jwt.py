from app.utils.security import create_access_token, verify_token
from datetime import timedelta

# 测试JWT令牌的生成和验证
print("测试JWT令牌生成和验证...")

# 生成测试令牌
test_data = {"sub": "admin@default.com", "company_id": 1}
token = create_access_token(test_data, expires_delta=timedelta(minutes=30))
print(f"生成的令牌: {token}")

# 验证令牌
payload = verify_token(token)
print(f"验证结果: {payload}")

if payload:
    print(f"令牌有效，包含数据: {payload}")
else:
    print("令牌无效")

print("JWT测试完成")
