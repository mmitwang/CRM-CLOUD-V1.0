<template>
  <div class="page-container">
    <h1 class="page-title">客户管理</h1>
    
    <!-- 搜索和筛选 -->
    <el-card class="card">
      <div class="search-filter">
        <el-input
          v-model="searchForm.search"
          placeholder="搜索客户名称、联系人、电话"
          prefix-icon="el-icon-search"
          style="width: 300px; margin-right: 10px"
        />
        <el-select
          v-model="searchForm.status"
          placeholder="客户状态"
          style="width: 150px; margin-right: 10px"
        >
          <el-option label="全部" value="" />
          <el-option label="活跃" value="active" />
          <el-option label="非活跃" value="inactive" />
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
          @click="handleAddCustomer"
        >
          新增客户
        </el-button>
      </div>
    </el-card>
    
    <!-- 客户列表 -->
    <el-card class="card">
      <div class="table-container">
        <el-table
          :data="customers"
          border
          style="width: 100%"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55" />
          <el-table-column prop="id" label="ID" width="80" />
          <el-table-column prop="name" label="客户名称" />
          <el-table-column prop="contact_person" label="联系人" />
          <el-table-column prop="phone" label="电话" />
          <el-table-column prop="email" label="邮箱" />
          <el-table-column prop="company" label="公司" />
          <el-table-column prop="status" label="状态" width="100">
            <template #default="scope">
              <span
                :class="[
                  'status-tag',
                  scope.row.status === 'active' ? 'status-online' : 'status-offline'
                ]"
              >
                {{ scope.row.status === 'active' ? '活跃' : '非活跃' }}
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="created_at" label="创建时间" width="180" />
          <el-table-column label="操作" width="180" fixed="right">
            <template #default="scope">
              <el-button
                type="primary"
                size="small"
                @click="handleViewCustomer(scope.row)"
                style="margin-right: 5px"
              >
                查看
              </el-button>
              <el-button
                type="success"
                size="small"
                @click="handleEditCustomer(scope.row)"
                style="margin-right: 5px"
              >
                编辑
              </el-button>
              <el-button
                type="danger"
                size="small"
                @click="handleDeleteCustomer(scope.row.id)"
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
    
    <!-- 客户详情对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="600px"
    >
      <el-form
        ref="customerFormRef"
        :model="customerForm"
        :rules="customerRules"
        label-width="100px"
      >
        <el-form-item label="客户名称" prop="name">
          <el-input v-model="customerForm.name" placeholder="请输入客户名称" />
        </el-form-item>
        <el-form-item label="联系人" prop="contact_person">
          <el-input v-model="customerForm.contact_person" placeholder="请输入联系人" />
        </el-form-item>
        <el-form-item label="电话" prop="phone">
          <el-input v-model="customerForm.phone" placeholder="请输入电话" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="customerForm.email" placeholder="请输入邮箱" />
        </el-form-item>
        <el-form-item label="公司" prop="company">
          <el-input v-model="customerForm.company" placeholder="请输入公司名称" />
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-input
            v-model="customerForm.address"
            type="textarea"
            placeholder="请输入地址"
            rows="3"
          />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="customerForm.status" placeholder="请选择状态">
            <el-option label="活跃" value="active" />
            <el-option label="非活跃" value="inactive" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSaveCustomer">保存</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { useCustomerStore } from '../stores/customer';
import { ElMessage, ElMessageBox } from 'element-plus';

const customerStore = useCustomerStore();

// 搜索表单
const searchForm = reactive({
  search: '',
  status: '',
});

// 分页
const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0,
});

// 客户列表
const customers = ref([]);
const selectedCustomers = ref([]);

// 对话框
const dialogVisible = ref(false);
const dialogTitle = ref('新增客户');
const currentCustomerId = ref(null);

// 客户表单
const customerFormRef = ref();
const customerForm = reactive({
  name: '',
  contact_person: '',
  phone: '',
  email: '',
  company: '',
  address: '',
  status: 'active',
});

// 表单验证规则
const customerRules = {
  name: [{ required: true, message: '请输入客户名称', trigger: 'blur' }],
  contact_person: [{ required: true, message: '请输入联系人', trigger: 'blur' }],
  phone: [{ required: true, message: '请输入电话', trigger: 'blur' }],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' },
  ],
};

// 获取客户列表
const getCustomers = async () => {
  await customerStore.getCustomers({
    page: pagination.page,
    page_size: pagination.pageSize,
    search: searchForm.search,
    status: searchForm.status,
  });
  customers.value = customerStore.customers;
  pagination.total = customerStore.total;
};

// 搜索
const handleSearch = () => {
  pagination.page = 1;
  getCustomers();
};

// 重置搜索
const resetSearch = () => {
  searchForm.search = '';
  searchForm.status = '';
  pagination.page = 1;
  getCustomers();
};

// 分页处理
const handleSizeChange = (size: number) => {
  pagination.pageSize = size;
  getCustomers();
};

const handleCurrentChange = (current: number) => {
  pagination.page = current;
  getCustomers();
};

// 选择客户
const handleSelectionChange = (selection: any[]) => {
  selectedCustomers.value = selection;
};

// 新增客户
const handleAddCustomer = () => {
  dialogTitle.value = '新增客户';
  currentCustomerId.value = null;
  // 重置表单
  Object.assign(customerForm, {
    name: '',
    contact_person: '',
    phone: '',
    email: '',
    company: '',
    address: '',
    status: 'active',
  });
  dialogVisible.value = true;
};

// 查看客户
const handleViewCustomer = (customer: any) => {
  dialogTitle.value = '查看客户';
  currentCustomerId.value = customer.id;
  Object.assign(customerForm, customer);
  dialogVisible.value = true;
};

// 编辑客户
const handleEditCustomer = (customer: any) => {
  dialogTitle.value = '编辑客户';
  currentCustomerId.value = customer.id;
  Object.assign(customerForm, customer);
  dialogVisible.value = true;
};

// 保存客户
const handleSaveCustomer = async () => {
  if (!customerFormRef.value) return;
  
  await customerFormRef.value.validate(async (valid: boolean) => {
    if (valid) {
      if (currentCustomerId.value) {
        // 更新客户
        await customerStore.updateCustomer(currentCustomerId.value, customerForm);
      } else {
        // 新增客户
        await customerStore.createCustomer(customerForm);
      }
      dialogVisible.value = false;
      getCustomers();
    }
  });
};

// 删除客户
const handleDeleteCustomer = async (id: number) => {
  await ElMessageBox.confirm('确定要删除这个客户吗？', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  });
  
  const success = await customerStore.deleteCustomer(id);
  if (success) {
    getCustomers();
  }
};

onMounted(() => {
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