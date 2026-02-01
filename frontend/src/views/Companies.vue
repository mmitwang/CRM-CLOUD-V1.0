<template>
  <div class="companies-container">
    <div class="page-header">
      <h1 class="page-title">公司管理</h1>
      <el-button type="primary" @click="openCreateDialog" :disabled="!isAdmin">
        <el-icon><Plus /></el-icon>
        新增公司
      </el-button>
    </div>
    
    <el-card class="companies-card">
      <template #header>
        <div class="card-header">
          <span>公司列表</span>
          <el-input
            v-model="searchQuery"
            placeholder="搜索公司名称或代码"
            prefix-icon="el-icon-search"
            clearable
            class="search-input"
          />
        </div>
      </template>
      
      <el-table
        v-loading="loading"
        :data="filteredCompanies"
        style="width: 100%"
        border
        stripe
      >
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="公司名称" />
        <el-table-column prop="code" label="公司代码" />
        <el-table-column prop="contact_person" label="联系人" />
        <el-table-column prop="phone" label="联系电话" />
        <el-table-column prop="email" label="邮箱" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.status === 'active' ? 'success' : 'danger'">
              {{ scope.row.status === 'active' ? '活跃' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="created_at" label="创建时间" width="180" />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="scope">
            <el-button
              type="primary"
              size="small"
              @click="openEditDialog(scope.row)"
              :disabled="!isAdmin"
            >
              编辑
            </el-button>
            <el-button
              type="danger"
              size="small"
              @click="handleDelete(scope.row.id)"
              :disabled="!isAdmin"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <div class="pagination-container">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
    
    <!-- 创建/编辑公司对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogType === 'create' ? '新增公司' : '编辑公司'"
      width="500px"
    >
      <el-form
        :model="companyForm"
        :rules="companyRules"
        ref="companyFormRef"
        label-width="100px"
      >
        <el-form-item label="公司名称" prop="name">
          <el-input v-model="companyForm.name" placeholder="请输入公司名称" />
        </el-form-item>
        <el-form-item label="公司代码" prop="code">
          <el-input v-model="companyForm.code" placeholder="请输入公司代码" />
        </el-form-item>
        <el-form-item label="联系人" prop="contact_person">
          <el-input v-model="companyForm.contact_person" placeholder="请输入联系人" />
        </el-form-item>
        <el-form-item label="联系电话" prop="phone">
          <el-input v-model="companyForm.phone" placeholder="请输入联系电话" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="companyForm.email" placeholder="请输入邮箱" />
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-input v-model="companyForm.address" placeholder="请输入地址" type="textarea" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="companyForm.status" placeholder="请选择状态">
            <el-option label="活跃" value="active" />
            <el-option label="禁用" value="inactive" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit" :loading="dialogLoading">
            确定
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { companyApi } from '@/api/company'

const loading = ref(false)
const dialogVisible = ref(false)
const dialogLoading = ref(false)
const dialogType = ref<'create' | 'edit'>('create')
const companyFormRef = ref()

const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const searchQuery = ref('')

const companyForm = reactive({
  id: 0,
  name: '',
  code: '',
  contact_person: '',
  phone: '',
  email: '',
  address: '',
  status: 'active'
})

const companyRules = {
  name: [{ required: true, message: '请输入公司名称', trigger: 'blur' }],
  code: [{ required: true, message: '请输入公司代码', trigger: 'blur' }],
  contact_person: [{ required: true, message: '请输入联系人', trigger: 'blur' }],
  phone: [{ required: true, message: '请输入联系电话', trigger: 'blur' }],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }]
}

const companies = ref<any[]>([])

const filteredCompanies = computed(() => {
  if (!searchQuery.value) {
    return companies.value
  }
  return companies.value.filter(company => {
    return (
      company.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      company.code.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  })
})

const isAdmin = computed(() => {
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  return user.role === 'admin'
})

const getCompanies = async () => {
  loading.value = true
  try {
    const response = await companyApi.getCompanies()
    companies.value = response
    total.value = response.length
  } catch (error) {
    ElMessage.error('获取公司列表失败')
  } finally {
    loading.value = false
  }
}

const openCreateDialog = () => {
  dialogType.value = 'create'
  Object.assign(companyForm, {
    id: 0,
    name: '',
    code: '',
    contact_person: '',
    phone: '',
    email: '',
    address: '',
    status: 'active'
  })
  dialogVisible.value = true
}

const openEditDialog = (company: any) => {
  dialogType.value = 'edit'
  Object.assign(companyForm, company)
  dialogVisible.value = true
}

const handleSubmit = async () => {
  if (!companyFormRef.value) return
  
  try {
    await companyFormRef.value.validate()
    dialogLoading.value = true
    
    if (dialogType.value === 'create') {
      await companyApi.createCompany(companyForm)
      ElMessage.success('创建公司成功')
    } else {
      await companyApi.updateCompany(companyForm.id, companyForm)
      ElMessage.success('更新公司成功')
    }
    
    dialogVisible.value = false
    getCompanies()
  } catch (error) {
    ElMessage.error('操作失败')
  } finally {
    dialogLoading.value = false
  }
}

const handleDelete = async (companyId: number) => {
  try {
    await ElMessageBox.confirm('确定要删除该公司吗？', '警告', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    await companyApi.deleteCompany(companyId)
    ElMessage.success('删除公司成功')
    getCompanies()
  } catch (error) {
    // 用户取消操作
  }
}

const handleSizeChange = (size: number) => {
  pageSize.value = size
  getCompanies()
}

const handleCurrentChange = (current: number) => {
  currentPage.value = current
  getCompanies()
}

onMounted(() => {
  getCompanies()
})
</script>

<style scoped>
.companies-container {
  padding: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.page-title {
  font-size: 24px;
  font-weight: 600;
  margin: 0;
}

.companies-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.search-input {
  width: 300px;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
}
</style>