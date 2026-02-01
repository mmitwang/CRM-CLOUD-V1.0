<template>
  <div class="page-container">
    <h1 class="page-title">设备管理</h1>
    
    <!-- 搜索和筛选 -->
    <el-card class="card">
      <div class="search-filter">
        <el-input
          v-model="searchForm.search"
          placeholder="搜索设备名称、设备ID"
          prefix-icon="el-icon-search"
          style="width: 300px; margin-right: 10px"
        />
        <el-select
          v-model="searchForm.status"
          placeholder="设备状态"
          style="width: 120px; margin-right: 10px"
        >
          <el-option label="全部" value="" />
          <el-option label="在线" value="online" />
          <el-option label="离线" value="offline" />
          <el-option label="异常" value="warning" />
        </el-select>
        <el-select
          v-model="searchForm.type"
          placeholder="设备类型"
          style="width: 120px; margin-right: 10px"
        >
          <el-option label="全部" value="" />
          <el-option label="电表" value="meter" />
          <el-option label="断路器" value="breaker" />
          <el-option label="传感器" value="sensor" />
        </el-select>
        <el-button
          type="primary"
          @click="handleSearch"
          style="margin-right: 10px"
        >
          搜索
        </el-button>
        <el-button
          @click="resetSearch"
          style="margin-right: 10px"
        >
          重置
        </el-button>
        <el-button
          type="success"
          @click="handleAddDevice"
        >
          新增设备
        </el-button>
      </div>
    </el-card>
    
    <!-- 设备列表 -->
    <el-card class="card">
      <div class="table-container">
        <el-table
          :data="devices"
          border
          style="width: 100%"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55" />
          <el-table-column prop="id" label="ID" width="80" />
          <el-table-column prop="device_id" label="设备ID" />
          <el-table-column prop="name" label="设备名称" />
          <el-table-column prop="type" label="设备类型" width="100">
            <template #default="scope">
              {{ getDeviceTypeLabel(scope.row.type) }}
            </template>
          </el-table-column>
          <el-table-column prop="status" label="状态" width="100">
            <template #default="scope">
              <span
                :class="[
                  'status-tag',
                  scope.row.status === 'online' ? 'status-online' : 
                  scope.row.status === 'offline' ? 'status-offline' : 'status-warning'
                ]"
              >
                {{ getDeviceStatusLabel(scope.row.status) }}
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="customer_name" label="所属客户" />
          <el-table-column prop="location" label="安装位置" />
          <el-table-column prop="last_active" label="最后活跃" width="180" />
          <el-table-column label="操作" width="180" fixed="right">
            <template #default="scope">
              <el-button
                type="primary"
                size="small"
                @click="handleViewDevice(scope.row)"
                style="margin-right: 5px"
              >
                查看
              </el-button>
              <el-button
                type="success"
                size="small"
                @click="handleEditDevice(scope.row)"
                style="margin-right: 5px"
              >
                编辑
              </el-button>
              <el-button
                type="danger"
                size="small"
                @click="handleDeleteDevice(scope.row.id)"
              >
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      
      <!-- 分页 -->
      <div class="pagination">
        <el-pagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pagination.total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
    
    <!-- 设备详情对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="600px"
    >
      <el-form
        ref="deviceFormRef"
        :model="deviceForm"
        :rules="deviceRules"
        label-width="100px"
      >
        <el-form-item label="设备ID" prop="device_id">
          <el-input v-model="deviceForm.device_id" placeholder="请输入设备ID" />
        </el-form-item>
        <el-form-item label="设备名称" prop="name">
          <el-input v-model="deviceForm.name" placeholder="请输入设备名称" />
        </el-form-item>
        <el-form-item label="设备类型" prop="type">
          <el-select v-model="deviceForm.type" placeholder="请选择设备类型">
            <el-option label="电表" value="meter" />
            <el-option label="断路器" value="breaker" />
            <el-option label="传感器" value="sensor" />
          </el-select>
        </el-form-item>
        <el-form-item label="设备型号" prop="model">
          <el-input v-model="deviceForm.model" placeholder="请输入设备型号" />
        </el-form-item>
        <el-form-item label="序列号" prop="serial_number">
          <el-input v-model="deviceForm.serial_number" placeholder="请输入序列号" />
        </el-form-item>
        <el-form-item label="所属客户" prop="customer_id">
          <el-select v-model="deviceForm.customer_id" placeholder="请选择客户">
            <el-option
              v-for="customer in customers"
              :key="customer.id"
              :label="customer.name"
              :value="customer.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="安装位置" prop="location">
          <el-input v-model="deviceForm.location" placeholder="请输入安装位置" />
        </el-form-item>
        <el-form-item label="安装日期" prop="installed_at">
          <el-date-picker
            v-model="deviceForm.installed_at"
            type="datetime"
            placeholder="选择安装日期"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="设备状态" prop="status">
          <el-select v-model="deviceForm.status" placeholder="请选择状态">
            <el-option label="在线" value="online" />
            <el-option label="离线" value="offline" />
            <el-option label="异常" value="warning" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSaveDevice">保存</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { useDeviceStore } from '../stores/device';
