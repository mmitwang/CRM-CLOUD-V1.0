<template>
  <view class="index-container">
    <!-- 顶部用户信息 -->
    <view class="user-info-section">
      <view class="user-avatar">
        <uni-icons type="person" size="48" color="#fff"></uni-icons>
      </view>
      <view class="user-details">
        <text class="user-name">{{ userInfo.name || '管理员' }}</text>
        <text class="user-role">{{ userInfo.role || '系统管理员' }}</text>
      </view>
      <uni-icons type="gear-filled" size="24" color="#fff" class="settings-icon"></uni-icons>
    </view>
    
    <!-- 统计卡片 -->
    <view class="stats-section">
      <view class="stat-card">
        <text class="stat-value">{{ stats.customerCount }}</text>
        <text class="stat-label">客户总数</text>
      </view>
      <view class="stat-card">
        <text class="stat-value">{{ stats.deviceCount }}</text>
        <text class="stat-label">设备总数</text>
      </view>
      <view class="stat-card">
        <text class="stat-value">{{ stats.alertCount }}</text>
        <text class="stat-label">告警数量</text>
      </view>
    </view>
    
    <!-- 快捷操作 -->
    <view class="quick-actions">
      <view class="action-grid">
        <view class="action-item" @click="navigateTo('/pages/customers/index')">
          <view class="action-icon blue">
            <uni-icons type="contact" size="32" color="#fff"></uni-icons>
          </view>
          <text class="action-text">客户管理</text>
        </view>
        <view class="action-item" @click="navigateTo('/pages/devices/index')">
          <view class="action-icon green">
            <uni-icons type="monitor" size="32" color="#fff"></uni-icons>
          </view>
          <text class="action-text">设备管理</text>
        </view>
        <view class="action-item" @click="handleRefresh">
          <view class="action-icon orange">
            <uni-icons type="refresh" size="32" color="#fff"></uni-icons>
          </view>
          <text class="action-text">刷新数据</text>
        </view>
        <view class="action-item" @click="navigateTo('/pages/profile/profile')">
          <view class="action-icon red">
            <uni-icons type="person" size="32" color="#fff"></uni-icons>
          </view>
          <text class="action-text">个人中心</text>
        </view>
      </view>
    </view>
    
    <!-- 最近活动 -->
    <view class="recent-activities">
      <view class="section-header">
        <text class="section-title">最近活动</text>
        <text class="section-more" @click="viewAllActivities">查看全部</text>
      </view>
      <view class="activity-list">
        <view class="activity-item" v-for="(activity, index) in recentActivities" :key="index">
          <view class="activity-icon" :class="getActivityTypeClass(activity.type)">
            <uni-icons :type="getActivityTypeIcon(activity.type)" size="20" color="#fff"></uni-icons>
          </view>
          <view class="activity-content">
            <text class="activity-title">{{ activity.title }}</text>
            <text class="activity-time">{{ activity.time }}</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'

const userInfo = reactive({
  name: '管理员',
  role: '系统管理员'
})

const stats = reactive({
  customerCount: 0,
  deviceCount: 0,
  alertCount: 0
})

const recentActivities = ref([
  {
    title: '添加了新客户 上海电力设备有限公司',
    time: '10分钟前',
    type: 'customer'
  },
  {
    title: '设备 配电柜 A-001 离线',
    time: '30分钟前',
    type: 'alert'
  },
  {
    title: '更新了设备 变压器 B-002 的状态',
    time: '1小时前',
    type: 'device'
  }
])

// 加载统计数据
const loadStats = async () => {
  // 模拟API请求
  await new Promise(resolve => setTimeout(resolve, 500))
  
  // 模拟数据
  stats.customerCount = 128
  stats.deviceCount = 356
  stats.alertCount = 8
}

// 导航到页面
const navigateTo = (url) => {
  uni.navigateTo({
    url: url
  })
}

// 刷新数据
const handleRefresh = async () => {
  uni.showLoading({
    title: '刷新中...'
  })
  
  await loadStats()
  
  uni.hideLoading()
  uni.showToast({
    title: '数据已刷新',
    icon: 'success'
  })
}

