<template>
  <view class="index-page">
    <!--  顶部导航栏  -->
    <uni-nav-bar
      title="首页"
      class="nav-bar"
      :fixed="true"
      :status-bar="true"
    >
      <template #right>
        <uni-icons type="scan" size="24" color="#fff" @click="scanCode"></uni-icons>
      </template>
    </uni-nav-bar>
    
    <!--  页面内容  -->
    <view class="page-content">
      <!--  用户信息卡片  -->
      <view class="user-card">
        <view class="user-info">
          <uni-avatar :size="60" :src="userAvatar" class="user-avatar">
            {{ username.charAt(0).toUpperCase() }}
          </uni-avatar>
          <view class="user-details">
            <text class="user-name">{{ username }}</text>
            <text class="user-role">{{ roleText }}</text>
          </view>
        </view>
        <uni-icons type="chevron-right" size="20" color="#fff"></uni-icons>
      </view>
      
      <!--  数据概览  -->
      <view class="stats-section">
        <text class="section-title">数据概览</text>
        <view class="stats-grid">
          <view class="stat-item" @click="navigateToCustomers">
            <uni-icons type="person" size="32" color="#1890ff" class="stat-icon"></uni-icons>
            <text class="stat-value">{{ customerCount }}</text>
            <text class="stat-label">客户总数</text>
          </view>
          <view class="stat-item" @click="navigateToDevices">
            <uni-icons type="electrical" size="32" color="#52c41a" class="stat-icon"></uni-icons>
            <text class="stat-value">{{ deviceCount }}</text>
            <text class="stat-label">设备总数</text>
          </view>
          <view class="stat-item" @click="navigateToAlerts">
            <uni-icons type="warning" size="32" color="#faad14" class="stat-icon"></uni-icons>
            <text class="stat-value">{{ alertCount }}</text>
            <text class="stat-label">异常告警</text>
          </view>
          <view class="stat-item" @click="navigateToTasks">
            <uni-icons type="todo-list" size="32" color="#ff4d4f" class="stat-icon"></uni-icons>
            <text class="stat-value">{{ taskCount }}</text>
            <text class="stat-label">待办任务</text>
          </view>
        </view>
      </view>
      
      <!--  快捷操作  -->
      <view class="quick-actions">
        <text class="section-title">快捷操作</text>
        <view class="actions-grid">
          <view class="action-item" @click="addCustomer">
            <view class="action-icon bg-blue">
              <uni-icons type="add-person" size="24" color="#fff"></uni-icons>
            </view>
            <text class="action-label">添加客户</text>
          </view>
          <view class="action-item" @click="addDevice">
            <view class="action-icon bg-green">
              <uni-icons type="add" size="24" color="#fff"></uni-icons>
            </view>
            <text class="action-label">添加设备</text>
          </view>
          <view class="action-item" @click="scanDevice">
            <view class="action-icon bg-yellow">
              <uni-icons type="scan" size="24" color="#fff"></uni-icons>
            </view>
            <text class="action-label">扫码添加</text>
          </view>
          <view class="action-item" @click="takePhoto">
            <view class="action-icon bg-red">
              <uni-icons type="camera" size="24" color="#fff"></uni-icons>
            </view>
            <text class="action-label">拍照上传</text>
          </view>
        </view>
      </view>
      
      <!--  最近活动  -->
      <view class="recent-activities">
        <view class="section-header">
          <text class="section-title">最近活动</text>
          <text class="view-more" @click="navigateToActivities">查看更多</text>
        </view>
        <uni-list>
          <uni-list-item
            v-for="(activity, index) in recentActivities"
            :key="index"
            :title="activity.title"
            :note="activity.time"
            :thumb="activity.icon"
            show-arrow
            @click="navigateToActivityDetail(activity.id)"
          />
        </uni-list>
      </view>
      
      <!--  设备状态  -->
      <view class="device-status">
        <view class="section-header">
          <text class="section-title">设备状态</text>
          <text class="view-more" @click="navigateToDeviceStatus">查看更多</text>
        </view>
        <uni-list>
          <uni-list-item
            v-for="(device, index) in deviceStatusList"
            :key="index"
            :title="device.name"
            :note="device.location"
            show-arrow
            @click="navigateToDeviceDetail(device.id)"
          >
            <template #footer>
              <uni-badge :type="device.status === 'online' ? 'success' : 'error'" class="status-badge">
                {{ device.status === 'online' ? '在线' : '离线' }}
              </uni-badge>
            </template>
          </uni-list-item>
        </uni-list>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useUserStore } from '../../stores/user'

const userStore = useUserStore()

// 用户信息
const username = computed(() => userStore.username)
const role = computed(() => userStore.role)
const userAvatar = ref('')

// 角色文本
const roleText = computed(() => {
  const roleMap = {
    'admin': '管理员',
    'user': '普通用户',
    'engineer': '工程师'
  }
  return roleMap[role.value] || '用户'
})

// 统计数据
const customerCount = ref(128)
const deviceCount = ref(356)
const alertCount = ref(5)
const taskCount = ref(12)

