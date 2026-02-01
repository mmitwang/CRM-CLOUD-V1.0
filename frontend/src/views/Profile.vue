<template>
  <div class="page-container">
    <h1 class="page-title">用户信息</h1>
    
    <el-card class="card">
      <div class="profile-container">
        <div class="profile-avatar">
          <el-avatar size="120px" :src="userAvatar">
            {{ user?.username?.charAt(0).toUpperCase() }}
          </el-avatar>
        </div>
        
        <div class="profile-info">
          <h2>{{ user?.username }}</h2>
          <div class="profile-detail">
            <div class="detail-item">
              <span class="detail-label">邮箱：</span>
              <span class="detail-value">{{ user?.email }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">角色：</span>
              <span class="detail-value">{{ user?.role === 'admin' ? '管理员' : '普通用户' }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">登录时间：</span>
              <span class="detail-value">{{ lastLoginTime }}</span>
            </div>
          </div>
          
          <div class="profile-actions">
            <el-button type="primary" @click="handleEditProfile">编辑资料</el-button>
            <el-button type="success" @click="handleChangePassword">修改密码</el-button>
          </div>
        </div>
      </div>
    </el-card>
    
    <!-- 编辑资料对话框 -->
    <el-dialog
      v-model="editDialogVisible"
      title="编辑资料"
      width="500px"
    >
      <el-form
        ref="editFormRef"
        :model="editForm"
        :rules="editRules"
        label-width="80px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editForm.username" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email" placeholder="请输入邮箱" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSaveProfile">保存</el-button>
        </span>
      </template>
    </el-dialog>
    
    <!-- 修改密码对话框 -->
    <el-dialog
      v-model="passwordDialogVisible"
      title="修改密码"
      width="500px"
    >
      <el-form
        ref="passwordFormRef"
        :model="passwordForm"
        :rules="passwordRules"
        label-width="120px"
      >
        <el-form-item label="原密码" prop="oldPassword">
          <el-input
            v-model="passwordForm.oldPassword"
            type="password"
            placeholder="请输入原密码"
            show-password
          />
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input
            v-model="passwordForm.newPassword"
            type="password"
            placeholder="请输入新密码"
            show-password
          />
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input
            v-model="passwordForm.confirmPassword"
            type="password"
            placeholder="请确认新密码"
            show-password
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="passwordDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSavePassword">保存</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import { useUserStore } from '../stores/user';
import { ElMessage, ElMessageBox } from 'element-plus';

const userStore = useUserStore();

// 用户信息
const user = computed(() => userStore.user);
const userAvatar = ref('');
const lastLoginTime = ref('2026-01-27 09:00:00');

// 编辑资料对话框
const editDialogVisible = ref(false);
const editFormRef = ref();
const editForm = reactive({
  username: '',
  email: '',
});
const editRules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' },
  ],
};

// 修改密码对话框
const passwordDialogVisible = ref(false);
const passwordFormRef = ref();
const passwordForm = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: '',
});
const passwordRules = {
  oldPassword: [{ required: true, message: '请输入原密码', trigger: 'blur' }],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, message: '密码长度至少6位', trigger: 'blur' },
  ],
  confirmPassword: [
    { required: true, message: '请确认新密码', trigger: 'blur' },
    {
      validator: (rule: any, value: string, callback: any) => {
        if (value !== passwordForm.newPassword) {
          callback(new Error('两次输入的密码不一致'));
        } else {
          callback();
        }
      },
      trigger: 'blur',
    },
  ],
};

// 初始化用户信息
const initUserInfo = () => {
  if (user.value) {
    editForm.username = user.value.username;
    editForm.email = user.value.email;
  }
};

// 编辑资料
const handleEditProfile = () => {
  initUserInfo();
  editDialogVisible.value = true;
};

// 保存资料
const handleSaveProfile = async () => {
  if (!editFormRef.value) return;
  
  await editFormRef.value.validate(async (valid: boolean) => {
    if (valid) {
      // 模拟保存
      await new Promise(resolve => setTimeout(resolve, 500));
      ElMessage.success('资料修改成功');
      editDialogVisible.value = false;
    }
  });
};

// 修改密码
const handleChangePassword = () => {
  // 重置表单
  Object.assign(passwordForm, {
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  passwordDialogVisible.value = true;
};

// 保存密码
const handleSavePassword = async () => {
  if (!passwordFormRef.value) return;
  
  await passwordFormRef.value.validate(async (valid: boolean) => {
    if (valid) {
      // 模拟保存
      await new Promise(resolve => setTimeout(resolve, 500));
      ElMessage.success('密码修改成功');
      passwordDialogVisible.value = false;
    }
  });
};

onMounted(() => {
  initUserInfo();
});
</script>

<style scoped>
.profile-container {
  display: flex;
  padding: 20px;
}

.profile-avatar {
  margin-right: 40px;
}

.profile-info {
  flex: 1;
}

.profile-info h2 {
  margin-bottom: 20px;
  font-size: 24px;
  font-weight: 600;
}

.profile-detail {
  margin-bottom: 30px;
}

.detail-item {
  margin-bottom: 10px;
  font-size: 16px;
}

.detail-label {
  font-weight: 500;
  color: #606266;
  margin-right: 10px;
}

.detail-value {
  color: #303133;
}

.profile-actions {
  display: flex;
  gap: 10px;
}

@media screen and (max-width: 768px) {
  .profile-container {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  
  .profile-avatar {
    margin-right: 0;
    margin-bottom: 20px;
  }
  
  .profile-actions {
    justify-content: center;
  }
}
</style>