<template>
  <div class="dashboard-container">
    <el-card shadow="hover" class="dashboard-card">
      <template #header>
        <div class="card-header">
          <span>系统概览</span>
          <el-button type="primary" size="small" @click="refreshData">
            <el-icon><Refresh /></el-icon>
            刷新数据
          </el-button>
        </div>
      </template>
      
      <!-- 统计卡片 -->
      <div class="stats-grid">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-content">
            <div class="stat-icon blue">
              <el-icon><UserFilled /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ stats.customerCount }}</div>
              <div class="stat-label">客户总数</div>
            </div>
          </div>
        </el-card>
        
        <el-card shadow="hover" class="stat-card">
          <div class="stat-content">
            <div class="stat-icon green">
              <el-icon><Monitor /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ stats.deviceCount }}</div>
              <div class="stat-label">设备总数</div>
            </div>
          </div>
        </el-card>
        
        <el-card shadow="hover" class="stat-card">
          <div class="stat-content">
            <div class="stat-icon orange">
              <el-icon><User /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ stats.userCount }}</div>
              <div class="stat-label">用户总数</div>
            </div>
          </div>
        </el-card>
        
        <el-card shadow="hover" class="stat-card">
          <div class="stat-content">
            <div class="stat-icon red">
              <el-icon><Warning /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ stats.alertCount }}</div>
              <div class="stat-label">告警数量</div>
            </div>
          </div>
        </el-card>
      </div>
      
      <!-- 图表区域 -->
      <div class="charts-container">
        <el-card shadow="hover" class="chart-card">
          <template #header>
            <span>设备状态分布</span>
          </template>
          <div ref="deviceStatusChart" class="chart"></div>
        </el-card>
        
        <el-card shadow="hover" class="chart-card">
          <template #header>
            <span>客户行业分布</span>
          </template>
          <div ref="industryChart" class="chart"></div>
        </el-card>
      </div>
      
      <!-- 最近活动 -->
      <el-card shadow="hover" class="activity-card">
        <template #header>
          <span>最近活动</span>
        </template>
        <el-table :data="recentActivities" style="width: 100%">
          <el-table-column prop="time" label="时间" width="180" />
          <el-table-column prop="type" label="类型" width="120">
            <template #default="scope">
              <el-tag :type="getActivityTypeTag(scope.row.type)">
                {{ scope.row.type }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="description" label="描述" />
          <el-table-column prop="user" label="操作人" width="120" />
        </el-table>
      </el-card>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import * as echarts from 'echarts'
import { UserFilled, Monitor, User, Warning, Refresh } from '@element-plus/icons-vue'
import type { ECharts } from 'echarts'

const deviceStatusChart = ref<HTMLElement | null>(null)
const industryChart = ref<HTMLElement | null>(null)
let deviceStatusChartInstance: ECharts | null = null
let industryChartInstance: ECharts | null = null

// 统计数据
const stats = reactive({
  customerCount: 0,
  deviceCount: 0,
  userCount: 0,
  alertCount: 0
})

// 最近活动
const recentActivities = ref([
  {
    time: '2026-01-27 14:30:00',
    type: '新增客户',
    description: '添加了新客户 上海电力设备有限公司',
    user: '管理员'
  },
  {
    time: '2026-01-27 13:15:00',
    type: '设备告警',
    description: '设备 配电柜 A-001 离线',
    user: '系统'
  },
  {
    time: '2026-01-27 11:45:00',
    type: '更新设备',
    description: '更新了设备 变压器 B-002 的状态',
    user: '操作员'
  },
  {
    time: '2026-01-27 10:00:00',
    type: '用户登录',
    description: '用户 管理员 登录系统',
    user: '系统'
  }
])

// 获取活动类型标签
const getActivityTypeTag = (type: string) => {
  const tagMap: Record<string, string> = {
    '新增客户': 'success',
    '设备告警': 'danger',
    '更新设备': 'warning',
    '用户登录': 'info'
  }
  return tagMap[type] || 'default'
}

// 加载统计数据
const loadStats = async () => {
  // 模拟API请求
  await new Promise(resolve => setTimeout(resolve, 500))
  
  // 模拟数据
  stats.customerCount = 128
  stats.deviceCount = 356
  stats.userCount = 24
  stats.alertCount = 8
}

// 初始化设备状态图表
const initDeviceStatusChart = () => {
  if (!deviceStatusChart.value) return
  
  deviceStatusChartInstance = echarts.init(deviceStatusChart.value)
  
  const option = {
    tooltip: {
      trigger: 'item'
    },
    legend: {
      orient: 'vertical',
      left: 'left'
    },
    series: [
      {
        name: '设备状态',
        type: 'pie',
        radius: '50%',
        data: [
          { value: 280, name: '在线' },
          { value: 76, name: '离线' }
        ],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  }
  
  deviceStatusChartInstance.setOption(option)
}

// 初始化行业分布图表
const initIndustryChart = () => {
  if (!industryChart.value) return
  
  industryChartInstance = echarts.init(industryChart.value)
  
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    xAxis: {
      type: 'category',
      data: ['制造业', '商业', '住宅', '公共设施', '其他']
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: '客户数量',
        type: 'bar',
        data: [45, 30, 25, 18, 10]
      }
    ]
  }
  
  industryChartInstance.setOption(option)
}

// 刷新数据
const refreshData = async () => {
  await loadStats()
  initDeviceStatusChart()
  initIndustryChart()
}

// 监听窗口大小变化
const handleResize = () => {
  deviceStatusChartInstance?.resize()
  industryChartInstance?.resize()
}

onMounted(async () => {
  await loadStats()
  initDeviceStatusChart()
  initIndustryChart()
  window.addEventListener('resize', handleResize)
})
</script>

<style scoped>
.dashboard-container {
  padding: 20px;
}

.dashboard-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* 统计卡片 */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.stat-card {
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-5px);
}

.stat-content {
  display: flex;
  align-items: center;
  gap: 16px;
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: #fff;
}

.stat-icon.blue {
  background-color: #409eff;
}

.stat-icon.green {
  background-color: #67c23a;
}

.stat-icon.orange {
  background-color: #e6a23c;
}

.stat-icon.red {
  background-color: #f56c6c;
}

.stat-info {
  flex: 1;
}

.stat-value {
  font-size: 24px;
  font-weight: 600;
  color: #303133;
}

.stat-label {
  font-size: 14px;
  color: #606266;
  margin-top: 4px;
}

/* 图表区域 */
.charts-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.chart-card {
  min-height: 300px;
}

.chart {
  width: 100%;
  height: 260px;
}

/* 活动列表 */
.activity-card {
  margin-top: 20px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .dashboard-container {
    padding: 10px;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .charts-container {
    grid-template-columns: 1fr;
  }
  
  .chart-card {
    min-height: 250px;
  }
  
  .chart {
    height: 220px;
  }
}
</style>
