<template>
  <view class="customer-detail-page">
    <!--  顶部导航栏  -->
    <uni-nav-bar
      title="客户详情"
      class="nav-bar"
      :fixed="true"
      :status-bar="true"
    >
      <template #right>
        <uni-icons type="edit" size="24" color="#fff" @click="editCustomer"></uni-icons>
      </template>
    </uni-nav-bar>
    
    <!--  页面内容  -->
    <view class="page-content">
      <!--  加载状态  -->
      <view v-if="loading" class="loading-state">
        <uni-icons type="loading" size="48" color="#1890ff" class="loading-icon"></uni-icons>
        <text class="loading-text">加载中...</text>
      </view>
      
      <!--  客户详情  -->
      <view v-else-if="customer" class="customer-detail">
        <!--  基本信息卡片  -->
        <uni-card class="info-card">
          <template #title>
            <view class="card-header">
              <text class="card-title">基本信息</text>
              <uni-badge :type="customer.status === 'active' ? 'success' : 'default'" class="status-badge">
                {{ customer.status === 'active' ? '活跃' : '非活跃' }}
              </uni-badge>
            </view>
          </template>
          <view class="info-grid">
            <view class="info-item">
              <text class="info-label">客户名称</text>
              <text class="info-value">{{ customer.name }}</text>
            </view>
            <view class="info-item">
              <text class="info-label">所属行业</text>
              <text class="info-value">{{ customer.industry }}</text>
            </view>
            <view class="info-item">
              <text class="info-label">联系人</text>
              <text class="info-value">{{ customer.contactPerson }}</text>
            </view>
            <view class="info-item">
              <text class="info-label">联系电话</text>
              <text class="info-value">{{ customer.phone }}</text>
            </view>
            <view class="info-item">
              <text class="info-label">电子邮箱</text>
              <text class="info-value">{{ customer.email || '未设置' }}</text>
            </view>
            <view class="info-item">
              <text class="info-label">地址</text>
              <text class="info-value">{{ customer.address }}</text>
            </view>
            <view class="info-item">
              <text class="info-label">创建时间</text>
              <text class="info-value">{{ customer.createdAt }}</text>
            </view>
            <view class="info-item">
              <text class="info-label">最后更新</text>
              <text class="info-value">{{ customer.updatedAt }}</text>
            </view>
          </view>
        </uni-card>
        
        <!--  设备列表  -->
        <uni-card class="devices-card">
          <template #title>
            <view class="card-header">
              <text class="card-title">关联设备</text>
              <text class="device-count">({{ customer.devices.length }}台)</text>
            </view>
          </template>
          <uni-list>
            <uni-list-item
              v-for="device in customer.devices"
              :key="device.id"
              :title="device.name"
              :note="device.model + ' ' + device.location"
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
          <view v-if="customer.devices.length === 0" class="empty-devices">
            <text class="empty-text">暂无关联设备</text>
          </view>
        </uni-card>
        
        <!--  历史记录  -->
        <uni-card class="history-card">
          <template #title>
            <view class="card-header">
              <text class="card-title">历史记录</text>
              <text class="view-more" @click="viewAllHistory">查看全部</text>
            </view>
          </template>
          <uni-list>
            <uni-list-item
              v-for="record in customer.history"
              :key="record.id"
              :title="record.title"
              :note="record.time"
              show-arrow
              @click="viewHistoryDetail(record.id)"
            />
          </uni-list>
          <view v-if="customer.history.length === 0" class="empty-history">
            <text class="empty-text">暂无历史记录</text>
          </view>
        </uni-card>
        
        <!--  操作按钮  -->
        <view class="action-buttons">
          <uni-button type="default" @click="callCustomer" class="action-button">
            <uni-icons type="phone" size="20" color="#666" class="button-icon"></uni-icons>
            拨打电话
          </uni-button>
          <uni-button type="primary" @click="addDevice" class="action-button">
            <uni-icons type="plus" size="20" color="#fff" class="button-icon"></uni-icons>
            添加设备
          </uni-button>
        </view>
      </view>
      
      <!--  错误状态  -->
      <view v-else class="error-state">
        <uni-icons type="error" size="64" color="#ff4d4f"></uni-icons>
        <text class="error-text">加载失败</text>
        <uni-button type="primary" size="small" @click="loadCustomerDetail" class="retry-button">
          重试
        </uni-button>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// 状态
const loading = ref(true)
const customer = ref(null)

// 获取路由参数
const getCustomerId = () => {
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1]
  return currentPage.options.id
}