// 查看全部活动
const viewAllActivities = () => {
  uni.showToast({
    title: '功能开发中',
    icon: 'none'
  })
}

// 获取活动类型图标
const getActivityTypeIcon = (type) => {
  const iconMap = {
    'customer': 'contact-filled',
    'alert': 'warn-filled',
    'device': 'monitor'
  }
  return iconMap[type] || 'info'
}

// 获取活动类型样式
const getActivityTypeClass = (type) => {
  const classMap = {
    'customer': 'blue',
    'alert': 'red',
    'device': 'green'
  }
  return classMap[type] || 'gray'
}

onMounted(() => {
  loadStats()
})
</script>

<style scoped>
.index-container {
  min-height: 100vh;
  background-color: #f5f7fa;
}

/* 用户信息区域 */
.user-info-section {
  background: linear-gradient(135deg, #409eff 0%, #667eea 100%);
  padding: 32rpx 24rpx;
  display: flex;
  align-items: center;
  border-radius: 0 0 24rpx 24rpx;
  margin-bottom: 24rpx;
}

.user-avatar {
  width: 96rpx;
  height: 96rpx;
  background-color: rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 24rpx;
}

.user-details {
  flex: 1;
}

.user-name {
  font-size: 32rpx;
  font-weight: 600;
  color: #fff;
  display: block;
  margin-bottom: 8rpx;
}

.user-role {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.8);
  display: block;
}

.settings-icon {
  margin-left: 16rpx;
}

/* 统计区域 */
.stats-section {
  display: flex;
  justify-content: space-around;
  padding: 0 24rpx;
  margin-bottom: 32rpx;
}

.stat-card {
  background-color: #fff;
  border-radius: 16rpx;
  padding: 24rpx;
  min-width: 220rpx;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.stat-value {
  font-size: 36rpx;
  font-weight: 600;
  color: #303133;
  display: block;
  margin-bottom: 8rpx;
}

.stat-label {
  font-size: 24rpx;
  color: #606266;
}

/* 快捷操作 */
.quick-actions {
  padding: 0 24rpx;
  margin-bottom: 32rpx;
}

.action-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24rpx;
}

.action-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.action-icon {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12rpx;
}

.action-icon.blue {
  background-color: #409eff;
}

.action-icon.green {
  background-color: #67c23a;
}

.action-icon.orange {
  background-color: #e6a23c;
}

.action-icon.red {
  background-color: #f56c6c;
}

.action-text {
  font-size: 22rpx;
  color: #303133;
  text-align: center;
}

/* 最近活动 */
.recent-activities {
  padding: 0 24rpx;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}

.section-title {
  font-size: 28rpx;
  font-weight: 600;
  color: #303133;
}

.section-more {
  font-size: 24rpx;
  color: #409eff;
}

.activity-list {
  background-color: #fff;
  border-radius: 16rpx;
  padding: 20rpx;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.activity-item {
  display: flex;
  align-items: center;
  padding: 20rpx 0;
  border-bottom: 1px solid #f0f0f0;
}

.activity-item:last-child {
  border-bottom: none;
}

.activity-icon {
  width: 48rpx;
  height: 48rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20rpx;
}

.activity-icon.blue {
  background-color: #409eff;
}

.activity-icon.green {
  background-color: #67c23a;
}

.activity-icon.red {
  background-color: #f56c6c;
}

.activity-icon.gray {
  background-color: #909399;
}

.activity-content {
  flex: 1;
}

.activity-title {
  font-size: 26rpx;
  color: #303133;
  display: block;
  margin-bottom: 8rpx;
}

.activity-time {
  font-size: 22rpx;
  color: #909399;
}

/* 响应式设计 */
@media screen and (max-width: 375px) {
  .stat-card {
    min-width: 180rpx;
    padding: 16rpx;
  }
  
  .stat-value {
    font-size: 32rpx;
  }
  
  .stat-label {
    font-size: 22rpx;
  }
  
  .action-icon {
    width: 72rpx;
    height: 72rpx;
  }
  
  .action-text {
    font-size: 20rpx;
  }
}
</style>