import { useCustomerStore } from '../stores/customer';
import { ElMessage, ElMessageBox } from 'element-plus';

const deviceStore = useDeviceStore();
const customerStore = useCustomerStore();

// 搜索表单
const searchForm = reactive({
  search: '',
  status: '',
  type: '',
});

// 分页
const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0,
});

// 设备列表
const devices = ref([]);
const selectedDevices = ref([]);
const customers = ref([]);

// 对话框
const dialogVisible = ref(false);
const dialogTitle = ref('新增设备');
const currentDeviceId = ref(null);

// 设备表单
const deviceFormRef = ref();
const deviceForm = reactive({
  device_id: '',
  name: '',
  type: 'meter',
  model: '',
  serial_number: '',
  customer_id: null,
  location: '',
  installed_at: new Date(),
  status: 'offline',
});

// 表单验证规则
const deviceRules = {
  device_id: [{ required: true, message: '请输入设备ID', trigger: 'blur' }],
  name: [{ required: true, message: '请输入设备名称', trigger: 'blur' }],
  type: [{ required: true, message: '请选择设备类型', trigger: 'change' }],
  model: [{ required: true, message: '请输入设备型号', trigger: 'blur' }],
  serial_number: [{ required: true, message: '请输入序列号', trigger: 'blur' }],
  customer_id: [{ required: true, message: '请选择所属客户', trigger: 'change' }],
  location: [{ required: true, message: '请输入安装位置', trigger: 'blur' }],
  installed_at: [{ required: true, message: '请选择安装日期', trigger: 'change' }],
};

// 获取设备类型标签
const getDeviceTypeLabel = (type: string): string => {
  const typeMap = {
    meter: '电表',
    breaker: '断路器',
    sensor: '传感器',
  };
  return typeMap[type] || type;
};

// 获取设备状态标签
const getDeviceStatusLabel = (status: string): string => {
  const statusMap = {
    online: '在线',
    offline: '离线',
    warning: '异常',
  };
  return statusMap[status] || status;
};

// 获取设备列表
const getDevices = async () => {
  await deviceStore.getDevices({
    page: pagination.page,
    page_size: pagination.pageSize,
    search: searchForm.search,
    status: searchForm.status,
    type: searchForm.type,
  });
  devices.value = deviceStore.devices;
  pagination.total = deviceStore.total;
};

// 获取客户列表
const getCustomers = async () => {
  await customerStore.getCustomers({ page_size: 100 });
  customers.value = customerStore.customers;
};

// 搜索
const handleSearch = () => {
  pagination.page = 1;
  getDevices();
};

// 重置搜索
const resetSearch = () => {
  searchForm.search = '';
  searchForm.status = '';
  searchForm.type = '';
  pagination.page = 1;
  getDevices();
};

// 分页处理
const handleSizeChange = (size: number) => {
  pagination.pageSize = size;
  getDevices();
};

const handleCurrentChange = (current: number) => {
  pagination.page = current;
  getDevices();
};

// 选择设备
const handleSelectionChange = (selection: any[]) => {
  selectedDevices.value = selection;
};

// 新增设备
const handleAddDevice = () => {
  dialogTitle.value = '新增设备';
  currentDeviceId.value = null;
  // 重置表单
  Object.assign(deviceForm, {
    device_id: '',
    name: '',
    type: 'meter',
    model: '',
    serial_number: '',
    customer_id: null,
    location: '',
    installed_at: new Date(),
    status: 'offline',
  });
  dialogVisible.value = true;
};

// 查看设备
const handleViewDevice = (device: any) => {
  dialogTitle.value = '查看设备';
  currentDeviceId.value = device.id;
  Object.assign(deviceForm, device);
  dialogVisible.value = true;
};

// 编辑设备
const handleEditDevice = (device: any) => {
  dialogTitle.value = '编辑设备';
  currentDeviceId.value = device.id;
  Object.assign(deviceForm, device);
  dialogVisible.value = true;
};

// 保存设备
const handleSaveDevice = async () => {
  if (!deviceFormRef.value) return;
  
  await deviceFormRef.value.validate(async (valid: boolean) => {
    if (valid) {
      if (currentDeviceId.value) {
        // 更新设备
        await deviceStore.updateDevice(currentDeviceId.value, deviceForm);
      } else {
        // 新增设备
        await deviceStore.createDevice(deviceForm);
      }
      dialogVisible.value = false;
      getDevices();
    }
  });
};

// 删除设备
const handleDeleteDevice = async (id: number) => {
  await ElMessageBox.confirm('确定要删除这个设备吗？', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  });
  
  const success = await deviceStore.deleteDevice(id);
  if (success) {
    getDevices();
  }
};

onMounted(() => {
  getDevices();
  getCustomers();
});
</script>

<style scoped>
.search-filter {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

@media screen and (max-width: 768px) {
  .search-filter {
    flex-direction: column;
    align-items: stretch;
  }
  
  .search-filter .el-input,
  .search-filter .el-select {
    width: 100% !important;
    margin-right: 0 !important;
  }
  
  .pagination {
    justify-content: center;
  }
}
</style>