// 加载客户详情
const loadCustomerDetail = async () => {
  loading.value = true
  
  try {
    // 模拟API请求
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // 模拟客户数据
    customer.value = {
      id: parseInt(getCustomerId()),
      name: '上海电力设备有限公司',
      industry: '制造业',
      contactPerson: '张三',
      phone: '13800138001',
      email: 'zhangsan@example.com',
      address: '上海市浦东新区张江高科技园区',
      status: 'active',
      createdAt: '2026-01-01 10:00:00',
      updatedAt: '2026-01-20 14:30:00',
      devices: [
        {
          id: 1,
          name: '配电柜 A-001',
          model: 'PD-2000',
          location: '一号厂房',
          status: 'online'
        },
        {
          id: 2,
          name: '变压器 B-002',
          model: 'TB-1000',
          location: '二号厂房',
          status: 'offline'
        }
      ],
      history: [
        {
          id: 1,
          title: '添加设备',
          time: '2026-01-20 14:30:00'
        },
        {
          id: 2,
          title: '更新联系信息',
          time: '2026-01-15 09:15:00'
        },
        {
          id: 3,
          title: '创建客户',
          time: '2026-01-01 10:00:00'
        }
      ]
    }
  } catch (error) {
    console.error('加载客户详情失败:', error)
    customer.value = null
  } finally {
    loading.value = false
  }
}

// 编辑客户
const editCustomer = () => {
  uni.showToast({
    title: '功能开发中',
    icon: 'none'
  })
}

// 拨打电话
const callCustomer = () => {
  if (customer.value?.phone) {
    uni.makePhoneCall({
      phoneNumber: customer.value.phone,
      success: () => {
        console.log('拨打电话成功')
      },
      fail: (error) => {
        console.error('拨打电话失败:', error)
      }
    })
  }
}

// 添加设备
const addDevice = () => {
  uni.showToast({
    title: '功能开发中',
    icon: 'none'
  })
}

// 导航到设备详情
const navigateToDeviceDetail = (id) => {
  uni.showToast({
    title: '功能开发中',
    icon: 'none'
  })
}

// 查看全部历史
const viewAllHistory = () => {
  uni.showToast({
    title: '功能开发中',
    icon: 'none'
  })
}

// 查看历史详情
const viewHistoryDetail = (id) => {
  uni.showToast({
    title: '功能开发中',
    icon: 'none'
  })
}

// 初始化
onMounted(() => {
  loadCustomerDetail()
})
</script>

<style scoped>
.customer-detail-page {
  min-height: 100vh;
  background-color: #f5f7fa;
}

.page-content {
  padding-top: 88px; /* 导航栏高度 + 状态栏高度 */
  padding-bottom: 30px;
}

/* 加载状态 */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 100px 20px;
}

.loading-icon {
  animation: spin 2s linear infinite;
  margin-bottom: 16px;
}

.loading-text {
  font-size: 16px;
  color: #666;
}

/* 错误状态 */
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 100px 20px;
  text-align: center;
}

.error-text {
  font-size: 16px;
  color: #ff4d4f;
  margin: 16px 0;
}

.retry-button {
  margin-top: 16px;
}

/* 客户详情 */
.customer-detail {
  padding: 16px;
}

/* 卡片样式 */
.info-card,
.devices-card,
.history-card {
  margin-bottom: 16px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.status-badge {
  font-size: 12px;
}

.device-count {
  font-size: 14px;
  color: #666;
}

.view-more {
  font-size: 14px;
  color: #1890ff;
}

/* 信息网格 */
.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  padding: 16px 0;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.info-label {
  font-size: 14px;
  color: #666;
}

.info-value {
  font-size: 15px;
  color: #333;
  font-weight: 500;
}

/* 空状态 */
.empty-devices,
.empty-history {
  padding: 40px 20px;
  text-align: center;
}

.empty-text {
  font-size: 14px;
  color: #999;
}

/* 操作按钮 */
.action-buttons {
  display: flex;
  gap: 12px;
  padding: 0 16px;
  margin-top: 24px;
}

.action-button {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.button-icon {
  margin-right: 4px;
}

/* 动画 */
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* 响应式设计 */
@media screen and (max-width: 375px) {
  .customer-detail {
    padding: 12px;
  }
  
  .info-grid {
    gap: 12px;
  }
  
  .info-label {
    font-size: 13px;
  }
  
  .info-value {
    font-size: 14px;
  }
  
  .action-buttons {
    padding: 0 12px;
    gap: 8px;
  }
  
  .action-button {
    font-size: 14px;
  }
}
</style>
