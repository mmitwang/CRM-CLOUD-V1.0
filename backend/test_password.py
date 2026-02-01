from app.utils.security import verify_password, get_password_hash

# 测试密码验证函数
print("测试密码验证函数...")

# 生成密码哈希
hashed_password = get_password_hash("123456")
print(f"密码哈希: {hashed_password}")

# 验证正确密码
result1 = verify_password("123456", hashed_password)
print(f"验证正确密码: {result1}")

# 验证错误密码
result2 = verify_password("wrong_password", hashed_password)
print(f"验证错误密码: {result2}")

print("密码验证测试完成")
