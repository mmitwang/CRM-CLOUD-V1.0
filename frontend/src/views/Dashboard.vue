<template>
  <div class="page-container">
    <h1 class="page-title">数据概览</h1>
    
    <!-- 统计卡片 -->
    <div class="stats-container">
      <el-card class="stats-card">
        <div class="stats-item">
          <div class="stats-number">{{ totalCustomers }}</div>
          <div class="stats-label">总客户数</div>
        </div>
      </el-card>
      <el-card class="stats-card">
        <div class="stats-item">
          <div class="stats-number">{{ totalDevices }}</div>
          <div class="stats-label">总设备数</div>
        </div>
      </el-card>
      <el-card class="stats-card">
        <div class="stats-item">
          <div class="stats-number">{{ onlineDevices }}</div>
          <div class="stats-label">在线设备</div>
        </div>
      </el-card>
      <el-card class="stats-card">
        <div class="stats-item">
          <div class="stats-number">{{ warningDevices }}</div>
          <div class="stats-label">异常设备</div>
        </div>
      </el-card>
    </div>
    
    <!-- 图表区域 -->
    <div class="charts-container">
      <el-card class="chart-card">
        <template #header>
          <div class="chart-header">
            <span>设备状态分布</span>
          </div>
        </template>
        <div ref="statusChartRef" class="chart"></div>
      </el-card>
      <el-card class="chart-card">
        <template #header>
          <div class="chart-header">
            <span>客户增长趋势</span>
          </div>
        </template>
        <div ref="customerChartRef" class="chart"></div>
      </el-card>
    </div>
    
    <!-- 最近活动 -->
    <el-card class="activity-card">
      <template #header>
        <div class="activity-header">
          <span>最近活动</span>
        </div>
      </template>
      <el-table :data="recentActivities" stripe style="width: 100%">
        <el-table-column prop="time" label="时间" width="180" />
        <el-table-column prop="type" label="类型" width="120" />
        <el-table-column prop="description" label="描述" />
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import * as echarts from 'echarts';
import { useCustomerStore } from '../stores/customer';
import { useDeviceStore } from '../stores/device';

const customerStore = useCustomerStore();
const deviceStore = useDeviceStore();

// 统计数据
const totalCustomers = ref(128);
const totalDevices = ref(356);
const onlineDevices = ref(320);
const warningDevices = ref(15);

// 图表引用
const statusChartRef = ref<HTMLElement>();
const customerChartRef = ref<HTMLElement>();
let statusChart: echarts.ECharts | null = null;
let customerChart: echarts.ECharts | null = null;

// 最近活动数据
const recentActivities = ref([
  { time: '2026-01-27 10:30', type: '设备', description: '设备 D12345 上线' },
  { time: '2026-01-27 09:15', type: '客户', description: '新增客户 张三' },
  { time: '2026-01-26 16:45', type: '设备', description: '设备 D67890 状态异常' },
  { time: '2026-01-26 14:20', type: '客户', description: '客户 李四 信息更新' },
  { time: '2026-01-26 11:00', type: '设备', description: '设备 D54321 离线' },
]);

// 初始化设备状态图表
const initStatusChart = () => {
  if (statusChartRef.value) {
    statusChart = echarts.init(statusChartRef.value);
    const option = {
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {c} ({d}%)',
      },
      legend: {
        orient: 'horizontal',
        bottom: 10,
        left: 'center',
      },
      series: [
        {
          name: '设备状态',
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2,
          },
          label: {
            show: false,
            position: 'center',
          },
          emphasis: {
            label: {
              show: true,
              fontSize: '18',
              fontWeight: 'bold',
            },
          },
          labelLine: {
            show: false,
          },
          data: [
            { value: onlineDevices.value, name: '在线', itemStyle: { color: '#67c23a' } },
            { value: totalDevices.value - onlineDevices.value - warningDevices.value, name: '离线', itemStyle: { color: '#f56c6c' } },
            { value: warningDevices.value, name: '异常', itemStyle: { color: '#e6a23c' } },
          ],
        },
      ],
    };
    statusChart.setOption(option);
  }
};

// 初始化客户增长图表
const initCustomerChart = () => {
  if (customerChartRef.value) {
    customerChart = echarts.init(customerChartRef.value);
    const option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        data: ['1月', '2月', '3月', '4月', '5月', '6月'],
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          name: '新增客户',
          type: 'bar',
          data: [12, 19, 3, 5, 2, 3],
          itemStyle: {
            color: '#409eff',
          },
        },
      ],
    };
    customerChart.setOption(option);
  }
};

// 响应式调整
const handleResize = () => {
  statusChart?.resize();
  customerChart?.resize();
};

onMounted(() => {
  initStatusChart();
  initCustomerChart();
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
  statusChart?.dispose();
  customerChart?.dispose();
});
</script>

<style scoped>
.stats-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.stats-card {
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stats-item {
  text-align: center;
}

.stats-number {
  font-size: 28px;
  font-weight: 600;
  color: #409eff;
  margin-bottom: 8px;
}

.stats-label {
  font-size: 14px;
  color: #606266;
}

.charts-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.chart-card {
  height: 300px;
}

.chart-header {
  font-size: 16px;
  font-weight: 600;
}

.chart {
  width: 100%;
  height: calc(100% - 40px);
}

.activity-card {
  margin-bottom: 20px;
}

.activity-header {
  font-size: 16px;
  font-weight: 600;
}

@media screen and (max-width: 768px) {
  .stats-container {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .charts-container {
    grid-template-columns: 1fr;
  }
  
  .chart-card {
    height: 250px;
  }
}
</style>