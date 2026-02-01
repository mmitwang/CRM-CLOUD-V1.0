<template>
  <view class="customers-list-page">
    <!--  顶部导航栏  -->
    <uni-nav-bar
      title="客户列表"
      class="nav-bar"
      :fixed="true"
      :status-bar="true"
    >
      <template #right>
        <uni-icons type="plus" size="24" color="#fff" @click="addCustomer"></uni-icons>
      </template>
    </uni-nav-bar>
    
    <!--  页面内容  -->
    <view class="page-content">
      <!--  搜索栏  -->
      <view class="search-bar">
        <uni-search-bar
          v-model="searchQuery"
          placeholder="搜索客户名称、联系人或电话"
          @input="handleSearch"
          @confirm="handleSearch"
          @clear="handleSearch"
          class="search-input"
        ></uni-search-bar>
        <uni-icons type="filter" size="24" color="#666" @click="showFilter" class="filter-icon"></uni-icons>
      </view>
      
      <!--  客户列表  -->
      <view class="customers-list">
        <uni-list>
          <uni-list-item
            v-for="customer in filteredCustomers"
            :key="customer.id"
            :title="customer.name"
            :note="customer.contactPerson + ' ' + customer.phone"
            show-arrow
            @click="navigateToCustomerDetail(customer.id)"
          >
            <template #footer>
              <uni-badge :type="customer.status === 'active' ? 'success' : 'default'" class="status-badge">
                {{ customer.status === 'active' ? '活跃' : '非活跃' }}
              </uni-badge>
            </template>
          </uni-list-item>
        </uni-list>
        
        <!--  空状态  -->
        <view v-if="filteredCustomers.length === 0" class="empty-state">
          <uni-icons type="person" size="64" color="#d9d9d9"></uni-icons>
          <text class="empty-text">暂无客户数据</text>
          <uni-button type="primary" size="small" @click="addCustomer" class="add-button">
            添加客户
          </uni-button>
        </view>
      </view>
      
      <!--  筛选弹窗  -->
      <uni-popup v-model:show="filterVisible" type="bottom" :mask-click="true">
        <view class="filter-popup">
          <view class="filter-header">
            <text class="filter-title">筛选条件</text>
            <uni-icons type="close" size="24" color="#666" @click="filterVisible = false"></uni-icons>
          </view>
          
          <view class="filter-content">
            <!--  状态筛选  -->
            <view class="filter-item">
              <text class="filter-label">客户状态</text>
              <uni-segmented-control
                v-model="filterStatus"
                :values="['全部', '活跃', '非活跃']"
                :current="filterStatusIndex"
                @clickItem="handleStatusChange"
                style-type="button"
                active-color="#1890ff"
              ></uni-segmented-control>
            </view>
            
            <!--  行业筛选  -->
            <view class="filter-item">
              <text class="filter-label">所属行业</text>
              <uni-picker-view
                :range="industryOptions"
                @change="handleIndustryChange"
                :value="industryIndex"
              ></uni-picker-view>
            </view>
          </view>
          
          <view class="filter-footer">
            <uni-button type="default" @click="resetFilter" class="reset-button">
              重置
            </uni-button>
            <uni-button type="primary" @click="applyFilter" class="apply-button">
              应用
            </uni-button>
          </view>
        </view>
      </uni-popup>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

// 搜索和筛选
const searchQuery = ref('')
const filterVisible = ref(false)
const filterStatus = ref('全部')
const filterStatusIndex = ref(0)
const industryOptions = ref(['全部', '制造业', '商业', '住宅', '公共设施', '其他'])
const industryIndex = ref([0])
const selectedIndustry = ref('全部')