// 最近活动
const recentActivities = ref([
  {
    id: 1,
    title: '新客户添加',
    time: '2026-01-27 10:30',
    icon: 'person'
  },
  {
    id: 2,
    title: '设备故障告警',
    time: '2026-01-27 09:15',
    icon: 'warning'
  },
  {
    id: 3,
    title: '任务完成',
    time: '2026-01-26 16:45',
    icon: 'checkmark'
  }
])

// 设备状态
const deviceStatusList = ref([
  {
    id: 1,
    name: '配电柜 A-001',
    location: '一号厂房',
    status: 'online'
  },
  {
    id: 2,
    name: '变压器 B-002',
    location: '二号厂房',
    status: 'offline'
  },
  {
    id: 3,
    name: '发电机 C-003',
    location: '发电房',
    status: 'online'
  }
])

// 导航方法
const navigateToCustomers = () => {
  uni.navigateTo({
    url: '/pages/customers/list/list'
  })
}

const navigateToDevices = () => {
  uni.navigateTo({
    url: '/pages/devices/map/map'
  })
}

const navigateToAlerts = () => {
  uni.showToast({
    title: '功能开发中',
    icon: 'none'
  })
}

const navigateToTasks = () => {
  uni.showToast({
    title: '功能开发中',
    icon: 'none'
  })
}

const navigateToActivities = () => {
  uni.showToast({
    title: '功能开发中',
    icon: 'none'
  })
}

const navigateToDeviceStatus = () => {
  uni.showToast({
    title: '功能开发中',
    icon: 'none'
  })
}

const navigateToActivityDetail = (id) => {
  uni.showToast({
    title: '功能开发中',
    icon: 'none'
  })
}

const navigateToDeviceDetail = (id) => {
  uni.showToast({
    title: '功能开发中',
    icon: 'none'
  })
}

// 快捷操作
const addCustomer = () => {
  uni.showToast({
    title: '功能开发中',
    icon: 'none'
  })
}

const addDevice = () => {
  uni.showToast({
    title: '功能开发中',
    icon: 'none'
  })
}

const scanCode = () => {
  // 调用扫码API
  uni.scanCode({
    success: (res) => {
      console.log('扫码结果:', res)
      uni.showToast({
        title: '扫码成功',
        icon: 'success'
      })
    },
    fail: (error) => {
      console.error('扫码失败:', error)
      uni.showToast({
        title: '扫码失败',
        icon: 'none'
      })
    }
  })
}

const scanDevice = () => {
  scanCode()
}

const takePhoto = () => {
  // 调用拍照API
  uni.chooseImage({
    count: 1,
    sizeType: ['original', 'compressed'],
    sourceType: ['camera'],
    success: (res) => {
      console.log('拍照结果:', res)
      uni.showToast({
        title: '拍照成功',
        icon: 'success'
      })
    },
    fail: (error) => {
      console.error('拍照失败:', error)
      uni.showToast({
        title: '拍照失败',
        icon: 'none'
      })
    }
  })
}

// 初始化
onMounted(async () => {
  // 初始化用户信息
  await userStore.initUserInfo()
  
  // 模拟加载数据
  setTimeout(() => {
    // 这里可以添加实际的数据加载逻辑
  }, 500)
})
</script>

<style scoped>
.index-page {
  min-height: 100vh;
  background-color: #f5f7fa;
}

.page-content {
  padding-top: 88px; /* 导航栏高度 + 状态栏高度 */
}

/* 用户卡片 */
.user-card {
  background: linear-gradient(135deg, #1890ff 0%, #096dd9 100%);
  margin: 16px;
  padding: 20px;
  border-radius: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #fff;
  box-shadow: 0 4px 12px rgba(24, 144, 255, 0.3);
}

.user-info {
  display: flex;
  align-items: center;
  gap: 16px;
}

.user-avatar {
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.user-details {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.user-name {
  font-size: 18px;
  font-weight: 600;
}

.user-role {
  font-size: 14px;
  opacity: 0.8;
}

/* 数据概览 */
.stats-section {
  margin: 16px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 16px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.stat-item {
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s;
}

.stat-item:active {
  transform: scale(0.95);
}

.stat-icon {
  margin-bottom: 12px;
}

.stat-value {
  display: block;
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 14px;
  color: #666;
}

/* 快捷操作 */
.quick-actions {
  margin: 16px;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.action-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.action-icon {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.bg-blue {
  background-color: #1890ff;
}

.bg-green {
  background-color: #52c41a;
}

.bg-yellow {
  background-color: #faad14;
}

.bg-red {
  background-color: #ff4d4f;
}

.action-label {
  font-size: 12px;
  color: #666;
  text-align: center;
}

/* 最近活动和设备状态 */
.recent-activities,
.device-status {
  margin: 16px;
  margin-top: 24px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.view-more {
  font-size: 14px;
  color: #1890ff;
}

.status-badge {
  font-size: 12px;
}

/* 响应式设计 */
@media screen and (max-width: 375px) {
  .user-card {
    padding: 16px;
  }
  
  .stats-grid {
    gap: 10px;
  }
  
  .stat-item {
    padding: 16px;
  }
  
  .stat-icon {
    font-size: 28px;
  }
  
  .stat-value {
    font-size: 20px;
  }
  
  .actions-grid {
    gap: 12px;
  }
  
  .action-icon {
    width: 48px;
    height: 48px;
  }
}
</style>
