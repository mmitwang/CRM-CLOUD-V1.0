<template>
  <div class="layout-container">
    <!-- 侧边栏 -->
    <aside class="sidebar">
      <div class="sidebar-header">
        <h2 class="sidebar-title">智析客户管理系统V1.0</h2>
      </div>
      <nav class="sidebar-nav">
        <ul>
          <li>
            <router-link to="/dashboard" class="nav-item" active-class="active">
              <el-icon><House /></el-icon>
              <span>控制台</span>
            </router-link>
          </li>
          <li>
            <router-link to="/companies" class="nav-item" active-class="active">
              <el-icon><OfficeBuilding /></el-icon>
              <span>公司管理</span>
            </router-link>
          </li>
          <li>
            <router-link to="/customers" class="nav-item" active-class="active">
              <el-icon><UserFilled /></el-icon>
              <span>客户管理</span>
            </router-link>
          </li>
          <li>
            <router-link to="/devices" class="nav-item" active-class="active">
              <el-icon><Monitor /></el-icon>
              <span>设备管理</span>
            </router-link>
          </li>
          <li>
            <router-link to="/profile" class="nav-item" active-class="active">
              <el-icon><User /></el-icon>
              <span>个人资料</span>
            </router-link>
          </li>
        </ul>
      </nav>
      <div class="sidebar-footer">
        <el-button type="danger" size="small" @click="logout" class="logout-btn">
          <el-icon><SwitchButton /></el-icon>
          退出登录
        </el-button>
      </div>
    </aside>
    
    <!-- 主内容区 -->
    <main class="main-content">
      <!-- 顶部导航栏 -->
      <header class="top-nav">
        <div class="nav-left">
          <button class="toggle-btn" @click="toggleSidebar">
            <el-icon><Menu /></el-icon>
          </button>
          <h1 class="page-title">{{ $route.meta.title || '控制台' }}</h1>
        </div>
        <div class="nav-right">
          <el-dropdown>
            <span class="user-info">
              <el-avatar :size="32" :src="userAvatar"></el-avatar>
              <span class="user-name">{{ userName }}</span>
              <el-icon><ArrowDown /></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="goToProfile">
                  <el-icon><User /></el-icon>
                  <span>个人资料</span>
                </el-dropdown-item>
                <el-dropdown-item @click="logout">
                  <el-icon><SwitchButton /></el-icon>
                  <span>退出登录</span>
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </header>
      
      <!-- 内容区域 -->
      <div class="content">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { House, OfficeBuilding, UserFilled, Monitor, User, SwitchButton, Menu, ArrowDown } from '@element-plus/icons-vue'

const router = useRouter()
const sidebarCollapsed = ref(false)

// 用户信息
const userName = ref(localStorage.getItem('userName') || '管理员')
const userAvatar = ref('https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png')

// 切换侧边栏
const toggleSidebar = () => {
  sidebarCollapsed.value = !sidebarCollapsed.value
}

// 退出登录
const logout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('userName')
  router.push('/login')
}

// 前往个人资料
const goToProfile = () => {
  router.push('/profile')
}
</script>

<style scoped>
.layout-container {
  display: flex;
  height: 100vh;
  overflow: hidden;
}

/* 侧边栏 */
.sidebar {
  width: 240px;
  background-color: #1f2329;
  color: #fff;
  display: flex;
  flex-direction: column;
  transition: width 0.3s ease;
}

.sidebar.collapsed {
  width: 80px;
}

.sidebar-header {
  padding: 20px;
  border-bottom: 1px solid #30363d;
}

.sidebar-title {
  font-size: 18px;
  font-weight: 600;
  margin: 0;
  color: #fff;
}

.sidebar-nav {
  flex: 1;
  padding: 20px 0;
}

.sidebar-nav ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.nav-item {
  display: flex;
  align-items: center;
  padding: 12px 20px;
  color: #8b949e;
  text-decoration: none;
  transition: all 0.3s ease;
  border-radius: 6px;
  margin: 0 12px 4px 12px;
}

.nav-item:hover {
  background-color: #2d333b;
  color: #f0f6fc;
}

.nav-item.active {
  background-color: #238636;
  color: #fff;
}

.nav-item el-icon {
  margin-right: 12px;
  font-size: 18px;
}

.sidebar-footer {
  padding: 20px;
  border-top: 1px solid #30363d;
}

.logout-btn {
  width: 100%;
  justify-content: center;
}

/* 主内容区 */
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: #f6f8fa;
  overflow: hidden;
}

/* 顶部导航栏 */
.top-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 24px;
  height: 64px;
  background-color: #fff;
  border-bottom: 1px solid #e1e4e8;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.nav-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.toggle-btn {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #656d76;
  padding: 4px;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.toggle-btn:hover {
  background-color: #f6f8fa;
}

.page-title {
  font-size: 18px;
  font-weight: 600;
  margin: 0;
  color: #24292f;
}

.nav-right {
  display: flex;
  align-items: center;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 6px;
  transition: background-color 0.2s;
}

.user-info:hover {
  background-color: #f6f8fa;
}

.user-name {
  font-size: 14px;
  font-weight: 500;
  color: #24292f;
}

/* 内容区域 */
.content {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .sidebar {
    position: fixed;
    left: 0;
    top: 0;
    height: 100vh;
    z-index: 1000;
    transform: translateX(-100%);
  }
  
  .sidebar.collapsed {
    transform: translateX(0);
  }
  
  .main-content {
    width: 100%;
  }
  
  .content {
    padding: 16px;
  }
}

/* 过渡动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