// 客户数据
const customers = ref([
  {
    id: 1,
    name: '上海电力设备有限公司',
    contactPerson: '张三',
    phone: '13800138001',
    status: 'active',
    industry: '制造业',
    address: '上海市浦东新区张江高科技园区'
  },
  {
    id: 2,
    name: '北京智能电气股份有限公司',
    contactPerson: '李四',
    phone: '13900139002',
    status: 'active',
    industry: '制造业',
    address: '北京市海淀区中关村科技园区'
  },
  {
    id: 3,
    name: '广州商业中心',
    contactPerson: '王五',
    phone: '13700137003',
    status: 'inactive',
    industry: '商业',
    address: '广州市天河区天河路385号'
  },
  {
    id: 4,
    name: '深圳科技园',
    contactPerson: '赵六',
    phone: '13600136004',
    status: 'active',
    industry: '公共设施',
    address: '深圳市南山区科技园'
  },
  {
    id: 5,
    name: '杭州西湖区住宅项目',
    contactPerson: '孙七',
    phone: '13500135005',
    status: 'active',
    industry: '住宅',
    address: '杭州市西湖区文一西路'
  }
])

// 筛选后的客户列表
const filteredCustomers = computed(() => {
  return customers.value.filter(customer => {
    // 搜索筛选
    const matchesSearch = !searchQuery.value || 
      customer.name.includes(searchQuery.value) ||
      customer.contactPerson.includes(searchQuery.value) ||
      customer.phone.includes(searchQuery.value)
    
    // 状态筛选
    const matchesStatus = filterStatus.value === '全部' || 
      (filterStatus.value === '活跃' && customer.status === 'active') ||
      (filterStatus.value === '非活跃' && customer.status === 'inactive')
    
    // 行业筛选
    const matchesIndustry = selectedIndustry.value === '全部' || 
      customer.industry === selectedIndustry.value
    
    return matchesSearch && matchesStatus && matchesIndustry
  })
})

// 处理搜索
const handleSearch = () => {
  // 搜索逻辑已在computed中处理
}

// 显示筛选
const showFilter = () => {
  filterVisible.value = true
}

// 处理状态变化
const handleStatusChange = (index) => {
  filterStatusIndex.value = index
  filterStatus.value = ['全部', '活跃', '非活跃'][index]
}

// 处理行业变化
const handleIndustryChange = (e) => {
  industryIndex.value = e.detail.value
  selectedIndustry.value = industryOptions.value[e.detail.value[0]]
}

// 重置筛选
const resetFilter = () => {
  filterStatus.value = '全部'
  filterStatusIndex.value = 0
  industryIndex.value = [0]
  selectedIndustry.value = '全部'
}

// 应用筛选
const applyFilter = () => {
  filterVisible.value = false
}

// 导航到客户详情
const navigateToCustomerDetail = (id) => {
  uni.navigateTo({
    url: `/pages/customers/detail/detail?id=${id}`
  })
}

// 添加客户
const addCustomer = () => {
  uni.showToast({
    title: '功能开发中',
    icon: 'none'
  })
}

// 初始化
onMounted(() => {
  // 这里可以添加实际的数据加载逻辑
})
</script>

<style scoped>
.customers-list-page {
  min-height: 100vh;
  background-color: #f5f7fa;
}

.page-content {
  padding-top: 88px; /* 导航栏高度 + 状态栏高度 */
}

/* 搜索栏 */
.search-bar {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  background-color: #fff;
  border-bottom: 1px solid #f0f0f0;
  position: sticky;
  top: 88px;
  z-index: 10;
}

.search-input {
  flex: 1;
}

.filter-icon {
  margin-left: 12px;
}

/* 客户列表 */
.customers-list {
  min-height: calc(100vh - 160px);
}

.status-badge {
  font-size: 12px;
}

/* 空状态 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
}

.empty-text {
  font-size: 16px;
  color: #999;
  margin: 16px 0;
}

.add-button {
  margin-top: 16px;
}

/* 筛选弹窗 */
.filter-popup {
  background-color: #fff;
  border-radius: 16px 16px 0 0;
  padding-bottom: 30px;
}

.filter-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #f0f0f0;
}

.filter-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.filter-content {
  padding: 20px;
}

.filter-item {
  margin-bottom: 24px;
}

.filter-label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #333;
  margin-bottom: 12px;
}

.filter-footer {
  display: flex;
  padding: 0 20px;
  gap: 12px;
}

.reset-button,
.apply-button {
  flex: 1;
}

/* 响应式设计 */
@media screen and (max-width: 375px) {
  .search-bar {
    padding: 10px 12px;
  }
  
  .filter-content {
    padding: 16px;
  }
  
  .filter-footer {
    padding: 0 16px;
  }
}
</style>
